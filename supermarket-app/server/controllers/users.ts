import type { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/async';
import { UserRequest } from '../middleware/auth';

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Owner
 */
export const getUsers = asyncHandler(async (req: Request, res: Response & { advancedResults?: any }, next: NextFunction) => {
  res.status(200).json(res.advancedResults || { success: true, data: [] });
});

/**
 * @desc    Get single user
 * @route   GET /api/users/:id
 * @access  Private/Owner
 */
export const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Create user (by owner)
 * @route   POST /api/users
 * @access  Private/Owner
 */
export const createUser = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction) => {
  // Set created by field to current user
  req.body.createdBy = req.user.id;

  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Owner
 */
export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Owner
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @desc    Add address to user profile
 * @route   POST /api/users/addresses
 * @access  Private
 */
export const addAddress = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction) => {
  const { address, city, coordinates, isDefault } = req.body;

  // Find user
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // If setting this address as default, remove default from other addresses
  if (isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }

  // Add new address
  user.addresses.push({
    address,
    city,
    coordinates,
    isDefault: isDefault || user.addresses.length === 0, // First address becomes default automatically
  });

  await user.save();

  res.status(200).json({
    success: true,
    data: user.addresses,
  });
});

/**
 * @desc    Update user address
 * @route   PUT /api/users/addresses/:id
 * @access  Private
 */
export const updateAddress = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction) => {
  const addressId = req.params.id;
  const { address, city, coordinates, isDefault } = req.body;

  // Find user
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Find address index
  const addressIndex = user.addresses.findIndex(addr => addr._id?.toString() === addressId);

  if (addressIndex === -1) {
    return next(new ErrorResponse('Address not found', 404));
  }

  // If setting this address as default, remove default from other addresses
  if (isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }

  // Update address
  user.addresses[addressIndex] = {
    ...user.addresses[addressIndex],
    address: address || user.addresses[addressIndex].address,
    city: city || user.addresses[addressIndex].city,
    coordinates: coordinates || user.addresses[addressIndex].coordinates,
    isDefault: isDefault !== undefined ? isDefault : user.addresses[addressIndex].isDefault,
  };

  await user.save();

  res.status(200).json({
    success: true,
    data: user.addresses,
  });
});

/**
 * @desc    Delete user address
 * @route   DELETE /api/users/addresses/:id
 * @access  Private
 */
export const deleteAddress = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction) => {
  const addressId = req.params.id;
  
  // Find user
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Find address index
  const addressIndex = user.addresses.findIndex(addr => addr._id?.toString() === addressId);

  if (addressIndex === -1) {
    return next(new ErrorResponse('Address not found', 404));
  }

  // Check if it's the default address
  const isDefault = user.addresses[addressIndex].isDefault;

  // Remove address
  user.addresses.splice(addressIndex, 1);

  // If we deleted the default address and have other addresses, make the first one default
  if (isDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: user.addresses,
  });
}); 