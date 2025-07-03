import express from 'express';
import { requestToken, verifyToken } from '../Controllers/adminTokenController.js';

const router = express.Router();

router.post('/token-request', requestToken);
router.post('/verify-token', verifyToken);

export default router;
