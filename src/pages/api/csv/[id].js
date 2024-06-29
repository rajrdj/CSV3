import dbConnect from '../../../utils/dbConnect';
import CSV from '../../../models/CSV';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiResponse } from '../../../utils/apiResponse';
import { ApiError } from '../../../utils/apiError';

export default asyncHandler(async (req, res) => {
  await dbConnect();

  const { id } = req.query;

  if (req.method === 'GET') {
    const csv = await CSV.findById(id);
    if (!csv) {
      throw new ApiError(404, 'CSV file not found');
    }
    res.status(200).json(new ApiResponse(200, csv, 'CSV file fetched successfully'));
  } else if (req.method === 'DELETE') {
    const csv = await CSV.findByIdAndDelete(id);
    if (!csv) {
      throw new ApiError(404, 'CSV file not found');
    }
    res.status(200).json(new ApiResponse(200, null, 'CSV file deleted successfully'));
  } else {
    throw new ApiError(405, 'Method not allowed');
  }
});