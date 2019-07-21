# DB Schema 

Consider adding constraints on foreign keys.

* twitch_channel
    * id
    * native_channel_id
    * channel_name

* lol_summoner
    * id
    * native_summoner_id
    * summoner_name
    * twitch_channel_id

* twitch_vod
    * id
    * started_at
    * ended_at
    * twitch_channel_id
    * native_vod_id

* lol_match
    * id
    * native_match_id 
    * winning_team
    * started_at
    * ended_at

* lol_match_participant
    * id
    * lol_match_id
    * team_id
    * champion
    * lane/role
    * summoner_name
    * native_summoner_id

* lol_match_twitch_vod
    * id
    * lol_match_id
    * twitch_vod_id
    * timestamp
