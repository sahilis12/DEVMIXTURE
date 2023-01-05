require("dotenv").config();
let express = require("express");
let bodyParser = require("body-parser");
const md5 = require("md5");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/usersDB");
let db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", function (callback) {
  console.log("connection succeeded");
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

const User = new mongoose.model("User", userSchema);

let app = express();
const images = "/devmixture/images";
const public = "/devmixture/public";

app.use(bodyParser.json());
app.use(express.static(public));
app.use(express.static(images));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post("/sign_up", function (req, res) {
  let name = req.body.name;
  let email = req.body.email;
  let pass = md5(req.body.password);
  const role = req.body.role;
  // let phone = req.body.phone;

  // let data = {
  //   name: name,
  //   email: email,
  //   password: pass,
  //   phone: phone,
  // };
  // db.collection("details").insertOne(data, function (err, collection) {
  //   if (err) throw err;
  //   console.log("Record inserted Successfully");
  // });

  // md5(req.body.password)

  console.log(req.body.role);
  const newUser = new User({
    name: name,
    email: email,
    password: pass,
    role: role,
    // md5(req.body.password)
  });

  newUser.save((err) => {
    if (err) {
      console.log(errr);
    } else {
      res.sendFile("/devmixture/front-end/HTML/main_body/index.html");
    }
  });
});

app.get("/index", (req, res) => {
  ///workson a href yoho!

  return res.sendFile(__dirname + "/sign_up.html");
});
app.get("/", function (req, res) {
    // return res.sendFile(__dirname + "/index.html");
    res.sendFile("/devmixture/front-end/HTML/main_body/index.html");
    // res.set({
    // 	'Access-control-Allow-Origin': '*'
    // 	});
    // return res.redirect('index');
  })
 app.get('/login',(req,res) => {
  res.sendFile(__dirname + "/index.html");
 }) 
app.post("/login", (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = md5(req.body.password);
  const role = req.body.role;
  const key = req.body.key;
  // md5(req.body.password)

  User.findOne({ email: email }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password && foundUser.role === role)
          if (key === process.env.KEY) {
            res.end("welcome admin");
          } else {
            res.sendFile("/devmixture/front-end/HTML/main_body/index.html");
          }
      } else {
        res.end("Account  not found");
      }
    }
  });
});
app.listen(3000)
console.log("server listening at port 3000");
