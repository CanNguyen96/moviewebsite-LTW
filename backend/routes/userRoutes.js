const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const { authenticateToken, isAdmin } = require('../middlewares/auth');

router.get('/api/users/search', authenticateToken, isAdmin, userController.searchUsers);
router.get('/api/users', authenticateToken, isAdmin, userController.getUsers);
router.get('/api/users/:user_id', authenticateToken, isAdmin, userController.getUserById);
router.put('/api/users/:user_id/status', authenticateToken, isAdmin, userController.updateUserStatus);

module.exports = router;