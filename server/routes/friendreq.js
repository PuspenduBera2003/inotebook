const express = require('express');
const router = express.Router();
const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');
const fetchuser = require('../middleware/fetctuser')
const mongoose = require('mongoose');

// ROUTE 1: For sending friend requests, login required
router.post('/send', fetchuser, async (req, res) => {
    try {
        const { fromUserId, toUserId } = req.body;
        let success = false;
        // Check whether the user is existed in iNotebook mongoDB collection or not
        let isValidObjectId = mongoose.Types.ObjectId.isValid(fromUserId);
        if (!isValidObjectId) {
            return res.status(400).json({ success, message: 'Invalid user ID' });
        }
        isValidObjectId = mongoose.Types.ObjectId.isValid(toUserId);
        if (!isValidObjectId) {
            return res.status(400).json({ success, message: 'Invalid user ID' });
        }

        // Check if request is send from an existing user
        const fromExistingUser = await User.findById(fromUserId);
        if (!fromExistingUser) {
            return res.status(401).json({ success, message: 'You are not an existing user' });
        }

        // Check if request is send to an existing user
        const toExistingUser = await User.findById(toUserId)
        if (!toExistingUser) {
            return res.status(401).json({ success, message: "The user you are trying to send request is't exist" });
        }

        // Check if a request already exists
        const existingRequest = await FriendRequest.findOne({ from: fromUserId, to: toUserId });
        if (existingRequest) {
            return res.status(400).json({ success, message: 'Friend request already sent' });
        }

        const friendRequest = new FriendRequest({ from: fromUserId, to: toUserId, status: 'pending' });
        await friendRequest.save();
        success = true;
        res.status(200).json({ success, message: 'Friend request sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
})

// Route 2: For showing pending friend requests, login required
router.get('/pendingrequests/:id', fetchuser, async (req, res) => {
    try {
        let success = false;
        // Check whether the user is existed in iNotebook mongoDB collection or not
        const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValidObjectId) {
            return res.status(400).json({ success, message: 'Invalid user ID' });
        }
        const pendingRequests = await FriendRequest.find({ to: req.params.id, status: "pending" });
        if(!pendingRequests || pendingRequests.length === 0 ) {
            res.status(200).json({success, message: 'No new friend requests'});
        }
        success = true;
        res.status(200).json({ success, pendingRequests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }

})

// Route 3: For accepting friend requests, login required
router.put('/accept/:id', fetchuser, async (req, res) => {
    try {
        let success = false;
        // Check whether the friend request is existed
        const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValidObjectId) {
            return res.status(400).json({ success, message: 'Invalid friend request ID' });
        }
        let pendingRequest = await FriendRequest.findById(req.params.id)
        if (!pendingRequest) {
            return res.status(400).json({ success, message: "Friend request not found" });
        }
        if (pendingRequest.status === "accept") {
            return res.status(400).json({ success, message: "Friend request already accepted" });
        }
        if (pendingRequest.status === "reject") {
            return res.status(400).json({ success, message: "Friend request already rejected" });
        }
        // Update the status to accept
        pendingRequest.status = "accept";
        await pendingRequest.save();

        // Adds the friend data corresponding to the user
        let fromUser = await User.findById(pendingRequest.from);
        const updatedUser = await User.findByIdAndUpdate(
            pendingRequest.to,
            { $push: { friends: { $each: [fromUser.username], $position: 0 } } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ success, message: 'Error updating user' });
        }

        success = true;
        res.json({ success, updatedUser, pendingRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
})

// Route 4: For rejecting friend requests, login required
router.put('/reject/:id', fetchuser, async (req, res) => {
    try {
        let success = false;
        // Check whether the friend request is existed
        const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValidObjectId) {
            return res.status(400).json({ success, message: 'Invalid friend request ID' });
        }
        let pendingRequest = await FriendRequest.findById(req.params.id)
        if (!pendingRequest) {
            return res.status(400).json({ success, message: "Friend request not found" });
        }
        if (pendingRequest.status.toString() === "accept") {
            return res.status(400).json({ success, message: "Friend request already accepted" });
        }
        if (pendingRequest.status.toString() === "reject") {
            return res.status(400).json({ success, message: "Friend request already rejected" });
        }
        // Update the status to reject
        pendingRequest.status = "reject";
        await pendingRequest.save();
        success = true;
        res.json({ success, pendingRequest })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
})

// Route 5: For unfriending an existing friend, login required
router.delete('/unfriend/:id', fetchuser, async (req, res) => {
    try {
        let success = false
        // Check whether the friend request is existed
        const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValidObjectId) {
            return res.status(400).json({ success, message: 'Invalid friend request ID' });
        }
        // Find the friend to be unfriended
        let friend = await FriendRequest.findById(req.params.id)
        if (!friend) {
            return res.status(404).json({ success, message: "Not Found!!" });
        };
        if (friend.status.toString() === "pending" || friend.status.toString() === "reject") {
            return res.status(400).json({ success, message: "You cannot unfriend this user since you are not friend" });
        }
        // Delete the friend request
        friend = await FriendRequest.findByIdAndDelete(req.params.id)
        let removeFriend = await User.findById(friend.from);
        // Remove the friend from the user's friends array
        const updatedUser = await User.findByIdAndUpdate(
            friend.to,
            { $pull: { friends: removeFriend.username } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(500).json({ success, message: "Error removing friend from user's friends array" });
        }
        success = true;
        res.json({ success, message: `${removeFriend.username} has been unfriend`, friend });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
})

// Route 6: For showing the list of accepted friends. login required
router.get('/friends', fetchuser, async (req, res) => {
    const { userId } = req.body;
    let success = false;
    const existingUser = await User.findById(userId);
    if(!existingUser) {
        return res.status(401).json({success, message: "You are not an existing user"});
    }
    const acceptedRequests = await FriendRequest.find({ to: userId, status: "accept" });
    if(!acceptedRequests || acceptedRequests.length === 0) {
        return res.status(200).json({success, message: "You don't have any friend"});
    }
    // Extract the IDs of the friends who have accepted the request
    const friendIds = acceptedRequests.map(request => request.from);

    // Query for the profiles of the friends using $in
    const acceptedRequestsProfile = await User.find({ _id: { $in: friendIds } });
    success = true;
    res.status(200).json({success, friends: acceptedRequestsProfile});
})

module.exports = router