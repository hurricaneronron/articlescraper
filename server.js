// npm packages
var express = require('express')
var bodyparser = require('body-parser')
var path = require('path')
var morgan = require('morgan')
var expresshbs = require('express-handlebars')
var mongoose = require('mongoose')
var cheerio = require('cheerio')
var request = require('request')

mongoose.connect('mongodb://localhost/nytArticlesDb')
var db = require('./models')

// new express app
var app = express()

// middleware
app.use(morgan('dev'))
app.engine('hbs', expresshbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, '/public/')))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

// routes
app.get('/', function (req, res) {
  res.render('index.hbs')
  db.article.find({}, function(e, r) {
    if(e) throw e
    
  })
})

app.post('/articles/new', function (req, res) {
  request('https://www.nytimes.com/section/world', function (e, r, html) {
    var $ = cheerio.load(html)
    $('div.story-body').each(function (i, element) {
      var link = $(element).find("a").attr("href")
			var title = $(element).find("h2.headline").text().trim()
			var summary = $(element).find("p.summary").text().trim()
      console.log(title)
      console.log(link)
      console.log(summary)
      db.article.find({'title': title}, function(e, r) {
        if(e) throw e
        if(!title) {
          db.article.create({
            title: title,
            link: link,
            summary: summary
          })
        }
      })
    })
  })
})

// listening port
var PORT = process.env.PORT || 3000
app.listen(PORT, function (e) {
  if (e) throw e
  console.log('Listening on PORT ' + PORT)
})