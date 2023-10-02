const express = require('express');
const Gateway = require('../model/model').Gateway;
const router = express.Router();
const { body, validationResult } = require('express-validator');

// get all gateways with their devices
router.get('/gateways', async (req, res) => {
  try {
    const gateways = await Gateway.find();
    res.json(gateways);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
