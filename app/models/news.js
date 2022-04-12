let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let newsSchema = new Schema({
    title: String,
    author: String,
    description: String,
    imageUrl: String,
    publishedAt: Date
})

let News = mongoose.model('News', newsSchema, 'News');
module.exports = News;