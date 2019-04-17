import mongoose, { Schema } from 'mongoose'

const CommentSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    replylv1: [{
        type: Schema.Types.ObjectId,
        ref: 'Replylv1'
    }],
    username: {
        type: String,
        trim: true,
        required: [true, 'The username is requied!'],
        minlength: [3, 'Title need to be longer!'],
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        trim: true,
    },
    comment: {
        type: String,
        trim: true,
        required: [true, 'Comment is required!'],
    },
    isReply: {
        type: Boolean,
        default: false,
    }
},
    { timestamps: true })

CommentSchema.methods = {
    toJSON() {
        return {
            _id: this._id,
            postId: this.postId,
            replylv1: this.replylv1,
            username: this.username,
            email: this.email,
            comment: this.comment,
            isReply: this.isReply
        }
    }
}

export default mongoose.model('Comment', CommentSchema)