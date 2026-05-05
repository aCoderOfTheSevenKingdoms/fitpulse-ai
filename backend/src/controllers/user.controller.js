const User = require('../models/user.model');
const {uploadToCloudinary} = require('../services/imgUpload.service');
const cloudinary = require('../config/cloudinary');
const logger = require('../utils/logger');

const uploadAvatar = async (req,res) => {
   try {
        if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
        }

        const userId = req.userId;

        // upload to cloudinary
        const result = await uploadToCloudinary(
        req.file.buffer,
        "avatars"
        );

        // update DB
        const user = await User.findByIdAndUpdate(
        userId,
        {
            avatar: {
            url: result.url,
            publicId: result.publicId,
            },
        },
        { new: true }
        );

        res.status(200).json({
        message: "Avatar uploaded successfully",
        avatar: user.avatar,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: "Avatar upload failed" });
    }
}

const removeAvatar = async (req,res) => {
   try {
      const userDoc = await User.findById(req.userId);
      if(!userDoc){
        return res.status(404).json({
            message: "User not found⛔"
        })
      } 

      if(!userDoc.avatar){
        return res.json({
            message: "No avatar uploaded"
        })
      }

      // Remove image from cloudinary
      const imgPublicId = userDoc.avatar.publicId;
      const response = await cloudinary.uploader.destroy(imgPublicId);

      if(response.result !== "ok" && response.result !== "not found"){
        return res.status(500).json({
            message: "Cloudinary delete failed"
        })
      }

      // Set avatar to null
      userDoc.avatar = null;
      await userDoc.save();

      res.json({
        message: "Avatar deleted successfully"
      })
   } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: "Some error occured while removing avatar"
      })
   }
}

const updateProfile = async (req,res) => {
  try {

    const allowedFields = ['name', 'location', 'weight', 'height', 'bio'];

    const updateFields = Object.fromEntries(
      Object.entries(req.body)
      .filter(([key,value]) => allowedFields.includes(key) && value !== undefined)
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    )

    if(!updatedUser){
      return res.json({
        message: "Something went wrong while updating user info"
      })
    }

    res.status(200).json({
      message: "User info updated successfully✅",
      user: updatedUser
    })

  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "Internal server error"
    })
  }
}

module.exports = {
  uploadAvatar,
  removeAvatar,
  updateProfile
}