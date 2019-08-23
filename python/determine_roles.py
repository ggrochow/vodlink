from roleml import roleml
import requests
import time
import sys
import json

region = sys.argv[1]
match_id = sys.argv[2]
api_key = sys.argv[3]

headers = {
    'X-Riot-Token': api_key
}

match_url = 'https://{0}.api.riotgames.com/lol/match/v4/matches/{1}'.format(region, match_id)
match_res = requests.get(match_url, headers=headers)
match_json = match_res.json()

if match_res.status_code != 200:
    raise Exception('match_res status_code = {} expected 200'.format(match_res.status_code))

# Our method of avoiding rate limits assumes that each job only makes one req,
# since this requires a 2nd, we put a small sleep to avoid rate limits. 
time.sleep(0.9) 

timeline_url = 'https://{0}.api.riotgames.com/lol/match/v4/timelines/by-match/{1}'.format(region, match_id)
timeline_res = requests.get(timeline_url, headers=headers)
timeline_json = timeline_res.json()

if timeline_res.status_code != 200:
    raise Exception('timeline_res status_code = {} expected 200'.format(timeline_res.status_code))

roles = roleml.predict(match_json, timeline_json)

# Since we've made a 2nd request, and our job timer begins on job start we need to sleep again
# Might be overkill, but im trying to avoid ever hitting rate limits.
time.sleep(0.9)

# print to send data back through our PythonShell js lib
print(json.dumps(roles))