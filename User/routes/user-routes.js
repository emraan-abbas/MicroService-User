const express = require ("express");
const router = express.Router();
const jwthandler = require('../Authentication/auth')

const userController = require("../controllers/user-controller");
const user = require("../models/user-model");


router.post ('/register', userController.register);
router.post ('/login', userController.login);

router.post('/login/refresh' , [jwthandler.verifyRefreshBodyField , jwthandler.validRefreshNeeded , jwthandler.validJWTNeeded ]
            
, userController.login)


router.get("/check" , jwthandler.validJWTNeeded ,  (req,res) => {
    // all secured routes goes here
    console.log("Req.USER",req.user);
    res.send('I am secured...')
})


router.get("/api/auth/" , jwthandler.validJWTNeeded ,  (req,res) => {
    console.log("Req.USER",req.user);
    res.send('I am secured...')
})
module.exports = router;