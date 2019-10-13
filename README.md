# VODLINK

### Requirements
postgres 11.4
node 12.6.0
python 64bit 3.7.4 

### Setup
* Ensure all requirements are installed at the correct version.
* Create postgres DB
* Populate .env file `cp example.env .env`
* `npm install`
* `npm run migrate_database`
* `npm run seed-database`
* `pip install -r python/requirements.txt`

### Folder Structure
* api - Express API backend
* database - Database Queries & Setup
    * migrations - Database migration files 
* external_apis - functions that make calls to twitch/lol APIs to get data
* job_system
    * job_queue - job queue, types, runner & related jobs
    * scheduled_jobs - scheduled job runner & related jobs
* lol_data - League of legends constants and champion Info
* python - python scripts for FFI calls
* scripts - package.json scripts
* utils - utility functions
* webapp - Frontend next.js React application

