const express = require('express');
const { body, validationResult } = require("express-validator");

const app = express();
const port = 3000;
const host = "localhost";

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("landing");
});

app.post("/", 
[
  body("url")
    .custom(value => {
      const URL_REGEX = new RegExp(/^https:\/\/github.com\/[\w]+\/[\w]+/);
      return URL_REGEX.test(value);
    })
], 
(req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error ('Error! Invalid GitHub Repository URL');
  } else {
    console.log(req.body.url);
    res.render("results");
  }
});

app.listen(port, host, () => {
  console.log(`listening on port ${port} of ${host}...`);
});