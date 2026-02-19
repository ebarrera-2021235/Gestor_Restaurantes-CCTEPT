const mongoose = require("mongoose");
const env = require("./env");

async function connectDB() {
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log("MongoDB conectado correctamente");
    } catch (error) {
        console.error("❌ Error conectando MongoDB:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
