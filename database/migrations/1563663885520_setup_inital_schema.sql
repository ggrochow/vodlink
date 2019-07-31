CREATE TABLE twitch_channels (
    id                  serial      PRIMARY KEY,
    native_channel_id   BIGINT      UNIQUE NOT NULL,
    channel_name        VARCHAR     UNIQUE NOT NULL
);

CREATE TABLE lol_summoners (
    id                  serial      PRIMARY KEY,
    native_summoner_id  VARCHAR     UNIQUE NOT NULL,
    summoner_name       VARCHAR     UNIQUE NOT NULL,
    region              VARCHAR     NOT NULL,
    twitch_channel_id   INTEGER     NOT NULL
);

CREATE TABLE twitch_vods (
    id                  serial      PRIMARY KEY,
    started_at          TIMESTAMP   NOT NULL,
    ended_at            TIMESTAMP   NOT NULL,
    twitch_channel_id   INTEGER     NOT NULL,
    native_vod_id       BIGINT      UNIQUE NOT NULL
);

CREATE TABLE lol_matches (
    id                  serial      PRIMARY KEY,
    native_match_id     BIGINT      UNIQUE NOT NULL,
    winning_team        SMALLINT    NOT NULL,
    started_at          TIMESTAMP   NOT NULL,
    ended_at            TIMESTAMP   NOT NULL
);

CREATE TABLE lol_match_participants (
    id                  serial      PRIMARY KEY,
    lol_match_id        INTEGER     NOT NULL,
    team_id             SMALLINT    NOT NULL,
    champion_id         INTEGER     NOT NULL,
    lane                VARCHAR     NOT NULL,
    role                VARCHAR     NOT NULL,
    summoner_name       VARCHAR     NOT NULL,
    native_summoner_id  VARCHAR     NOT NULL
);

CREATE TABLE lol_match_twitch_vods (
    id                  serial      PRIMARY KEY,
    lol_match_id        INTEGER     NOT NULL,
    twitch_vod_id       INTEGER     UNIQUE NOT NULL,
    vod_timestamp       TIMESTAMP   NOT NULL
);
