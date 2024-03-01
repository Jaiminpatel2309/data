// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const axios = require('axios'); // Import Axios for making HTTP requests

// const app = express();
// const PORT = 80;

// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB connection
// mongoose.connect('mongodb+srv://jp3520278:yPZ35Uriz0PgnT1h@cluster0.9d7rn9y.mongodb.net/test?retryWrites=true&w=majority');

// // Define Property schema
// const LifestyleSchema = new mongoose.Schema({
//   name: String,
//   type: {
//     type: [String],
//     enum: [
//       "Modern",
//       "Scandinavian",
//       "Contemporary",
//       "Eclectic",
//       "Industrial living room",
//       "Minimalist",
//       "Minimalist living room",
//       "Rustic",
//       "Asian",
//       "Country",
//       "Industrial",
//       "Mediterranean",
//       "Midcentury cool",
//       "Retro",
//       "Traditional"
//     ]
//   },
// });

// const Lifestyle = mongoose.model('Lifestyle', LifestyleSchema);

// // API endpointsapi/Lifes
// app.get('/tyle', async (req, res) => {
//   try {
//     const Lifestyle= await Lifestyle.find();
//     res.json(Lifestyle);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.post('/api/Lifestyle', async (req, res) => {

//   console.log(req)
//   // const Lifestyle = new Lifestyle(req.body);

//   try {
//     const newLifestyle = await Lifestyle.save();
//     res.status(201).json(newLifestyle);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Add the POST request code here or in any appropriate route handler

// // Example code to create a new property
// app.post('/create-Lifestyle', async (req, res) => {
//   const LifestyleData = {
//     "name": "Example Lifestyle",
//     "type": ["Modern", "Minimalist"],
//     "parking": true,
//     "description": "This is an example Lifestyle with modern and minimalist styles."
//   };

//   try {
//     const response = await axios.post('/api/Lifestyle', LifestyleData);
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.delete('/api/Lifestyle/:id', async (req, res) => {
//   const id = req.params.id;

//   try {
//     await Lifestyle.findByIdAndDelete(id);
//     res.json({ message: 'Lifestyle deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


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
mongoose.connect('mongodb+srv://jp3520278:yPZ35Uriz0PgnT1h@cluster0.9d7rn9y.mongodb.net/Lifestyle', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define Lifestyle schema
const lifestyleSchema = new mongoose.Schema({
  roomtype: { type: [String] },
  product: { type: [String] },
  angle: { type: [String] },
  color: { type: [String] },
  roomLight: { type: [String] },
  tone: { type: [String] },
  image: { type: [String] }
  
});

const Lifestyle = mongoose.model('Lifestyle', lifestyleSchema);


// API endpoints for Lifestyle
app.post('/api/lifestyle', async (req, res) => {
  const { roomtype, color, tone, product, angle, roomLight } = req.body;
  try {
    const query = {};
    if (roomtype) {
      query.roomtype = { $in: roomtype };
    }
    if (color) {
      query.color = { $in: color };
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
    console.log("query",query)
    const lifestyles = await Lifestyle.find(query);
    res.json(lifestyles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/saveLifestyle', async (req, res) => {
  const { roomtype, product, angle, color, roomLight, tone,image } = req.body;

  const newLifestyle = new Lifestyle({
    roomtype: roomtype,
    product: product,
    angle: angle,
    color: color,
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
