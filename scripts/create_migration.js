/*
    Creates empty migration .sql files in the database/Migrations folder.
    Naming scheme is timestamp_providedname.sql
    Provide names via ARGV
 */

const fs = require("fs");
const MIGRATION_FOLDER_PATH = "database/migrations/"; // From project root

let timestamp = new Date().getTime();
let argvName = process.argv[2] || "";
let upFileName = `${timestamp}.do.${argvName}.sql`;
let downFileName = `${timestamp}.undo.${argvName}.sql`;

fs.closeSync(fs.openSync(`${MIGRATION_FOLDER_PATH}${upFileName}`, 'a'));
fs.closeSync(fs.openSync(`${MIGRATION_FOLDER_PATH}${downFileName}`, 'a'));
