const router = require("express").Router()
const { Entity } = require("../models/entity")
const { User } = require("../models/user")
const { validate } = require("../models/entity")
const { validateUser } = require("../models/user")

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error)
            return res.status(400).send({ message: error.details[0].message })
        const newEntity = new Entity({ ...req.body });
        await newEntity.save()
        res.status(201).send({ data: newEntity, message: "Entity created successfully" })
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    }
})

router.get("/", async (req, res) => {
    Entity.find().exec()
        .then(async () => {
            const entities = await Entity.find();
            res.status(200).send({ data: entities, message: "Lista potworów" });
        })
        .catch(error => {
            res.status(500).send({ message: error.message });
        });
})

router.put("/:entityId", async (req, res) => {
    try {
        const { entityId } = req.params;
        const { x, y, alive } = req.body;
        console.log(entityId, x, y, alive)
        if(!entityId || !x || !y) {
            return res.status(400).send({ message: "Bad Request" });
        }
        const entity = await Entity.findByIdAndUpdate(entityId, { x, y, alive }, { new: true });
        if(!entity) {
            return res.status(404).send({ message: "Entity not found" });
        }
        res.status(200).send({ data: entity, message: "Entity updated successfully" });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router