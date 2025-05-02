const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

// Endpoint to receive data from Arduino
app.post('/api/data', (req, res) => {
  const entry = {
    time: new Date().toISOString(),
    bpm: req.body.bpm,
    spo2: req.body.spo2
  };

  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  data.push(entry);
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

  res.status(200).send({ status: 'Data saved' });
});

// Endpoint to get data for chart
app.get('/api/data', (req, res) => {
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
