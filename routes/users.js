var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');

// GET all users
router.get('/', async function (req, res, next) {
    try {
        let users = await userModel.find({ isDeleted: false }).populate({
            path: 'role',
            select: 'name description'
        });
        res.send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET user by id
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.findById(id).populate({
            path: 'role',
            select: 'name description'
        });
        if (!result || result.isDeleted) {
            res.status(404).send({ message: "ID NOT FOUND" });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(404).send({ message: "ID NOT FOUND" });
    }
});

// POST enable user (Yeu cau 2)
router.post('/enable', async function (req, res, next) {
    try {
        let { email, username } = req.body;
        let user = await userModel.findOne({
            email: email,
            username: username,
            isDeleted: false
        });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        user.status = true;
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// POST disable user (Yeu cau 3)
router.post('/disable', async function (req, res, next) {
    try {
        let { email, username } = req.body;
        let user = await userModel.findOne({
            email: email,
            username: username,
            isDeleted: false
        });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        user.status = false;
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// POST create new user
router.post('/', async function (req, res, next) {
    try {
        let newUser = new userModel({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            role: req.body.role,
            loginCount: req.body.loginCount
        });
        await newUser.save();
        res.send(newUser);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// PUT update user by id
router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.findById(id);
        if (!result || result.isDeleted) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        let updated = await userModel.findByIdAndUpdate(id, req.body, { new: true });
        res.send(updated);
    } catch (error) {
        res.status(404).send({ message: "ID NOT FOUND" });
    }
});

// DELETE soft delete user by id
router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.findById(id);
        if (!result || result.isDeleted) {
            res.status(404).send({ message: "ID NOT FOUND" });
        } else {
            result.isDeleted = true;
            await result.save();
            res.send(result);
        }
    } catch (error) {
        res.status(404).send({ message: "ID NOT FOUND" });
    }
});

module.exports = router;
