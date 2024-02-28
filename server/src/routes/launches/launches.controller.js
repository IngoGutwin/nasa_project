const {
  getAllLaunches,
  addNewLaunch,
  existLaunchWithId,
  abortLaunchById } = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
  return res.status(200).json(Array.from((getAllLaunches())));
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

function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  console.log(launchId);
  if (!existLaunchWithId(launchId)) {
    return res.status(404).json({
      error: 'Launch not found',
    });
  }

  const abourted = abortLaunchById(launchId);
  return res.status(200).json(abourted);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
};