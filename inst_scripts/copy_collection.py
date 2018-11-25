#!/usr/bin/env python3
import os
from pymongo import MongoClient

remote_mongo = MongoClient(os.environ.get("MONGO_URI"))
local_mongo = MongoClient("mongodb://localhost:27017/wth")

def main():
    for doc in local_mongo.wth.post2.find():
        res = remote_mongo.hashtagwth.instPosts.insert_one(doc)
        print(res.inserted_id)

if __name__ == '__main__':
    main()

