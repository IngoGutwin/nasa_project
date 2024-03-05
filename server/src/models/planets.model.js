const { parse } = require('csv-parse');
const fs = require('node:fs');
const path = require('node:path');
const { fetchNewConnection } = require('./launches.mariadb');
const { keplerPlanetsTableSql, generateInsertSqlQuery } = require('./sql.queries');

async function createPlanetsTable() {
  let connection;
  try {
    connection = await fetchNewConnection();
    connection.query(keplerPlanetsTableSql());
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
}

async function checkIfPlanetExistInDatabase(planet) {
  let connection;
  try {
    connection = await fetchNewConnection();
    let res =
      await connection.query('SELECT * FROM kepler_exoplaneten WHERE kepler_name = ?',
        [planet]);
    if (res.length < 1) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
}

async function writePlantesData(data) {
  let connection;
  try {
    connection = await fetchNewConnection();
    let res = await connection
      .query(generateInsertSqlQuery('kepler_exoplaneten', data),
        Object.values(data)
      );
    console.log(res);
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
}

function isHabitablePlanet(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    createPlanetsTable();
    fs.createReadStream(path.join(__dirname, '../../data/kepler_data.csv'))
      .pipe(
        parse({
          comment: '#',
          columns: true,
        }),
      )
      .on('data',async (data) => {
        if (isHabitablePlanet(data)) {
          checkIfPlanetExistInDatabase(data.kepler_name)
            .then(res => {
              if (!res) {
                writePlantesData(data);
              }
            });
        }
      })
      .on('error', (err) => {
        reject(err);
      })
      .on('end', () => {
        resolve();
      });
  });
}

async function getAllPlanets() {
  let connection;
  try {
    connection = await fetchNewConnection();
    let res =
      await connection.query('SELECT kepler_name FROM kepler_exoplaneten');
    return res;
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
