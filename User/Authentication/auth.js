const jwt = require("jsonwebtoken");
const config = require("../controllers/config.json");
const crypto = require("crypto");

exports.verifyRefreshBodyField = (req, res, next) => {
  console.log("checking vlaid body");
  if (req.body && req.body.refresh_token) {
    return next();
  } else {
    return res.status(400).send({ error: "need to pass refresh_token field" });
  }
};

exports.validRefreshNeeded = (req, res, next) => {
  // let b = new Buffer(req.body.refresh_token, 'base64');
  // let refresh_token = b.toString();

  let refresh_token = req.body.refresh_token;
  const token = jwt.sign({ refresh_token }, config.refreshTokenSecret, {
    expiresIn: config.tokenLife,
  });

  res.send({ token: token });
};

exports.validJWTNeeded = (req, res, next) => {
  //const header = req.headers["Authorization"];
  const header = req.headers.authorization;
  const authorization = header.split(' ')[1];
  if (authorization) {
    console.log(authorization);
    try {
        jwt.verify(authorization, config.ACCESS_TOKEN_SECRET, (payload)=>{
        console.log("HELOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO !", payload);
        req.user = payload
        next();
      });

    } catch (err) {
      console.log("CATCHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH !", err);
      return res.status(403).send(err);
    }
  } else {
    console.log("ELSEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE !");
    return res.status(401).send("No Token Provided");
  }
};

// const authenticate = (req, res, next) =>{
//     try{

//         const token = req.header.authorization.split(' ')[1]
//         const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
//         if(decode)
//         {
//             next()
//         }
//         //throw exception if not verified token
//     }
//     catch(error){
//         res.json({
//             message:'Authentication Failed !'
//         })

//     }
// }

// module.exports = authenticate
