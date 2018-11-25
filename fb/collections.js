const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationsSchema = new Schema({
  name: String,
  checkins: String,
  picture: Object,
  location: Object,
  about: String,
  description: String,
  app_links: Object,
  engagement: Object,
  is_always_open: Boolean,
  is_permanently_closed: Boolean,
  overall_star_rating: Number,
  photos: Object,
  rating_count: Number,
  website: String,
  id: String,
});

const Locations = mongoose.model('Locations', locationsSchema);

module.exports = Locations;
