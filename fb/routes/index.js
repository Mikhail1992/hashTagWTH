const express = require('express');
const router = express.Router();
const Locations = require('../collections');

router.get('/', function(req, res, next) {

  const order = req.query.order || 'asc';
  const field = req.query.field || 'name';

  const filters = [
    {
      name: 'Name',
      filter: `?field=name&order=${order}`,
    },
    {
      name: 'Checkins',
      filter: `?field=checkins&order=${order}`,
    },
    {
      name: 'Star rating',
      filter: `?field=overall_star_rating&order=${order}`,
    },
    {
      name: 'Rating Count',
      filter: `?field=rating_count&order=${order}`,
    },
    {
      name: 'ASC',
      filter: `?field=${field}&order=asc`,
    },
    {
      name: 'DESC',
      filter: `?field=${field}&order=desc`,
    }
  ];


  Locations.find().then((data) => {
    data.sort((a, b) => {
      if (order === 'desc') {
        return a[field] - b[field];
      } else if (order === 'asc') {
        return b[field] - a[field];
      }
      return 'asc';
    })
    res.render('index', { data, filters });
  });
});

module.exports = router;
