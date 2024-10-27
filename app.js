const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");  // Import bcrypt for password hashing

// Import your Blog model (assuming you have it in ./modules/Blog)
const { healthmodel } = require("./models/user");

// Connect to MongoDB (replace this with your actual MongoDB connection string)
mongoose.connect("mongodb+srv://salmanshan:salman642001@cluster0.odxej1b.mongodb.net/Healthmonitor?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

const app = express();
app.use(cors()); // To handle cross-origin requests
app.use(express.json()); // To parse JSON request bodies

// Create a function to generate a hashed password
const generateHashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);  // Generate salt
    return bcrypt.hash(password, salt);     // Hash the password
};

// Create the SignUp API
app.post("/SignUp", async (req, res) => {
    try {
        let input = req.body;  // Get input from the request body

        // Hash the password before saving
        let hashedPassword = await generateHashedPassword(input.password);
        input.password = hashedPassword;

        // Create a new blog model instance with the input data
        const health = new healthmodel(input);

        // Save the user data to the MongoDB collection
        await health.save();  

        // Send a success response
        res.json({ "status": "success" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "status": "error", "message": "Server error" });
    }
});

app.post("/Signin", async (req, res) => {
    try {
      let input = req.body;
      const user = await healthmodel.findOne({ email: input.email });
      
      if (!user) {
        return res.status(400).json({ status: "error", message: "User not found" });
      }
  
      // Compare the password with the stored hashed password
      const isMatch = await bcrypt.compare(input.password, user.password);
      if (!isMatch) {
        return res.status(400).json({ status: "error", message: "Invalid credentials" });
      }
  
      res.json({ status: "success", message: "Login successful" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "error", message: "Server error" });
    }
  });
  

// Start the server on port 8080
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
