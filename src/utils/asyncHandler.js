import { ApiError } from './apiError';
import { ApiResponse } from './apiResponse';

const asyncHandler = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error(error);

    if (error instanceof ApiError) {
      res.status(error.statusCode).json(
        new ApiResponse(error.statusCode, null, error.message)
      );
    } else {
      res.status(500).json(
        new ApiResponse(500, null, "An unexpected error occurred")
      );
    }
  }
};

export { asyncHandler };