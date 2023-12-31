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
            return res.status(401).json({ success, message: "The user you are trying to send request isn't exist" });
        }

        // Check if request is from a different user or not
        if (fromUserId === toUserId) {
            return res.status(400).json({ success, message: 'You can not send friend request to yourself' })
        }

        // Check if a request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { from: fromUserId, to: toUserId },
                { from: toUserId, to: fromUserId }
            ]
        });
        if (existingRequest && existingRequest.status === 'accept') {
            return res.status(400).json({ success, message: "You are already friends" });
        }
        if (existingRequest && existingRequest.status === 'pending') {
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
        // Extract the IDs of the users where from the request is sent
        const requestFrom = pendingRequests.map(request => request.from);

        // Query for the profiles of the friends using $in
        const pendingRequestsProfile = await User.find({ _id: { $in: requestFrom } });
        success = true;
        res.status(200).json({ success, pendingRequests, pendingRequestsProfile });
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
        pendingRequest.date = new Date();
        await pendingRequest.save();

        // Adds the friend data corresponding to the user
        let fromUser = await User.findById(pendingRequest.from);
        let toUser = await User.findById(pendingRequest.to);
        const updatedToUser = await User.findByIdAndUpdate(
            pendingRequest.to,
            { $push: { friends: { $each: [fromUser.username], $position: 0 } } },
            { new: true }
        );
        const updatedFromUser = await User.findByIdAndUpdate(
            pendingRequest.from,
            { $push: { friends: { $each: [toUser.username], $position: 0 } } },
            { new: true }
        );

        if (!updatedToUser) {
            return res.status(400).json({ success, message: 'Error updating user the request send to' });
        }

        if (!updatedFromUser) {
            return res.status(400).json({ success, message: 'Error updating user the request send from' });
        }

        success = true;
        res.json({ success, updatedToUser, updatedFromUser, pendingRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
})

// Route 4: For rejecting friend requests, login required
router.delete('/reject/:id', fetchuser, async (req, res) => {
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
        const delete_request = await FriendRequest.deleteOne(pendingRequest)
        if(!delete_request) {
            return res.status(400).json({ success, message: "Error while rejecting request"});
        }
        success = true;
        res.status(200).json({ success, pendingRequest })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
})

// Route 5: For cancelling an existing pending Request, login required
router.delete('/cancel/:id', fetchuser, async (req, res) => {
    try {
        let success = false;
        // Check whether the friend request is existed
        const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValidObjectId) {
            return res.status(400).json({ success, message: 'Invalid friend request ID' });
        }

        // Find the request to be cancelled
        let pending_request = await FriendRequest.findById(req.params.id);
        if(!pending_request) {
            return res.status(404).json({ success, message: "Request Not found" });
        }
        if(pending_request.status.toString() === "pending") {
            pending_request = await FriendRequest.findByIdAndDelete(req.params.id);
            const request_to = await User.findById(pending_request.to);
            success = true;
            return res.status(200).json({success, message: `Your request to ${request_to.name} has been cancelled`});
        } else {
            return res.status(400).json({success, message: 'Unable to cancel the request'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
})

// Route 6: For unfriending an existing friend, login required
router.delete('/unfriend/:id', fetchuser, async (req, res) => {
    try {
        let success = false;
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
        if (friend.status.toString() === "pending") {
            return res.status(400).json({ success, message: "You cannot unfriend this user since you are not friend" });
        }
        // Delete the friend request
        friend = await FriendRequest.findByIdAndDelete(req.params.id)
        let removeFriendFrom = await User.findById(friend.from);
        let removeFriendTo = await User.findById(friend.to);
        // Remove the friend from the user's friends array
        const updatedUserTo = await User.findByIdAndUpdate(
            friend.to,
            { $pull: { friends: removeFriendFrom.username } },
            { new: true }
        );
        const updatedUserFrom = await User.findByIdAndUpdate(
            friend.from,
            { $pull: { friends: removeFriendTo.username } },
            { new: true }
        );

        if (!updatedUserTo || !updatedUserFrom) {
            return res.status(500).json({ success, message: "Error removing friend from user's friends array" });
        }
        success = true;
        res.json({ success, message: 'Successfully unfriend', friend });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }
})

// Route 7: For showing the list of accepted friends. login required
router.get('/:userid/friends', fetchuser, async (req, res) => {
    const userId = req.params.userid;
    let success = false;
    const existingUser = await User.findById(userId);
    if (!existingUser) {
        return res.status(401).json({ success, message: "You are not an existing user" });
    }
    const acceptedRequests = await FriendRequest.find({
        $or: [
            { to: userId, status: "accept" },
            { from: userId, status: "accept" }
        ]
    });

    // Extract the IDs of the friends who have accepted the request
    const friendIds = acceptedRequests.map(request => request.from);

    // Extract the 'to' IDs from the requests
    const toIds = acceptedRequests.map(request => request.to);

    // Query for the profiles of the friends and 'to' users using $in
    const acceptedRequestsProfile = await User.find({ _id: { $in: friendIds.concat(toIds) } });

    // Remove the user with _id equal to req.params.userid
    const filteredAcceptedRequestsProfile = acceptedRequestsProfile.filter(user => user._id.toString() !== userId);

    success = true;
    res.status(200).json({ success, friends: filteredAcceptedRequestsProfile, request: acceptedRequests });
})

// Route 8: For showing pending friend requests sent from user, login required
router.get('/requestsend/:id', fetchuser, async (req, res) => {
    try {
        let success = false;
        // Check whether the user is existed in iNotebook mongoDB collection or not
        const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValidObjectId) {
            return res.status(400).json({ success, message: 'Invalid user ID' });
        }
        const pendingRequests = await FriendRequest.find({ from: req.params.id, status: "pending" });
        // Extract the IDs of the users where from the request is sent
        const requestFrom = pendingRequests.map(request => request.to);

        // Query for the profiles of the friends using $in
        const pendingRequestsProfile = await User.find({ _id: { $in: requestFrom } });
        success = true;
        res.status(200).json({ success, pendingRequests, pendingRequestsProfile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' });
    }

})

module.exports = router