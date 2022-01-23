const mongoose = require('mongoose');
//const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const AccountSchema = new Schema(
    {
        id: { type: Number },
        username: { type: String, required: true },
        fullname: { type: String, required: true },
        email: { type: String },
        password: { type: String, required: true },
        permission: { type: Number },
        dob: { type: String },
    },
    {
        //_id: false, //mongoose không can thiệp
        timestamps: true, // Tự thêm thời gian
    },
);

// Add plugins
//AccountSchema.plugin(AutoIncrement, { id: 'account_seq', collection_name: 'account_counter'  });

module.exports = mongoose.model('Account', AccountSchema); // Model name tự chuyển thành lower-case và thêm số nhiều
// Chưa có thì sẽ tạo
