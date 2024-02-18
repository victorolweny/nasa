const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require('../../models/launches.models')

const { getPagination } = require('../../services/query')

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query)
  const launches = await getAllLaunches(skip, limit)
  return res.status(200).json(launches)
}

async function httpAddNewLaunch(req, res) {
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
  
  const launch = await scheduleNewLaunch(newLaunch)
  console.log(launch)
  return res.status(201).json(launch)
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id)
  const existsLaunch = await existsLaunchWithId(launchId)
  if(!existsLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    })
  }

  const aborted = await abortLaunchById(launchId)

  if(!aborted) {
    return res.status(400).json({
      error: 'Launch not aborted'
    })
  }
  return res.status(200).json({ ok: true })
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
}