const { Schema, model } = require('mongoose');

// Schema to create a thought model
const thoughtSchema = new Schema();

const Thought = model('thought', thoughtSchema);

module.exports = Thought;
