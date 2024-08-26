import mongoose from "mongoose";
const CommentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
    comment: { type: String, required: true },
  }, { timestamps: true });
  
  const Comment = mongoose.model('Comment', CommentSchema);
  
  export default Comment