const express = require('express');
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const Parser = require('rss-parser');
const parser = new Parser();
const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');
const app = express();
const port = 4000;

app.set('view engine', 'ejs');
app.use(cors({origin: 'https://varitomirandacr.github.io/cybersec/'}));

/* Middlewares */
//app.use(express.static('/'));
app.use('/', express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }));

/* Routes */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/api/news', async (req, res) => {
  try {
    const response = await axios.get('https://newsdata.io/api/1/news?apikey=pub_48290aed27ff3a224875151ae01fc6a504c03&q=cybersecurity');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.get('/api/mags', async (req, res) => {
  try {
    const response = await axios.get('./content/magazines/magazines.json');
    const json = response.json();
    const mags = [];
    json.magazines.forEach(mag => {
      mags.push(`<!-- ${mag.name} -->
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${mag.name}</h5>
                        <a href="${mag.url}" class="btn btn-primary">Visit Website</a>
                    </div>
                </div>
            </div>`);
    });
    res.json({ content: mags.join('') });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});


app.listen(process.env.PORT || port, function() {
  console.log(`App listening on port ${process.env.PORT || port}!`);
});