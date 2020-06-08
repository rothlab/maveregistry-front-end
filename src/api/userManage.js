import { Parse } from "./parseConnect.js"

// Helper: parse user metadata
function parseUserMetadata (user) {
  return {
    username: user.get("username"),
    email: user.get("email"),
    first_name: user.get("first_name"),
    last_name: user.get("last_name"),
    website: user.get("website"),
    profile_image: user.get("profile_image"),
  }
}

// Log in user with password
export async function loginUserPassword (username, password) {
  // Authenticate
  const user = await Parse.User.logIn(username, password)
  
  return parseUserMetadata(user)
}

// Log in user from cache
export async function loginUserCache () {
  const currentUser = Parse.User.current()
  if (currentUser) return parseUserMetadata(currentUser)

  return undefined
}

// Sign up user with username, email and password
export async function signupUserPassword (username, email, password, firstName, lastName) {
  // Prepare new user
  let user = new Parse.User()
  user.set("username", username)
  user.set("email", email)
  user.set("password", password)
  user.set("first_name", firstName)
  user.set("last_name", lastName)

  // Sign up
  const retUser = await user.signUp()

  return parseUserMetadata(retUser)
}

// Sign up user with Google auth code
export async function signupLoginUserGoogle (userInfo) {
  // Link account
  let user = new Parse.User()
  user.set("email", userInfo.email)
  user.set("first_name", userInfo.first_name)
  user.set("last_name", userInfo.last_name)
  user.set("profile_image", userInfo.profile_image)
  await user.linkWith("google", {
    authData: userInfo.auth
  })

  return parseUserMetadata(Parse.User.current())
}

// Sign up user with ORCID OAuth2
export async function signupLoginUserOrcid (userInfo) {
  // Register provider
  const provider = {
    authenticate: () => Promise.resolve(),
    restoreAuthentication() {
      return true;
    },
  
    getAuthType() {
      return 'orcid';
    },

    getAuthData() {
      return {
        authData: userInfo.auth
      }
    }
  };
  Parse.User._registerAuthenticationProvider(provider);

  let res = new Object

  // Link account
  let user = new Parse.User()
  user.set("email", userInfo.email)
  user.set("first_name", userInfo.first_name)
  user.set("last_name", userInfo.last_name)
  user.set("profile_image", userInfo.profile_image)

  // Check if current user has email
  // Because user might use the log in function to sign up
  // We need to handle that case
  const ret = await user.linkWith(provider.getAuthType(), provider.getAuthData())

  // Set user info
  res = parseUserMetadata(Parse.User.current())
  res.hasEmail = ret.getEmail() !== ""

  return res
}

// Log out user
export async function logoutUser () {

  return await Parse.User.logOut()
}

// Fetch user info with username
export async function fetchUserInfo (username) {
  // Clear cache
  Parse.User._clearCache()

  // Query user info
  const query = new Parse.Query(Parse.User)
  query.equalTo("username", username)
  const user = await query.find()
  if (user.length > 0) {
    return parseUserMetadata(user[0])
  } else {
    throw new Error(`User does not exist`)
  }
}

// Update user profile
export async function updateUserProfile (userInfo) {
  // We can only change profile for the current logged in user
  let user = Parse.User.current();
  if (!user) return

  // Update user info
  if (userInfo.username) user.set("username", userInfo.username)
  if (userInfo.first_name) user.set("first_name", userInfo.first_name)
  if (userInfo.last_name) user.set("last_name", userInfo.last_name)
  if (userInfo.email) user.set("email", userInfo.email)
  if (userInfo.website) user.set("website", userInfo.website)
  if (userInfo.profile_image) user.set("profile_image", userInfo.profile_image)

  // Save user info changes
  const retUser = await user.save()
  return parseUserMetadata(retUser)
}

// Reset password
export async function resetPassword (email) {
  return await Parse.User.requestPasswordReset(email)
}