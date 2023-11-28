const mongoose = require("mongoose")
const Joi = require("joi")

const entitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true},
    lvl: { type: Number, required: true},
    alive: { type: Boolean, required: true, default: false },
    respawnTime: { type: Number, required: true },
    image: { type: String, required: true },
}, { collection: "entities" })
const Entity = mongoose.model("Entity", entitySchema)
const validate = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        x: Joi.number().required(),
        y: Joi.number().required(),
        lvl: Joi.number().required(),
        alive: Joi.boolean().required(),
        respawnTime: Joi.Number().required(),
        image: Joi.string().required()
    })
    return schema.validate(data)
}
module.exports = { Entity }

