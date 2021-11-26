const mongoose = require('mongoose');

// Await luôn nằm trong một cái hàm async
async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/f8_education_dev');
        console.log('Connect DB Successfully!!!');
    } catch (error) {
        console.log('Connect DB Failure!!!');
    }
}

module.exports = { connect };
