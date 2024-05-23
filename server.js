const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const path = require('path');

const app = express();

const clientId = '11a73fdbec8b4e8e837eae1be557ec6e'; // Your Spotify client ID
const clientSecret = '8a49af646d2346e68287e2c9345c15a5'; // Your Spotify client secret
const redirectUri = 'https://site-engracado-beta.vercel.app/callback'; // Update with your Vercel deployment URL

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/callback', async (req, res) => {
    const code = req.query.code || null;

    if (!code) {
        res.send('Authorization failed.');
        return;
    }

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token, refresh_token } = response.data;

        res.redirect(`/game.html?access_token=${access_token}`);

        // Store tokens or handle them as needed
        res.send(`Access Token: ${access_token}<br>Refresh Token: ${refresh_token}`);
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).send('Error retrieving access token.');
        }
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
