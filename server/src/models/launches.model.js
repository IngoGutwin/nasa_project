const { fetchNewConnection } = require('../services/mariadb.service');
const { v4: uuidV4 } = require('uuid');
const axios = require('axios');

async function getAllLaunches(skip, limit) {
  let connection;
  try {
    connection = await fetchNewConnection();
    let launches = await connection.query(
      'SELECT flight_number, launch_date, mission, rocket, target, customer, upcoming, success FROM launches WHERE flight_number > ? AND flight_number < ?', [skip, (skip + limit)]
    );
    let spaceXLaunches = await connection.query(
      'SELECT flight_number, launch_date, mission, rocket, customer, upcoming, success FROM space_x_launches WHERE flight_number > ? AND flight_number < ? AND success IS NOT NULL',
      [skip, (skip + limit)]
    );
    return [...launches, ...spaceXLaunches];
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
}

const SPACE_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function checkIfSpaceXDataIsLoaded() {
  let connection;
  try {
    connection = await fetchNewConnection();
    let result = await connection.query('SELECT flight_number FROM space_x_launches');
    if (result.length < 1) {
      return false;
    };
    return true;
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
}

/**
 * const launch = {
 *  flightNumber: 100, //flight_number
 *  mission: '', // name 
 *  rocket: '', //rocket.name
 *  launchDate: '', // date_local
 *  target: '', // not applicable
 *  customer: '', //payload.customers for each payload
 *  upcoming: true, // upcoming
 *  success: true, // success
 * };
 */
async function loadSpaceXLaunchData() {
  let isDataLoaded = await checkIfSpaceXDataIsLoaded();
  if (!isDataLoaded) {
    const response = await axios.post(SPACE_API_URL, {
      query: {},
      options: {
        pagination: false,
        populate: [
          {
            path: 'rocket',
            select: {
              name: 1
            }
          },
          {
            path: 'payloads',
            select: {
              customers: 1
            }
          }
        ]
      }
    });
    let launchData = mapSpaceXLaunches(response.data.docs);
    await saveSpaceXLaunches(launchData);
  }
}

async function saveSpaceXLaunches(launchData) {
  let connection;
  try {
    connection = await fetchNewConnection();
    for (let i = 0; i < launchData.length; i++) {
      let launch = launchData[i];
      await connection.query(
        'INSERT INTO space_x_launches (flight_number, mission, rocket, launch_date, customer, upcoming, success) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [launch.flightNumber, launch.mission, launch.rocket, launch.launchDate, launch.customers.join(', '), launch.upcoming, launch.success]
      );
    }
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
}

function mapSpaceXLaunches(launchDocs) {
  return launchDocs.map(launchDoc => {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });

    return {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers
    };
  });
}

async function addNewLaunch({ mission, rocket, launchDate, target, customer }) {
  const launch = {
    flight_id: uuidV4(),
    mission: mission,
    rocket: rocket,
    launchDate: launchDate,
    target: target,
    customer: customer?.join(', ') || ['ZTM', 'NASA'].join(', '),
    upcoming: true,
    success: true,
  };
  let connection;
  try {
    connection = await fetchNewConnection();
    await connection.query(
      'INSERT INTO launches (flight_id, mission, rocket, launch_date, target, customer, upcoming, success) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      Object.values(launch)
    );
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
}

async function abortLaunchById(launchId) {
  let connection;
  try {
    connection = await fetchNewConnection();
    await connection.query(
      'UPDATE launches SET upcoming = false, success = false WHERE flight_number = ? ',
      [launchId],
    );
    return true;
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
}

module.exports = {
  loadSpaceXLaunchData,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
};

