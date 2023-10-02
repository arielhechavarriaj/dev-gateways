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
router.post('/gateways', [body('serialNumber').not().isEmpty().trim().escape(), body('name').not().isEmpty().trim().escape(), body('ipv4').isIP(),], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const gateway = new Gateway(req.body);
        await gateway.save();
        res.json(gateway);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
            const duplicateKey = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ msg: `El campo '${duplicateKey}' ya existe en la base de datos.` });
        } else {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
});



// add a new device to a gateway
router.post('/gateways/:serialNumber/devices', [
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
        const device = {...req.body, uid: new Date().getTime()};
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
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const gateway = await Gateway.findOneAndUpdate({serialNumber: req.params.serialNumber}, req.body, {new: true});
        if (!gateway) {
            return res.status(404).json({msg: 'Gateway not found'});
        }
        res.json(gateway);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// delete a gateway by its serial number
router.delete('/gateways/:serialNumber', async (req, res) => {
    try {
        const gateway = await Gateway.findOneAndDelete({serialNumber: req.params.serialNumber});
        if (!gateway) {
            return res.status(404).json({msg: 'Gateway not found'});
        }
        res.json({msg: 'Gateway deleted'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


// update a device in a gateway
router.put('/gateways/:serialNumber/devices/:uid', [
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

        const deviceIndex = gateway.devices.findIndex(device => {
                console.log(device)
                return device.uid === Number(req.params.uid)
            })

        ;
        if (deviceIndex === -1) {
            return res.status(404).json({msg: 'Device not found'});
        }

        gateway.devices[deviceIndex] = {...gateway.devices[deviceIndex], ...req.body};
        await gateway.save();
        res.json(gateway);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


// delete a device from a gateway
router.delete('/gateways/:serialNumber/devices/:uid', async (req, res) => {
    try {
        const gateway = await Gateway.findOne({serialNumber: req.params.serialNumber});
        if (!gateway) {
            return res.status(404).json({msg: 'Gateway not found'});
        }
        const device = gateway.devices.find(d => d.uid === Number(req.params.uid));
        if (!device) {
            return res.status(404).json({msg: 'Device not found'});
        }
        gateway.devices = gateway.devices.filter(d => d.uid !== Number(req.params.uid));
        await gateway.save();
        res.json(gateway);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
