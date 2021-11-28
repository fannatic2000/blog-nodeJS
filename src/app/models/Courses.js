const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const CourseSchema = new Schema(
    {
        _id: { type: Number },
        name: { type: String, required: true },
        description: { type: String },
        image: { type: String },
        slug: {
            type: String,
            slug: 'name',
            unique: true,
            slugOn: { updateOne: true },
        },
        videoID: { type: String, required: true }, // Chuyển thành không dấu, xóa dấu cách thành dấu -
        level: { type: String },
    },
    {
        _id: false, //mongoose không can thiệp
        timestamps: true, // Tự thêm thời gian
    },
);

// Custom query helpers
CourseSchema.query.sortable = function (req) {
    if (req.query.hasOwnProperty('_sort')) {
        const isValidType = ['asc', 'desc'].includes(req.query.type);
        return this.sort({
            [req.query.column]: isValidType ? req.query.type : 'desc',
        });
    }
    return this;
};

CourseSchema.query.enabledPagination = function (page, perPage) {
    return this.skip(perPage * (page - 1)).limit(perPage);
};

// Add plugins
CourseSchema.plugin(AutoIncrement);
CourseSchema.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true,
});
mongoose.plugin(slug);

module.exports = mongoose.model('Course', CourseSchema); // Model name tự chuyển thành lower-case và thêm số nhiều
// Chưa có thì sẽ tạo
