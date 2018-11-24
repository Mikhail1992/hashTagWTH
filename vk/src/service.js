const request = require('request');
const config = require('./config');
const findHashtags = require('find-hashtags');

const NEWS_FEED_SEARCH = 'https://api.vk.com/method/newsfeed.search';

class VkService {
    get(url, q, startFrom) {
        return new Promise((resolve, reject) => {
            const qs = this.getDefaultParams();

            if (q) {
                qs.q = q;
            }

            if (startFrom) {
                qs.start_from = startFrom;
            }

            request.get({ url, qs }, function (error, response, body) {
                if (error) {
                    console.log('error:', error);
                    return reject(error)
                }
                console.log('statusCode:', response && response.statusCode);
                resolve(JSON.parse(body));
            });
        });
    }

    async newsFeedSearch(callback) {
        for (const tag of config.vkHashtags) {
            console.log(`tag - ${tag}`);
            let data = await this.get(NEWS_FEED_SEARCH, tag);
            console.log(`total count - ${data.response.total_count}`);

            while (true) {
                console.log(`next from - ${data.response.next_from}`);
                const parsedData = this.parseNewsFeed(data.response);
                if (!parsedData.length) {
                    break;
                }

                callback(parsedData);

                const nextFrom = data.response.next_from;
                if (!nextFrom) {
                    break;
                }
                data = await this.get(NEWS_FEED_SEARCH, tag, nextFrom);
            }
        }
    }

    parseNewsFeed(response) {
        const results = [];
        for (const item of response.items) {

            const news = {
                id: item.id,
                text: item.text,
                date: this.getDate(item),
                resource: "vk",
                photo: this.getPhoto(item),
                url: item.post_source.url,
                author: this.getAuthor(item.owner_id, response.profiles, response.groups),
                hashtags: findHashtags(item.text)
            };

            if (item.geo) {
                const [ lat, lon ] = item.geo.coordinates.split(" ");
                news.lat = lat;
                news.lon = lon;
                news.placeName = item.geo.place.title;
            }

            results.push(news);
        }
        console.log(results.length);
        return results;
    }

    getPhoto(item) {
        if (!item.attachments) {
            return;
        }

        const attachment = item.attachments.find(c => c.type === "photo");
        if (attachment) {
            return attachment.photo_1280 && attachment.photo_807
        }
    }

    getDate(item) {
        return new Date(item.date * 1000).toISOString()
    }

    getAuthor(item, profiles, groups) {
        if (item.owner_id > 0) {
            const profile = profiles.find(p => p.id = item.owner_id);
            return `${profile.first_name} ${profile.last_name}`
        } else {
            const group = groups.find(g => g.id === Math.abs(g.id));
            if (group) {
                return group.name;
            }
        }
    }

    getDefaultParams() {
        return {
            user_id: config.userId,
            v: config.vk_version,
            access_token: config.accessToken,
            longitude: config.minsk_longitude,
            latitude: config.minsk_latitude,
            extended: 1,
            fields: "first_name,last_name",
            count: config.vk_max_count,
            start_time: 1543017600
        }
    }
}

module.exports = VkService;