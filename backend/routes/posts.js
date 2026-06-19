const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

//GET/api/posts
router.get('/', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM posts ORDER BY createdAt DESC');
    res.json(rows);
});

//POST/api/posts
router.post('/', auth, upload, async (req, res) => {
    const author = req.user.username;
    const content = req.body.content?.trim() || '';
    const hasImage = !!req.file;

    if (!content && !hasImage) {
        return res.status(400).json({error: 'Cần có nội dung hoặc hình ảnh'});
    }

    const image_url = req.file ? '/uploads/' + req.file.filename : null;

    const [result] = await db.query(
        'INSERT INTO posts (author, content, image_url) VALUES (?, ?, ?)', 
        [author, content, image_url]
    );

    res.status(201).json({
        id: result.insertId, 
        author, 
        content, 
        image_url,
    });
});

//DELETE/api/posts/:id
router.delete('/:id', auth, async (req, res) => {
    await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.json({message: 'Post is deleted completely!'});
});

module.exports = router;