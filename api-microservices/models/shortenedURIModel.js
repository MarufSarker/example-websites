import mongoose from 'mongoose';

let urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrlID: String
});

module.exports = mongoose.model('ShortenedURL', urlSchema);
