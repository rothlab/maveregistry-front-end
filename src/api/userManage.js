import { Parse } from "./parseConnect"

// Log in user with password
export async function loginUserPassword (username, password) {
  let res = {
  }

  // Authenticate
  try {
    const user = await Parse.User.logIn(username, password)

    // Parse user
    res.user = {
      username: user.get("username"),
      email: user.get("email"),
      first_name: user.get("first_name"),
      last_name: user.get("last_name")
    }
  } catch (e) {
    res.error = e
  }

  return res
}