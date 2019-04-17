import mongoose from 'mongoose'
import HTTPStatus from 'http-status'

import Comment from '../comments/comment.model'
import Replylv1 from './replylv1.model'
import Replylv2 from './replylv2.model'
import Replylv3 from './replylv3.model'

const createReplyLv1 = (replyId, postId, commentId, username, email, reply) => new Promise((resolve, reject) => {
    Replylv1.create({ _id: replyId, postId: postId, commentId: commentId, username: username, email: email, reply: reply}, (err, result) => {
        if (err) reject(err)
        else resolve(result)
    })
})  

const appendIdReplylv1 = (commentId, replyId) => new Promise((resolve, reject) => {
    Comment.findOneAndUpdate({ _id: commentId }, { $push: { replylv1 : replyId } }, (err, result) => {
        if (err) reject(err)
        else resolve(result)
    })
})

const createReplyLv2 = (replyId, postId, commentId, replylv1, username, email, reply) => new Promise((resolve, reject) => {
    Replylv2.create({ _id: replyId, postId: postId, commentId: commentId, replylv1: replylv1, username: username, email: email, reply: reply}, (err, result) => {
        if (err) reject(err)
        else resolve(result)
    })
})

const appendIdReplylv2 = (replylv1, replyId) => new Promise((resolve, reject) => {
    Replylv1.findOneAndUpdate({ _id: replylv1 }, { $push: { replylv2 : replyId } }, (err, result) => {
        if (err) reject(err)
        else resolve(result)
    })
})

const createReplyLv3 = (replyId, postId, commentId, replylv1, replylv2, username, email, reply) => new Promise((resolve, reject) => {
    Replylv3.create({ _id: replyId, postId: postId, commentId: commentId, replylv1: replylv1, replylv2: replylv2, username: username, email: email, reply: reply}, (err, result) => {
        if (err) reject(err)
        else resolve(result)
    })
})

const appendIdReplylv3 = (replylv2, replyId) => new Promise((resolve, reject) => {
    Replylv2.findOneAndUpdate({ _id: replylv2 }, { $push: { replylv3 : replyId } }, (err, result) => {
        if (err) reject(err)
        else resolve(result)
    })
})

export async function replyComment(req, res) {
    const replyId = mongoose.Types.ObjectId()
    const { postId, commentId, replylv1, replylv2, username, email, reply } = req.body.reply
    try {
        if (commentId && replylv1 && replylv2) {
            const rply = await Promise.all([
                createReplyLv3( replyId, postId, commentId, replylv1, replylv2, username, email, reply),
                appendIdReplylv3(replylv2, replyId)
            ]).then(result => result[0])

            return res.status(HTTPStatus.CREATED).json({ rply })
        } else if (commentId && replylv1) {
            const rply = await Promise.all([
                createReplyLv2( replyId, postId, commentId, replylv1, username, email, reply),
                appendIdReplylv2(replylv1, replyId)
            ]).then(result => result[0])

            return res.status(HTTPStatus.CREATED).json({ rply })
        } else {
            // console.log('this is the else block')
            const rply = await Promise.all([
                createReplyLv1( replyId, postId, commentId, username, email, reply),
                appendIdReplylv1(commentId, replyId)
            ]).then(result => result[0])

            return res.status(HTTPStatus.CREATED).json({ rply })
        }

    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json(error);
    }
}