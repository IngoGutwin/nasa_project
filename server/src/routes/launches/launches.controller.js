const {
  getAllLaunches,
  addNewLaunch,
  abortLaunchById } = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
  let launches = await getAllLaunches();
  return res.status(200).json(launches);
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (!launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target) {
    return res.status(400).json({
      error: 'Mission required launch property',
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    console.log(isNaN(launch.launchDate));
    return res.status(400).json({
      error: 'Invalid launch date',
    });
  }

  addNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const abourted = await abortLaunchById(launchId);
  return res.status(200).json(abourted);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
};
