import mongoose, { Schema } from 'mongoose';
import slug from 'slug';
import uniqueValidator from 'mongoose-unique-validator';

const PostSchema = new Schema(
  {
    imageUrl: {
      type: String
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Title is required!'],
      minlength: [3, 'Title need to be longer!'],
      unique: true,
    },
    category: {
      type: String,
      trim: true,
      required: true
    },
    text: {
      type: String,
      trim: true,
      required: [true, 'Text is required!'],
      minlength: [10, 'Text need to be longer!'],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    commentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],
    isComment: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true },
);

PostSchema.plugin(uniqueValidator, {
  message: '{VALUE} already taken!',
});

PostSchema.pre('validate', function (next) {
  this._slugify();

  next();
});

PostSchema.methods = {
  _slugify() {
    this.slug = slug(this.title);
  },
  toJSON() {
    return {
      _id: this._id,
      imageUrl: this.imageUrl,
      title: this.title,
      category: this.category,
      text: this.text,
      createdAt: this.createdAt,
      slug: this.slug,
      admin: this.user,
      favoriteCount: this.favoriteCount,
      updatedAt: this.updatedAt,
      isComment: this.isComment,
      comments: this.commentIds
    };
  },
};

PostSchema.statics = {
  createPost(args, user) {
    return this.create({
      ...args,
      user,
    });
  },
  list({ skip = 0, limit = 5 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('admin');
  },

  findByIdAndPopulate(postId) {
    return this.findById(postId).populate('commentIds')
  },

  incFavoriteCount(postId) {
    return this.findByIdAndUpdate(postId, { $inc: { favoriteCount: 1 } });
  },

  decFavoriteCount(postId) {
    return this.findByIdAndUpdate(postId, { $inc: { favoriteCount: -1 } });
  }
};

export default mongoose.model('Post', PostSchema);
