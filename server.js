
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
  productcolor: { type: [String] },
  roomcolor: { type: [String] },
  roomLight: { type: [String] },
  tone: { type: [String] },
  image: { type: [String] }
  
});

const Lifestyle = mongoose.model('Lifestyle', lifestyleSchema);


// API endpoints for Lifestyle
app.post('/api/lifestyle', async (req, res) => {
  const { searchBar, roomType, productcolor, roomcolor, tone, product, angle, roomLight } = req.body;
  try {
    const query = {};
    if (searchBar) {
      query.$or = [
        { roomType: { $regex: new RegExp(searchBar, 'i') } },
        { productcolor: { $regex: new RegExp(searchBar, 'i') } },
        { roomcolor: { $regex: new RegExp(searchBar, 'i') } },
        { tone: { $regex: new RegExp(searchBar, 'i') } },
        { product: { $regex: new RegExp(searchBar, 'i') } },
        { angle: { $regex: new RegExp(searchBar, 'i') } },
        { roomLight: { $regex: new RegExp(searchBar, 'i') } }
      ];
    }
    if (roomType) {
      query.roomType = Array.isArray(roomType) ? { $in: roomType} : roomType;
    }
    if (productcolor) {
      query.productcolor = { $in: productcolor };
    }
    if (roomcolor) {
      query.roomcolor = { $in: roomcolor };
    }
    if (tone) {
      query.tone = { $in: tone };
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
    const lifestyles = await Lifestyle.find(query);
    res.json(lifestyles); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/saveLifestyle', async (req, res) => {
  const { roomType, product, angle, productcolor, roomcolor, roomLight, tone,image } = req.body;

  const newLifestyle = new Lifestyle({
    roomType: roomType,
    product: product,
    angle: angle,
    productcolor: productcolor,
    roomcolor: roomcolor,
    roomLight: roomLight,
    tone: tone,
    image:image
  });

  try {
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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
