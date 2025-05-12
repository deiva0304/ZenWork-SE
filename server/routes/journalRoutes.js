import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { analyzeJournalEntry, getJournalEntries, trackNLPAction } from '../controllers/journalController.js';

const journalRouter = express.Router();

journalRouter.post('/analyze', userAuth, analyzeJournalEntry);
journalRouter.get('/entries', userAuth, getJournalEntries);
journalRouter.post('/track-action', userAuth, trackNLPAction);

export default journalRouter;