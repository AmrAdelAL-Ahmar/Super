interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

/**
 * Login user
 */
export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '1',
        email: credentials.email,
        name: 'User Name',
        role: 'customer'
      });
    }, 1000);
  });
};

/**
 * Register user
 */
export const registerUser = async (userData: RegisterData): Promise<User> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '1',
        email: userData.email,
        name: userData.name,
        role: 'customer'
      });
    }, 1000);
  });
};

/**
 * Forgot password
 */
export const forgotPassword = async (email: string): Promise<boolean> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<boolean> => {
  // In a real app, this would be a fetch call to the API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}; 