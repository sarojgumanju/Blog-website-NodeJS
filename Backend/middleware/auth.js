
const { verifyJWT } = require("../utils/generateToken");

const verifyUser = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if(!token)
        return res.status(401).json({ success: false, message: "Please sign in."});

    try {
        let user = await verifyJWT(token);
        if(!user) {
            return res
                .status(400)
                .json({success: false, message: "Please sign in."});
        }
        req.user = user.id;
        next();
    } catch (error) {
        return res.status(403).json({message: "invalid token"});
    }
};



module.exports = verifyUser;
