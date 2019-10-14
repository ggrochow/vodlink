const postgrator = require('../postgrator');


async function run() {
    let version = await postgrator.getDatabaseVersion();
    let migrations = await postgrator.getMigrations();

    migrations = migrations.filter(migration => migration.action === 'do');
    let migrationVersions = migrations.map(migration => migration.version);

    migrationVersions = migrationVersions.sort();
    migrationVersions.unshift(0);
    // To migrate back to initial DB state we can run migrate('0')

    let versionIndex = migrationVersions.indexOf(version);
    if (versionIndex === -1) {
        throw new Error("Unable to find current migration version");
    }

    let lastVersion = migrationVersions[versionIndex - 1];
    let rollback = await postgrator.migrate(`${lastVersion}`);

    console.log(rollback);
}


run()
    .catch(err => console.error(err));
