// A well-written user authentication module

const users = new Map();

/**
 * Registers a new user with a hashed password
 * @param {string} username
 * @param {string} password
 * @returns {{ success: boolean, message: string }}
 */
function registerUser(username, password) {
  if (!username || !password) {
    return { success: false, message: "Username and password are required" };
  }

  if (users.has(username)) {
    return { success: false, message: "User already exists" };
  }

  // Simulate hashing (in real code, use bcrypt)
  const hashedPassword = Buffer.from(password).toString("base64");
  users.set(username, { hashedPassword, createdAt: new Date() });

  return { success: true, message: "User registered successfully" };
}

/**
 * Authenticates a user
 * @param {string} username
 * @param {string} password
 * @returns {boolean}
 */
function loginUser(username, password) {
  const user = users.get(username);
  if (!user) return false;

  const hashedPassword = Buffer.from(password).toString("base64");
  return user.hashedPassword === hashedPassword;
}

export { registerUser, loginUser };
