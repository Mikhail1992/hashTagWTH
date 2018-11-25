import pymongo


class MongoPipeline:
    def __init__(self, collection_name):
        self.mongo_uri = "mongodb://localhost:27017/wth"
        self.mongo_db = "wth"
        self.collection_name = collection_name

    @classmethod
    def from_crawler(cls, crawler):
        settings = crawler.settings
        return cls(settings.get('POSTS_COLLECTION'))

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]

    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        self.db[self.collection_name].insert_one(dict(item))
        return item
