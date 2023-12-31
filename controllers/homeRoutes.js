const router = require("express").Router();
const {User, Post, Comments} = require('../models')
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
   
    


    const posts = postData.map((post) => post.get({ plain: true }))

    res.render('homepage', {
        posts,
        logged_in: req.session.logged_in
    })
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/post/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [{model: Comments},],    
    });

    

    const post = postData.get({ plain: true })

    res.render('post', {
      ...post , 
      logged_in: true
    })
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/dashboard", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Post }],
    });


    const user = userData.get({ plain: true })

    res.render('dashboard', {
        ...user,
        logged_in: true
    })
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/newPost", withAuth, (req, res) => {
  res.render('newPost')
})

router.get('/editPost/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id)

    req.session.save(() => {
      req.session.post_id = postData.id
    })
    const post = postData.get({plain: true})

  res.render('editPost', {
    post,
    logged_in: true
  })
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

router.get('/sign-up', (req, res) => {

  res.render('signUp');
});


module.exports = router;
