import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Car } from '../models/car.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { isValidObjectId } from 'mongoose';
import pLimit from 'p-limit';

/* 
    Add, Update, Read, Delete
*/

// Cloudinary Upload Function (Optimized with pLimit)
const uploadImagesToCloudinary = async (files) => {
  const limit = pLimit(10);
  const uploadPromises = files.map(file => 
    limit(() => uploadOnCloudinary(file.buffer))
  );
  const uploadedImages = await Promise.all(uploadPromises);
  return uploadedImages.map(img => img.url);
};

// 1) ADD CAR
const addCar = asyncHandler(async (req, res) => {
  const { title, description, tags } = req.body;

  if (!req.files || !req.files.images || req.files.images.length === 0) {
    throw new ApiError(400, "At least one image is required");
  }

  if (req.files.images.length > 10) {
    throw new ApiError(400, "Cannot upload more than 10 images");
  }
  let imageUrls
  try {
    console.log("Uploading images..")
    imageUrls = await uploadImagesToCloudinary(req.files.images);
    console.log("All images uploaded successfully!")
  } catch (error) {
    console.log("Error while uploading images.",error)
    throw new ApiError(505, "Error while uploading images in backend")
  }

  const car = await Car.create({
    userId: req.user._id, 
    title,
    description,
    images: imageUrls,
    tags: JSON.parse(tags),
  });

  return res.status(201).json(new ApiResponse(200, car, "Car added successfully!"));
});

// 2) GET CAR BY ID
const getCarById = asyncHandler(async (req, res) => {
  const { carId } = req.params;

  if (!isValidObjectId(carId)) {
    throw new ApiError(400, "Invalid Car ID");
  }

  const car = await Car.findById(carId);
  if (!car) {
    throw new ApiError(404, "Car not found");
  }

  return res.status(200).json(new ApiResponse(200, car, "Car fetched successfully"));
});

// 3) GET ALL CARS (with Search & Pagination)
const getAllCars = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query } = req.query;
  const pipeline = [];

  if (query) {
    pipeline.push({
      $search: {
        index: "cars_index",
        text: {
          query,
          path: ["title", "description", "tags"],
          fuzzy: { maxEdits: 2, prefixLength: 3 }
        }
      }
    });

    // Optional: project the score if you want to see it (but NOT sort by it)
    pipeline.push({
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        tags: 1,
        images: 1,
        createdAt: 1,
        updatedAt: 1,
        score: { $meta: "searchScore" }
      }
    });

    // Now just sort by createdAt
    pipeline.push({ $sort: { createdAt: -1 } });

  } else {
    pipeline.push({ $sort: { createdAt: -1 } });
  }

  pipeline.push({ $skip: (page - 1) * limit });
  pipeline.push({ $limit: parseInt(limit, 10) });

  try {
    const cars = await Car.aggregate(pipeline);
    const totalDocs = await Car.countDocuments();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          docs: cars,
          totalPages: Math.ceil(totalDocs / limit),
          currentPage: parseInt(page, 10),
        },
        "Cars fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Failed to fetch cars", error);
  }
});

// 4) UPDATE CAR (Selective Image Update)
const updateCar = asyncHandler(async (req, res) => {
  const { carId } = req.params;
  const { title, description, tags, imageIndexesToUpdate } = req.body;

  // Validate Car ID
  if (!isValidObjectId(carId)) {
    throw new ApiError(400, "Invalid Car ID");
  }

  // Fetch the existing Car
  const car = await Car.findById(carId);
  if (!car) {
    throw new ApiError(404, "Car not found");
  }

  // Check ownership
  if (String(car.userId) !== String(req.user._id)) {
    throw new ApiError(403, "Unauthorized to update this car");
  }

  // Start with the current images
  let updatedImages = [...car.images];

  // If new files are provided

  if (req.files?.images?.length > 0) {
    // Case A: Replace images at specific indexes
    if (imageIndexesToUpdate) {
      const indexes = JSON.parse(imageIndexesToUpdate); // e.g. "[0,2]"
      if (indexes.length !== req.files.images.length) {
        throw new ApiError(400, "Mismatch between indexes and images uploaded");
      }

      // Upload new images concurrently
      const newImageUrls = await uploadImagesToCloudinary(req.files.images);

      // Overwrite existing images at specified indexes
      indexes.forEach((index, i) => {
        if (index < updatedImages.length) {
          updatedImages[index] = newImageUrls[i];
        }
      });

    // Case B: Append new images (no indexes)
    } else {
      const newImageUrls = await uploadImagesToCloudinary(req.files.images);
      updatedImages.push(...newImageUrls);
    }

    // If your schema enforces a max of 10 images, optionally check here
    if (updatedImages.length > 10) {
      throw new ApiError(400, "Cannot have more than 10 images total!");
    }

  } else if (imageIndexesToUpdate) {
    //
    // Case C: No new images uploaded but `imageIndexesToUpdate` present
    // --> Means remove images at those indexes
    //
    const indexes = JSON.parse(imageIndexesToUpdate);
    // Sort descending so you don’t shift indexes mid-loop
    indexes.sort((a, b) => b - a);
    indexes.forEach(idx => {
      if (idx < updatedImages.length) {
        updatedImages.splice(idx, 1);
      }
    });
  }
  let parsedTags = car.tags; // keep old tags by default
  if (tags !== undefined) {
    parsedTags = JSON.parse(tags);
  }
  // Perform the update
  const updatedCar = await Car.findByIdAndUpdate(
    carId,
    {
      title,
      description,
      tags: parsedTags, // parse if you’re sending tags as JSON string
      images: updatedImages,
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCar, "Car updated successfully"));
});


// 5) DELETE CAR
const deleteCar = asyncHandler(async (req, res) => {
  const { carId } = req.params;

  if (!isValidObjectId(carId)) {
    throw new ApiError(400, "Invalid Car ID");
  }

  const car = await Car.findById(carId);
  if (!car) {
    throw new ApiError(404, "Car not found");
  }

  if (String(car.userId) !== String(req.user._id)) {
    throw new ApiError(403, "Unauthorized to delete this car");
  }

  await Car.findByIdAndDelete(carId);

  return res.status(200).json(new ApiResponse(200, {}, "Car deleted successfully"));
});

// 6) GET CARS BY USER
const getUserCars = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cars = await Car.find({ userId }).sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, cars, "User's cars fetched successfully"));
});

export {
  addCar,
  getCarById,
  getAllCars,
  updateCar,
  deleteCar,
  getUserCars
};
