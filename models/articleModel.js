var mongoose = require('mongoose')

var Schema = mongoose.Schema

var article = new Schema({
  title: {
    type: String
  },
  link: {
    type: String
  },
  summary: {
    type: String
  }
})

module.exports = mongoose.model('article', article)