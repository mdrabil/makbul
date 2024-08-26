import mongoose  from "mongoose";

const blogSchema = new mongoose.Schema({
    post: { type: String, required: true },
    username: { type: String, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    comments: [
      {
        content: String,
        author: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  }, { timestamps: true });
  
  const Blog = mongoose.model('Blog', blogSchema);
  
  export default Blog