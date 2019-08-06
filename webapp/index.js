const express = require('express');
const db = require('../database');
const logger = require('../utils/logger');
const app = express();


app.get('/api/championIdsByRole', (req, res) => {
    let { role, lane } = req.query;

    db.searchQueries.getChampionIdsByRole(role, lane)
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
    let { role, lane, championId } = req.query;

    db.searchQueries.getOpponentChampionIdsByRoleAndOurChampion(role, lane, championId)
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
    let { role, lane, championId, opponentChampionId } = req.query;

    db.searchQueries.getVodLinkInfoByMatchUp(role, lane, championId, opponentChampionId)
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            console.error(err);
            logger.error(err.message);
            res.status(500).end();
        })

});


app.listen(3000, () => console.log('app listening on 3000'));
// TODO: move port to env
// TODO: move run to base index.js
// TODO: response caching
