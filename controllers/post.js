const Post = require('../models/post');
const formidable = require('formidable');
const _ = require('lodash');

const fs = require('fs');


exports.createPost = (req,res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req,(err, fields ,files)=>{
		if(err){
			res.status(400).json({
				error : "Image could not be uploaded"
			});
		}
		let post = new Post(fields);
		post.postedBy = req.requestSender;

		//handle files
		if(files.photo){
			post.photo.data = fs.readFileSync(files.photo.path)
			post.photo.contentType = files.photo.type
		}

		post.save((err,result)=>{
			if(err){
				res.status(400).json({
					error : err 
				})
			}
			res.json(result);
		});

	})

};

exports.getPosts = (req,res) => {
	const allPosts = Post.find().select("_id title body")
	.then(allPosts => res.status(200).send({"posts":allPosts}))
	.catch(error=>res.status(500).send({"error":error}));

}

exports.getPostsByRequestingUser = (req,res) => {
	Post.find({postedBy: req.requestSender})
	.populate("postedBy","name")
	.sort("-created")
	.exec((err,posts)=>{
		if(err){
			return res.status(400).json({
				error:err
			})
		}
		res.json(posts);
	});
}

exports.getPostsByUser = (req,res,userId) => {
	var userId = req.params['userId'] ;
	Post.find({postedBy: userId})
	.populate("postedBy","name")
	.sort("-created")
	.exec((err,posts)=>{
		if(err){
			return res.status(400).json({
				error:err
			})
		}
		res.json(posts);
	});
}

exports.deletePost = (req,res) =>{
	let postId = req.params['postId'];
	Post.findById(postId).exec((err,post)=>{
		if(err || !post){
			res.status(400).json({
				error: "No post to delete!"
			});
		}
		post.remove();
		res.json({
			message: "Post deleted successfully"
		});
	});
}

exports.updatePost = (req,res) =>{
	let postId = req.params['postId'];
	Post.findById(postId).exec((err,post)=>{
		if(err || !post){
			res.status(400).json({
				error: "No post to delete!"
			});
		}
		post = _.extend(post,req.body);
		post.update = Date.now();
		post.save((err,post)=>{
			if(err){
				res.status(400).json({
					error: err
				});
			}
			res.json(post);
		});
    
    
    
	})
}

