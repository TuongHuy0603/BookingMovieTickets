const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth1')

const UserType = require('../models/UserType')

// @route GET admin/userTypes/
// @desc GET userType
// @access Public
router.get('/', verifyToken, async (req, res) => {
    try {
        const userTypes = await UserType.find()
        
        return res
            .json({
                success: true,
                message: 'All list UserType got successfully',
                data: userTypes
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Intenal server error'})
    }
})

// @route GET admin/userTypes/:id
// @desc GET userType
// @access Public
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const userTypGetCondition = {_id: req.params.id}
        var userTypes = await UserType.findOne(userTypGetCondition)
        if (!userTypes) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'No data in collection UserType'
                })
        }
        return res
            .json({
                success: true,
                message: 'UserType got successfully',
                data: userTypes
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Intenal server error'})
    }
})

// @route POST admin/userTypes/
// @desc POST userType
// @access Public
router.post('/', verifyToken, async (req, res) => {
    const {
        nameUserType
    } = req.body

    if (!nameUserType) {
        return res
            .status(400)
            .json({
                success: false,
                message: 'Missing nameUserType'
            })
    }

    try {
        // All good
        const newUserType = new UserType({
            nameUserType
        })
        await newUserType.save()

        return res
            .json({
                success: true,
                message: 'UserType created successfully',
                data: newUserType
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Intenal server error'})
    }
})

// @route PUT admin/userTypes/
// @desc PUT userType
// @access Public
router.put('/:id', verifyToken, async (req, res) => {
    const {
        nameUserType
    } = req.body

    if (!nameUserType) {
        return res
            .status(400)
            .json({
                success: false,
                message: 'Missing nameUserType'
            })
    }

    try {
        let updatedUserType = {
            nameUserType
        }
        const UpdateCondition = {_id: req.params.id}
        
        updatedUserType = await UserType.findOneAndUpdate(UpdateCondition, updatedUserType, {new: true})
        if(!updatedUserType){
            return res
                .status(401)
                .json({
                    success: false, 
                    message: 'UserType not found or user not authorised'
                })
        }

        res.json({
            success: true,
            message: 'UserType updated successfully!',
            data: updatedUserType
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Intenal server error'})
    }
})

// @route DELETE admin/userTypes/
// @desc DELETE userType
// @access Public
router.delete('/:id', verifyToken, async (req, res) => {
    
    try {
        const deleteCondition = {_id: req.params.id}
        deletedUserTypes = await UserType.findByIdAndDelete(deleteCondition)

        if (!deletedUserTypes) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: 'Usertype not found or user not authorised'
                })
        }

        res.json({success: true, message: 'Deleted Usertype successfully!', data: deletedUserTypes})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Intenal server error'})
    }
})

module.exports = router