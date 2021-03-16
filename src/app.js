const express = require("express");
const app = express();
const flips = require("./data/flips-data"); // reads, executes, returns `exports` object

app.use("/flips/:flipId", (req, res, next) => {
  // define a handler for the path
  const { flipId } = req.params; // destructure flipId variable from params
  const foundFlip = flips.find((flip) => flip.id === Number(flipId)); // find() flip by id

  if (foundFlip) {
    res.json({ data: foundFlip }); // send data containing foundFlip object to client as JSON
  } else {
    next(`Flip id not found: ${flipId}`); // next() with err message if not found
  }
});

app.use("/flips", (req, res) => {
  // define a handler for the path
  res.json({ data: flips }); // method to tell express to respond with JSON
});

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});

module.exports = app;
