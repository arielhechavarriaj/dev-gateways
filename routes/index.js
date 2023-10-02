const express = require('express');
const Gateway = require('../model/model').Gateway;
const router = express.Router();
const {body, validationResult} = require('express-validator');

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
        console.log(123)
        return res.status(400).json({errors: errors.array()});
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

// add a new device to a gateway
router.post('/gateways/:serialNumber/devices', [
    body('uid').not().isEmpty().isInt(),
    body('vendor').not().isEmpty().trim().escape(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const gateway = await Gateway.findOne({serialNumber: req.params.serialNumber});
        if (!gateway) {
            return res.status(404).json({msg: 'Gateway not found'});
        }
        if (gateway.devices.length >= 10) {
            return res.status(400).json({msg: 'Maximum number of devices reached for this gateway'});
        }
        const device = req.body;
        gateway.devices.push(device);
        await gateway.save();
        res.json(gateway);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// update a gateway by its serial number
router.put('/gateways/:serialNumber', [
    body('name').not().isEmpty().trim().escape(),
    body('ipv4').isIP(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const gateway = await Gateway.findOneAndUpdate({ serialNumber: req.params.serialNumber }, req.body, { new: true });
        if (!gateway) {
            return res.status(404).json({ msg: 'Gateway not found' });
        }
        res.json(gateway);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
