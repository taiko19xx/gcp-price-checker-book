"use strict";
const scraper = require('./lib/scraper');

const argv = process.argv.slice(2);

(async () => {
    console.log(await scraper.getData(argv[0]));
})();