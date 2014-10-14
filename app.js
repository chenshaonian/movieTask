var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.listen(port, function(req, res){
	console.log('start port at :' + port);
});

app.get('/', function(req, res){
		res.render('index', {
		title:'movei index',
		movies:[{
			title:'transforman3',
			_id:1,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
			title:'transforman3',
			_id:2,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
			title:'transforman3',
			_id:3,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
			title:'transforman3',
			_id:4,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
			title:'transforman3',
			_id:5,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},
		]



	})
});
app.get('/movie/:id', function(req, res){
	console.log(arguments);
	res.render('detail', {
		title:'detail page',
		movie: {
			director:'tom',
			country:'America',
			title:'transforman3',
			year:2014,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
			language:'english',
			flash:'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
			summary:'123123123333ahwdfaosiudfiausipdfupaisdpfawefasdf'

		}
	})
});
app.get('/admin/list', function(req, res){
	res.render('list', {
		title:'list page',
		movies: [{
			title:'transforman3',
			_id:1,
			director:'tom',
			country:'America',
			year:2014
			// language:'english',
			// flash:'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf'
		}
		]
	})
});
app.get('/admin/movie', function(req, res){
	res.render('admin', {
		title:'admin movie page',
		movie:{
			title:'',
			director:'',
			country:'',
			year:'',
			poster:'',
			flash:'',
			summary:'',
			language:''
		}
	})
})
