import { Router } from 'express';
import { AddressController } from '../controllers/address.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { addressValidation } from '../validations/address.validation';

const router = Router();
const addressController = new AddressController();

// All routes require authentication
router.use(authenticate);

// Address management
router.get('/', addressController.getAddresses);
router.post(
  '/',
  validate(addressValidation.createAddress),
  addressController.createAddress
);

router.get(
  '/:id',
  addressController.getAddressById
);

router.put(
  '/:id',
  validate(addressValidation.updateAddress),
  addressController.updateAddress
);

router.delete(
  '/:id',
  addressController.deleteAddress
);

// Address operations

router.get(
  '/nearby',
  validate(addressValidation.findNearby),
  addressController.findNearby
);

export default router; 