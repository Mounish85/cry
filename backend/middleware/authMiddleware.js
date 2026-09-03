const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {

    const token = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : req.cookies.jwt;

    if (token) {

        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {

            if (err) {
                console.log(err.message);

                return res.status(401).json({
                    message: 'Your session has expired. Please log in again.'
                });
            }

            req.userId = decodedToken.id;

            next();
        });

    } else {

        return res.status(401).json({
            message: 'Authentication required.'
        });
    }
};

// Check current user
const checkUser = (req, res, next) => {

    const token = req.cookies.jwt;

    if (token) {

        jwt.verify(
            token,
            process.env.JWT_SECRET,
            async (err, decodedToken) => {

                if (err) {

                    console.log(err.message);
                    res.locals.user = null;
                    next();

                } else {

                    console.log(decodedToken);

                    const user = await User.findById(decodedToken.id);

                    res.locals.user = user;
                    next();
                }
            }
        );

    } else {

        res.locals.user = null;
        next();
    }
};


module.exports = {
    requireAuth,
    checkUser
};