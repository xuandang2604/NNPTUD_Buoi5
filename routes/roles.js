var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles');
let userModel = require('../schemas/users');

// GET all roles
router.get('/', async function (req, res, next) {
    try {
        let roles = await roleModel.find({ isDeleted: false });
        res.send(roles);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET role by id
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findById(id);
        if (!result || result.isDeleted) {
            res.status(404).send({ message: "ID NOT FOUND" });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(404).send({ message: "ID NOT FOUND" });
    }
});

// GET all users by role id (Yeu cau 4)
router.get('/:id/users', async function (req, res, next) {
    try {
        let id = req.params.id;
        // Kiem tra role co ton tai khong
        let role = await roleModel.findById(id);
        if (!role || role.isDeleted) {
            return res.status(404).send({ message: "ROLE NOT FOUND" });
        }
        // Lay tat ca user co role = id va chua bi xoa
        let users = await userModel.find({
            role: id,
            isDeleted: false
        }).populate({
            path: 'role',
            select: 'name description'
        });
        res.send(users);
    } catch (error) {
        res.status(404).send({ message: "ROLE NOT FOUND" });
    }
});

// POST create new role
router.post('/', async function (req, res, next) {
    try {
        let newRole = new roleModel({
            name: req.body.name,
            description: req.body.description
        });
        await newRole.save();
        res.send(newRole);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// PUT update role by id
router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findById(id);
        if (!result || result.isDeleted) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        let updated = await roleModel.findByIdAndUpdate(id, req.body, { new: true });
        res.send(updated);
    } catch (error) {
        res.status(404).send({ message: "ID NOT FOUND" });
    }
});

// DELETE soft delete role by id
router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findById(id);
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
