# Job Queue
Job Queue to run API fetching jobs without ever running into rate limit errors.

### Queues
* Twitch Api Queue
* Lol API Queue
* Non API Queue

#### LoL API Queue
Rate Limit - 100 requests every 2 minutes - 900ms rounding up.
Using a single queue for all regions.

### Jobs 
* FETCH_LOL_SUMMONER_ID - Get summoner ID information by name
* FETCH_LOL_MATCHES_DURING_VOD - Get list of matches during a vod
* FETCH_LOL_MATCH_INFO - Get details about Lol Match & Participants
* DETERMINE_LOL_MATCH_ROLES - Use roleML to determine roles for participants 

#### Twitch API Queue
Rate limit - 30 requests per minute - 2000ms.

### Jobs 
* FETCH_TWITCH_CHANNEL_ID - Fetch channel ID information by name
* FETCH_NEW_TWITCH_VODS - Fetch new twitch vods for a channel
* CHECK_VOD_EXISTENCE - Check that a vod still exists

#### No API Queue
Rate limit - No real rate limit - 100ms.

### Jobs 
* ASSOCIATE_LOL_MATCH_TO_TWITCH_VOD - Create joins between a match, and all vods it was played on

