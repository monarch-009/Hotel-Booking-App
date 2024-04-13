import express from "express";
import { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { HotelType } from "../models/hotel";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    }
});



// This is the /api/my-hotels route
router.post(
    "/",
    verifyToken, [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Type is required"),
    body("pricePerNight").notEmpty().isNumeric().withMessage("Price per night is required and must be a number"),
    body("facilities").notEmpty().isArray().withMessage("Facilities is required")
],
    upload.array("imagesFiles", 6),
    async (req: Request, res: Response) => {
        try {
            const imagesFiles = req.files as Express.Multer.File[];
            const newHotel: HotelType = req.body;


            const uploadPromises = imagesFiles.map(async (images) => {
                const b64 = Buffer.from(images.buffer).toString("base64");
                let dataURL = `data:${images.mimetype};base64,${b64}`;
                const res = await cloudinary.v2.uploader.upload(dataURL);
                return res.url;
            });

            const imageUrls = await Promise.all(uploadPromises);
            newHotel.imageUrls = imageUrls;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId;

            const hotel = new Hotel(newHotel);
            await hotel.save();

            res.status(201).send(hotel);

        } catch (err) {
            console.log("Error creating hotel: ", err);
            res.status(500).json({ message: "Something went wrong" });

        }

    });

export default router;