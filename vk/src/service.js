const request = require('request');
const config = require('./config');
const { MINSK_LATITUDE, MINSK_LONGITUDE, VK_VERSION } = require('./common');

const NEWS_FEED_SEARCH = 'https://api.vk.com/method/newsfeed.search';

class VkService {
    get(url, q) {
        return new Promise((resolve, reject) => {
            console.log(config.accessToken);
            const params = {
                url,
                qs: {
                    q,
                    ...this.getDefaultParams()
                }
            };

            request.get(params, function (error, response, body) {
                if (error) {
                    console.log('error:', error);
                    return reject(error)
                }
                console.log('statusCode:', response && response.statusCode);
                console.log('body:', body);
                resolve(body);
            });
        });
    }

    newsFeedSearch(query) {
        return this.get(NEWS_FEED_SEARCH, "dance");
    }

    getDefaultParams() {
        return {
            user_id: config.userId,
            v: VK_VERSION,
            access_token: config.accessToken,
            longitude: MINSK_LONGITUDE,
            latitude: MINSK_LATITUDE
        }
    }
}

module.exports = VkService;