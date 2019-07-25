/*
    Creates empty migration .sql files in the DB/Migrations folder.
    Naming scheme is timestamp_providedname.sql
    Provide names via ARGV
 */

const fs = require("fs");
const MIGRATION_FOLDER_PATH = "DB/setup/migrations/"; // From project root

let timestamp = new Date().getTime();
let argv_name = process.argv[2] || "";
let file_name = `${timestamp}_${argv_name}.sql`;

fs.closeSync(fs.openSync(`${MIGRATION_FOLDER_PATH}${file_name}`, 'a'));
