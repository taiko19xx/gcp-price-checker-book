"use strict";

const express = require('express');
const app = express();

const functions = require('./function');

app.get('/', async (req, res) => {
  await functions.entryPoint(req, res);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`express: listening on port ${port}`);
});