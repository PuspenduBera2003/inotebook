const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendRequestSchema = new Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    status: String,
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('friend-requests', FriendRequestSchema);