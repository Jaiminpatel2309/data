const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000; // Change the port as needed

app.use(cors());
app.use(bodyParser.json());


// MongoDB connection
mongoose.set("strictQuery", false);
mongoose.connect('mongodb+srv://jp3520278:yPZ35Uriz0PgnT1h@cluster0.9d7rn9y.mongodb.net/Lifestyle', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define Lifestyle schema
const lifestyleSchema = new mongoose.Schema({
  roomType: { type: [String] },
  product: { type: [String] },
  angle: { type: [String] },
  productColor: { type: [String] },
  roomColor: { type: [String] },
  roomLight: { type: [String] },
  image: { type: [String] },
  createdAt: { type: Date, default: Date.now },
  lastModifiedAt: { type: Date, default: Date.now }
});

const Lifestyle = mongoose.model('Lifestyle', lifestyleSchema);

// API endpoint to get lifestyles with pagination
app.post('/api/lifestyleold', async (req, res
) => {

  const page = parseInt(req.body.page) || 1;
  const limit = parseInt(req.body.limit) || 18;

  console.log("page 2", page, limit)

  try {
    const totalDocuments = await Lifestyle.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);
    const offset = (page - 1) * limit;

    const lifestyle = await Lifestyle.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    res.json({
      totalDocuments,
      totalPages,
      currentPage: page,
      lifestyles: lifestyle
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API endpoints for Lifestyle
app.post('/api/lifestyle', async (req, res) => {
  const { searchBar, roomType, productColor, roomColor, tone, product, angle, roomLight, page, limit } = req.body;
  
  

  try {
    const query = {};
    if (searchBar) {
      query.$or = [
        { roomType: { $regex: new RegExp(searchBar, 'i') } },
        { productColor: { $regex: new RegExp(searchBar, 'i') } },
        { roomColor: { $regex: new RegExp(searchBar, 'i') } },
        { product: { $regex: new RegExp(searchBar, 'i') } },
        { angle: { $regex: new RegExp(searchBar, 'i') } },
        { roomLight: { $regex: new RegExp(searchBar, 'i') } }
      ];
    }
    if (roomType) {
      query.roomType = Array.isArray(roomType) ? { $in: roomType } : roomType;
    }
    if (productColor) {
      query.productColor = { $in: productColor };
    }
    if (roomColor) {
      query.roomColor = { $in: roomColor };
    }
    if (product) {
      query.product = { $in: product };
    }
    if (angle) {
      query.angle = { $in: angle };
    }
    if (roomLight) {
      query.roomLight = { $in: roomLight };
    }

    query.image = { $ne: [] };


  const totalDocuments = await Lifestyle.find(query).count();
  console.log("totalDocuments",totalDocuments)
  const totalPages = Math.ceil(totalDocuments / limit);
  const offset = (page - 1) * limit;


    const lifestyles = await Lifestyle.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    res.json({
      totalDocuments,
      totalPages,
      currentPage: page,
      lifestyles: lifestyles
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/saveLifestyle', async (req, res) => {
  const { roomType, product, angle, productColor, roomColor, roomLight, tone, image } = req.body;

  const newLifestyle = new Lifestyle({
    roomType: roomType,
    product: product,
    angle: angle,
    productColor: productColor,
    roomColor: roomColor,
    roomLight: roomLight,
    image: image
  });

  try {
    newLifestyle.createdAt = newLifestyle.lastModifiedAt = Date.now();
    const savedLifestyle = await newLifestyle.save();
    res.status(201).json(savedLifestyle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/updateLifestyle/:id', async (req, res) => {
  const id = req.params.id;
  const updateFields = req.body;

  try {
    const updatedLifestyle = await Lifestyle.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedLifestyle) {
      return res.status(404).json({ message: 'Lifestyle not found' });
    }

    res.json(updatedLifestyle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/deleteLifestyle/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const deletedLifestyle = await Lifestyle.findByIdAndDelete(id);
    if (!deletedLifestyle) {
      return res.status(404).json({ message: 'Lifestyle not found' });
    }
    res.json({ message: 'Lifestyle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/getLifestyle/:id', async (req, res) => {
  try {
    const lifestyle = await Lifestyle.findById(req.params.id);
    res.json(lifestyle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


