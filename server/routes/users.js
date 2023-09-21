const router = require("express").Router()
const { User, validate } = require("../models/user")
const bcrypt = require("bcrypt")

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body)
    if (error)
      return res.status(400).send({ message: error.details[0].message })
    const { password } = req.body
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" })
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT))
    const hashPassword = await bcrypt.hash(password, salt)
    const newUser = new User({ ...req.body, password: hashPassword });
    await newUser.save()
    res.status(201).send({ data: newUser, message: "User created successfully" })
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" })
  }
})

router.get("/", async (req, res) => {
  User.find().exec()
    .then(async () => {
      const users = await User.find();
      res.status(200).send({ data: users, message: "Lista użytkowników" });
    })
    .catch(error => {
      res.status(500).send({ message: error.message });
    });
})

router.delete("/:userId?", async (req, res) => {
  try {
    const { userId } = req.params;
    const id = req.user._id;

    if (userId) {
      // Usuwanie na podstawie przekazanego ID
      await User.findByIdAndRemove(userId);
      res.status(200).send({ message: "User deleted successfully" });
    } else {
      // Usuwanie na podstawie zalogowanego użytkownika
      await User.findByIdAndRemove(id);
      res.status(200).send({ message: "User deleted successfully" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});


router.get("/user", async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ data: user, message: "User details retrieved successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/:userEmail", async (req, res) => {
  try {
    const userEmail = req.params.userEmail
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ data: user, message: "User details retrieved successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.put("/password", async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid current password" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashPassword;
    await user.save();

    res.status(200).send({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.put("/:playerId", async (req, res) => {
  try {
      const { playerId } = req.params;
      const { x, y, online } = req.body;
      console.log("x", x, "y", y, "online", online)
      if (!playerId || !x || !y) {
          return res.status(400).send({ message: "Bad request" });
      }


      const player = await User.findByIdAndUpdate(playerId, { x, y }, { new: true });

      if (!player) {
          return res.status(404).send({ message: "Player not found" });
      }

      res.status(200).send({ message: "Player updated" });
  } catch (error) {
      res.status(500).send({ message: "Internal server error" });
  }
});





module.exports = router