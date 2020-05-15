const MONGO_DB = process.env.MONGO_DB||require("./config/secrets").MONGO_DB;
// const SK = process.env.SK;
var express = require('express')
var app = express()
app.set("view engine", "ejs")
app.use(express.static('public'))
var fs = require('fs')
var path = require('path')
const mongoose = require('mongoose');
mongoose.connect(MONGO_DB, { useNewUrlParser: true });
var session = require('express-session')
var _ = require("lodash")
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const crypto = require('crypto');
const Insta = require('instamojo-nodejs');
const url = require('url');

/*let Razorpay = require('razorpay');
const Razorpayconfig = {
    //key_id = '',
    //key_secret =''
}
var instance = new Razorpay(Razorpayconfig);*/




var bodyParser = require("body-parser")
// var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 1160000 } }))
const secret = 'abcdefg';
// var stripe = require("stripe")(SK);

const ItemSchema = new Schema({
    name: String,
    address:String,
    email: {
        type: String
    },
    phn: Number,
    it: {
        type : Array
    }
});
const Item = mongoose.model('Item', ItemSchema);

const UserSchema = new Schema({
    username: String,
    email: {
        type: String,
        unique: true
    },
    phn : Number,
    date:String
});
const User = mongoose.model('User', UserSchema);
const blogScehma = new Schema({
    email: {
        type: String,
        unique: true
    },
    name: String,
    review: String,
    postedBy: ObjectId
});

const blogModel = mongoose.model("Blog", blogScehma)
app.get('/', function (req, res) {
    res.render("creativefolks")
});
app.get('/register', function (req, res) {
    res.render('register')
})
app.post('/register', urlencodedParser, function (req, res) {
    let newUser = new User();
    newUser.username = req.body.username;
    newUser.email = req.body.email;
    newUser.phn = req.body.phn;
    newUser.date = req.body.date;
    newUser.save(function (err) {
        if (err) {
            console.log(err, 'error')
            return
        }
        res.redirect('/success')

    });
})
app.get('/success', function (req, res) {
    res.render('success')
})

app.get('/review', (req, res) => {
    blogModel.find({}, (err, docs) => {
        res.render('review', { blogs: docs })
    })
})

app.post('/review', urlencodedParser, (req, res) => {
    User.findOne({ email: req.body.email }, function (err, doc) {
        if (err) {
            console.log(err, 'error')
            res.redirect('/')
            return
        }
        if (_.isEmpty(doc)) {
           
                res.render('not')
            
        }
        else {
            let newBlog = new blogModel()
            newBlog.review = req.body.review
            newBlog.email = req.body.email
            newBlog.name = req.body.name
            newBlog.save(function (err) {
                res.redirect('/review')
            })
        }
    })
})
app.get('/gallery',(req,res)=>{
    res.render('gallery')
})



app.get('/pay',(req,res)=>{
    res.render('ins')
})
app.get('/other',(req,res)=>{
        res.render('other')
})   
app.post('/other', urlencodedParser, (req, res) => {
    let newItem = new Item();
    newItem.name = req.body.name;
    newItem.address = req.body.address;
    newItem.email = req.body.email;
    newItem.phn = req.body.phn;
    newItem.it = req.body.it;
    
    newItem.save(function (err, doc) {
        if (err) {
            console.log(err, 'error')
            return
        }
        req.session.item = doc;
        res.redirect('/do')

    });
})
app.get('/do', function (req, res) {
    res.render('do')
})
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server has started at port 3000");
  });