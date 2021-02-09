const mongoose = require('mongoose');

const channelSchema = mongoose.Schema({
  channelName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subscribers: {
    type: Array,
    required: true,
    default: ','
  }
});

module.exports = mongoose.model('Channel', channelSchema);