const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Defining a data representation
var subjectDreeSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    path: { type: String, required: true },
    time: { type: Date, default: Date.now },
     
});

subjectDreeSchema.add({
    children: [subjectDreeSchema]
    
  });
// Creating a collection
var subjectDree = mongoose.model("Subjectd", subjectDreeSchema);

module.exports = subjectDree;