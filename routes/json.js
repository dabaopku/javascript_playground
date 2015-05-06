var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('users');
});

router.get('/list', function(req, res) {
    var users = req.db.get('users');
    users.find({}, function (err, items) {
        if(err) {
            
        }
        else {
            res.json(items);
        }
    });
});

router.delete('/delete/:id', function(req, res){
    var users = req.db.get('users');
    users.remove({_id:req.params.id}, function(err){
        res.send(err ? err : '');
    });
});

module.exports = router;
