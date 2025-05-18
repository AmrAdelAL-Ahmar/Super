// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Time format validation (24-hour format)
export const isValidTime = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Coordinate validation
export const isValidCoordinate = (lat: number, lng: number): boolean => {
  return (
    lat >= -90 && lat <= 90 && // Latitude range
    lng >= -180 && lng <= 180 // Longitude range
  );
};

// Price validation
export const isValidPrice = (price: number): boolean => {
  return price >= 0 && Number.isFinite(price);
};

// Quantity validation
export const isValidQuantity = (quantity: number): boolean => {
  return quantity > 0 && Number.isInteger(quantity);
};

// Rating validation
export const isValidRating = (rating: number): boolean => {
  return rating >= 1 && rating <= 5 && Number.isFinite(rating);
};

// ObjectId validation
export const isValidObjectId = (id: string): boolean => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
}; 