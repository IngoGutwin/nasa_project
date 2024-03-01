const { fetchNewConnection } = require('./launches.mariadb');
const { v4: uuidV4 } = require('uuid');
const launches = new Map();

let latestFlightNumber = 100;

function existLaunchWithId(launchId) {
  return launches.has(launchId);
}

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('January 27, 2030'),
  target: 'Kepler-442 b',
  customer: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunchSql({
  mission,
  rocket,
  launchDate,
  target,
  customer,
  upcoming,
  success,
}) {
  const dbConnection = fetchNewConnection();
  console.log(launchDate);
  dbConnection.query(
    'INSERT INTO launches (flight_id, mission, rocket, launch_date, target, customer, upcoming, success) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      uuidV4(),
      mission,
      rocket,
      launchDate,
      target,
      customer.join(),
      upcoming,
      success,
    ],
    (err, result) => {
      if (err) {
        throw err;
      } else {
        console.log('queryResult: ', result);
      }
    },
  );
}

function addNewLaunch(launch) {
  console.log(launch);
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      upcoming: true,
      success: true,
      customer: ['ZTM', 'NASA'],
      flightNumber: latestFlightNumber,
    }),
  );

  const newLaunch = Object.assign(launch, {
    upcoming: true,
    success: true,
    customer: ['ZTM', 'NASA'],
  });
  addNewLaunchSql(newLaunch);
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  existLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
};
