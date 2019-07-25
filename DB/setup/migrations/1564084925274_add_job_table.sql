CREATE TYPE job_type_enum AS ENUM (
    'FETCH_TWITCH_CHANNEL_ID',
    'FETCH_LOL_SUMMONER_ID',
    'FETCH_NEW_TWITCH_VODS',
    'FETCH_TWITCH_VOD_INFO',
    'FETCH_LOL_MATCHES_DURING_VOD',
    'FETCH_LOL_MATCH_INFO',
    'ASSOCIATE_LOL_MATCH_TO_TWITCH_VOD',
    'CLEANUP_EXPIRED_TWITCH_VODS'
);

CREATE TYPE job_status_enum AS ENUM (
    'NEW',
    'RUNNING',
    'RETRY',
    'FINISHED',
    'ERROR'
);

CREATE TABLE jobs (
    id          serial              PRIMARY KEY,
    job_type    job_type_enum       NOT NULL,
    status      job_status_enum     NOT NULL,
    payload     JSONB               NOT NULL,
    errors      VARCHAR
);