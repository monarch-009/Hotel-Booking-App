import express from "express";
import { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { HotelType } from "../shared/types";
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


            const imageUrls = await uploadImages(imagesFiles);
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

router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ userId: req.userId });
        res.json(hotels);

    } catch (error) {
        res.status(500).json({ message: "Error fetching hotel" });
    }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
    // /api/my-hotels/194756496
    const id = req.params.id.toString();
    try {
        const hotel = await Hotel.findOne({
            _id: id,
            userId: req.userId
        });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.json(hotel);

    } catch (error) {
        res.status(500).json({ message: "Error fetching hotel" });
    }
});


router.put(
    "/:hotelId",
    verifyToken,
    upload.array("imageFiles"),
    async (req: Request, res: Response) => {
      try {
        const updatedHotel: HotelType = req.body;
        updatedHotel.lastUpdated = new Date();
  
        const hotel = await Hotel.findOneAndUpdate(
          {
            _id: req.params.hotelId,
            userId: req.userId,
          },
          updatedHotel,
          { new: true }
        );
  
        if (!hotel) {
          return res.status(404).json({ message: "Hotel not found" });
        }
  
        const files = req.files as Express.Multer.File[];
        const updatedImageUrls = await uploadImages(files);
  
        hotel.imageUrls = [
          ...updatedImageUrls,
          ...(updatedHotel.imageUrls || []),
        ];
  
        await hotel.save();
        res.status(201).json(hotel);
      } catch (error) {
        res.status(500).json({ message: "Something went throw" });
      }
    }
  );
  




async function uploadImages(imagesFiles: Express.Multer.File[]) {
    const uploadPromises = imagesFiles.map(async (images) => {
        const b64 = Buffer.from(images.buffer).toString("base64");
        let dataURL = `data:${images.mimetype};base64,${b64}`;
        const res = await cloudinary.v2.uploader.upload(dataURL);
        return res.url;
    });

    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}

export default router;
