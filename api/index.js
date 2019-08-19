const express = require('express');
const cors = require('cors');
const db = require('../database');
const logger = require('../utils/logger');
const app = express();

require('dotenv').config();

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
            res.json(data)
        })
        .catch(err => {
            console.error(err);
            logger.error(err.message);
            res.status(500).end();
        })
});

let port = process.env.API_PORT;
app.listen(port, () => console.log(`app listening on ${port}`));
// TODO: move port to env
// TODO: move run to base index.js
// TODO: response caching
// TODO: proper cors handling
