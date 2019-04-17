import mongoose, { Schema } from 'mongoose'

const Replylv1Schema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: 'Replylv1'
    },
    replylv2: [{
        type: Schema.Types.ObjectId,
        ref: 'Replylv2'
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
    reply: {
        type: String,
        trim: true,
        required: [true, 'Comment is required!'],
    },
    isReply: {
        type: Boolean,
        default: false,
    }
},
{ 
    timestamps: true 
})

Replylv1Schema.methods = {
    toJSON() {
        return {
            _id: this._id,
            postId: this.postId,
            commentId: this.commentId,
            replylv2: this.replylv2,
            username: this.username,
            email: this.email,
            reply: this.reply,
            isReply: this.isReply
        }
    }
}

export default mongoose.model('Replylv1', Replylv1Schema)