import mongoose, { Schema } from 'mongoose'
import slug from 'slug';
import uniqueValidator from 'mongoose-unique-validator';

const CategorySchema = new Schema({
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
    },
    category: {
        type: String,
        trim: true,
        required: [true, 'Category is required!'],
        minlength: [3, 'Category needs to be longer!'],
        unique: true
    },
    slug: {
        type: String,
        trim: true,
        lowercase: true,
    },
},
    { timestamps: true })

CategorySchema.pre('validate', function (next) {
    this._slugify();

    next();
});

CategorySchema.methods = {
    _slugify() {
        this.slug = slug(this.category);
    },
    toJSON() {
        console.log(this);
        return {
            _id: this._id,
            category: this.category,
            slug: this.slug,
            admin: this.user,
        };
    },
};

CategorySchema.statics = {
    createCategory(args, admin) {
        console.log(args, admin);
        return this.create({
            ...args,
            admin,
        });
    },
    list({ skip = 0, limit = 5 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('admin');
    },
};

export default mongoose.model('Category', CategorySchema);