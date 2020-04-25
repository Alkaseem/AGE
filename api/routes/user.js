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
        cart: req.user.cart,
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

router.post("/addToCart", auth, async(req, res, next) => {
    try {
        db.User.findById(req.user._id, (err, userInfo) => {
            let duplicate = false;
            userInfo.cart.forEach((cartInfo) => {
                if(cartInfo.id === req.query.productId) {
                    duplicate = true
                }
            });
            if(duplicate) {
                db.User.findOneAndUpdate(
                    { _id: req.user._id, "cart.id": req.query.productId },
                    {$inc: { "cart.$.quantity": 1 } },
                    { new: true },
                    () => {
                        if (err) return res.json({ success: false, err });
                        return res.status(200).json(userInfo.cart);
                    }
                )
            } else {
                db.User.findOneAndUpdate(
                    { _id: req.user._id },
                    {
                        $push: {
                            cart: {
                                id: req.query.productId,
                                quantity: 1,
                                date: Date.now()
                            }
                        }
                    },
                    { new: true },
                    (err, userInfo) => {
                        if (err) return res.json({ success: false, err });
                        return res.status(200).json(userInfo.cart); 
                    }
                )
            }
        })
    } catch (err) {
        return next(err)
    }
});

router.get('/removeFromCart', auth, async(req, res, next) => {
    try {
        db.User.findOneAndUpdate(
            { _id: req.user._id },
            {
                "$pull":
                    { "cart": { "id": req.query._id } }
            },
            { new: true },
            (err, userInfo) => {
                let cart = userInfo.cart;
                let array = cart.map(item => {
                    return item.id
                })
    
                db.Product.find({ '_id': { $in: array } })
                    .populate('creator')
                    .exec((err, cartDetail) => {
                        return res.status(200).json({
                            cartDetail,
                            cart
                        })
                    })
            }
        )
    } catch (err) {
        return next(err)
    }
});

router.get('/userCartInfo', auth, async(req, res, next) => {
    try {
        db.User.findOne(
            { _id: req.user._id },
            (err, userInfo) => {
                let cart = userInfo.cart;
                let array = cart.map(item => {
                    return item.id
                })
    
                db.Product.find({ '_id': { $in: array } })
                    .populate('creator')
                    .exec((err, cartDetail) => {
                        if (err) return res.status(400).send(err);
                        return res.status(200).json({ success: true, cartDetail, cart })
                    })
    
            }
        )
    } catch (err) {
        return next(err)
    }
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