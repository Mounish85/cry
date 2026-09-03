const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { isEmail } = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true
    },

    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },

    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },

    role: {
        type: String,
        enum: ['FRONTLINER', 'PARTNER_NGO'],
        required: true
    },

    ngoId: {
        type: Schema.Types.ObjectId,
        ref: 'NGO'
    }

});

//Hashing passwords using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
});


//static method to login user
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email });
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}


const User = mongoose.model('User',userSchema);

module.exports = User;