const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3330;

app.get('/:num', async (req, res) => {
  try {
    const { num } = req.params;
    const url = `https://www.google.com/search?q=${num}+train+running+status`;
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    const $ = cheerio.load(data);
    const trainName = $('div.k9rLYb').eq(0).text().trim();
    const liveStatus = $('div.dK1Bub .rUtx7d').eq(1).text();
    const delayTime = $('div.Rjvkvf.MB86Dc').eq(1).text().trim();
    const modifiedData = { trainName, liveStatus, delayTime };
    res.json(modifiedData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred');
  }
});

app.get('/:num/1', async (req, res) => {
  try {
    const { num } = req.params;
    const url = `https://runningstatus.in/status/${num}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const trainName = $('head').text().replace('Live Train Running Status', '').trim();
    const currentStation = $('.table-success').text().trim();
    const modifiedData = { Name: trainName, currentStation: currentStation };
    res.json(modifiedData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred');
  }
});

app.get('/:num/2', async (req, res) => {
  try {
    const { num } = req.params;
    const { data } = await axios.get(`https://trainstatus.com/runningstatus/${num}`);
    const $ = cheerio.load(data);
    const trainName = $('head').text().replace('Live Train Running Status', '').trim();
    const currentStation = $('.panel-heading').text().trim();
    const modifiedData = { Name: trainName, currentStation: currentStation };
    res.json(modifiedData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred');
  }
});

app.get('/:num/3', async (req, res) => {
  try {
    const { num } = req.params;
    const { data } = await axios.get(`https://spotyourtrain.com/trainstatus?train=${num}`);
    const $ = cheerio.load(data);
    const trainName = $('head').text().replace('Live Train Running Status', '').trim();
    const currentStation = $('.table-success').text().trim();
    const modifiedData = { Name: trainName, currentStation: currentStation };
    res.json(modifiedData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred');
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
