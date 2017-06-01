import mongoose from 'mongoose';

let searchSchema = new mongoose.Schema({
  query: String,
  processedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LatestSearchModel', searchSchema);
