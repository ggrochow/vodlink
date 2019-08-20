# Jobs

### Requirements
Jobs will be passed DB columns in the constructor.
Jobs must have a `run()` function that does all the work.
Jobs must only make 1 API call per job, this system is setup to work around rate limiting APIs. 

### Error Handling
Abort doing things, save job with `ERROR` state, include as much of error message as we can in `errors` field.

### Retry state
Jobs that get rate limited will be put into a `RETRY` state and treated as new. 
Maybe worth having a max amount of retries? If the job queues work as intended it shouldn't hit this state 
