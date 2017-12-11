const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const emailValidator = require('email-validator');
const chalk = require('chalk');

/* Schema */
const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    details: {
        firstName: String,
        lastName: String
    }
});

/* Validators */
userSchema.path('email').validate(email => emailValidator.validate(email), { message: '{VALUE} is not a valid e-mail address.' });

/* Class */
class UserClass {
    add(email, password) {
        return new Promise((resolve, reject) => {
            this.email = email;
            this.password = UserClass.hashPassword(password);
            console.log(chalk.blue(`Creating new user ${this.email} : ${this.password}`));
            this.save()
                .then(() => resolve({success: true}),
                    err => {
                        console.log(chalk.red(err));
                        reject({message: err.message, success: false});
                    });
        });
    }
    validPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
    static hashPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    }

}

userSchema.loadClass(UserClass);

module.exports = mongoose.model('User', userSchema);
