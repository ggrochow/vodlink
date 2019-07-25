# Jobs

## Find Channel ID by name
Also include LoL account names for followup job.
Query Twitch API for channel info given a name
New Twitch IDs found would create a find LoL account ID by name jobs for each associated LoL account

##### enum type
FETCH_TWITCH_CHANNEL_ID

##### started by
Adding new channels to system
DB seeding / signups

##### startup needs
* twitch_channel.channel_name
* lol_summoner.summoner_name ( for each summoner being added )

##### API needs
1 request to twitch


## Find LoL Account ID by name
Query LoL api for summoner info by name
Save native id to create DB entry
After a successful entry, ensure that the related channel starts a 'find new twitch vods' job

##### enum type
FETCH_LOL_SUMMONER_ID

##### started by
find channel ID by name
Adding additional summoner accounts to associate with twitch accounts.

##### startup needs
* twitch_channel.id
* lol_summoner.summoner_name


## Find new Twitch VoDs for channel
Query Twitch API for all VODs we don't know about.
Check native vod IDs against the list of all 'archive' type videos in a users list.
Any new Ids will start a vod fetch job.


##### enum type
FETCH_NEW_TWITCH_VODS

##### started by
daily cron task? 
unsure

##### startup needs
* twitch_channel.id
    
##### APIs used
1+ request to Twitch ( might have pagination )


## Fetch VOD info from twitch
Query Twitch API for information on a single VOD.
If the vod doesnt contain LoL ignore it.
Save VOD info into database.
Start a find matches played job for each LoL account associated to the channel.

##### enum type
FETCH_TWITCH_VOD_INFO

##### started by
Fetch new twitch vods job

##### startup needs
* twitch_vod.native_vod_id
* twitch_channel.id 

##### APIs used
1 request to twitch 


## Find Matches played during VOD
Query LoL API for list of games played during the VOD
For each game played during, start a fetch match info job

##### enum type
FETCH_LOL_MATCHES_DURING_VOD

##### started by
Fetch VOD info job

##### startup needs
* twitch_vod.id
* lol_summoner.id

##### APIs used
1+ request to LoL ( might have pagination )


## Fetch Match info
If this match is in our DB already skip directly to associate step
Query LoL API for a information on a single LoL Game
Parse info on players / team / etc
Start Match -> Vod association job 

##### enum type
FETCH_LOL_MATCH_INFO

##### started by
Find matches played during vod job

##### startup needs
* lol_match.native_match_id

##### APIs used
1 request to LoL


## Associate VOD to Match
Attempt to link this to all possible VoDs that would include this game.
Check all players native_summoner_ids against our lol_summoner table. 
Check any found if they have VoDs during, if so, link this match to them.

##### enum type
ASSOCIATE_LOL_MATCH_TO_TWITCH_VOD

##### started by
fetch match info job

##### startup needs
* lol_match.id

##### APIs used
none


## Remove Stale VODs & Vod -> LoL Game relations
Check Vods that are over 14 days old. (or w/e twitch default limit is)
delete twitch_vod and any associated lol_match_vod_id records.
check associated match for any remaining lol_match_twitch_vod's and delete all match info if none remain.

##### enum type
CLEANUP_EXPIRED_TWITCH_VODS

##### started by
cron ? 
unsure

##### startup needs
* none

##### APIs used 
none
