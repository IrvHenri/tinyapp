const express = require("express");
const app = express();
const PORT = 8080;

//  Middleware
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
// Set Ejs view engine
app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const generateRandomString = function() {
  return Math.random().toString(20).substr(2, 6);
};


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render("urls_show", templateVars);
});
/////////////////
// UPDATE URL
/////////////////

app.post('/urls/:shortURL', (req,res) =>{
  
  //extract shortUrl from req.params
  const {shortURL} = req.params

  // extract longUrl from req.body
  const {longURL} = req.body

  // update url in the urlDatabase
  urlDatabase[shortURL] = longURL

  // redirect to urls page
  res.redirect('/urls')
})


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
  const {longURL} = req.body;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
  
});

/////////////////
// DELETE URL
/////////////////
app.post('/urls/:shortURL/delete',(req,res)=>{
  const {shortURL} = req.params;
  delete urlDatabase[shortURL]
  res.redirect('/urls')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
