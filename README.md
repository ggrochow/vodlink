# VODLINK
## https://www.lolvodlink.com
A tool to link League of Legends matches to twitch streamers VODs. 
Allowing users to find timestamps to vods to watch based on a given champion matchup.
Automatically fetches matches & vods from Twitch/LoL APIs grabbing new data daily.

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

### Running
There are 3 separate things to run for this to operate fully.
They can be ran on separate servers as long as the .env file is configured correctly for each.
Make sure you are running the start commands from project root to ensure the .env file is found/used.

1) Job System
    * Queries Twitch/LoL Apis to fetch new data, as well as cleaning up old stale data.
    * RUN: `node job_system/index.js`
2) API
    * API server for the frontend to query
    * RUN: `node api/index.js`
3) Front end web server & React app
    * Next.js React frontend
    * RUN dev: `npm run dev`
    * RUN prod: `npm run build` then `npm run start`

### Folder Structure
* api - Express API backend
* database - Database Queries & Setup
    * migrations - Database migration files 
* external_apis - functions that make calls to twitch/lol APIs to get data
* job_system
    * job_queue - job queue, types, runner & related jobs
    * scheduled_jobs - scheduled job runner & related jobs
* utils - utility functions and folders
    * lol_data - League of legends constants and champion Info
    * python - python scripts for FFI calls
    * scripts - package.json scripts
* webapp - Frontend next.js React application
    * components - React components to be used to build pages
    * pages - react components used as routes
    * static - static files served at /static/...
    * utils - front end utility functions 
