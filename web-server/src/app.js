const express = require("express");
const path = require("path");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

const PORT = process.env.PORT || 3000;

const publicPath = path.join(__dirname, "..", "public");
const viewsPath = path.join(__dirname, "..", "templates", "views");
const partialsPath = path.join(__dirname, "..", "templates", "partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/help", (req, res) => {
  res.render("help");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/weather", async (req, res) => {
  const query = req.query.search;
  const location = await geocode(query);

  if (location.error) {
    return res.send(location);
  }

  const weather = await forecast(location);

  res.send({ location, weather });
});

app.get("/*", (req, res) => {
  res.render("404");
});

app.listen(PORT, () => {
  console.log(`Server is up in port ${PORT}`);
});
