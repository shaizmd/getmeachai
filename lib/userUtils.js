// lib/utils.js - Centralized username utilities
export const formatUsername = (user) => {
  if (!user) return 'user';
  
  // Priority: name > email username > fallback
  if (user.name && user.name !== user.email?.split('@')[0]) {
    // Real name exists (from OAuth)
    return user.name
      .replace(/[^a-zA-Z0-9]/g, '') // Remove all special chars and spaces
      .toLowerCase(); // Consistent lowercase
  }
  
  if (user.email) {
    // Extract username from email
    return user.email.split('@')[0].toLowerCase();
  }
  
  return 'user';
};

/**
 * Validates if a username is valid
 * @param {string} username - The username to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return false;
  }
  
  // Check length (3-30 characters)
  if (username.length < 3 || username.length > 30) {
    return false;
  }
  
  // Check for valid characters (alphanumeric, hyphens, underscores)
  const validUsernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!validUsernameRegex.test(username)) {
    return false;
  }
  
  // Check that it doesn't start or end with special characters
  if (username.startsWith('-') || username.startsWith('_') || 
      username.endsWith('-') || username.endsWith('_')) {
    return false;
  }
  
  return true;
};
