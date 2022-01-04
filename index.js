const express = require('express');

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





app.listen(port, host, () => {
  console.log(`listening on port ${port} of ${host}...`);
});





