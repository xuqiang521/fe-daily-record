var express = require('express')
var fortune = require('./lib/fortune.js')

var app = express()

// set up handlebars view engine
var handlebars = require('express3-handlebars')
	.create({ defaultLayout: 'main' })
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

app.set('port', process.env.PORT || 3000)

app.use(express.static(__dirname + '/public'))

// set 'showTests' context property if the querystring contains test=1
app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' && 
		req.query.test === '1'
	next()
})

app.get('/', function(req, res) {
	res.render('home')
})
app.get('/about', function(req,res){
	res.render('about', { 
		fortune: fortune.getFortune(),
		pageTestScript: '/qa/tests-about.js'
	})
})
app.get('/tours/hood-river', function(req, res){
	res.render('tours/hood-river')
})
app.get('/tours/oregon-coast', function(req, res){
	res.render('tours/oregon-coast')
})
app.get('/tours/request-group-rate', function(req, res){
	res.render('tours/request-group-rate')
})
app.disable('x-powered-by')
app.get('/headers', (req, res) => {
	res.type('text/plain')
	var s = ''
	for (var name in req.headers) s += name + ': ' + req.headers[name] + '\n'
	res.send(s)
})

var tours = [
	{ id: 0, name: 'Hood River', price: 99.99 },
	{ id: 1, name: 'Oregon Coast', price: 149.95 }
]

// app.get('/api/tours', (req, res) => {
// 	res.json(tours)
// })

app.get('/api/tours', (req, res) => {
	var toursXml = '<?xml version="1.0"?><tours>' +
						tours.map(p => {
							return '<tour price="' + p.price + 'id="' + p.id + '">' + p.name + '</tour>'
						}).join('') + '</tours>'
	var toursText = tours.map(p => {
		return p.id + ': ' + p.name + ' (' + p.price + ')'
	}).join('\n')

	res.format({
		'application/json' () {
			res.json(tours)
		},
		'application/xml' () {
			res.type('application/xml')
			res.send(toursXml)
		},
		'text/xml' () {
			res.type('text/xml')
			res.send(toursXml)
		},
		'text/plain' () {
			res.type('text/plain')
			res.send(toursXml)
		}
	})
})

app.get('/api/tour/:id', (req, res) => {
	var i
	for (i = tours.length - 1; i >= 0; i++) {
		if (tours[i].id === req.params.id) break
	}
	if (i >= 0) {
		tours.splice(i, 1)
		res.json({ success: true })
	} else {
		res.json({ error: 'No such tour exists.' })
	}
})


// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404)
	res.render('404')
})

// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack)
	res.status(500)
	res.render('500')
})

app.listen(app.get('port'), function(){
  console.log( 'Express started on http://localhost:' + 
    app.get('port') + ' press Ctrl-C to terminate.' )
})
