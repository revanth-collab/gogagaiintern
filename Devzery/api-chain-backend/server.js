const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/users', async (req, res) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

app.post('/api/posts', async (req, res) => {
    try {
        const response = await axios.post('https://jsonplaceholder.typicode.com/posts', req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error creating post' });
    }
});

app.get('/api/comments', async (req, res) => {
    const { postId } = req.query;
    try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching comments' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
