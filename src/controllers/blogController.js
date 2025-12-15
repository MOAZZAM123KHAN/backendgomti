// const Blog = require('../models/Blog');

// exports.getPublicBlogs = async (req, res, next) => {
//   try {
//     const {
//       category = '',
//       page = 1,
//       limit = 10,
//       search = ''
//     } = req.query;

//     const query = { isPublished: true };

//     if (category) {
//       query.category = { $regex: category, $options: 'i' };
//     }

//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { titleEnglish: { $regex: search, $options: 'i' } },
//         { content: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const [blogs, total] = await Promise.all([
//       Blog.find(query)
//         .select('-__v')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Blog.countDocuments(query)
//     ]);

//     res.status(200).json({
//       success: true,
//       data: blogs,
//       pagination: {
//         total,
//         page: parseInt(page),
//         limit: parseInt(limit),
//         pages: Math.ceil(total / parseInt(limit))
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.getPublicBlogById = async (req, res, next) => {
//   try {
//     const blog = await Blog.findById(req.params.id);

//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: 'Blog not found'
//       });
//     }

//     if (!blog.isPublished) {
//       return res.status(404).json({
//         success: false,
//         message: 'Blog not found'
//       });
//     }

//     blog.views += 1;
//     await blog.save();

//     res.status(200).json({
//       success: true,
//       data: blog
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.getAllBlogsAdmin = async (req, res, next) => {
//   try {
//     const {
//       category = '',
//       page = 1,
//       limit = 20,
//       search = '',
//       isPublished
//     } = req.query;

//     const query = {};

//     if (category) {
//       query.category = { $regex: category, $options: 'i' };
//     }

//     if (isPublished !== undefined) {
//       query.isPublished = isPublished === 'true';
//     }

//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { titleEnglish: { $regex: search, $options: 'i' } },
//         { content: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const [blogs, total] = await Promise.all([
//       Blog.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Blog.countDocuments(query)
//     ]);

//     res.status(200).json({
//       success: true,
//       data: blogs,
//       pagination: {
//         total,
//         page: parseInt(page),
//         limit: parseInt(limit),
//         pages: Math.ceil(total / parseInt(limit))
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.getBlogByIdAdmin = async (req, res, next) => {
//   try {
//     const blog = await Blog.findById(req.params.id);

//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: 'Blog not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: blog
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.createBlog = async (req, res, next) => {
//   try {
//     const {
//       title,
//       titleEnglish,
//       content,
//       excerpt,
//       category,
//       readTime,
//       isPublished
//     } = req.body;

//     const blog = await Blog.create({
//       title,
//       titleEnglish,
//       content,
//       excerpt,
//       category,
//       readTime,
//       isPublished
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Blog created successfully',
//       data: blog
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.updateBlog = async (req, res, next) => {
//   try {
//     const allowedUpdates = [
//       'title', 'titleEnglish', 'content', 'excerpt',
//       'category', 'readTime', 'isPublished'
//     ];

//     const updates = {};
//     Object.keys(req.body).forEach(key => {
//       if (allowedUpdates.includes(key)) {
//         updates[key] = req.body[key];
//       }
//     });

//     const blog = await Blog.findByIdAndUpdate(
//       req.params.id,
//       updates,
//       { new: true, runValidators: true }
//     );

//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: 'Blog not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Blog updated successfully',
//       data: blog
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.deleteBlog = async (req, res, next) => {
//   try {
//     const blog = await Blog.findByIdAndDelete(req.params.id);

//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: 'Blog not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Blog deleted successfully'
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.getCategories = async (req, res, next) => {
//   try {
//     const categories = await Blog.distinct('category', { isPublished: true });

//     res.status(200).json({
//       success: true,
//       data: categories.filter(cat => cat)
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const Blog = require('../models/Blog');

/**
 * ===============================
 * PUBLIC CONTROLLERS
 * ===============================
 */

/**
 * GET /api/blogs
 * Public blogs with pagination, category & search
 */
exports.getPublicBlogs = async (req, res, next) => {
  try {
    const {
      category = '',
      page = 1,
      limit = 10,
      search = ''
    } = req.query;

    const query = { isPublished: true };

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { titleHindi: { $regex: search, $options: 'i' } },
        { titleEnglish: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Blog.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/blogs/:id
 * Public single blog (views increment)
 */
exports.getPublicBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
      isPublished: true
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ===============================
 * ADMIN CONTROLLERS
 * ===============================
 */

/**
 * GET /admin/blogs
 * Admin list with filters
 */
exports.getAllBlogsAdmin = async (req, res, next) => {
  try {
    const {
      category = '',
      page = 1,
      limit = 20,
      search = '',
      isPublished
    } = req.query;

    const query = {};

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (isPublished !== undefined) {
      query.isPublished = isPublished === 'true';
    }

    if (search) {
      query.$or = [
        { titleHindi: { $regex: search, $options: 'i' } },
        { titleEnglish: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Blog.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /admin/blogs/:id
 * Admin single blog
 */
exports.getBlogByIdAdmin = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /admin/blogs
 * Create blog
 */
exports.createBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /admin/blogs/:id
 * Update blog
 */
exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /admin/blogs/:id
 */
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/blogs/categories
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Blog.distinct('category', {
      isPublished: true
    });

    res.status(200).json({
      success: true,
      data: categories.filter(Boolean)
    });
  } catch (error) {
    next(error);
  }
};
