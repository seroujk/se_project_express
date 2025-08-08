const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");

module.exports.authorize = (req,res,next) =>{
  const {authorization} = req.headers;

  if(!authorization){
    return res.status(401).send({message : "Authorization Required"});
  }

  const token = authorization.replace("Bearer ","");
  let payload;
  try {
    payload = jwt.verify(token,JWT_SECRET);
  } catch (error) {
      return res.status(401).send({message: "Unauthorized"});
  }

  req.user = payload;
  next();
}
