const express = require("express");
const cookieParser = require("cookie-parser");
const {generateRandomString, createNewUser} = require('./helpers/helperFunctions')
const app = express();
app.use(cookieParser());
const PORT = 8080;

//  Middleware
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// Set Ejs view engine
app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  "6fd85i": {
    id: "6fd85i",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  gji08b: {
    id: "gji08b",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const { username } = req.cookies;
  const templateVars = { urls: urlDatabase, username };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const { username } = req.cookies;
  const templateVars = { username };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const { username } = req.cookies;
  const templateVars = {
    username,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  //extract shortUrl from req.params
  const { shortURL } = req.params;

  // extract longUrl from req.body
  const { longURL } = req.body;

  // update url in the urlDatabase
  urlDatabase[shortURL] = longURL;

  // redirect to urls page
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  // if (req.params.shortURL) -> res.redirect(longURL)
  // else redirect -> 404
  const longURL = urlDatabase[req.params.shortURL];

  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls", (req, res) => {
  // Log the POST request body to the console
  const { longURL } = req.body;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

/////////////////
// Login / Logout Routes
/////////////////
app.post("/login", (req, res) => {
  const { username } = req.body;
  res.cookie("username", username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

/////////////////
// Register Routes
/////////////////

app.get("/register", (req, res) => {
  const templateVars = { username: null };
  res.render("registration", templateVars);
});


app.post("/register", (req, res) => {
  let user = createNewUser(req.body);

  // add new user object to global users object
  users[user.id] = user;
  // set user_id cookie to users generated ID
  res.cookie("user_id", user.id);
  // redirect to the /urls page
  res.redirect("/urls");
});

/////////////////
// DELETE URL
/////////////////

app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

/////////////////
// 404
/////////////////

app.use(function (req, res) {
  const { username } = req.cookies;
  res.status(404);
  res.render("404_error_template", { title: "404: Page Not Found!", username });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
