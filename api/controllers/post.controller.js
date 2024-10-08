import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
export const createPost = async (req, res,next) => {

  if(!req.body.title || !req.body.content){
      return next(errorHandler(403,'Title and Content are required'));
  
  }
  const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

  const newPost=new Post({
      ...req.body,
      slug,
      userId:req.user.id
  });

  try{
      const savedPost=await newPost.save();
      res.status(201).json(savedPost);
  }
  catch(error){
      next(error);
  }
};

export const getposts = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
      const posts = await Post.find({
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: 'i' } },
            { content: { $regex: req.query.searchTerm, $options: 'i' } },
          ],
        }),
      })
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      const totalPosts = await Post.countDocuments();
      const postsWithAuthors = await Promise.all(posts.map(async post => {
        const user = await User.findById(post.userId);
        return {
            ...post._doc,
            author: user ? user.username : 'Unknown', // Adaugă numele autorului
        };
    }));
  
      const now = new Date();
  
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
  
      const lastMonthPosts = await Post.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
  
      res.status(200).json({
        posts : postsWithAuthors,
        totalPosts,
        lastMonthPosts,
      });
    } catch (error) {
      next(error);
    }
  };

 
  export const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const userId = req.params.userId;

        // Găsește postul
        const post = await Post.findById(postId);

        // Verifică dacă postul există
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Verifică dacă utilizatorul este creatorul postului sau un admin
        if (post.userId !== userId && !req.user.isAdmin) {
            return res.status(403).json({ message: 'You are not allowed to delete this post' });
        }

        // Șterge postul
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        next(error);
    }
};
/*
 export const deletePost = async (req, res, next) => {
    
    try {
      if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this post'));
      }
      await Post.findByIdAndDelete(req.params.postId);
      res.status(200).json('The post has been deleted');
    } catch (error) {
      next(error);
    }
  };

  */
export const updatePost = async (req, res, next) => {
  if(!req.user.isAdmin || req.user.id !=req.params.userId){
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
      $set: {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        image: req.body.image,
      }
    },{new:true});
      res.status(200).json(updatePost);
    } catch (error) {
      next(error);
    }
  };