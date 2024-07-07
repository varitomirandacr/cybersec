const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const Parser = require('rss-parser');
const parser = new Parser();
const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(cors());

// Serve static files from the "public" directory
//app.use(express.static(path.join(__dirname, '/')));

/* Middlewares */
app.use(express.static('/'));
app.use(bodyParser.urlencoded({ extended: false }));

/* Routes */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.use('/', express.static(__dirname + '/'));

// Define an API route
app.get('/api/callrss', (req, res) => {
  console.log('API /api/callrss called');
  fetch("https://feeds.feedburner.com/TheHackersNews?format=xml", {
        method: 'GET'
    }) 
    .then(response => response.text())
    .then(xmlString => { 
      const jsonItems = [];
      xml2js.parseString(xmlString, (err, result) => {
        const items = result.rss.channel[0].item;
        
        items.forEach(item => {
          const title = item.title[0];
          const description = item.description[0];
          const link = item.link[0];
          const pubDate = item.pubDate[0];

          jsonItems.push({title: title, description: description, link: link, pubDate: pubDate });
        });
      });
      
      return jsonItems; 
    })
    .then(items => {   
      let parsed = [];     
      items.forEach(el => {
        parsed.push(`
          <div class="col-md-4 col-lg-6 d-flex flex-column h-100 p-5 pb-1 text-white text-shadow-1">
            <div class="cyan-card">
              <div>
                <h5 class="card-title cyan-title">${el.title}</h5>
                <p class="card-text">
                  ${el.description}
                </p>
                <a href="${el.link}" class="card-link">Read more</a>
              </div>
              <div class="card-footer text-muted">
                ${el.pubDate}
              </div>
            </div>
          </div>`);
      }); 
      res.json({ content: parsed.join('') });     
    })
    .catch(error => console.log('Error fetching the RSS feed:', error));
});

app.get('/api/test', (req, res) => {
  console.log('API /api/data called');
  res.json({ message: 'Hello from the backend!' });
});

app.listen(process.env.PORT || 3000, function() {
  console.log('Example app listening on port 3000!');
});