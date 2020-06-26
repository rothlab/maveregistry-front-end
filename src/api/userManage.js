import { Parse } from "./parseConnect.js"
import { Team } from "./teamManage.js"

// Helper: parse user metadata
function parseUserMetadata (user, includeTeam = true) {
  let ret = {
    username: user.get("username"),
    email: user.get("email"),
    first_name: user.get("first_name"),
    last_name: user.get("last_name"),
    website: user.get("website"),
    profile_image: user.get("profile_image"),
    email_validated: user.get("emailVerified")
  }

  if (includeTeam) {
    // Get team when available
    const team = user.get("team")
    if (team) ret.team = team.id
  }

  return ret
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
  user.set("first_name", firstName.toLowerCase())
  user.set("last_name", lastName.toLowerCase())

  // Sign up
  const retUser = await user.signUp()

  return parseUserMetadata(retUser)
}

// Sign up user with Google auth code
export async function signupLoginUserGoogle (userInfo) {
  // Link account
  let user = new Parse.User()
  user.set("email", userInfo.email)
  user.set("first_name", userInfo.first_name.toLowerCase())
  user.set("last_name", userInfo.last_name.toLowerCase())
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

  // Link account
  let user = new Parse.User()
  user.set("email", userInfo.email)
  user.set("first_name", userInfo.first_name.toLowerCase())
  user.set("last_name", userInfo.last_name.toLowerCase())
  user.set("profile_image", userInfo.profile_image)

  // Check if current user has email
  // Because user might use the log in function to sign up
  // We need to handle that case
  await user.linkWith(provider.getAuthType(), provider.getAuthData())

  // Set user info and return
  return parseUserMetadata(Parse.User.current())
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
  if (userInfo.first_name) user.set("first_name", userInfo.first_name.toLowerCase())
  if (userInfo.last_name) user.set("last_name", userInfo.last_name.toLowerCase())
  // Only update user email if it's changed
  // Because every time it's updated, a new verification email will be sent
  if (userInfo.email && userInfo.email !== user.get("email")) user.set("email", userInfo.email)
  if (userInfo.website) user.set("website", userInfo.website)
  if (userInfo.profile_image) user.set("profile_image", userInfo.profile_image)
  if (userInfo.team) {
    const team = await new Team.fetchById(userInfo.team)
    user.set("team", team)
  }

  // Save user info changes
  const retUser = await user.save()
  return parseUserMetadata(retUser)
}

// Reset password
export async function resetPassword (email) {
  return await Parse.User.requestPasswordReset(email)
}

export async function fetchUsersByTeamId (id) {
  // Construct query
  const teamQuery = new Parse.Query(Team)
  teamQuery.equalTo("objectId", id)
  const query = new Parse.Query(Parse.User)
  query.matchesQuery("team", teamQuery)
  const members = await query.find()

  return members.map(e => parseUserMetadata(e, false))
}

// Resend validation email
export async function resendValidationEmail (username) {
  return await Parse.Cloud.run("resendVerificationEmail", { username: username })
}

// Get user roles
export async function getRoles() {
  // We can only get roles for the current user
  let user = Parse.User.current()
  if (!user) return

  return await Parse.Cloud.run("getRoles")
}