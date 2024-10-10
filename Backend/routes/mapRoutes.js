const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { saveGeneratedMap } = require('../controllers/mapController');
const {getUserMaps} = require('../controllers/mapController');


// Route for saving the generated map image
router.post('/maps/save', protect, saveGeneratedMap);
router.get('/maps/:email', protect, getUserMaps);
module.exports = router;