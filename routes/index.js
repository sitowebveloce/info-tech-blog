const express = require("express");
const Post = require("../models/post");
const User = require("../models/user");
const fs = require('fs');
const router = express.Router();
let msg = '';
const multer = require('multer');
const path = require('path');

// USER TOKEN TO PROTECT ROUTES
const { isLogged } = require('../middleware/isLogged');

//************** SET STORAGE ENGINE */
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, callback) {
        // The first callback value is the error, set to null
        // the second val is the input fiel name
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// Init Upload var
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    }, // 1mb
    fileFilter: function(req, file, callback) {

        // file types
        const filetypes = /jpeg|jpg|png|gif/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase())
            // Check mime type
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return callback(null, true);
        } else {
            callback('Error: Images only.')
        }

    }
}).single('upload'); // ckeditor exspect field name 'upload'  

//*** HOME REACT */
router.get("/", (req, res) => {
    // Response with the dir path and the name of the file html 
    res.sendFile(path.join(__dirname, '../reactApp/build1', 'index.html'));
});

//************* GET ROUTE INDEX HOME */
router.get("/v1/api", async(req, res) => {
    // if(res.locals.user !==){}else{}
    let page = parseInt(req.query.page, 10) || 1; // parse numb base 10
    let limit = parseInt(req.query.limit, 10) || 4; // parse numb base 10
    // Value to skip, to not return, first page 0, second page 10, then 20 etc
    // The logic is to have only 10 result and skip the other values! 
    let skip = (page - 1) * limit;
    let endIndex = page * limit;
    const total = await Post.countDocuments();
    // console.log(page)
    // console.log(skip)
    // console.log(limit)
    // console.log(endIndex)
    // console.log(total)
    // Find
    let myQuery = Post.find({}).populate({
        path: 'user'
            //     ,select: 'name description'
    });

    myQuery.sort('-createdAt').skip(skip).limit(limit)
        // Await response
    let posts = await myQuery;
    // console.log(posts)
    // Pagination
    let pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit: limit
        }
    }
    if (skip > 0) {
        pagination.prev = {
            page: page - 1,
            limit: limit
        }
    }
    // RETURN
    return res.status(200).json({
        success: true,
        count: posts.length,
        pagination,
        msg: 'Wellcome',
        file: '',
        posts: posts
    });

    //*************** OLD BABY QUERY */
    // await Post.find({}, (err, posts) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     // console.log(posts);

    //     let sortPosts = posts.map(item => {
    //       return item
    //     })
    //       .sort((a, b) => {
    //         if (b.createdAt > a.createdAt) {
    //           return 1;
    //         }
    //         if (b.createdAt < a.createdAt) {
    //           return -1;
    //         }
    //         return 0;
    //       })

    //     // console.log(sortPosts);
    //     return res.status(200).json({
    //       posts: sortPosts,
    //       msg: 'Welcome',
    //       file: ''
    //     });
    //   }
    // });

});

//***************** SEARCH POST ROUTE */
router.post('/searchinfo', async(req, res) => {
    // console.log(req.body.search)
    let search = req.body.search;
    let myQuery = Post.find({}).populate('user');
    myQuery.sort('-createdAt');
    // Await response
    let found = await myQuery;
    // console.log(found)


    if (search !== undefined && search.length > 0) {

        let match = found.filter(value => {
            let rgx = new RegExp(`^${search}`, 'gi');
            // console.log(value.slug)
            if (value.slug && value.text !== undefined) {
                // console.log(value.slug)
                return value.slug.match(rgx) || value.text.match(rgx);
            }
        });

        // Response
        if (match.length > 0) {
            return res.status(200).json({
                success: true,
                count: match.length,
                posts: match,
                file: ''
            });
        } else {
            res.status(200).json({
                success: false,
                count: match.length,
                posts: [{
                    _id: '0101010101010101010101',
                    user: { fname: '@lex' },
                    title: 'Not Found',
                    text: `<p>Not found...</p><figure class='image'><img src='${process.env.SERVER}/uploads/upload-1583491121972.jpg' alt='oki'></figure>`,
                    importance: 'low',
                    createdAt: '1313-13-13T13:13:13.130+00:00'
                }],
                file: ''
            });
        }

    } else {
        // If search input field is empty, response array empty
        res.status(200).json({
            success: false,
            count: 0,
            posts: [{
                _id: '0101010101010101010101',
                user: { fname: '@lex' },
                title: 'Not Found',
                text: `<p>Not found...</p><figure class='image'><img src='${process.env.SERVER}/uploads/upload-1583491121972.jpg' alt='oki'></figure>`,
                importance: 'low',
                createdAt: '1313-13-13T13:13:13.130+00:00'
            }],
            file: ''
        });
    }


    //************** OLD BABY SCHOOL */
    // Post.find({
    //   // slug: search
    // }, (err, found) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     // console.log(found);
    //     // Filter
    //     if (search !== undefined) {

    //       let match = found.filter(value => {
    //         let rgx = new RegExp(`^${search}`, 'gi');
    //         // console.log(value.slug)
    //         if (value.slug && value.text !== undefined) {
    //           // console.log(value.slug)
    //           return value.slug.match(rgx) || value.text.match(rgx);
    //         }
    //       });


    //       // console.log(match);

    //       // Render
    //       if (match !== undefined) {
    //         return res.status(200).json({
    //           posts: match,
    //           file: ''
    //         });
    //       } else {
    //         res.status(400).json({
    //           posts: [],
    //           file: ''
    //         });
    //       }

    //     };

    //   };
    // });
});


//************** CREATE POST ROUTE */
router.post('/infopost', isLogged, async(req, res) => {
    // Extract id from cookie token and find the user

    if (req.user !== undefined) {
        // console.log(req.user)
        let id = req.user._id;
        let user = await User.findById(id);
        if (user.role == 'publisher' || user.role == 'admin') {
            // console.log(req.body)
            let title = req.body.title;
            let slug = req.body.title.toLowerCase()
            let text = req.body.text;
            let importance = req.body.importance;

            // Create the object to save inside the DB
            // Return if text field is empty
            // console.log(text.length)
            // console.log(text)
            if (text.length <= 11) {
                msg = 'Add some text.'
                return res.status(400).json({
                    success: false,
                    message: msg
                });
            }

            let infoObj = {
                title: title,
                slug: slug,
                text: text,
                importance: importance,
                user: id
            };

            // SAVE IN THE DATABASE
            Post.create(infoObj, (err, post) => {
                if (err) {
                    console.log(err)
                } else {
                    // console.log(post);
                    // REDIRECT
                    // res.status(200).json({
                    //   success: true,
                    //   data: req.body
                    // });

                    msg = 'Post created.'
                    return res.status(200).json({
                        success: true,
                        message: msg
                    });

                }
            });

        } else {
            // Response not authorized
            msg = 'Not authorized.'
            return res.status(401).json({
                success: false,
                message: msg
            })
        }
    } else {
        // Response not authorized
        msg = 'Signup or Login first.'
        return res.status(400).json({
            success: false,
            message: msg
        })
    }

});

//************************* SECRET RETURN PASSWORD */
// router.get('/secretrouteapi', (req, res) => {
//   // res.send(`${process.env.PASS}`);
//   res.status(200).json({
//     success: true,
//     data: `${process.env.PASS}`
//   });
// });

//******************* UPDATE POST ROUTE */
router.post('/updatepost', isLogged, async(req, res) => {
    //*** Only the admin can update
    // Check logged user
    if (req.user !== undefined) {
        // console.log(req.user)
        // Extract id logged in user from cookie
        let userId = req.user._id;
        // Find user
        let user = await User.findById(userId);

        // Id and text to update
        let text = req.body.updatePost.dataUpdate;
        let postId = req.body.id
            // Find post to update
        let postToUpdate = await Post.findById(postId);
        // Check user role permissions and user owner
        // Only the owner and admins can update posts
        // console.log(user.role);
        // console.log(postToUpdate.user.toString())
        if (user.role == 'admin' || postToUpdate.user.toString() == userId) {
            postToUpdate.text = text;
            await postToUpdate.save();
            // OR YOU CAN UPDATE SO
            // postToUpdate = Post.findByIdAndUpdate(postId, {text: text},{new:true});

            // RETURN
            msg = 'Post updated.'
            return res.status(200).json({
                success: true,
                message: msg
            });

        } else {
            // Response not authorized
            msg = 'Not authorized.'
            return res.status(401).json({
                success: false,
                message: msg
            });
        }
    } else {
        // Response not authorized
        msg = 'Signup or Login first.'
        return res.status(400).json({
            success: false,
            message: msg
        });
    }
});


//************************* DELETE POST ROUTE */
//*** Only admin can delete

router.post('/deletepost/:id', isLogged, async(req, res) => {
    // Check user permissions
    if (req.user !== undefined) {
        // console.log(req.user)
        // Extract id from cookie
        let userId = req.user._id;
        // Find user privileges
        let user = await User.findById(userId);
        // Extract id
        let postId = req.params.id;
        // Find post by id
        let postToDelete = await Post.findById(postId);
        // console.log(postToDelete)
        // Check privileges if owner or admin
        if (user.role == 'admin' || postToDelete.user.toString() == userId) {
            // Remove post
            let postDeleted = await Post.findByIdAndRemove(postId);
            if (postDeleted) {
                // Return
                msg = `Deleted`;
                return res.status(200).json({
                    success: true,
                    message: msg
                });
            }
            // Return
            msg = `Delete error`;
            return res.status(400).json({
                success: false,
                message: msg
            });

        } else {
            // Response not authorized
            msg = 'Not authorized.'
            return res.status(401).json({
                success: false,
                message: msg
            })
        }
    } else {
        // Response not authorized
        msg = 'Signup or Login first.'
        return res.status(400).json({
            success: false,
            message: msg
        })
    }

});

//************************ UPLOAD */
router.post('/uploads', isLogged, async(req, res) => {

    await upload(req, res, (err) => {
        let url = '';
        if (req.file !== undefined) {
            url = `${process.env.SERVER}/uploads/${req.file.filename}`;
        } else {
            url = `${process.env.SERVER}/uploads/not-found.jpg`;
        };

        if (err) {
            res.status(500).json({
                uploaded: false,
                error: {
                    message: err.message
                }
            });
        } else {
            res.status(200).json({
                uploaded: true,
                url: url
            });
        }

        // upload(req, res, (err) => {
        //   // console.log(err)
        //   //console.log(req.file)
        //   if (err) {
        //     res.render('index', {
        //       posts: [],
        //       msg: err,
        //       file: ''
        //     })
        //   } else if (req.file === undefined) {
        //     res.render('index', {
        //       posts: [],
        //       msg: 'Error: Choose a valid image file.',
        //       file: ''
        //     })
        //   } else {
        //     res.render('index', {
        //       posts: [],
        //       msg: `File ${req.file.filename} uploaded.`,
        //       file: `uploads/${req.file.filename}`
        //     })
        //   }

        // });
    });
});

// Export
module.exports = router;