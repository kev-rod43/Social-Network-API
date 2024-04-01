const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async createThought(req, res) {
        /*Sample data
            {
                "thoughtText": "Here's a cool thought...",
                "username": "lernantino",
                "userId": "5edff358a0fcb779aa7b118b"
            } */
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought._id } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    message: 'Thought created, but found no user with that ID',
                });
            }

            res.json(thought);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async updateThought(req, res) {
        /*Sample data
            {
                "thoughtText": "Here's a cool thought...",
                "username": "lernantino",
                "userId": "5edff358a0fcb779aa7b118b"
            } */
        try {
            const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, {new: true});

            if (!thought) {
                return res.status(404).json({
                    message: 'No thought matched that ID',
                });
            }

            res.json(thought);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            const user = await User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    message: 'Thought deleted, but no users found',
                });
            }

            res.json({ message: 'Thought successfully deleted' });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async createReaction(req, res) {
        /*
        req.body should look like this:
        {
            reactionBody: String,
            username: String,
        }
        */
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                {
                    $push: {
                        reactions: req.body
                    }
                },
                {new: true});

            if (!thought) {
                return res.status(404).json({
                    message: 'No thought matched that ID',
                });
            }

            res.status(200).json(thought);
        } catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    },

    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                {
                    $pull: {
                        reactions: {reactionId: new ObjectId(req.params.reactionId)}
                    }
                },
                {new: true});

            if (!thought) {
                return res.status(404).json({
                    message: 'No thought matched that ID',
                });
            }

            res.status(200).json(thought);
        } catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    },
};