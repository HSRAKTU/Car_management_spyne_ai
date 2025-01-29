import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"
import { addCar, deleteCar, getAllCars, getCarById, getUserCars, updateCar } from "../controllers/car.controller.js";

const router = Router();

// open routes:
router.route("/list-products").get(getAllCars);
router.route("/list-product-by-id/:carId").get(getCarById);

//protected routes:
router.route("/create-product").post(
    verifyJWT,
    upload.fields([
        {name: "images", maxCount: 10}
    ]),
    addCar
)

router.route("/update-product/:carId").patch(
    verifyJWT,
    upload.fields([
        {name: "images", maxCount: 10}
    ]),                                     // Upload up to 10 images if needed
    updateCar
);
  
router.route("/delete-product/:carId").delete(
    verifyJWT,
    deleteCar
);

router.route("/user-products").get(
    verifyJWT,
    getUserCars
);
  

export default router;