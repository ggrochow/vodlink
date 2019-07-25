# Job Runner 

### needs

- Multiple different Queues process jobs
    - LoL / Twitch api queues

- Queues have a customizable 'wait' time between running a job. 
    - Jobs hitting APIs need to work around rate-limits

- Jobs need state field, NEW | IN_PROGRESS | DONE | ERROR | RETRY?
    - Ensure jobs only ran a single time. 
    - Retry failed jobs a few times?
    - Find all ERROR'd jobs and diagnose

- Jobs need a job_type
    - figure out what to do with the job
    
- Jobs need a payload field
    - some data will be required to run the job.

### Jobs DB table

ID | job_type | status | payload | errors 

### Runner

Takes list of job_type's that the job will look for
Takes a 'wait time', that it will pause for after each job

