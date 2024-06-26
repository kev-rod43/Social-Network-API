const { Schema, model } = require('mongoose');
const { ObjectId } = require('mongoose').Types;

const reactionSchema = new Schema(
    {
        reactionId: {
            type: ObjectId,
            default: new ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 200
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: d => new Date(d)
        },
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    })

// Schema to create a thought model
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: d => new Date(d)
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    });

thoughtSchema.virtual('reactionCount').get(function () { return this.reactions.length })

const Thought = model('thought', thoughtSchema);

module.exports = Thought;
