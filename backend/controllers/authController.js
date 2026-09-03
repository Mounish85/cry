const User = require("../models/User");
const jwt = require('jsonwebtoken');

//Handle Errors
module.exports.handleErrors = (err) => {
  console.log(err.message, err.code);

  let errors = { email: '', password: '' };

  //handle errors from login post request
  if(err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }
  if(err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }   

  //duplicate error code
  if(err.code === 11000) {
    errors.email = 'That email is already registered';
  }

  if(err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
    }

    return errors;
}

//Function for token creation
const maxAge = 3 * 24 * 60 * 60; //3 days in seconds
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge
  });
}

//Signup method
module.exports.signup_post = async (req, res) => {
    const { name, email, password, role, ngoId } = req.body;

    try {
        const user = await User.create({
            name,
            email,
            password,
            role,
            ngoId
        });

        const token = createToken(user._id);

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                ngoId: user.ngoId
            }
        });

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

//Embed the static login method from the user model into the controller
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.profile_get = async (req, res) => {
  const user = await User.findById(req.userId).select('_id name email');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.status(200).json({ user: { id: user._id, name: user.name, email: user.email } });
};


//Logout
module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('http://localhost:5173/');
}
