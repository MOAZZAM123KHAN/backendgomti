// // const mongoose = require('mongoose');

// // const blogSchema = new mongoose.Schema({
// //   title: {
// //     type: String,
// //     required: [true, 'Blog title is required'],
// //     trim: true,
// //     minlength: [10, 'Title must be at least 10 characters long']
// //   },
// //   titleEnglish: {
// //     type: String,
// //     trim: true
// //   },
// //   content: {
// //     type: String,
// //     required: [true, 'Blog content is required'],
// //     minlength: [100, 'Content must be at least 100 characters long']
// //   },
// //   excerpt: {
// //     type: String,
// //     trim: true,
// //     maxlength: [500, 'Excerpt must be less than 500 characters']
// //   },
// //   category: {
// //     type: String,
// //     trim: true,
// //     default: 'General'
// //   },
// //   readTime: {
// //     type: String,
// //     trim: true
// //   },
// //   isPublished: {
// //     type: Boolean,
// //     default: true
// //   },
// //   views: {
// //     type: Number,
// //     default: 0,
// //     min: [0, 'Views cannot be negative']
// //   },
// //   createdAt: {
// //     type: Date,
// //     default: Date.now
// //   },
// //   updatedAt: {
// //     type: Date,
// //     default: Date.now
// //   }
// // });

// // blogSchema.pre('save', function(next) {
// //   this.updatedAt = Date.now();

// //   if (!this.excerpt && this.content) {
// //     this.excerpt = this.content.substring(0, 200) + '...';
// //   }

// //   if (!this.readTime && this.content) {
// //     const wordsPerMinute = 200;
// //     const wordCount = this.content.split(/\s+/).length;
// //     const minutes = Math.ceil(wordCount / wordsPerMinute);
// //     this.readTime = `${minutes} min read`;
// //   }

// //   next();
// // });

// // blogSchema.index({ category: 1, isPublished: 1 });
// // blogSchema.index({ createdAt: -1 });

// // module.exports = mongoose.model('Blog', blogSchema);

// const mongoose = require('mongoose');

// const blogSchema = new mongoose.Schema({
//   titleHindi: {
//     type: String,
//     trim: true,
//     minlength: [10, 'Hindi title must be at least 10 characters long']
//   },

//   titleEnglish: {
//     type: String,
//     trim: true,
//     minlength: [5, 'English title must be at least 5 characters long']
//   },

//   content: {
//     type: String,
//     required: [true, 'Blog content is required'],
//     minlength: [100, 'Content must be at least 100 characters long']
//   },

//   excerpt: {
//     type: String,
//     trim: true,
//     maxlength: [500, 'Excerpt must be less than 500 characters']
//   },

//   category: {
//     type: String,
//     trim: true,
//     default: 'General'
//   },

//   readTime: {
//     type: String,
//     trim: true
//   },

//   isPublished: {
//     type: Boolean,
//     default: false
//   },

//   views: {
//     type: Number,
//     default: 0,
//     min: [0, 'Views cannot be negative']
//   }
// }, {
//   timestamps: true
// });

// /**
//  * 🔐 Custom validation:
//  * At least one title (Hindi OR English) is required
//  */
// blogSchema.pre('validate', function (next) {
//   if (!this.titleHindi && !this.titleEnglish) {
//     this.invalidate(
//       'title',
//       'Either Hindi title or English title is required'
//     );
//   }
//   next();
// });

// /**
//  * 📝 Auto excerpt & read time
//  */
// blogSchema.pre('save', function (next) {
//   if (!this.excerpt && this.content) {
//     this.excerpt = this.content.substring(0, 200) + '...';
//   }

//   if (!this.readTime && this.content) {
//     const wordsPerMinute = 200;
//     const wordCount = this.content.split(/\s+/).length;
//     const minutes = Math.ceil(wordCount / wordsPerMinute);
//     this.readTime = `${minutes} min read`;
//   }

//   next();
// });

// blogSchema.index({ category: 1, isPublished: 1 });
// blogSchema.index({ createdAt: -1 });

// module.exports = mongoose.model('Blog', blogSchema);



const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema(
  {
    titleHindi: {
      type: String,
      trim: true,
      minlength: [10, 'Hindi title must be at least 10 characters long'],
    },

    titleEnglish: {
      type: String,
      trim: true,
      minlength: [5, 'English title must be at least 5 characters long'],
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    content: {
      type: String,
      required: [true, 'Blog content is required'],
      minlength: [100, 'Content must be at least 100 characters long'],
    },

    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, 'Excerpt must be less than 500 characters'],
    },

    category: {
      type: String,
      trim: true,
      default: 'General',
    },

    readTime: {
      type: String,
      trim: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
      min: [0, 'Views cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * 🔐 Validation: At least one title required
 */
blogSchema.pre('validate', function (next) {
  if (!this.titleHindi && !this.titleEnglish) {
    this.invalidate(
      'title',
      'Either Hindi title or English title is required'
    );
  }
  next();
});

/**
 * 🔗 SLUG AUTO-GENERATION (🔥 FIXES YOUR 409 ERROR)
 */
blogSchema.pre('save', async function (next) {
  if (!this.slug) {
    const sourceTitle = this.titleHindi || this.titleEnglish;

    if (!sourceTitle) return next();

    const baseSlug = slugify(sourceTitle, {
      lower: true,
      strict: true,
      trim: true,
    });

    let slug = baseSlug;
    let count = 1;

    while (await mongoose.models.Blog.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    this.slug = slug;
  }

  next();
});

/**
 * 📝 Auto excerpt & read time
 */
blogSchema.pre('save', function (next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 200) + '...';
  }

  if (!this.readTime && this.content) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    this.readTime = `${minutes} min read`;
  }

  next();
});

/**
 * 📊 Indexes
 */
blogSchema.index({ category: 1, isPublished: 1 });
blogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);
