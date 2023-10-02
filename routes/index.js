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


// add a new gateway
router.post('/gateways', [
  body('serialNumber').not().isEmpty().trim().escape(),
  body('name').not().isEmpty().trim().escape(),
  body('ipv4').isIP(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const gateway = new Gateway(req.body);
    await gateway.save();
    res.json(gateway);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
