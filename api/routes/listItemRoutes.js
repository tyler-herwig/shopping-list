const express = require('express');
const { createListItem, getListItems, getListItemById, updateListItem, deleteListItem } = require('../controllers/listItemController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, createListItem);
router.get('/', authenticateToken, getListItems);
router.get('/:id', authenticateToken, getListItemById);
router.put('/:id', authenticateToken, updateListItem);
router.delete('/:id', authenticateToken, deleteListItem);

module.exports = router;