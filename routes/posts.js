const express = require('express');
const router = express.Router();

router.get('/post/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const post = res.locals.posts.find(p => p.id === postId);
    if (post) {
        res.render('pages/post', { post });
    } else {
        res.status(404).send('Post not found');
    }
});

router.post('/create', (req, res) => {
    const newPost = {
        id: res.locals.posts.length ? res.locals.posts[res.locals.posts.length - 1].id + 1 : 1,
        title: req.body.title,
        content: req.body.content
    };
    res.locals.posts.push(newPost);
    res.redirect('/');
});

router.post('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const post = res.locals.posts.find(p => p.id === postId);
    if (post) {
        post.title = req.body.title;
        post.content = req.body.content;
        res.redirect(`/post/${postId}`);
    } else {
        res.status(404).send('Post not found');
    }
});

router.post('/delete/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const postIndex = res.locals.posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        res.locals.posts.splice(postIndex, 1);
    }
    res.redirect('/');
});

router.get('/create', (req, res) => {
    res.render('pages/create');
});

router.get('/about', (req, res) => {
    res.render('pages/about');
});

router.get('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const post = res.locals.posts.find(p => p.id === postId);
    if (post) {
        res.render('pages/edit', { post });
    } else {
        res.status(404).send('Post not found');
    }
});

module.exports = router;
