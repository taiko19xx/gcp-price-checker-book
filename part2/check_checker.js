"use strict";
const checker = require('./checker/lib/checker');

const argv = process.argv.slice(2);

(async () => {
    console.log(await checker.runChecker(argv[0]));
    process.exit(0);
})();