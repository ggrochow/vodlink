require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('../database');
const logger = require('../utils/logger');
const app = express();

const jsonParser = bodyParser.json();

app.use(cors());

app.post('/api/full_matchup_vodlinks', jsonParser, (req, res) => {
    let body = req.body;

    db.searchQueries.matchupSearch(body)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error(err);
            logger.error(err.message);
            res.status(500).end();
        })

});


// TODO: response caching
// TODO: proper cors handling
logger.info("Starting express api");
let port = process.env.API_PORT;
app.listen(port, () => logger.info(`api listening on ${port}`));
