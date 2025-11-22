const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const https = require('https'); // Native HTTPS module
const { URLSearchParams } = require('url');

const app = express();
// CHANGED: Use Port 5000 instead of 8080 to avoid browser HSTS (HTTPS forcing) issues
const PORT = process.env.PORT || 5000; 
const DB_FILE = path.join(__dirname, 'database.json');

// ==================================================================
// ⚙️ CONFIGURATION SETTINGS
// ==================================================================

// 👇 MODE 1: LOCAL DEVELOPMENT
// Important: Keep 'http' for localhost. Browsers block self-signed SSL often.
const PROTOCOL = 'http'; 
const API_HOST = `localhost:${PORT}`;
const FRONTEND_HOST = 'localhost:3000';

// 👇 MODE 2: PRODUCTION / HOSTINGER (Uncomment this when deploying)
// const PROTOCOL = 'https';
// const API_HOST = 'mindsharenexus.com'; 
// const FRONTEND_HOST = 'mindsharenexus.com'; 

// ------------------------------------------------------------------

const API_BASE_URL = `${PROTOCOL}://${API_HOST}`;
const FRONTEND_URL = `${PROTOCOL}://${FRONTEND_HOST}`;

// TWITTER API CREDENTIALS
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID || 'TldnUmJmbG9sOFFzc1RzREQ5dko6MTpjaQ'; 
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET || 'WG30JpRWBhkvacleFhwtOwIPu8XUbKBgN0UJ4Ag9ylNgiqBrFO';

// IMPORTANT: Update this in Twitter Developer Portal to match PORT 5000
const REDIRECT_URI = `${API_BASE_URL}/api/auth/twitter/callback`;

// ==================================================================
// 🌍 REGION RULES (Server-Side Validation)
// ==================================================================
const GLOBAL_MENTIONS = ['@base', '@carv_official'];

const REGION_RULES = {
  'Turkey': {
    hashtags: ['#CarvMindshare', '#CarvTurkey', '#NexusTR'],
    mentions: [...GLOBAL_MENTIONS, '@Carv_TR']
  },
  'Ukraine': {
    hashtags: ['#CarvMindshare', '#CarvUA', '#NexusUkraine'],
    mentions: [...GLOBAL_MENTIONS]
  },
  'Russia': {
    hashtags: ['#CarvMindshare', '#CarvRU', '#NexusRussia'],
    mentions: [...GLOBAL_MENTIONS, '@Carv_RU']
  },
  'Japan': {
    hashtags: ['#CarvMindshare', '#CarvJP', '#NexusJapan'],
    mentions: [...GLOBAL_MENTIONS]
  },
  'Korea': {
    hashtags: ['#CarvMindshare', '#CarvKR', '#NexusKorea'],
    mentions: [...GLOBAL_MENTIONS, '@CARV_KR']
  },
  'Indonesia': {
    hashtags: ['#CarvMindshare', '#CarvID', '#NexusIndo'],
    mentions: [...GLOBAL_MENTIONS, '@CARV_IDN']
  },
  'Philippines': {
    hashtags: ['#CarvMindshare', '#CarvPH', '#NexusPH'],
    mentions: [...GLOBAL_MENTIONS]
  },
  'Persia': {
    hashtags: ['#CarvMindshare', '#CarvIR', '#NexusPersia'],
    mentions: [...GLOBAL_MENTIONS, '@CarvPersian']
  },
  'Africa': {
    hashtags: ['#CarvMindshare', '#CarvAfrica', '#NexusAfrica'],
    mentions: [...GLOBAL_MENTIONS]
  }
};

// ==================================================================

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- HEALTH CHECK ROUTE ---
app.get('/', (req, res) => {
    res.send(`
        <h1>Mindshare Nexus Backend Online</h1>
        <p>Status: <span style="color:green">RUNNING</span></p>
        <p>Port: ${PORT}</p>
        <p>Callback URI: <code>${REDIRECT_URI}</code></p>
        <hr>
        <p>Make sure your Twitter Developer Portal Callback URL matches exactly.</p>
    `);
});

// --- DATABASE HANDLERS ---

if (!fs.existsSync(DB_FILE)) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify([]));
    } catch (e) {
        console.error("Error creating database file:", e);
    }
}

function loadUsers() {
    try {
        if (!fs.existsSync(DB_FILE)) return [];
        const data = fs.readFileSync(DB_FILE, 'utf8');
        if (!data) return [];
        return JSON.parse(data);
    } catch (err) {
        console.error("Database read error:", err);
        return [];
    }
}

function saveUsers(users) {
    try {
        const tempFile = `${DB_FILE}.tmp`;
        fs.writeFileSync(tempFile, JSON.stringify(users, null, 2));
        fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
        console.error("Database write error:", err);
    }
}

// --- HELPER: HTTPS REQUEST ---
function makeRequest(url, options = {}, body = null) {
    return new Promise((resolve, reject) => {
        console.log(`[API OUT] ${options.method || 'GET'} ${url}`);
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(json);
                    } else {
                        console.error('API Error Response:', data);
                        reject(new Error(json.error_description || json.detail || JSON.stringify(json)));
                    }
                } catch (e) {
                    if (res.statusCode >= 200 && res.statusCode < 300) resolve(data);
                    else reject(new Error(res.statusMessage || 'Request failed'));
                }
            });
        });

        req.on('error', (e) => {
            console.error("[API OUT ERROR]", e.message);
            reject(e);
        });
        if (body) req.write(body);
        req.end();
    });
}

// --- TWITTER API LOGIC ---

function getTwitterAuthUrl(state) {
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: TWITTER_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: 'tweet.read users.read offline.access',
        state: state,
        code_challenge: 'challenge', 
        code_challenge_method: 'plain'
    });
    return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
}

async function exchangeCodeForToken(code) {
    const basicAuth = Buffer.from(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`).toString('base64');
    const params = new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: TWITTER_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        code_verifier: 'challenge'
    }).toString();

    return await makeRequest('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${basicAuth}`,
            'Content-Length': Buffer.byteLength(params)
        }
    }, params);
}

async function getTwitterUser(accessToken) {
    return await makeRequest('https://api.twitter.com/2/users/me?user.fields=profile_image_url,public_metrics', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
}

async function getUserTweets(userId, accessToken) {
    const url = `https://api.twitter.com/2/users/${userId}/tweets?max_results=50&exclude=retweets,replies&tweet.fields=public_metrics,created_at`;
    try {
        return await makeRequest(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
    } catch (e) {
        console.log("Tweet fetch error (user might have no tweets):", e.message);
        return { data: [] };
    }
}

// --- ROUTES ---

// 1. Start OAuth
app.get('/api/auth/twitter', (req, res) => {
    const { discordId, region } = req.query;
    const stateObj = JSON.stringify({ discordId, region });
    const state = Buffer.from(stateObj).toString('base64');
    
    console.log(`\n--- NEW LOGIN ATTEMPT ---`);
    console.log(`User: ${discordId}, Region: ${region}`);
    
    // Redirect user to Twitter
    res.redirect(getTwitterAuthUrl(state));
});

// 2. OAuth Callback
app.get('/api/auth/twitter/callback', async (req, res) => {
    const { code, state, error } = req.query;
    
    if (error) {
        console.error("Twitter returned error:", error);
        return res.redirect(`${FRONTEND_URL}/?status=error&message=${encodeURIComponent(error)}`);
    }

    try {
        if (!code) throw new Error("No code returned from Twitter");

        // Decode State
        let metadata = {};
        try {
             metadata = JSON.parse(Buffer.from(state, 'base64').toString());
        } catch (e) {
            console.error("State parsing failed");
        }
        const userRegion = metadata.region || 'Turkey';
        const regionRules = REGION_RULES[userRegion] || { hashtags: [], mentions: [] };

        console.log(`Processing callback for ${metadata.discordId || 'Unknown'} (${userRegion})`);

        // Exchange Code for Token
        const tokenData = await exchangeCodeForToken(code);
        const accessToken = tokenData.access_token;

        // Get User Data
        const userResponse = await getTwitterUser(accessToken);
        const userData = userResponse.data;
        console.log(`Identified Twitter User: @${userData.username}`);

        // Calculate Score
        const tweetsResponse = await getUserTweets(userData.id, accessToken);
        const tweets = tweetsResponse.data || [];
        
        let totalImpressions = 0;
        
        tweets.forEach(tweet => {
             const text = tweet.text.toLowerCase();
             const hasHashtag = regionRules.hashtags.some(tag => text.includes(tag.toLowerCase().replace('#', '')));
             const hasMention = regionRules.mentions.some(mention => text.includes(mention.toLowerCase().replace('@', '')));

             if (hasHashtag || hasMention) {
                 const imps = tweet.public_metrics?.impression_count || 0;
                 totalImpressions += imps;
             }
        });

        console.log(`Total Valid Impressions: ${totalImpressions}`);

        const redirectParams = new URLSearchParams({
            status: 'success',
            discordId: metadata.discordId || '',
            region: userRegion,
            twitterHandle: `@${userData.username}`,
            twitterId: userData.id,
            avatarUrl: userData.profile_image_url || '',
            followers: userData.public_metrics?.followers_count || 0,
            score: totalImpressions.toString()
        });

        res.redirect(`${FRONTEND_URL}/?${redirectParams.toString()}`);

    } catch (err) {
        console.error("OAuth Logic Error:", err.message);
        res.redirect(`${FRONTEND_URL}/?status=error&message=${encodeURIComponent(err.message)}`);
    }
});

// 3. User Routes
app.get('/api/users', (req, res) => {
    console.log('GET /api/users');
    res.json(loadUsers());
});

app.get('/api/users/check/:discordId', (req, res) => {
    const users = loadUsers();
    const exists = users.some(u => u.discordUsername.toLowerCase() === req.params.discordId.toLowerCase());
    res.json({ exists });
});

app.post('/api/users', (req, res) => {
    const users = loadUsers();
    const newUser = req.body;

    if (!newUser.discordUsername) {
        return res.status(400).json({ error: 'Missing username' });
    }

    const existingIndex = users.findIndex(u => u.discordUsername === newUser.discordUsername);
    if (existingIndex >= 0) {
        const id = users[existingIndex].id;
        users[existingIndex] = { ...newUser, id: id };
    } else {
        users.push(newUser);
    }

    saveUsers(users);
    console.log(`User saved: ${newUser.discordUsername}`);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`
    ==================================================
    🚀 MINDSHARE NEXUS BACKEND ONLINE
    ==================================================
    📡 Port: ${PORT} (Changed from 8080)
    🔗 Local: ${API_BASE_URL}
    
    ⚠️ ACTION REQUIRED:
    Go to Twitter Developer Portal > User Authentication Settings
    Update Callback URI to: ${REDIRECT_URI}
    ==================================================
    `);
});