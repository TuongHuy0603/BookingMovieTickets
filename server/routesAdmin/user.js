const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth1')

const User = require('../models/User')

// @route GET admin/user/
// @desc GET user
// @access Public
router.get('/', verifyToken, async (req, res) => {
    try {
        const users = await User.find()
        
        return res
            .json({
                success: true,
                message: 'All list User got successfully',
                data: users
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Intenal server error'})
    }
})

// @route GET admin/users/:id
// @desc GET User
// @access Public
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const userTypGetCondition = {_id: req.params.id}
        var users = await User.findOne(userTypGetCondition)
        if (!users) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'No data in collection User'
                })
        }
        return res
            .json({
                success: true,
                message: 'User got successfully',
                data: users
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Intenal server error'})
    }
})

// @route POST admin/users/
// @desc POST User
// @access Public
router.post('/', verifyToken, async (req, res) => {
    const {
        username,
        password,
        firstName,
        lastName,
        phoneNumber,
        email,
        userType,
        group
    } = req.body

    // Simple validation
    if (!username || !password) {
        return res
            .status(400)
            .json({
                success: false,
                message: 'Missing username and/or password'
            })
    }

    if (!firstName || !lastName || !phoneNumber || !userType) {
        return res
            .status(400)
            .json({
                success: false,
                message: 'Missing firstname and/or lastname and/or phoneNumber and/or userType'
            })
    }

    try {
        // check for existing user
        const user = await User.findOne({ username })

        if (user) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'Username already taken'
                })
        }
        
        // All good
        const hashedPassword = await argon2.hash(password)
        const newUser = new User({
            username,
            password: hashedPassword,
            firstName,
            lastName,
            phoneNumber,
            email,
            userType,
            group
        })
        await newUser.save()

        return res
                .json({
                    success: true,
                    message: 'User created successfully'
                })
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Intenal server error'})
    }
})

// @route PUT admin/users/
// @desc PUT User
// @access Public
router.put('/:id', verifyToken, async (req, res) => {
    const {
        username,
        password,
        firstName,
        lastName,
        phoneNumber,
        email,
        userType,
        group
    } = req.body

    // Simple validation
    if (!username || !password) {
        return res
            .status(400)
            .json({
                success: false,
                message: 'Missing username and/or password'
            })
    }

    if (!firstName || !lastName || !phoneNumber || !userType) {
        return res
            .status(400)
            .json({
                success: false,
                message: 'Missing firstname and/or lastname and/or phoneNumber and/or userType'
            })
    }

    try {
        const hashedPassword = await argon2.hash(password)
        let updatedUser = {
            username,
            password: hashedPassword,
            firstName,
            lastName,
            phoneNumber,
            email,
            userType,
            group
        }
        const UpdateCondition = {_id: req.params.id}
        
        updatedUser = await User.findOneAndUpdate(UpdateCondition, updatedUser, {new: true})
        if(!updatedUser){
            return res
                .status(401)
                .json({
                    success: false, 
                    message: 'User not found or user not authorised'
                })
        }

        res.json({
            success: true,
            message: 'User updated successfully!',
            data: updatedUserType
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Intenal server error'})
    }
})

// @route DELETE admin/users/
// @desc DELETE User
// @access Public
router.delete('/:id', verifyToken, async (req, res) => {
    
    try {
        const deleteCondition = {_id: req.params.id}
        deletedUser = await User.findByIdAndDelete(deleteCondition)

        if (!deletedUser) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: 'User not found or user not authorised'
                })
        }

        res.json({success: true, message: 'Deleted User successfully!', data: deletedUser})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Intenal server error'})
    }
})

module.exports = router