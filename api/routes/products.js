const router = require('express').Router();
const db = require('../models');
const auth = require("../middleware/auth");
const multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);  
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.jpg' || ext !== '.png') {
            return  cb(res.status(400).end("only jpg, png are allowed"), false);
        }
        cb(null, true);
    }
   
});

var upload = multer({ storage: storage }).single('file')

//@Title -> Retrive All Products  from the DB 
//@Method -> POST
//@End-point -> /api/product/getProducts
router.post('/getProducts', auth, async(req, res, next) => {

    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);

    let term = req.body.searchTerm;

    try {
        if(term) {
            const regex = new RegExp(escapeRegex(term), 'gi');
            db.Product.find({productName: regex})
            // .find({ $text: { $search: term } })
            .populate("creator", {
                name: true,
                email: true,
                role: true
            })
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if(err) {
                    return res.status(404).json({
                        success: false,
                        message: "Sorry no product founds",
                        error: err
                    });
                }
                return res.status(200).json({
                    success: true,
                    products: products,
                    postSize: products.length
                })
            });
        } else {
            db.Product.find()
            .populate("creator", {
                name: true,
                email: true,
                role: true
            })
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if(err) {
                    return res.status(404).json({
                        success: false,
                        message: "Sorry no product found"
                    });
                }
                return res.status(200).json({
                    success: true,
                    products: products,
                    postSize: products.length
                })
            });
        }
       
    } catch (err) {
        return next(err);
    }
});

//@Title -> Retrive a spacific product from the DB
//@Method -> GET
//@End-point -> /api/product/:productId
// router.get('/:productId', async(req, res, next) => {
//     try {
//         db.Product.findById(req.params.productId, (err, product) => {
//             if(err) {
//                 return res.status(404).json({
//                     success: false,
//                     error: err
//                 });
//             }
//             return res.status(200).json({
//                 success: true,
//                 product: product,
//             })
//           });
//     } catch (err) {
//         return next(err)
//     }
// });

router.get("/productId", (req, res) => {
    let type = req.query.type
    let productIds = req.query.id

    if (type === "array") {
        let ids = req.query.id.split(',');
        productIds = [];
        productIds = ids.map(item => {
            return item
        })
    }

    //we need to find the product information that belong to product Id 
    db.Product.find({ '_id': { $in: productIds } })
    .populate('creator')
    .exec((err, product) => {
        if(err) return req.status(400).send(err)
        return res.status(200).send(product)
    })
});

//@Title -> UploadImage
//@Method -> POST
//@End-point -> /api/product/uploadImg
router.post('/uploadImg', (req, res, next) => {
    upload(req, res, err => {
        // console.log(res.req.file.path);
        if(err) return res.status(404).json({ success: false, err });
        return res.status(200).json({ success: true, images: res.req.file.path, fileName: res.req.file.filename})
    });
});

//@Title -> Create a new product and save it to MongoDB 
//@Method -> POST
//@End-point -> /api/product/addProduct
router.post('/addProduct', auth, async(req, res, next) => {
   try {
       const products = new db.Product(req.body);
       const savedProduct = await products.save();
       if(!savedProduct) {
        return res.status(404).json({
            success: false,
            message: "Product Not Saved"
        });
       }
       return res.status(200).json({
           success: true,
           products: products
       })
   } catch (err) {
       return next(err)
   }
});

//@Title -> Update a spacific product from the DB 
//@Method -> PUT
//@End-point -> /api/product/:productId
router.put('/:productId', (req, res) => {
    res.json({
        Message: "Products routes"
    });
});

//T@itle -> Delete a spacific product 
//@Method -> DELELTE
//@End-point -> /api/product/:productId
router.delete('/:productId', (req, res) => {
    res.json({
        Message: "Products routes"
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };
  

module.exports = router