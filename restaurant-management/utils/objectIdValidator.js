const mongoose = require("mongoose");

module.exports = function validarObjectId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("ID inválido");
        error.statusCode = 400;
        throw error;
    }
};