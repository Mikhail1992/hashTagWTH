const VkService = require("./service");
const config = require("./config");
const MongoClient = require('mongodb').MongoClient;

const vkService = new VkService(config.accessToken);

const job = async () => {
    MongoClient.connect(config.db.mongoUrl, function(err, client) {
        const db = client.db(config.db.name);
        vkService.newsFeedSearch((data) => {
            db.collection("vk").insertMany(data, {}, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        });
    });
};


job();