#!/usr/bin/env python3
import pymongo
from subprocess import call


client = pymongo.MongoClient("mongodb://localhost:27017/wth")


def main():
    for place in client.wth.unique_places.find():
        from subprocess import call

        result = call(["./run.sh", place['id']])


if __name__ == '__main__':
    main()
