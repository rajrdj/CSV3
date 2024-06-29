import dbConnect from '../../../../utils/dbConnect';
import CSV from '../../../../models/CSV';
import { asyncHandler } from '../../../../utils/asyncHandler';
import { ApiResponse } from '../../../../utils/apiResponse';
import { ApiError } from '../../../../utils/apiError';
import { deleteFromCloudinary } from '../../../../utils/cloudinary';

export default asyncHandler(async (req, res) => {
  if (req.method !== 'DELETE') {
    throw new ApiError(405, 'Method Not Allowed');
  }

  await dbConnect();

  const { id } = req.query;

  const csv = await CSV.findById(id);
  if (!csv) {
    throw new ApiError(404, 'CSV file not found');
  }

  // Delete from Cloudinary
  const cloudinaryPublicId = csv.cloudinaryUrl.split('/').pop().split('.')[0];
  await deleteFromCloudinary(cloudinaryPublicId);

  // Delete from database
  await CSV.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, null, 'CSV file deleted successfully'));
});