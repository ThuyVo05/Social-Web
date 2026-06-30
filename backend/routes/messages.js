const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

//GET/api/messages
router.get('/', auth, async (req, res) => {
    const [rows] = await db.query('SELECT * FROM messages ORDER BY createdAt ASC');
    res.json(rows);
});

//POST/api/messages
router.post('/', auth, upload, async (req, res) => {
    const user_id = req.user.id;
    const author = req.user.username;
    const content = req.body?.content?.trim() || '';
    const hasImage = !!req.file;

    if (!content && !hasImage) {
        return res.status(400).json({ error: 'Cần có nội dung hoặc hình ảnh' });
    }

    const image_url = req.file ? '/uploads/' + req.file.filename : null;

    const [result] = await db.query(
        'INSERT INTO messages (user_id, author, content, image_url) VALUES (?, ?, ?, ?)',
        [user_id, author, content, image_url]
    );
    res.status(201).json({
        id: result.insertId,
        user_id,
        author,
        content,
        image_url,
    });
});

module.exports = router;
