const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios'); // Import Axios for making HTTP requests

const app = express();
const PORT = 80;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://jp3520278:yPZ35Uriz0PgnT1h@cluster0.9d7rn9y.mongodb.net/test?retryWrites=true&w=majority');

// Define Property schema
const LifestyleSchema = new mongoose.Schema({
  name: String,
  type: {
    type: [String],
    enum: [
      "Modern",
      "Scandinavian",
      "Contemporary",
      "Eclectic",
      "Industrial living room",
      "Minimalist",
      "Minimalist living room",
      "Rustic",
      "Asian",
      "Country",
      "Industrial",
      "Mediterranean",
      "Midcentury cool",
      "Retro",
      "Traditional"
    ]
  },
  parking: Boolean,
  description: String,
});

const Lifestyle = mongoose.model('Lifestyle', LifestyleSchema);

// API endpoints
app.get('/api/Lifestyle', async (req, res) => {
  try {
    const Lifestyle= await Lifestyle.find();
    res.json(Lifestyle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/Lifestyle', async (req, res) => {
  const Lifestyle = new Lifestyle(req.body);

  try {
    const newLifestyle = await Lifestyle.save();
    res.status(201).json(newLifestyle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add the POST request code here or in any appropriate route handler

// Example code to create a new property
app.post('/create-Lifestyle', async (req, res) => {
  const LifestyleData = {
    "name": "Example Lifestyle",
    "type": ["Modern", "Minimalist"],
    "parking": true,
    "description": "This is an example Lifestyle with modern and minimalist styles."
  };

  try {
    const response = await axios.post('/api/Lifestyle', LifestyleData);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/Lifestyle/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await Lifestyle.findByIdAndDelete(id);
    res.json({ message: 'Lifestyle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
  