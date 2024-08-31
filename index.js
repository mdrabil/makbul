import mongoose from "mongoose";
import cors from 'cors'
import bodyParser from "body-parser";
import dotenv from 'dotenv'
import express from 'express'
import User from "./models/usermodel.js";
import Blog from "./models/postmodel.js";
import Comment from "./models/commentmodel.js";
dotenv.config()

const port = process.env.PORT || 8000
const app = express()
app.get('/',(req,res)=>{
  res.send("nice")
})
app.use(cors(
  {
    origin:['https://deenkibaatein.vercel.app'],
    
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
  }
))
app.use(bodyParser.json())

mongoose.connect(process.env.URL).then(()=>{
  console.log("Database connect")
}).catch(()=>{
  console.log("DB not connect")
})







app.post('/signup',async(req,res)=>{
    const {name,email,password} = req.body ;
console.log(name)
try {
    const newuser = new User({
        name,email,password
    })
    await newuser.save()
    res.status(200).json("user")
} catch (error) {
    res.status(404).json({msg:"user not found"})
}



})

app.post('/createblog', async (req, res) => {
    try {
      const { post, username } = req.body;
      const newBlog = new Blog({ post, username });
      await newBlog.save();
      res.status(201).json({ success: true, msg: "Post created successfully", data: newBlog });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ success: false, msg: "Error creating post" });
    }
  });



app.get('/readblog', async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, msg: "Error fetching posts" });
  }
});

app.post('/:id/like', async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Blog.findByIdAndUpdate(postId, { $inc: { likes: 1 } }, { new: true });
      if (!post) {
        return res.status(404).json({ success: false, msg: "Post not found" });
      }
      res.status(200).json({ success: true, data: post });
    } catch (error) {
      console.error('Error liking post:', error);
      res.status(500).json({ success: false, msg: "Error liking post" });
    }
  });
  
  // Dislike a blog post
  app.post('/:id/dislike', async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Blog.findByIdAndUpdate(postId, { $inc: { dislikes: 1 } }, { new: true });
      if (!post) {
        return res.status(404).json({ success: false, msg: "Post not found" });
      }
      res.status(200).json({ success: true, data: post });
    } catch (error) {
      console.error('Error disliking post:', error);
      res.status(500).json({ success: false, msg: "Error disliking post" });
    }
  });
  
  // Add a comment to a blog post
  app.post('/:id/comment', async (req, res) => {
    try {
      const postId = req.params.id;
      const { content, author } = req.body;
      const post = await Blog.findByIdAndUpdate(postId, { $push: { comments: { content, author } } }, { new: true });
      if (!post) {
        return res.status(404).json({ success: false, msg: "Post not found" });
      }
      res.status(200).json({ success: true, data: post.comments });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ success: false, msg: "Error adding comment" });
    }
  });
  
  // Get comments for a blog post
  app.get('/:id/comment', async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Blog.findById(postId);
      if (!post) {
        return res.status(404).json({ success: false, msg: "Post not found" });
      }
      res.status(200).json(post.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ success: false, msg: "Error fetching comments" });
    }
  });
  
  



app.get('/:postId/comment', async (req, res) => {
    try {
      const { postId } = req.params;
      const comments = await Comment.find({ postId });
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ success: false, msg: "Failed to fetch comments" });
    }
  });
  
  // Add a new comment to a specific post
  app.post('/:postId/comment', async (req, res) => {
    try {
      const { postId } = req.params;
      const { text } = req.body;
  
      if (!text) {
        return res.status(400).json({ success: false, msg: "Comment text is required" });
      }
  
      const newComment = new Comment({ postId, comment: text });
      await newComment.save();
  
      res.status(201).json({ success: true, msg: "Comment added successfully" });
    } catch (error) {
      res.status(500).json({ success: false, msg: "Failed to add comment" });
    }
  });

  app.put('/updateblog/:id', async (req, res) => {
    try {
      const updatedPost = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedPost);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Delete a post
  app.delete('/deleteblog/:id', async (req, res) => {
    try {
      await Blog.findByIdAndDelete(req.params.id);
      res.json({ message: 'Post deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app.get('/getone/:id', async (req, res) => {
    try {
      const post = await Blog.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });




app.listen(port,()=>{
    console.log("server is running", port)
})



