const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { URLSearchParams } = require('url');

const app = express();
const PORT = process.env.PORT || 5000; 
const DB_FILE = path.join(__dirname, 'database.json');

// Enable Trust Proxy
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// DEBUG LOGGER: Log every request to console
app.use((req, res, next) => {
    // Log API requests specifically
    if (req.path.startsWith('/api')) {
        console.log(`🔥 [API REQUEST] Method: ${req.method} | Path: ${req.path} | Query: ${JSON.stringify(req.query)}`);
    }
    next();
});

// TWITTER CREDENTIALS
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID || 'TldnUmJmbG9sOFFzc1RzREQ5dko6MTpjaQ'; 
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET || 'WG30JpRWBhkvacleFhwtOwIPu8XUbKBgN0UJ4Ag9ylNgiqBrFO';

// REGION DATA
const GLOBAL_MENTIONS = ['@base', '@carv_official'];
const REGION_RULES = {
  'Turkey': { hashtags: ['#CarvMindshare', '#CarvTurkey', '#NexusTR'], mentions: [...GLOBAL_MENTIONS, '@Carv_TR'] },
  'Ukraine': { hashtags: ['#CarvMindshare', '#CarvUA', '#NexusUkraine'], mentions: [...GLOBAL_MENTIONS] },
  'Russia': { hashtags: ['#CarvMindshare', '#CarvRU', '#NexusRussia'], mentions: [...GLOBAL_MENTIONS, '@Carv_RU'] },
  'Japan': { hashtags: ['#CarvMindshare', '#CarvJP', '#NexusJapan'], mentions: [...GLOBAL_MENTIONS] },
  'Korea': { hashtags: ['#CarvMindshare', '#CarvKR', '#NexusKorea'], mentions: [...GLOBAL_MENTIONS, '@CARV_KR'] },
  'Indonesia': { hashtags: ['#CarvMindshare', '#CarvID', '#NexusIndo'], mentions: [...GLOBAL_MENTIONS, '@CARV_IDN'] },
  'Philippines': { hashtags: ['#CarvMindshare', '#CarvPH', '#NexusPH'], mentions: [...GLOBAL_MENTIONS] },
  'Persia': { hashtags: ['#CarvMindshare', '#CarvIR', '#NexusPersia'], mentions: [...GLOBAL_MENTIONS, '@CarvPersian'] },
  'Africa': { hashtags: ['#CarvMindshare', '#CarvAfrica', '#NexusAfrica'], mentions: [...GLOBAL_MENTIONS] }
};

// --- HELPERS ---
function makeRequest(url, options = {}, body = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (res.statusCode >= 200 && res.statusCode < 300) resolve(json);
                    else reject(new Error(json.error_description || json.detail || JSON.stringify(json)));
                } catch (e) {
                    if (res.statusCode >= 200 && res.statusCode < 300) resolve(data);
                    else reject(new Error(res.statusMessage || 'Request failed'));
                }
            });
        });
        req.on('error', (e) => reject(e));
        if (body) req.write(body);
        req.end();
    });
}

function getBaseUrl(req) {
    const host = req.get('host');
    if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
        return `https://${host}`;
    }
    return `${req.protocol}://${host}`;
}

// --- DATABASE ---
if (!fs.existsSync(DB_FILE)) {
    try { fs.writeFileSync(DB_FILE, JSON.stringify([])); } catch (e) { console.error("DB Init Error:", e); }
}

function loadUsers() {
    try {
        if (!fs.existsSync(DB_FILE)) return [];
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (err) { return []; }
}

function saveUsers(users) {
    try {
        const tempFile = `${DB_FILE}.tmp`;
        fs.writeFileSync(tempFile, JSON.stringify(users, null, 2));
        fs.renameSync(tempFile, DB_FILE);
    } catch (err) { console.error("DB Write Error:", err); }
}

// ==================================================================
// 🚀 API ROUTES
// ==================================================================

// 1. Health & Ping
app.get('/api/ping', (req, res) => res.send('pong'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', port: PORT }));

// 2. OAuth Start Logic (Refactored to separate function)
const handleAuthStart = (req, res) => {
    try {
        const { discordId, region } = req.query;
        const baseUrl = getBaseUrl(req);
        
        // Remove trailing slash from baseUrl if present to prevent double slash
        const cleanBaseUrl = baseUrl.replace(/\/$/, '');
        const redirectUri = `${cleanBaseUrl}/api/auth/twitter/callback`;

        console.log(`▶ [Auth Start] User: ${discordId}, Region: ${region}`);
        console.log(`▶ [Auth Start] RedirectURI: ${redirectUri}`);

        const state = Buffer.from(JSON.stringify({ discordId, region, redirectUri })).toString('base64');
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: TWITTER_CLIENT_ID,
            redirect_uri: redirectUri,
            scope: 'tweet.read users.read offline.access',
            state: state,
            code_challenge: 'challenge',
            code_challenge_method: 'plain'
        });

        const finalUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
        console.log(`▶ [Auth Start] Redirecting to: ${finalUrl}`);
        res.redirect(finalUrl);
    } catch (error) {
        console.error("Auth Start Error:", error);
        res.status(500).send("Internal Server Error during Auth Start");
    }
};

// REGISTER BOTH ROUTES (With and Without Slash)
app.get('/api/auth/twitter', handleAuthStart);
app.get('/api/auth/twitter/', handleAuthStart);

// 3. OAuth Callback Logic
const handleAuthCallback = async (req, res) => {
    const { code, state, error } = req.query;
    const baseUrl = getBaseUrl(req);
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    
    // Determine frontend URL for redirecting back
    const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
    const frontendUrl = isLocalhost ? 'http://localhost:3000' : cleanBaseUrl;

    if (error) {
        console.error("Twitter returned error:", error);
        return res.redirect(`${frontendUrl}/?status=error&message=${encodeURIComponent(error)}`);
    }

    try {
        if (!code) throw new Error("No code returned");
        
        let metadata = {};
        try { metadata = JSON.parse(Buffer.from(state, 'base64').toString()); } catch (e) {}
        
        // IMPORTANT: The redirect_uri sent here MUST match the one sent in the start step EXACTLY
        const originalRedirectUri = metadata.redirectUri || `${cleanBaseUrl}/api/auth/twitter/callback`;

        // Token Exchange
        const basicAuth = Buffer.from(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`).toString('base64');
        const tokenParams = new URLSearchParams({
            code,
            grant_type: 'authorization_code',
            client_id: TWITTER_CLIENT_ID,
            redirect_uri: originalRedirectUri,
            code_verifier: 'challenge'
        }).toString();

        console.log("Exchanging token with URI:", originalRedirectUri);

        const tokenData = await makeRequest('https://api.twitter.com/2/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${basicAuth}`,
                'Content-Length': Buffer.byteLength(tokenParams)
            }
        }, tokenParams);

        if (!tokenData.access_token) {
            console.error("Token Data Error:", tokenData);
            throw new Error("Failed to get access token");
        }

        // Get User Info
        const userResp = await makeRequest('https://api.twitter.com/2/users/me?user.fields=profile_image_url,public_metrics', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
        });
        
        // Calculate Score
        let score = 0;
        try {
            const regionRules = REGION_RULES[metadata.region || 'Turkey'];
            const tweetsUrl = `https://api.twitter.com/2/users/${userResp.data.id}/tweets?max_results=20&exclude=retweets,replies&tweet.fields=public_metrics`;
            const tweetsResp = await makeRequest(tweetsUrl, { 
                method: 'GET', 
                headers: { 'Authorization': `Bearer ${tokenData.access_token}` } 
            });

            if (tweetsResp.data) {
                tweetsResp.data.forEach(t => {
                    const txt = t.text.toLowerCase();
                    const hit = regionRules.hashtags.some(h => txt.includes(h.toLowerCase().replace('#',''))) ||
                                regionRules.mentions.some(m => txt.includes(m.toLowerCase().replace('@','')));
                    if (hit) score += (t.public_metrics?.impression_count || 0);
                });
            }
        } catch (e) { console.log("Tweet score calc error (ignoring):", e.message); }

        // Success Redirect
        const params = new URLSearchParams({
            status: 'success',
            discordId: metadata.discordId || '',
            region: metadata.region || 'Turkey',
            twitterHandle: `@${userResp.data.username}`,
            avatarUrl: userResp.data.profile_image_url || '',
            followers: userResp.data.public_metrics?.followers_count || 0,
            score: score.toString()
        });

        res.redirect(`${frontendUrl}/?${params.toString()}`);

    } catch (err) {
        console.error("Auth Callback Error:", err.message);
        res.redirect(`${frontendUrl}/?status=error&message=${encodeURIComponent(err.message)}`);
    }
};

// REGISTER BOTH ROUTES FOR CALLBACK
app.get('/api/auth/twitter/callback', handleAuthCallback);
app.get('/api/auth/twitter/callback/', handleAuthCallback);

// 4. User Routes
app.get('/api/users', (req, res) => res.json(loadUsers()));
app.get('/api/users/check/:id', (req, res) => {
    const users = loadUsers();
    res.json({ exists: users.some(u => u.discordUsername.toLowerCase() === req.params.id.toLowerCase()) });
});
app.post('/api/users', (req, res) => {
    const users = loadUsers();
    const newUser = req.body;
    const idx = users.findIndex(u => u.discordUsername === newUser.discordUsername);
    if (idx >= 0) users[idx] = { ...newUser, id: users[idx].id };
    else users.push(newUser);
    saveUsers(users);
    res.json({ success: true });
});

// ==================================================================
// 📂 STATIC FILES
// ==================================================================
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
}

// Catch-all for React Router (Must be last)
app.get('*', (req, res) => {
    // Debug for missing API routes
    if (req.path.startsWith('/api')) {
        console.log(`❌ [404 API] Route not found: ${req.path}`);
        return res.status(404).json({ error: `API Route Not Found: ${req.path}` });
    }
    if (fs.existsSync(path.join(distPath, 'index.html'))) {
        res.sendFile(path.join(distPath, 'index.html'));
    } else {
        res.send('Backend Running. Frontend build not found.');
    }
});

function printRoutes() {
    console.log('📍 Registered Routes:');
    app._router.stack.forEach((r) => {
        if (r.route && r.route.path) {
            console.log(`   ${Object.keys(r.route.methods).join(',').toUpperCase()} ${r.route.path}`);
        }
    });
}

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    printRoutes();
});