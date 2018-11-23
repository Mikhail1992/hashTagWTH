import tweepy
import json
import os
from dotenv import load_dotenv
load_dotenv()

auth = tweepy.OAuthHandler(os.getenv('TWITTER_CONSUMER_API_KEY'), os.getenv('TWITTER_CONSUMER_API_SECRET'))
auth.set_access_token(os.getenv('TWITTER_ACCESS_TOKEN'), os.getenv('TWITTER_ACCESS_TOKEN_SECRET'))

api = tweepy.API(auth)

ID_LIST = []

max_id = 1

with open('tweets.txt', 'w') as file:
    while True:
        tweets = api.search(q='', geocode='53.9,27.5667,20km', count=100, max_id=max_id)
        if tweets.max_id == max_id:
            break
        max_id = tweets.max_id
        for tweet_str in map(lambda t: json.dumps(t._json), filter(lambda t: t.id not in ID_LIST, tweets)):
            file.write(tweet_str + '\n')
        ID_LIST += list(map(lambda tweet: tweet.id, tweets))
