const express = require("express");
const app = express();
const flips = require("./data/flips-data"); // reads, executes, returns `exports` object
const counts = require("./data/counts-data");

function bodyHasResultProperty(req, res, next) {
  const { data: { result } = {} } = req.body;
  if (result) {
    return next();
  }
  next({
    status: 400,
    message: "A 'result' property is required.",
  });
}

app.use(express.json());

app.use("/counts/:countId", (req, res, next) => {
  const { countId } = req.params;
  const foundCount = counts[countId];

  if (foundCount === undefined) {
    next(`Count id not found: ${countId}`);
  } else {
    res.json({ data: foundCount }); // Return a JSON object, not a number.
  }
});

app.use("/counts", (req, res) => {
  res.json({ data: counts });
});

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

app.get("/flips", (req, res) => {
  // define a handler for the path
  res.json({ data: flips }); // method to tell express to respond with JSON
});

app.post(
  "/flips",
  bodyHasResultProperty, // Add validation middleware function
  (req, res) => {
    // Route handler no longer has validation code.
    const { data: { result } = {} } = req.body;
    const newFlip = {
      id: flips.length + 1, // Assign the next ID
      result: result,
    };
    flips.push(newFlip);
    res.status(201).json({ data: newFlip });
  }
);

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  res.status(status).json({ error: message });
});

module.exports = app;
