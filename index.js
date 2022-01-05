const express = require('express');
const { body, validationResult } = require("express-validator");
const { fetchCompletePrData } = require('./lib/callApi');

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
async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error ('Error! Invalid GitHub Repository URL');
  } else {
    const params = /[\w\-]+/g;
    let url = req.body.url;
    let [userName, repoName] = url.match(params).filter(word => {
      return !['https', 'github', 'com'].includes(word);
    });
    
    let pullRequests = await fetchCompletePrData(userName, repoName);
    
    res.render("results", {
      pullRequests,
      url
    });
  }
});

app.listen(port, host, () => {
  console.log(`listening on port ${port} of ${host}...`);
});