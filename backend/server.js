const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const postsRouter = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//API
app.use('/api/posts', postsRouter);

//Phục vụ frontend tĩnh
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});