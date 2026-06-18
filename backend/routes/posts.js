const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

//GET/api/posts
router.get('/', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM posts ORDER BY createdAt DESC');
    res.json(rows);
});

//POST/api/posts
router.post('/', auth, async (req, res) => {
    const author = req.user.username;
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({error: 'Content is required'});
    }
    const [result] = await db.query('INSERT INTO posts (author, content) VALUES (?, ?)', [author, content]);
    res.status(201).json({id: result.insertId, author, content});
});

//DELETE/api/posts/:id
router.delete('/:id', auth, async (req, res) => {
    await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.json({message: 'Post is deleted completely!'});
});

module.exports = router;