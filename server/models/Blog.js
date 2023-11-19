const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
    },
    title: {
        type: String,
        required: true,
        minlength: 4,
    },
    desc: {
        type: String,
        required: true,
        minlength: 10,
    },
    photo: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    views: {
        type: Number,
        default: 0,
    },
    likes: {
        type: [String],
        default: [],
    }
}, { timestamps: true });

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;
