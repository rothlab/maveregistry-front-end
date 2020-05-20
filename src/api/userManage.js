import { Parse } from "./parseConnect"

// Helper: parse user metadata
function parseUserMetadata (user) {
  return {
    username: user.get("username"),
    email: user.get("email"),
    first_name: user.get("first_name"),
    last_name: user.get("last_name")
  }
}

// Log in user with password
export async function loginUserPassword (username, password) {
  let res = new Object

  // Authenticate
  try {
    const user = await Parse.User.logIn(username, password)

    // Parse user
    res.user = parseUserMetadata(user)
  } catch (e) {
    res.error = e
  }

  return res
}

// Sign up user with username, email and password
export async function signupUserPassword (username, email, password, firstName, lastName) {
  let res = new Object

  // Prepare new user
  let user = new Parse.User()
  user.set("username", username)
  user.set("email", email)
  user.set("password", password)
  user.set("first_name", firstName)
  user.set("last_name", lastName)

  // Sign up
  try {
    const retUser = await user.signUp()

    // Parse user
    res.user = parseUserMetadata(retUser)
  } catch (e) {
    res.error = e
  }

  return res
}