const express = require('express');
const { createList, getLists, getListById, updateList, deleteList } = require('../controllers/listController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, createList);
router.get('/', authenticateToken, getLists);
router.get('/:id', authenticateToken, getListById);
router.put('/:id', authenticateToken, updateList);
router.delete('/:id', authenticateToken, deleteList);

module.exports = router;