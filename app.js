var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var _=require('underscore');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/imooc');

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, function(req, res){
	console.log('start port at :' + port);
});
app.locals.moment = require('moment');

app.get('/', function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}else{
			res.render('index', {
				title:'imooc index page',
				movies: movies
			})
		}
	});


		// res.render('index', {
		// title:'movei index',
		// movies:[{
		// 	title:'transforman3',
		// 	_id:1,
		// 	poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		// },{
		// 	title:'transforman3',
		// 	_id:2,
		// 	poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		// },{
		// 	title:'transforman3',
		// 	_id:3,
		// 	poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		// },{
		// 	title:'transforman3',
		// 	_id:4,
		// 	poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		// },{
		// 	title:'transforman3',
		// 	_id:5,
		// 	poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		// },
		// ]
});
app.get('/movie/:id', function(req, res){
	var id = req.params.id;

	Movie.findById(id, function(err, movie){
		if(err){
			console.log(err);
		}
		console.log(movie);
		res.render('detail', {
			title: 'imooc ' + movie.title,
			movie:movie
		})
	});

	// res.render('detail', {
	// 	title:'detail page',
	// 	movie: {
	// 		director:'tom',
	// 		country:'America',
	// 		title:'transforman3',
	// 		year:2014,
	// 		poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
	// 		language:'english',
	// 		flash:'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
	// 		summary:'123123123333ahwdfaosiudfiausipdfupaisdpfawefasdf'

	// 	}
	// })
});

//list delete movie
app.delete('/admin/list', function(req, res){
	var id = req.query.id;
	if(id){
		Movie.remove({_id: id}, function(err, movie){
			if(err){
				console.log(err);
			}else{
				res.json({success: 1});
			}
		})
	}
})
//admin update movie
app.get('/admin/update/:id', function(req, res){
	var id = req.params.id;

	if(id){
		Movie.findById(id, function(err, movie){
			res.render('admin', {
				title:'imooc admin update page',
				movie:movie
			})
		})
	}
});


//admin post movie
app.post('/admin/movie/new', function(req, res){
	console.log('new',req.body);
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	console.log(id)
	if(id !== 'undefined'){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err);
			}else{
				_movie = _.extend(movie, movieObj);
				_movie.save(function(err, movie){
					if(err){
						console.log(err);
					}else {
						res.redirect('/movie/' + movie._id);
					}
				});
			}
		})
	}else{
		console.log('movieObj:',movieObj);
		_movie = new Movie({
			director: movieObj.director,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		});

		_movie.save(function(err, movie){
			if(err){
				console.log(err);
			}else{
				res.redirect('/movie/' + movie._id);
			}
		})
	}
});

//list page
app.get('/admin/list', function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}else {
			res.render('list', {
				title:'list page',
				movies: movies
			});
		}
	})

		// movies: [{
		// 	title:'transforman3',
		// 	_id:1,
		// 	director:'tom',
		// 	country:'America',
		// 	year:2014
		// 	// language:'english',
		// 	// flash:'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf'
		// }
		// ]
});
app.get('/admin/movie', function(req, res){
	res.render('admin', {
		title:'admin movie page',
		movie:{
			title:'123',
			director:'tom',
			country:'china',
			year:'2014',
			poster:'',
			flash:'',
			summary:'test',
			language:'chinese'
		}
	})
});
