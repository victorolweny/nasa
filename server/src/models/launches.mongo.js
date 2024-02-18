const { Schema, model } = require('mongoose')

const launchesSchema = new Schema({
  flightNumber: {
    type: Number,
    required: true
  },
  launchDate: {
    type: Date,
    required: true
  },
  mission: {
    type: String,
    required: true
  },
  rocket: {
    type: String,
    required: true 
  },
  target: {
    type: String
  },
  customers: {
    type: [String]
  },
  upcoming: {
    type: Boolean,
    required: true
  },
  success: {
    type: Boolean,
    required: true,
    default: true
  }
})

// Connects lauchesSchema with the "lauches" collection
module.exports = model('Launch', launchesSchema)