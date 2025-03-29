const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, index: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);