import express from 'express';
import { getUserByEmail , getFullProfileByEmail,
    updateProfileByEmail} from '../Controllers/userController.js';

const router = express.Router();

router.get('/getUserByEmail', getUserByEmail);
router.get('/getFullProfile', getFullProfileByEmail); // for profile page view
router.put('/updateProfile', updateProfileByEmail);   // for saving profile edits


export default router;
