module.exports = function validateUser({ name, email, password, address }) {
    const errors = [];
  
    if (!name || name.length < 20 || name.length > 60) {
      errors.push("Name must be 20-60 characters.");
    }

    // if (!name ) {
    //   errors.push("Name must be 20-60 characters.");
    // }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push("Invalid email format.");
    }
  
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;
    if (!password || password.length < 8 || password.length > 16 || !passRegex.test(password)) {
      errors.push("Password must be 8-16 chars, with 1 uppercase and 1 special character.");
    }
  
    if (!address || address.length > 400) {
      errors.push("Address must be less than 400 characters.");
    }
  
    return errors;
  };
  