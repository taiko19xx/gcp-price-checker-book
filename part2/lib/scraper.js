"use strict";

const dmm = require('./dmm');
const amazon = require('./amazon');

exports.getData = async (url) => {
  if (url.indexOf('dmm.com') !== -1 || url.indexOf('dmm.co.jp') !== -1) {
    return await dmm.getDmm(url);
  }

  if (url.indexOf('amazon.co.jp') !== -1) {
    return await amazon.getAmazon(url);
  }

  return {
    result: false,
    message: 'target not found'
  }
};