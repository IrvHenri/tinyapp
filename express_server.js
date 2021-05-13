const express = require("express");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt"); // Imported here to use on initial dummy user data
const { helperGenerator, urlsForUser } = require("./helpers/helperFunctions");
const app = express();
const PORT = 8080;
const saltRounds = 10;

//  Middleware
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

const users = {
  "6fd85i": {
    id: "6fd85i",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", saltRounds),
  },
  gji08b: {
    id: "gji08b",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", saltRounds),
  },
};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
};

const { generateRandomString, createNewUser, authenticateUser } =
  helperGenerator(users);

app.get("/", (req, res) => {
  res.redirect("/urls");
});

/////////////////
//   Home page routes
/////////////////
app.get("/urls", (req, res) => {
  const { user_id } = req.session;
  let user = users[user_id];
  let userURLS = urlsForUser(user_id, urlDatabase);
  const templateVars = { urls: userURLS, user };
  res.render("urls_index", templateVars);
});


app.post("/urls", (req, res) => {
  const { user_id } = req.session;
  const { longURL } = req.body;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL, userID: user_id };
  res.redirect(`/urls/${shortURL}`);
});

/////////////////
//   Create Url form page  - once User is logged in
/////////////////

app.get("/urls/new", (req, res) => {
  const { user_id } = req.session;
  let user = users[user_id];
  const templateVars = { user };
  if (user && user_id) {
    return res.render("urls_new", templateVars);
  }
  return res.redirect("/login");
});


/////////////////
//   shortURL routes for viewing & updating LongURL
/////////////////

app.get("/urls/:shortURL", (req, res) => {
  const { user_id } = req.session;
  let user = users[user_id];
  //Error handle for non-existing short url
  if (!urlDatabase[req.params.shortURL]) {
    return res.render('400_error_template',{ title: "404: Page Not Found!", user })
  }
  //Error handle non-user url access
  if (!user_id) {
    return res.render('400_error_template',{ title: "403: Forbidden!", user })
  }
  //Error handle non-owner url access
  const { shortURL } = req.params;
  let ownerOfURL = urlDatabase[shortURL].userID;
  if (user_id !== ownerOfURL) {
    return res.render('400_error_template',{ title: "403: Forbidden!", user })
  }

  const templateVars = {
    user,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
  };
  return res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  
  const { shortURL } = req.params;
 
  const { longURL } = req.body;
 
  urlDatabase[shortURL].longURL = longURL;
  
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  // (minor) error handle and see if url exists
  res.redirect(longURL);
});


/// * if your ready to submit then you can delete this route
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

/////////////////
//    LOGIN & LOGOUT Routes
/////////////////

app.get("/login", (req, res) => {
  const { user_id } = req.session;
  let user = users[user_id];
  const templateVars = { user };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const result = authenticateUser(req.body);
  const { user_id } = req.session;
  let user = users[user_id];

  if (result.error) {
    return res.render('400_error_template',{ title: "Username or password is invalid.", user }) 
  }
  req.session.user_id = result.data.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

/////////////////
// Register Routes
/////////////////

app.get("/register", (req, res) => {
  const { user_id } = req.session;
  let user = users[user_id];
  const templateVars = { user };
  res.render("registration", templateVars);
});

app.post("/register", (req, res) => {
  const result = createNewUser(req.body);
  const { user_id } = req.session;
  let user = users[user_id];
  if (result.error) {
    //return html response
    return res.render('400_error_template',{ title: "Email already taken!", user })
  }
  req.session.user_id = result.data.id;

  res.redirect("/urls");
});

/////////////////
//  DELETE URL     
/////////////////

app.post("/urls/:shortURL/delete", (req, res) => {
  const { user_id } = req.session;
  const { shortURL } = req.params;
  if (!user_id) {
    return res.sendStatus(401);
  }
  
  let ownerOfURL = urlDatabase[shortURL].userID;
  if (user_id !== ownerOfURL) {
    return res.sendStatus(403);
  }
  delete urlDatabase[shortURL];
  return res.redirect("/urls");
});

/////////////////
// 404 routes
/////////////////

app.use(function (req, res) {
  const { user_id } = req.session;

  let user = users[user_id];
  res.status(404);
  res.render("400_error_template", { title: "404: Page Not Found!", user });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
