const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {getUserMaps} = require('../controllers/mapController');


// Route for saving the generated map image
router.post('/', protect, getUserMaps);

module.exports = router;
