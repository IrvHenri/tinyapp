const express = require("express");
const cookieParser = require("cookie-parser");
const { helperGenerator,urlsForUser } = require("./helpers/helperFunctions");
const app = express();
app.use(cookieParser());
const PORT = 8080;

//  Middleware
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// Set Ejs view engine
app.set("view engine", "ejs");

// const urlDatabase = {
//   b2xVn2: "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com",
// };

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

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};


const { generateRandomString, createNewUser, authenticateUser } =
  helperGenerator(users);

app.get("/", (req, res) => {
  res.send("Hello!");
});



app.get("/urls", (req, res) => {
  const { user_id } = req.cookies;
  let user = users[user_id];
  let userURLS = urlsForUser(user_id, urlDatabase)
  const templateVars = { urls: userURLS, user };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const { user_id } = req.cookies;
  let user = users[user_id];
  const templateVars = { user };
  if (user && user_id) {
    return res.render("urls_new", templateVars);
  }
  return res.redirect("/login");
});

app.get("/urls/:shortURL", (req, res) => {
  const { user_id } = req.cookies;

  let user = users[user_id];
  const templateVars = {
    user,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  //extract shortUrl from req.params
  const { shortURL } = req.params;
  // extract longUrl from req.body
  const { longURL } = req.body;
  // update url in the urlDatabase
  urlDatabase[shortURL].longURL = longURL;
  // redirect to urls page
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;

  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls", (req, res) => {
  const { user_id } = req.cookies;
  // Log the POST request body to the console
  const { longURL } = req.body;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL, userID:user_id };
  res.redirect(`/urls/${shortURL}`);
});

/////////////////
// LOGIN / LOGOUT Routes
/////////////////

app.get("/login", (req, res) => {
  const { user_id } = req.cookies;
  let user = users[user_id];
  const templateVars = { user };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const result = authenticateUser(req.body, users);

  if (result.error) {
    return res.sendStatus(403);
  }
  res.cookie("user_id", result.data.id);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

/////////////////
// Register Routes
/////////////////

app.get("/register", (req, res) => {
  const { user_id } = req.cookies;
  let user = users[user_id];
  const templateVars = { user };
  res.render("registration", templateVars);
});

app.post("/register", (req, res) => {
  const result = createNewUser(req.body);
  if (result.error) {
    return res.sendStatus(400);
  }
  res.cookie("user_id", result.data.id);
  res.redirect("/urls");
});

/////////////////
// DELETE URL
/////////////////

app.post("/urls/:shortURL/delete", (req, res) => {
  const { user_id } = req.cookies;
  const { shortURL } = req.params;
  if(user_id){
    delete urlDatabase[shortURL];
   return res.redirect("/urls");
  } 
  return res.sendStatus(401)
});

/////////////////
// 404
/////////////////

app.use(function (req, res) {
  const { user_id } = req.cookies;

  let user = users[user_id];
  res.status(404);
  res.render("404_error_template", { title: "404: Page Not Found!", user });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
