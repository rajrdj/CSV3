import dbConnect from '../../../utils/dbConnect';
import CSV from '../../../models/CSV';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiResponse } from '../../../utils/apiResponse';
import { ApiError } from '../../../utils/apiError';

export default asyncHandler(async (req, res) => {
  await dbConnect();

  if (req.method === 'GET') {
    const csvFiles = await CSV.find({}, 'filename cloudinaryUrl');
    res.status(200).json(new ApiResponse(200, csvFiles, 'CSV files fetched successfully'));
  } else {
    throw new ApiError(405, 'Method not allowed');
  }
});