const {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require('../../models/launches.models')

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches())
}

function httpAddNewLaunch(req, res) {
  const {mission, rocket, launchDate, target} = req.body

  if (!mission || !rocket || !launchDate || !target) {
    return res.status(400).json({
      error: "Missing required launch property"
    })
  }

  const newLaunch = {
    mission,
    rocket,
    launchDate: new Date(launchDate),
    target
  }

  if (isNaN(newLaunch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date"
    })
  }
  
  const launch = addNewLaunch(newLaunch)
  console.log(launch)
  return res.status(201).json(launch)
}

function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id)

  if(!existsLaunchWithId(launchId)) {
    return res.status(404).json({
      error: "Launch not found",
    })
  }

  const aborted = abortLaunchById(launchId)
  return res.status(200).json(aborted)
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
}