/** @format */

// controllers/imageController.js
const fs = require("fs");
const multer = require("multer");
const Image = require("../models/Image");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		let uploadDir = "uploads/";
		
		// Check if the image type is 'generatedImage' and adjust the upload directory
		if (req.body.type === 'generatedImage') {
			uploadDir = "uploads/generated/";
		}

		// Create the uploads directory if it doesn't exist
		fs.mkdirSync(uploadDir, { recursive: true });
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
		cb(null, true);
	} else {
		cb(new Error("Unsupported file type"), false);
	}
};

const upload = multer({
	storage,
	fileFilter,
}).single("image");

const uploadImage = (req, res, next) => {
	upload(req, res, (err) => {
		if (err) {
			return res.status(400).json({ message: err.message });
		}
		next();
	});
};

// const addImage = async (req, res) => {
// 	try {
// 		const { filename } = req.file;
// 		const imageUrl = `/uploads/${filename}`;

// 		const newImage = new Image({
// 			name: req.body.name,
// 			imageUrl,
// 		});

// 		await newImage.save();
// 		res.status(201).json(newImage);
// 	} catch (error) {
// 		res.status(500).json({ message: error.message });
// 	}
// };
const addImage = async (req, res) => {
	try {
		const { filename } = req.file;
		const imageUrl = `/uploads/${filename}`;

		
		const newImage = new Image({
			name: req.body.name,
			imageUrl,
			...(req.body.userEmail && { userEmail: req.body.userEmail }), 
			...(req.body.type && { type: req.body.type }) 
		});

		await newImage.save();
		res.status(201).json(newImage);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const addGeneratedImage = async (req, res) => {
	try {
		const { filename } = req.file;
		const imageUrl = `/uploads/generated/${filename}`;

		
		const newImage = new Image({
			name: req.body.name,
			imageUrl,
			userEmail: req.body.userEmail || null,  
			type: req.body.type || 'generatedImage', // Type defaults to 'generatedImage'
		});

		await newImage.save();
		res.status(201).json(newImage);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};


const getImages = async (req, res) => {
	try {
		const images = await Image.find();
		res.status(200).json(images);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Method to get images by type: 'generatedImage'
const getAllGeneratedImage = async (req, res) => {
	try {
		const images = await Image.find({ type: 'generatedImage' });
		res.status(200).json(images);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
// Method to get images by type: 'generatedImage'
const getAllGeneratedImagesByEmail = async (req, res) => {
	try {
		const images = await Image.find({ type: 'generatedImage' , userEmail:req.body.email});
		res.status(200).json(images);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Method to get images that are not of type 'generatedImage'
const getAllImagesOtherThanGenerated = async (req, res) => {
	try {
		const images = await Image.find({ type: { $ne: 'generatedImage' } });
		res.status(200).json(images);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const getAllImagesOtherThanGeneratedByEmail = async (req, res) => {
	try {
		const images = await Image.find({ type: { $ne: 'generatedImage', userEmail:req.body.email } });
		res.status(200).json(images);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const saveGeneratedImageByEmail = async (req, res) => {
	const { email, imageUrl, imageName } = req.body;
	try {
	  const newImage = new Image({
		userEmail: email,
		imageUrl: imageUrl, 
		name: imageName,
		type: 'generatedImage',
	  });
	  const savedImage = await newImage.save();
	  res.status(201).json(savedImage);
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
  };



module.exports = {
	addGeneratedImage,
	uploadImage,
	addImage,
	getImages,
	getAllGeneratedImage,
	getAllGeneratedImagesByEmail,
	getAllImagesOtherThanGenerated,
	getAllImagesOtherThanGeneratedByEmail,
	saveGeneratedImageByEmail
};
