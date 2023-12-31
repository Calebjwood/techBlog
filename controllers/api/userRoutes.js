const router = require("express").Router();
const { User } = require("../../models");

router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);

    res.status(201).json(userData);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
    }  
    );
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email} });

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.name = userData.name
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.post("/logout", (req, res) => {

    req.session.destroy(() => {
      res.status(204).end();})

});

module.exports = router;
