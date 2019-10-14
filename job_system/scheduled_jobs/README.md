# Scheduled Jobs
Cron timer job runner

### Jobs 
* CreateFetchNewVodsJob - Create a fetch new job for each twitch channel in the DB
* CreateCheckVodExistenceJobs - Creates a CheckVodExistence Job for each Vod in the DB
* DeleteFinishedJobs - Delete jobs with the status of finished