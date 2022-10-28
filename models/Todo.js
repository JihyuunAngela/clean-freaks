const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  cleaningArea: {
    type: String,
    default: 'other',
    enum: ['other', 'bedroom', 'kitchen', 'dining room', 'bathroom', 'living room']
  },
  todoItem: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    default: Date.now,
  },
  comment: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Todo", TodoSchema);
