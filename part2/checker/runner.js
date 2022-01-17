"use strict";

const { exit } = require('process');
const checker = require('./lib/checker');

(async () => {
  try {
    if (!process.env.CHECKER_SITE) {
      throw new Error('Env [CHECKER_SITE] undefined.');
    }

    const result = await checker.runChecker(process.env.CHECKER_SITE);
    if (!result.result) {
      throw new Error(result.message);
    }

    console.log(result);
    exit(0);
  } catch (e) {
    console.log(e);
    exit(1);
  }
})();