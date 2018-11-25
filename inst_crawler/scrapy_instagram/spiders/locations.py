# -*- coding: utf-8 -*-
import json
import time
from datetime import datetime, timedelta

import scrapy
from pymongo import MongoClient
from scrapy_instagram.items import Post

client = MongoClient("mongodb://localhost:27017/wth")


class InstagramSpider(scrapy.Spider):
    name = "locations"

    custom_settings = {
        'FEED_URI': './scraped/%(name)s/%(loc_id)s/%(date)s',
    }

    def __init__(self, collection_name, loc_id='214179276'):
        super().__init__()
        self.loc_id = loc_id
        self.start_urls = ["https://www.instagram.com/explore/locations/{loc_id}/?__a=1".format(loc_id=self.loc_id)]
        self.date = time.strftime("%d-%m-%Y_%H")

        self.db = client.wth
        self.posts_collection = self.db[collection_name]
        self.pages_limit = 10
        self.pages_parsed = 0

        place = self.db.unique_places.find_one({"id": loc_id})

        self.loc_lat = 0
        self.loc_lon = 0
        self.place_name = ''
        self.date_limit = timedelta(days=1)

        if place:
            self.loc_lat = place['latitude']
            self.loc_lon = place['longitude']
            self.place_name = place['name']

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        return cls(crawler.settings.get('POSTS_COLLECTION'), *args, **kwargs)

    def check_already_scraped(self, shortcode):
        result = self.posts_collection.find_one({'shortcode': shortcode})

        return result

    def parse(self, response):
        return self.parse_location(response)

    def parse_location(self, response):
        graphql = json.loads(response.text)

        media = graphql['graphql']['location']['edge_location_to_media']

        has_next = media['page_info']['has_next_page']
        edges = media['edges']

        for edge in edges:
            shortcode, timestamp = edge['node']['shortcode'], edge['node']['taken_at_timestamp']

            taken_at = datetime.fromtimestamp(timestamp)
            threshold_date = datetime.now() - self.date_limit

            if taken_at < threshold_date:
                has_next = False
                break

            if self.check_already_scraped(shortcode):
                continue

            yield scrapy.Request("https://www.instagram.com/p/{shortcode}/?__a=1".format(shortcode=shortcode),
                                 callback=self.parse_post)

        if has_next:
            self.pages_parsed += 1

            if self.pages_parsed == self.pages_limit:
                return

            end_cursor = graphql['graphql']['location']['edge_location_to_media']['page_info']['end_cursor']
            yield scrapy.Request("https://www.instagram.com/explore/locations/{loc_id}/?__a=1&max_id={max_id}".format(
                loc_id=self.loc_id, max_id=end_cursor
            ))

    def parse_post(self, response):
        graphql = json.loads(response.text)
        media = graphql['graphql']['shortcode_media']
        yield self.make_post(media)

    def make_post(self, media):
        caption = ''
        if len(media['edge_media_to_caption']['edges']):
            caption = media['edge_media_to_caption']['edges'][0]['node']['text']
        date = datetime.fromtimestamp(media['taken_at_timestamp']).isoformat() + 'Z'
        return Post(id=media['id'],
                    shortcode=media['shortcode'],
                    text=caption,
                    date=date,
                    resource='instagram',
                    lat=self.loc_lat,
                    lon=self.loc_lon,
                    placeName=self.place_name,
                    url=media['display_url'],
                    author=media['owner']['username'])
