require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('../database');
const logger = require('../utils/logger');
const app = express();

const jsonParser = bodyParser.json();

app.use(cors());


app.get('/api/championIdsByRole', (req, res) => {
    let role = req.query.role;

    db.searchQueries.getChampionIdsByRole(role)
        .then(data => {
            let championIds = data.map(row => row.champion_id);

            res.json({ championIds });
        })
        .catch(err => {
            console.error(err);
            logger.error(err.message);
            res.status(500).end();
        });
});


app.get('/api/opponentChampionIdsByRoleAndChampion', (req, res) => {
    let { role, championId } = req.query;

    db.searchQueries.getOpponentChampionIdsByRoleAndOurChampion(role, championId)
        .then(data => {
            let championIds = data.map(row => row.champion_id);

            res.json({ championIds });
        })
        .catch(err => {
            console.error(err);
            logger.error(err.message);
            res.status(500).end();
        });
});


app.get('/api/vodLink', (req, res) => {
    let { role, championId, opponentChampionId } = req.query;

    // TODO pagination
    db.searchQueries.getVodLinkInfoByMatchUp(role, championId, opponentChampionId)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error(err);
            logger.error(err.message);
            res.status(500).end();
        })
});

app.post('/api/full_matchup_vodlinks', jsonParser, (req, res) => {
    let body = req.body;

    db.searchQueries.fullMatchupSearch(body)
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
