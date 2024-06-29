import multer from 'multer';
import csv from 'csv-parser';
import { createReadStream } from 'fs';
import dbConnect from '../../utils/dbConnect';
import CSV from '../../models/CSV';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { ApiError } from '../../utils/apiError';
import { uploadOnCloudinary } from '../../utils/cloudinary';

const upload = multer({ dest: 'public/uploads/' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default asyncHandler(async (req, res) => {
  await dbConnect();

  if (req.method === 'POST') {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        throw new ApiError(400, 'File upload failed', [err.message]);
      }

      if (!req.file) {
        throw new ApiError(400, 'No file uploaded');
      }

      const { originalname, path } = req.file;

      if (!originalname.endsWith('.csv')) {
        throw new ApiError(400, 'Only CSV files are allowed');
      }

      const cloudinaryResponse = await uploadOnCloudinary(path);
      if (!cloudinaryResponse) {
        throw new ApiError(500, 'Failed to upload file to Cloudinary');
      }

      const results = [];
      const columns = [];

      await new Promise((resolve, reject) => {
        createReadStream(path)
          .pipe(csv())
          .on('headers', (headers) => {
            columns.push(...headers);
          })
          .on('data', (data) => results.push(data))
          .on('end', resolve)
          .on('error', reject);
      });

      const csvFile = new CSV({
        filename: originalname,
        cloudinaryUrl: cloudinaryResponse.url,
        columns,
        data: results,
      });

      await csvFile.save();

      res.status(201).json(new ApiResponse(201, csvFile, 'CSV file uploaded successfully'));
    });
  } else {
    throw new ApiError(405, 'Method not allowed');
  }
});