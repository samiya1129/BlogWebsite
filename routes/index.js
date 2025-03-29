const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/home', { posts: res.locals.posts });
});

module.exports = router;
