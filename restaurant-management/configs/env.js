require("dotenv").config();

const env = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI
};

if (!env.MONGO_URI) {
    throw new Error("MONGO_URI no está definida en el .env");
}

module.exports = env;
