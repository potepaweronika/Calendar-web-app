const router = require("express").Router();
const tokenVerification = require("../middleware/tokenVerification");
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" });
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    await new User({ ...req.body, password: hashPassword }).save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  //pobranie wszystkich użytkowników z bd:
  User.find()
    .exec()
    .then(async () => {
      const users = await User.find();
      //konfiguracja odpowiedzi res z przekazaniem listy użytkowników:
      res.status(200).send({ data: users, message: "Lista użytkowników" });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
});

router.get("/profile", tokenVerification, async (req, res) => {
  User.find()
    .exec()
    .then(async () => {
      const id = req.user._id;
      const profile = await User.findOne({_id: id});
      res.status(200).send({ data: profile, message: "Użytkownik" });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
});

router.put("/profile", tokenVerification, async (req, res) => {
  try {
    const id = req.user._id;
    const { firstName, lastName, email, password } = req.body;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Update the user properties
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(password, salt);
      user.password = hashPassword;
    }

    // Save the updated user
    await user.save();

    res.status(200).send({ data: user, message: "Profile updated" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.delete("/", tokenVerification, async (req, res) => {
  User.find()
    .exec()
    .then(async () => {
      const id = req.user._id;
      await User.deleteOne({_id: id})
      res.status(200).send({ message: "Użytkownik usunięty" });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
});

module.exports = router;
