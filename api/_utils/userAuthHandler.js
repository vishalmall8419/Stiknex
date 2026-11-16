import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectToDatabase from './db.js';
import User from '../_models/User.js';
import TypingResult from '../_models/TypingResult.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_stiknex_super_secret_key_2026';

/**
 * Generate a guaranteed unique, collision-proof username derived from the user's name
 * e.g., "Rahul Sharma" -> "rahul_k72m"
 */
async function generateUniqueUsername(name) {
  const base = (name || 'typer')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 12) || 'typer';

  let attempts = 0;
  while (attempts < 20) {
    const randomSuffix = crypto.randomBytes(3).toString('hex').slice(0, 4);
    const candidate = `${base}_${randomSuffix}`;
    const existing = await User.findOne({ username: candidate }).lean();
    if (!existing) {
      return candidate;
    }
    attempts++;
  }
  return `${base}_${Date.now().toString(36)}`;
}

/**
 * Determine user tier based on peak WPM
 */
function getTierForWpm(wpm) {
  if (wpm >= 120) return 'Mythical';
  if (wpm >= 95) return 'Master';
  if (wpm >= 75) return 'Diamond';
  if (wpm >= 50) return 'Pro';
  return 'Standard';
}

/**
 * Verify JWT from request header
 */
function verifyUserToken(req) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Main User Authentication & Leaderboard Dispatcher
 */
export async function handleUserAuthAction(action, req, res) {
  await connectToDatabase();

  switch (action) {
    case 'user-register':
      return handleRegister(req, res);
    case 'user-login':
      return handleLogin(req, res);
    case 'user-me':
      return handleMe(req, res);
    case 'user-dashboard':
      return handleDashboard(req, res);
    case 'save-typing-score':
      return handleSaveScore(req, res);
    case 'typing-leaderboard':
      return handleLeaderboard(req, res);
    case 'user-workspace-save':
      return handleWorkspaceSave(req, res);
    case 'user-workspace-load':
      return handleWorkspaceLoad(req, res);
    default:
      return res.status(400).json({ success: false, error: `Unknown user auth action: ${action}` });
  }
}

/**
 * 1. USER REGISTRATION
 * Required: name, email, password, confirmPassword, age
 * Optional: phone
 */
async function handleRegister(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { name, email, password, confirmPassword, age, phone } = body;

    // Strict validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Passwords do not match.' });
    }
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 6 || parsedAge > 120) {
      return res.status(400).json({ success: false, error: 'Please enter a valid age between 6 and 120.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone ? phone.trim() : undefined;

    // Check existing email
    const existingEmail = await User.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res.status(409).json({ success: false, error: 'This email is already registered. Please log in.' });
    }

    // Check existing phone if provided
    if (cleanPhone) {
      const existingPhone = await User.findOne({ phone: cleanPhone });
      if (existingPhone) {
        return res.status(409).json({ success: false, error: 'This mobile number is already registered.' });
      }
    }

    // Unique username generation
    const uniqueUsername = await generateUniqueUsername(name);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Initial avatar selection
    const avatarList = ['rocket', 'falcon', 'tiger', 'ninja', 'phoenix', 'owl', 'cyber'];
    const chosenAvatar = avatarList[Math.floor(Math.random() * avatarList.length)];

    const user = new User({
      name: name.trim(),
      email: cleanEmail,
      username: uniqueUsername,
      phone: cleanPhone || undefined,
      age: parsedAge,
      passwordHash,
      avatar: chosenAvatar,
      tier: 'Standard',
      xp: 100,
      bestWpm: 0,
      avgWpm: 0,
      avgAccuracy: 0,
      testsCompleted: 0
    });

    await user.save();

    // Create JWT
    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone || null,
        age: user.age,
        avatar: user.avatar,
        tier: user.tier,
        xp: user.xp,
        bestWpm: user.bestWpm,
        testsCompleted: user.testsCompleted,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create account. Please try again.' });
  }
}

/**
 * 2. USER LOGIN
 * Accepts either: Username, Email, OR Mobile Number + Password
 */
async function handleLogin(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { identifier, password } = body;

    if (!identifier || !identifier.trim()) {
      return res.status(400).json({ success: false, error: 'Please enter your username, email, or mobile number.' });
    }
    if (!password) {
      return res.status(400).json({ success: false, error: 'Please enter your password.' });
    }

    const cleanInput = identifier.trim();
    const cleanLower = cleanInput.toLowerCase().replace(/^@/, '');

    // Search by email, username, or phone
    const user = await User.findOne({
      $or: [
        { email: cleanLower },
        { username: cleanLower },
        { phone: cleanInput }
      ]
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'No account found with these credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Incorrect password. Please verify and try again.' });
    }

    // Refresh tier
    user.tier = getTierForWpm(user.bestWpm || 0);
    await user.save();

    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone || null,
        age: user.age,
        avatar: user.avatar,
        tier: user.tier,
        xp: user.xp,
        bestWpm: user.bestWpm,
        avgWpm: user.avgWpm,
        avgAccuracy: user.avgAccuracy,
        testsCompleted: user.testsCompleted,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: 'Authentication failed. Please try again.' });
  }
}

/**
 * 3. GET CURRENT USER (Session verification)
 */
async function handleMe(req, res) {
  const decoded = verifyUserToken(req);
  if (!decoded) {
    return res.status(401).json({ success: false, error: 'Unauthorized or expired session.' });
  }

  try {
    const user = await User.findById(decoded.userId).select('-passwordHash').lean();
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Me error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

/**
 * 4. SAVE TYPING SCORE & UPDATE USER STATS
 */
async function handleSaveScore(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const decoded = verifyUserToken(req);
  if (!decoded) {
    return res.status(401).json({ success: false, error: 'Sign in required to save typing scores.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const {
      wpm,
      rawWpm,
      accuracy,
      consistency = 0,
      subMode = 'time',
      timeLimit = 15,
      wordLimit = 0,
      language = 'english',
      hasPunctuation = false,
      hasNumbers = false,
      characters = {}
    } = body;

    const numWpm = Math.min(450, Math.max(0, Math.round(Number(wpm) || 0)));
    const numRaw = Math.min(500, Math.max(0, Math.round(Number(rawWpm) || numWpm)));
    const numAcc = Math.min(100, Math.max(0, Math.round(Number(accuracy) || 0)));
    const numConsistency = Math.min(100, Math.max(0, Math.round(Number(consistency) || 0)));

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    const tier = getTierForWpm(Math.max(user.bestWpm || 0, numWpm));

    // Save individual test result
    const result = new TypingResult({
      userId: user._id,
      username: user.username,
      name: user.name,
      tier,
      avatar: user.avatar,
      wpm: numWpm,
      rawWpm: numRaw,
      accuracy: numAcc,
      consistency: numConsistency,
      subMode,
      timeLimit: Number(timeLimit) || 15,
      wordLimit: Number(wordLimit) || 0,
      language,
      hasPunctuation: Boolean(hasPunctuation),
      hasNumbers: Boolean(hasNumbers),
      characters: {
        correct: Number(characters.correct) || 0,
        incorrect: Number(characters.incorrect) || 0,
        extra: Number(characters.extra) || 0,
        missed: Number(characters.missed) || 0
      }
    });

    await result.save();

    // Update cumulative user stats
    const prevTests = user.testsCompleted || 0;
    const newTests = prevTests + 1;
    const newAvgWpm = Math.round(((user.avgWpm || 0) * prevTests + numWpm) / newTests);
    const newAvgAcc = Math.round(((user.avgAccuracy || 100) * prevTests + numAcc) / newTests);
    const earnedXp = Math.max(10, Math.round(numWpm * (numAcc / 100) * 1.5));

    user.bestWpm = Math.max(user.bestWpm || 0, numWpm);
    user.avgWpm = newAvgWpm;
    user.avgAccuracy = newAvgAcc;
    user.testsCompleted = newTests;
    user.xp = (user.xp || 0) + earnedXp;
    user.tier = tier;
    user.totalTimeSeconds = (user.totalTimeSeconds || 0) + (Number(timeLimit) || 15);

    await user.save();

    return res.status(201).json({
      success: true,
      message: 'Score saved to leaderboard and personal dashboard!',
      resultId: result._id,
      earnedXp,
      userStats: {
        bestWpm: user.bestWpm,
        avgWpm: user.avgWpm,
        avgAccuracy: user.avgAccuracy,
        testsCompleted: user.testsCompleted,
        xp: user.xp,
        tier: user.tier
      }
    });
  } catch (error) {
    console.error('Save score error:', error);
    return res.status(500).json({ success: false, error: 'Could not record score. Please try again.' });
  }
}

/**
 * 5. PUBLIC TYPING LEADERBOARD
 * Matches layout from user's reference image:
 * Rank, Name (Avatar + Username + Tier badge), WPM (accuracy), Raw (consistency), Date
 */
async function handleLeaderboard(req, res) {
  try {
    const category = (req.query.category || 'all-time').toLowerCase(); // 'all-time' | 'weekly' | 'daily'
    const rawTime = req.query.time || req.query.timeLimit;
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(10, parseInt(req.query.limit || '50', 10)));
    const skip = (page - 1) * limit;

    // Purge any lingering legacy mock data from database
    await TypingResult.deleteMany({
      username: { $in: ['rocket', 'przewodowy', 'saerith', 'joshua728', 'fallenrelic', 'velocity_coder', 'stiknex_pro'] }
    }).catch(() => {});

    const matchQuery = {
      username: { $nin: ['rocket', 'przewodowy', 'saerith', 'joshua728', 'fallenrelic', 'velocity_coder', 'stiknex_pro'] }
    };

    // Support duration filtering: 15, 30, 60, or 'all' (0) for global peak scores
    let parsedTimeLimit = 0;
    if (rawTime && rawTime !== 'all' && rawTime !== '0') {
      const parsed = parseInt(rawTime, 10);
      if (!isNaN(parsed) && parsed > 0) {
        parsedTimeLimit = parsed;
        matchQuery.timeLimit = parsed;
      }
    }

    if (category === 'weekly') {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      matchQuery.createdAt = { $gte: oneWeekAgo };
    } else if (category === 'daily') {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      matchQuery.createdAt = { $gte: oneDayAgo };
    }

    // Aggregate to fetch top score per user (preventing one user from taking all 50 slots)
    const pipeline = [
      { $match: matchQuery },
      { $sort: { wpm: -1, accuracy: -1, createdAt: -1 } },
      {
        $group: {
          _id: '$userId',
          bestResult: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: '$bestResult' } },
      { $sort: { wpm: -1, accuracy: -1 } },
      { $skip: skip },
      { $limit: limit }
    ];

    const dbResults = await TypingResult.aggregate(pipeline);

    // Only return genuine real user results from database - zero fake data
    const ranked = dbResults.map((item, idx) => ({
      rank: skip + idx + 1,
      username: item.username,
      name: item.name,
      tier: item.tier || getTierForWpm(item.wpm),
      avatar: item.avatar || 'rocket',
      wpm: Number(item.wpm.toFixed(2)),
      accuracy: Number(item.accuracy.toFixed(2)),
      rawWpm: Number((item.rawWpm || item.wpm).toFixed(2)),
      consistency: Number((item.consistency || 90).toFixed(2)),
      timeLimit: item.timeLimit || 30,
      date: item.createdAt
    }));

    return res.status(200).json({
      success: true,
      category,
      timeLimit: parsedTimeLimit,
      totalEntries: ranked.length,
      nextUpdateSeconds: 26,
      leaderboard: ranked
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({ success: false, error: 'Could not fetch leaderboard.' });
  }
}

/**
 * 6. USER DASHBOARD DATA
 * Complete profile, typing statistics, recent 25 tests, and cloud utility sync overview
 */
async function handleDashboard(req, res) {
  const decoded = verifyUserToken(req);
  if (!decoded) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Please sign in.' });
  }

  try {
    const user = await User.findById(decoded.userId).select('-passwordHash').lean();
    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found.' });
    }

    // Fetch user's recent typing tests
    const recentTests = await TypingResult.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    // Check user's standing on the global leaderboard (distinct users with higher best WPM)
    const userRank = await TypingResult.countDocuments({
      wpm: { $gt: user.bestWpm || 0 }
    });

    return res.status(200).json({
      success: true,
      profile: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone || null,
        age: user.age,
        avatar: user.avatar || 'rocket',
        tier: user.tier || getTierForWpm(user.bestWpm || 0),
        xp: user.xp || 0,
        bestWpm: user.bestWpm || 0,
        avgWpm: user.avgWpm || 0,
        avgAccuracy: user.avgAccuracy || 0,
        testsCompleted: user.testsCompleted || 0,
        totalTimeMinutes: Math.round((user.totalTimeSeconds || 0) / 60),
        rankEstimate: userRank + 1,
        createdAt: user.createdAt,
        syncGroupId: user.syncGroupId || null
      },
      workspaceData: user.workspaceData || {
        notes: [],
        notebooks: [],
        whiteboards: [],
        lastSyncedAt: null
      },
      recentTests: recentTests.map((t) => ({
        id: t._id,
        wpm: t.wpm,
        rawWpm: t.rawWpm,
        accuracy: t.accuracy,
        consistency: t.consistency,
        subMode: t.subMode,
        timeLimit: t.timeLimit,
        language: t.language,
        createdAt: t.createdAt
      }))
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ success: false, error: 'Failed to load user dashboard.' });
  }
}

/**
 * 7. USER CLOUD WORKSPACE SAVE
 * Stores user's sticky notes and encrypted notebooks directly in MongoDB
 */
async function handleWorkspaceSave(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  const decoded = verifyUserToken(req);
  if (!decoded) return res.status(401).json({ success: false, error: 'Unauthorized. Please sign in.' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { notes, notebooks, whiteboards, syncGroupId } = body;

    const updateFields = {
      workspaceData: {
        notes: Array.isArray(notes) ? notes : [],
        notebooks: Array.isArray(notebooks) ? notebooks : [],
        whiteboards: Array.isArray(whiteboards) ? whiteboards : [],
        lastSyncedAt: new Date()
      }
    };
    if (syncGroupId) updateFields.syncGroupId = syncGroupId;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: updateFields },
      { new: true }
    ).select('-passwordHash').lean();

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User profile not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Workspace saved to MongoDB database.',
      workspaceData: updatedUser.workspaceData
    });
  } catch (error) {
    console.error('Workspace save error:', error);
    return res.status(500).json({ success: false, error: 'Failed to save workspace data to database.' });
  }
}

/**
 * 8. USER CLOUD WORKSPACE LOAD
 * Retrieves user's sticky notes and notebooks directly from MongoDB
 */
async function handleWorkspaceLoad(req, res) {
  const decoded = verifyUserToken(req);
  if (!decoded) return res.status(401).json({ success: false, error: 'Unauthorized. Please sign in.' });

  try {
    const user = await User.findById(decoded.userId).select('workspaceData syncGroupId').lean();
    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found.' });
    }

    return res.status(200).json({
      success: true,
      workspaceData: user.workspaceData || { notes: [], notebooks: [], whiteboards: [], lastSyncedAt: null },
      syncGroupId: user.syncGroupId || null
    });
  } catch (error) {
    console.error('Workspace load error:', error);
    return res.status(500).json({ success: false, error: 'Failed to load workspace data from database.' });
  }
}
