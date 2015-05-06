var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mongodb' });
});


router.get('/users', function(req, res, next) {
    var db = req.db;
    var users = db.get('users');
    users.find({}, function(err, docs){
        if (err) {
            res.json(err);
        }
        else {
            res.json(docs);
        }
    });
});

router.get('/register', function(req, res, next) {
    res.render('register');
});

router.post('/register', function(req, res, next){
    var db = req.db;
    var users = db.get('users');
    var username = req.body.username;
    var email = req.body.email;
    
    users.insert({username:username, email:email}, function(err, doc){
        if(err) {
            res.json(err);
        }
        else {
            res.location('users');
            res.redirect('users');
        }
    });
});


module.exports = router;
