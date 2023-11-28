const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const Joi = require("joi")
const passwordComplexity = require("joi-password-complexity")
const userSchema = new mongoose.Schema({
    nick: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true},
    lvl: { type: Number, required: true},
    online: { type: Boolean, required: true, default: false },
    email: { type: String, required: true },
    password: { type: String, required: false },
}, { collection: "users" })
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    })
    return token
}
const User = mongoose.model("User", userSchema)
const validate = (data) => {
    const complexityOptions = {
        min: 8,
        max: 50,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
    };

    const schema = Joi.object({
        nick: Joi.string().required(),
        x: Joi.number().required(),
        y: Joi.number().required(),
        lvl: Joi.number().required(),
        online: Joi.boolean().required(),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity(complexityOptions).optional().label("Password"),
    })
    return schema.validate(data)
}
module.exports = { User, validate }