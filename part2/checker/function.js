"use strict";

const checker = require('./lib/checker');

exports.entryPoint = async (req, res) => {
  try {
    if (!req.query.site) {
      throw new Error('paramter [site] required');
    }

    const result = await checker.runChecker(req.query.site);
    if (!result.result) {
      throw new Error(result.message);
    }

    res.status(200).send(result);
  } catch (e) {
    res.status(400).send({error: e.message});
  }
};