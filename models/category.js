const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Defining a data representation
var categorySchema = new Schema({
    name: { type: String, required: true },
    
});

// Creating a collection
var Category = mongoose.model("Category", categorySchema);
//console.log(userData);
module.exports = Category;