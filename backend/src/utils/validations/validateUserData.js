const validator = require("validator");

const validateSignupData = (userData) => {
  const { firstName, lastName, emailId, password, role } = userData;

  if (!firstName || firstName.trim().length < 3) {
    throw new Error("First name is required with minimum 3 characters");
  }

  if (!lastName || lastName.trim().length < 3) {
    throw new Error("Last name is required with minimum 3 characters");
  }

  if (!emailId || !validator.isEmail(emailId.toLowerCase().trim())) {
    throw new Error("A valid email is required");
  }

  if (!password || !validator.isStrongPassword(password)) {
    throw new Error(
      "A strong password is required (min 8 chars, with letters, numbers & symbols)"
    );
  }

  if (role && !["CUSTOMER"].includes(role)) {
    throw new Error("Only 'CUSTOMER' role is allowed during signup");
  }
};

const validateLoginData = (userData) => {
  const { emailId, password } = userData;

  if (!emailId || !validator.isEmail(emailId.toLowerCase().trim())) {
    throw new Error("A valid email is required");
  }

  if (!password) {
    throw new Error("Password is required");
  }
};

module.exports = {
  validateSignupData,
  validateLoginData,
};
