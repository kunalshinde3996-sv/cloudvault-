const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileKey: { type: String, required: true },
  fileSize: { type: Number },
  fileType: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);