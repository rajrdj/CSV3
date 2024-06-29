import mongoose from 'mongoose';

const CSVSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  cloudinaryUrl: { type: String, required: true },
  columns: [{ type: String }],
  data: [{ type: mongoose.Schema.Types.Mixed }],
}, { timestamps: true });

export default mongoose.models.CSV || mongoose.model('CSV', CSVSchema);