const express = require("express");
const config = require("./config");
const VkService = require("./service");

const app = express();
const vkService = new VkService(config.accessToken);

app.get('/', async function (req, res) {
    const response = await vkService.newsFeedSearch();
    res.send(response);
});

app.listen(config.port, function () {
    console.log(`Example app listening on port ${config.port}!`);
});

//https://oauth.vk.com/authorize?client_id=5490057&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=friends&response_type=token&v=5.52