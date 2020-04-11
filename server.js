const express = require("express");
// const logger = require("morgan");
const mongoose = require("mongoose");
var path = require("path");
const app = express();
const PORT = process.env.PORT || 8000;
const Workout = require("./models/workout.js")
// app.use(logger("dev"));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("public"));


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workoutdb", {
  useNewUrlParser: true,
  useFindAndModify: false
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
app.get("/exercise", function (req, res) {
  res.sendFile(path.join(__dirname, "public/exercise.html"));
});
app.get("/stats", function (req, res) {
  res.sendFile(path.join(__dirname, "public/stats.html"));
});

app.post("/api/workouts", ({body}, res) => {
  Workout.create(body)
  .then(data =>
    res.json(data))
  .catch(err => {
    res.json(err);
  });  
})
app.get("/api/workouts",(req,res)=>{
  Workout.find({})
  .then(data => {
      res.json(data);
  })
  .catch(err => {
      res.json(err);
  });
});
app.put("/api/workouts/:id", ({ body, params }, res) => {
  Workout.findByIdAndUpdate(
      params.id,
      { $push: { exercises: body } },
      { new: true, runValidators: true }
  )
      .then(data => res.json(data))
      .catch(err => {
          console.log("err", err)
          res.json(err)
      })
});
app.get("/api/workouts/range", (req, res) => {
  Workout.find({}, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.json(data);
    }
  })
})
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});