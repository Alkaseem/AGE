const router = require('express').Router();
const  db = require("../models");
const auth = require("../middleware/auth");

router.get('/', auth, async (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
    });
});

//Register route
router.post('/register', async (req, res) => {
    const user = new db.User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true,
            data: doc
        });
    });
});

//Login routes
router.post('/login', async (req, res) => {
    db.User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true,
                        userId: user._id,
                        token: user.token,
                        tokenExp: user.tokenExp
                    });
            });
        });
    });
});

//logout routes
router.get('/logout', auth, (req, res) => {
    db.User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true,
            message: "Successfuly Log You Out"
        });
    });
});

module.exports = router;