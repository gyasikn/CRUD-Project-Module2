const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  task: String,
  _list: { type: Schema.Types.ObjectId, ref: "List", required: true },
  _creator: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Task", TaskSchema);
