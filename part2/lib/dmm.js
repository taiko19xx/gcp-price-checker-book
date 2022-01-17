"use strict";

const axios = require('axios');
const regex = /\/detail\/(=\/(title_id|cid)=(.*)|(.*))\//g;

exports.getDmm = async (url) => {
  if (!process.env.DMM_API_ID || !process.env.DMM_AFFILIATE_ID) {
    return {
      result: false,
      message: 'API or affiliate id not found'
    };
  }

  const api_id = process.env.DMM_API_ID;
  const affiliate_id = process.env.DMM_AFFILIATE_ID;
  let site = 'DMM.com';
  if (url.indexOf('dmm.co.jp') !== -1) {
    site = 'FANZA';
  }

  const result = [...url.matchAll(regex)];

  if (result.length <= 0) {
    return {
      result: false,
      message: 'url parse failed(matchAll)'
    };
  }

  let cid = result[0][3];
  if ('undefined' === typeof cid) {
    cid = result[0][4];

    if ('undefined' === typeof cid) {
      return {
        result: false,
        message: 'url parse failed(regex group not found)'
      };
    }
  }

  try {
    const fetch = await axios.get(`https://api.dmm.com/affiliate/v3/ItemList?api_id=${api_id}&affiliate_id=${affiliate_id}&site=${site}&cid=${cid}`);
    const item = fetch.data.result.items[0];

    return {
      result: true,
      data: {
        target: url,
        site: site,
        name: item.title,
        price: parseInt(item.prices.price)
      }
    }
  } catch (e) {
    return {
      result: false,
      message: JSON.stringify(e.response.data.result)
    };
  }
};