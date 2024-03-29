// Load mongoose
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Define the product schema
var PrdSchema = new Schema({
  asin: String,
  title: String,
  imgUrl: String,
  stars: Number,
  reviews: Number,
  price: Number,
  listPrice: Number,
  categoryName: String,
  isBestSeller: String, // Make isBestSeller optional
  boughtInLastMonth: Number,
});

// Export the product model
module.exports = mongoose.model("Product", PrdSchema);
