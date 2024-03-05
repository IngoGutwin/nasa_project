const http = require('node:http');

const PORT = process.env.PORT || 8000;

const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');
const { loadSpaceXLaunchData } = require('./models/launches.model');

const server = http.createServer(app);

async function startServer() {
  await loadPlanetsData();
  await loadSpaceXLaunchData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();

