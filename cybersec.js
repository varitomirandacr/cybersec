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
    const data = fs.readFileSync('./content/magazines/magazines.json', 'utf8');
    const json = JSON.parse(data);
    const mags = [];

    const title = `<div class="container"> 
        <h1>${json.title}</h1>
        <p class="pb-3 mb-0 small lh-sm card-bottom">${json.description}</p>
        <p class="last-updated"> ${new Date()} </p>
      </div>`;
    json.magazines.forEach(mag => {
      mags.push(`<!-- ${mag.name} -->
            <div class="col-md-4">
                <div class="d-flex text-body-secondary pt-3">
                    <div class="card-container">
                        <h4 class="card-title">${mag.name}</h4>
                        <p class="pb-3 mb-0 small lh-sm card-bottom">${mag.description}</p>
                        <a href="${mag.url}" class="card-link" target="_blank">Visit Website</a>
                    </div>
                </div>
            </div>`);
    });
    res.json({ content: `${title} ${mags.join('')}` });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.get('/api/jobs', async (req, res) => {
  try {
    const data = fs.readFileSync('./data/search_jobs.json', 'utf8');
    const json = JSON.parse(data);
    const jobs = [];

    json.forEach(job => {
      jobs.push(`<li class="list-group-item bg-dark text-white"> 
          <span> ${job.icon} </span>
          <a href="${job.url}"> ${job.site} </a>
        </li>`);
    });
    res.json({ content: `${jobs.join('')}` });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});



app.listen(process.env.PORT || port, function() {
  console.log(`App listening on port ${process.env.PORT || port}!`);
});