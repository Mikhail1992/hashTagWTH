# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

from scrapy.item import Item, Field


class Post(Item):
    # define the fields for your item here like:
    id = Field()
    shortcode = Field()
    text = Field()
    date = Field()
    resource = Field()
    lat = Field()
    lon = Field()
    placeName = Field()
    url = Field()
    author = Field()
