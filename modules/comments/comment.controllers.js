import mongoose from 'mongoose'
import HTTPStatus from 'http-status'

import Comment from './comment.model'
import Post from '../posts/post.model'

const create = (commentId, postId, username, email, comment) => new Promise((resolve, reject) => {
    Comment.create({ _id: commentId, postId: postId, username: username, email: email, comment: comment}, (err, result) => {
        if (err) reject(err)
        else resolve(result)
    })
})

const appendCommentId = (postId, commentId) => new Promise((resolve, reject) => {
    Post.findByIdAndUpdate({ _id: postId }, { $push: { commentIds: commentId } }, (err, result) => {
        if (err) reject(err)
        else resolve(result)
    })
})

export async function createComment(req, res) {
    const postId = req.body.newComment.postId
    const commentId = mongoose.Types.ObjectId()
    const { username, email, comment } = req.body.newComment
    try {
        const cmt = await Promise.all([
            create(commentId, postId, username, email, comment),
            appendCommentId(postId, commentId)
        ]).then(result => result[0])

        return res.status(HTTPStatus.CREATED).json({ cmt })
    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(error);
    }
}