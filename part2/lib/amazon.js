"use strict";

const axios = require('axios');
const { JSDOM } = require('jsdom');

exports.getAmazon = async (url) => {
  try {
    const resp = await axios.get(url);
    const domBody = new JSDOM(resp.data);
    const document = domBody.window.document;

    const title = document.querySelector('span#productTitle').textContent.replace(/(?:\r\n|\r|\n)/g, '');

    const priceBlocks = [
      'span#priceblock_dealprice',
      'span#priceblock_ourprice',
      'span#price',
      'span#kindle-price',
      'span#priceblock_saleprice',
    ];

    let price = 0;
    for (const block of priceBlocks) {
      if (null !== document.querySelector(block)) {
        price = parseInt(document.querySelector(block).textContent.replace(/[^0-9]/g, ''));
        break;
      }
    }

    return {
      result: true,
      data: {
        target: url,
        site: 'amazon.co.jp',
        name: title,
        price: price
      }
    };
  } catch (e) {
    return {
      result: false,
      message: e.message
    };
  }
};