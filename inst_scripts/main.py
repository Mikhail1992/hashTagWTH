#!/usr/bin/env python
import requests
import pprint
import pymongo
import json
import os.env
from pymongo import MongoClient

remote_mongo = MongoClient(os.env.get("MONGO_URI"))
local_mongo = MongoClient("mongodb://localhost:27017/wth")

# ACCESS_TOKEN = "3968461158.f9cb086.a71887336ad54cf18f582ad3ccc673f6"
ACCESS_TOKEN = "3123925475.f9cb086.fd2871d2d1714974bfad8d3fd594c081"


def save_as_json(filename, data):
    with open(filename, 'w') as f:
        f.write(json.dumps(data))


def places_parser():
    locs = local_mongo.wth.locations
    places = local_mongo.wth.places

    for loc in locs.find():
        lat, lng = loc['location']['latitude'], loc['location']['longitude']

        url = ("https://api.instagram.com/v1/locations/search?"
               "lat={lat}&lng={lng}&access_token={tkn}").format(tkn=ACCESS_TOKEN,
                                                                lat=lat,
                                                                lng=lng)
        data = requests.get(url).json()
        places.insert_many(data['data'])


def main():
    pass


if __name__ == '__main__':
    main()

