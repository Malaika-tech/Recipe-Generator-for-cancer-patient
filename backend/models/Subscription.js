const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nutritionist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'expired'], default: 'active' }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);