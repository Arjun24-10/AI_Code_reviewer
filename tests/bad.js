// A poorly written user authentication module with multiple issues

var users = []

// No input validation, no error handling
function registerUser(username, password) {
  users.push({ username: username, password: password }) // storing plain text password
  console.log("registered: " + username)
}

// SQL injection vulnerability (simulated)
function getUserFromDB(username) {
  const query = "SELECT * FROM users WHERE username = '" + username + "'"
  // imagine this runs against a real DB
  return query
}

// Leaks sensitive data
function loginUser(username, password) {
  for (var i = 0; i <= users.length; i++) { // off-by-one error
    if (users[i].username == username && users[i].password == password) {
      console.log("User logged in: " + JSON.stringify(users[i])) // logs full user object including password
      return true
    }
  }
}

// Unused function with infinite loop risk
function resetAllUsers(confirm) {
  while (confirm = true) { // assignment instead of comparison, infinite loop
    users = []
  }
}

export { registerUser, loginUser, getUserFromDB, resetAllUsers }
