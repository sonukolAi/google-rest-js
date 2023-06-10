const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3330;

const sources = {
  '0': {
    url: (num) => `https://www.google.com/search?q=${num}+train+running+status`,
    processData: ($, res) => {
      const train = $('div.k9rLYb').eq(0).text().trim();
      const status = $('div.dK1Bub .rUtx7d').eq(1).text();
      const delay = $('div.Rjvkvf.MB86Dc').eq(1).text().trim();
      const currentTime = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
      });
      res.json({ train, status, delay, currentTime });
    },
  },
  '1': {
    url: (num) => `https://runningstatus.in/status/${num}`,
    processData: ($, res) => {
      const train = $('title').text().replace('Live Train Running Status', '').trim();
      const station = $('.table-success').text().trim();
      const delay = $('.table-success small').eq(1).text().trim();
      const currentTime = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
      });
      res.json({ train, station, delay, currentTime });
    },
  },
  '2': {
    url: (num) => `https://trainstatus.com/runningstatus/${num}`,
    processData: ($, res) => {
      const train = $('.panel-heading h6').text().trim();
      const station = $('.info').text().replace(/\s+/g, ' ').trim();
      const delay = $('.panel-heading span').text().trim();
      const currentTime = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
      });
      res.json({ train, station, delay, currentTime });
    },
  },
  '3': {
    url: (num) => `https://spotyourtrain.com/trainstatus?train=${num}`,
    processData: ($, res) => {
      const train = $('.m-t-0').eq(0).text().trim();
      const station = $('.table-success').text().trim();
      const delay = $('.m-t-0 code').text().trim();
      const currentTime = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
      });
      res.json({ train, station, delay, currentTime });
    },
  },

  '4': {
    url: (num) => `https://www.railmitra.com/live-train-running-status/kte-et-pass-memu-spl-${num}`,
    processData: ($, res) => {
      const train = $('div h2 b').eq(1).text().trim();
      const station = $('.row.text-center .col-12').text().replace(/(\r\n|\n|\r)/gm, '').trim();
      const delay = $('.tl-msg.text-danger').eq(1).text().trim();
      const currentTime = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
      });
      res.json({ train, station, delay, currentTime });
    },
  },

};

app.get('/:num/:source', async (req, res) => {
  try {
    const { num, source } = req.params;
    const selectedSource = sources[source];
    if (selectedSource) {
      const url = selectedSource.url(num);
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
        },
      });
      const $ = cheerio.load(data);
      selectedSource.processData($, res);
    } else {
      res.status(400).send('Invalid source');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred');
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
