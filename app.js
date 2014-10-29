var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var User = require('./models/user');
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

});

//signup
app.post('/user/signup', function(req, res){
	var _user = req.body.user;
	//var _user = req.param('user');
	//var req.query.userid

	User.find({name:_user.name}, function(err, user){
		if(err){
			console.log(err);
		}
		if(user){
			console.log('user already exist ')
			return res.redirect('/');
		}else{
			var user = new User(_user);
			user.save(function(err, user){
				if(err) {
					console.log(err);
				}else{
					console.log('signup seccuse');
					res.redirect('/admin/userlist');
				}

			})
		}
	})
	

})

//user sign in
app.post('/user/signin', function(req, res){
	var _user = req.body.user;
	var username = _user.name;
	var password = _user.password;

	User.findByName({name: username},function(err, user){
		if(err) console.log(err);
		console.log(user);

		if(!user){
			console.log('no such user.')
			return res.redirect('/');
		}else{
			user.methods.comparePassword(password, function(err, isMatch){
				if(err){
					console.log(err);
				}
				if(isMatch){
					return res.redirect('/');
					console.log('isMatch success')
				}else {
					console.log('password is not match')
				}
			})
		}
	})
})


//user list
app.get('/admin/userlist', function(req, res){
	User.fetch(function(err, users){
		if(err){
			console.log(err);
		}else {
			res.render('userlist', {
				title:'userlist page',
				users: users
			});
		}
	})

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
// delete userlist
app.delete('/admin/userList', function(req, res){
	var id = req.query.id;
	if(id){
		User.remove({_id: id}, function(err, movie){
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
