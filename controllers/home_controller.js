const Post = require('../models/post');
const User = require('../models/user');
module.exports.home = async function (req, res) {
    // console.log(req.cookies);
    // res.cookie('user_id', 25);
    // Post.find({}, function(err, post){
    //     return res.render('home', {
    //         title : "Codeial | Home",
    //         posts : post
    //     });
    // });
    //populate the user of each post 
    try{
        //Change : populate the likes of each post and comment
        let post = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate : {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('likes');
        let users = await User.find({});
        
        return res.render('home', {
            title : "Codeial | Home",
            posts : post,
            all_users : users
        });
    } catch(err) {
       console.log("Error", err);
       return;
    }
}