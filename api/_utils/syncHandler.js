import connectToDatabase from './db.js';
import jwt from 'jsonwebtoken';
import Note from '../_models/Note.js';
import Whiteboard from '../_models/Whiteboard.js';
import Notebook from '../_models/Notebook.js';
import TypingResult from '../_models/TypingResult.js';
import Review from '../_models/Review.js';
import User from '../_models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_stiknex_super_secret_key_2026';

const COLLECTION_MODELS = {
  notes: Note,
  whiteboards: Whiteboard,
  notebooks: Notebook,
  typingResults: TypingResult,
  reviews: Review
};

export async function handleSync(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    // Authenticate user if token is provided
    let userId = null;
    let authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && (decoded.userId || decoded.id)) {
          userId = (decoded.userId || decoded.id).toString();
        }
      } catch {
        // Token invalid or expired - proceed as guest
      }
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const changes = Array.isArray(body.changes) ? body.changes : [];
    const lastSyncedAt = Number(body.lastSyncedAt) || 0;
    const syncedIds = [];

    // --- STEP 1: PUSH (Process client changes via bulkWrite) ---
    if (changes.length > 0) {
      // Group changes by collection
      const grouped = {};
      for (const change of changes) {
        if (!change || !change.collection || !change.clientId) continue;
        if (!grouped[change.collection]) {
          grouped[change.collection] = [];
        }
        grouped[change.collection].push(change);
      }

      for (const [colName, colChanges] of Object.entries(grouped)) {
        const Model = COLLECTION_MODELS[colName];
        if (!Model) continue;

        const bulkOps = [];
        for (const change of colChanges) {
          const { action, clientId, payload = {}, updatedAt = Date.now(), id } = change;
          const isDelete = action === 'DELETE' || payload.isDeleted === true;

          const updateFields = {
            ...payload,
            clientId,
            updatedAt: Number(updatedAt) || Date.now(),
            isDeleted: isDelete,
          };

          if (userId) {
            updateFields.userId = userId;
          }

          bulkOps.push({
            updateOne: {
              filter: {
                clientId,
                $or: [
                  { updatedAt: { $lte: updateFields.updatedAt } },
                  { updatedAt: { $exists: false } }
                ]
              },
              update: { $set: updateFields },
              upsert: true
            }
          });

          if (id !== undefined) {
            syncedIds.push(id);
          }
        }

        if (bulkOps.length > 0) {
          try {
            await Model.bulkWrite(bulkOps, { ordered: false });
          } catch (bulkErr) {
            console.error(`bulkWrite error for collection ${colName}:`, bulkErr?.message || bulkErr);
          }
        }
      }
    }

    // --- STEP 2: PULL (Fetch items changed since lastSyncedAt) ---
    const serverTime = Date.now();
    const updates = {};

    const pullableCollections = ['notes', 'whiteboards', 'notebooks'];
    for (const colName of pullableCollections) {
      const Model = COLLECTION_MODELS[colName];
      if (!Model) continue;

      const query = {
        updatedAt: { $gt: lastSyncedAt }
      };

      if (userId) {
        query.$or = [{ userId }, { userId: null }, { userId: { $exists: false } }];
      } else {
        query.$or = [{ userId: null }, { userId: { $exists: false } }];
      }

      const items = await Model.find(query).lean().limit(500);
      updates[colName] = items.map(item => ({
        ...item,
        _id: item._id ? item._id.toString() : undefined
      }));
    }

    return res.status(200).json({
      success: true,
      syncedIds,
      serverTime,
      updates
    });
  } catch (error) {
    console.error('Two-way sync error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Sync failed'
    });
  }
}

