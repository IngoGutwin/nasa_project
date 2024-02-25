const http = require('node:http');

const PORT = process.env.PORT || 8000;

const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');

const server = http.createServer(app);

loadPlanetsData()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
  });

