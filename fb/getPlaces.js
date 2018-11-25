const Locations = require('./collections');
const request = require('request');

const requestData = (url) => {
  request(url, function (error, response, body) {
    if (error) {
      console.log(error);
    }
    const data = JSON.parse(response.body);

    const dataList = data.data;
    if (dataList) {
      dataList.forEach((item, index) => {
        Locations.findOne({ id: item.id }).then(oldPlace => {
          if (!oldPlace) {
            const locations = new Locations({ ...item });
            locations.save();
          }
        });
      });
    }

    if (data.paging && data.paging.next) {
      requestData(data.paging.next);
    }
  });
}

const getPlaces = () => {
  const places = ['bar', 'club', 'cafe', 'restaurant'];
  places.forEach(place => {
    const url = `https://graph.facebook.com/search?type=place&fields=name,checkins,picture,location,about,app_links,context,description,engagement,fan_count,is_always_open,is_permanently_closed,overall_star_rating,photos,rating_count,website,restaurant_specialties&q=${place}&center=53.904146,27.554560&distance=20000&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`;

    requestData(url);
  });
}

module.exports = getPlaces;
