const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const port = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(cors());

//mongoose
mongoose
  .connect(
    "mongodb+srv://helphelper-dev:helphelper@cluster0.9dafc.mongodb.net/moviesDB?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

//data schema and model
const movieSchema = {
  title: String,
  genre: String,
  year: String
};

const Movie = mongoose.model("Movie", movieSchema);

//API routes
app.get("/movies", function (req, res) {
  Movie.find().then((movies) => res.json(movies));
});

//add movie
app.post("/newmovie", function (req, res) {
  const title = req.body.title;
  const genre = req.body.genre;
  const year = req.body.year;
  const newMovie = new Movie({
    title,
    genre,
    year
  });
  console.log("posting new movie", newMovie);

  newMovie.save();
});

app.delete("/delete/:id", function (req, res) {
  const id = req.params.id;
  Movie.findByIdAndDelete({ _id: id }, function (err) {
    if (!err) {
      console.log("movie deleted");
    } else {
      console.log(err);
    }
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, function () {
  console.log("express is running");
});
