const mongoose=require('mongoose');

const deviceSchema = new mongoose.Schema({
    uid: {
        type: Number,
        required: true,
        unique: true,
    },
    vendor: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        required: true,
        default: 'offline',
    },
});

const gatewaySchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    ipv4: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => {
                const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
                return ipRegex.test(v);
            },
            message: (props) => `${props.value} is not a valid IPv4 address!`,
        },
    },
    devices: {
        type: [deviceSchema],
        validate: {
            validator: (v) => {
                return v.length <= 10;
            },
            message: () => `No more than 10 devices are allowed per gateway!`,
        },
    },
});

module.exports = {
    Gateway: mongoose.model('Gateway', gatewaySchema),
};


