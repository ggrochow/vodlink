const postgrator = require('../utils/postgrator');

postgrator
    .migrate()
    .then(migrations => console.log(migrations))
    .catch(error => console.error(error));