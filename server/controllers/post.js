const PostData = require("../models/post");
const jwt = require('jsonwebtoken');

class postController {
    static async createPost(req, res) {
        const newpost = new PostData(req.body);
        await newpost.save();
        return res.status(201).json(newpost);
    }
    static async getPost(req, res) {
        const post = await PostData.findById(req.params.id);
        return res.status(201).json(post);
    }
    static async deletePost(req, res) {
        const post = await PostData.findById(req.params.id);
        if (post.username === req.body.username) {
            await post.delete();
            return res.status(201).json('post is deleted');
        }

        return res.status(401).json("you can delete your posts only");

    }

    static async updatePost(req, res) {
        const post = await PostData.findById(req.params.id);
        if (post.username === req.body.username) {
            const updated = await PostData.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body
                },
                { new: true }
            );
            return res.status(201).json(updated);
        }

        return res.status(401).json("you can update your posts only");
    }

    static async all(req, res) {
        const username = req.query.user;
        const catname = req.query.cat;
        let posts;
        if (username) {
            posts = await PostData.find({ username });
        } else if (catname) {
            posts = await PostData.find({
                categories: {
                    $in: [catname],
                },
            })
        } else {
            posts = await PostData.find();
        }

        return res.status(201).json(posts);
    }
}
module.exports = postController;