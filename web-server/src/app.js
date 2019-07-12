const express = require("express");
const path = require("path");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

const publicPath = path.join(__dirname, "..", "public");
const viewsPath = path.join(__dirname, "..", "templates", "views");
const partialsPath = path.join(__dirname, "..", "templates", "partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Caio"
  });
});

app.get("/help", (req, res) => {
  res.render("help");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/weather", async (req, res) => {
  console.log(req.query);
  const query = req.query.search;
  const location = await geocode(query);

  if (location.error) {
    return res.send(location.error);
  }

  const weather = await forecast(location);

  console.log(weather);

  res.send(weather);
});

app.get("/*", (req, res) => {
  res.render("404");
});

app.listen(3000, () => {
  console.log("Server is up");
});
