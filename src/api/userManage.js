import { Parse } from "./parseConnect.js"
import { Team } from "./teamManage.js"
import { uploadProfilePic } from "./fileManage.js"

// Helper: parse user metadata
function parseUserMetadata (user, includeTeam = true) {
  let ret = {
    username: user.get("username"),
    email: user.get("email"),
    first_name: user.get("first_name"),
    last_name: user.get("last_name"),
    website: user.get("website"),
    email_validated: user.get("emailVerified")
  }

  const profileImage = user.get("profile_image")
  if (profileImage) ret.profile_image = profileImage.url()
  
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
  if (currentUser && currentUser.get("username")) {
    return await fetchUserInfo(currentUser.get("username"))
  }

  return
}

// Sign up user with username, email and password
export async function signupUserPassword (userInfo) {
  // Prepare new user
  let user = new Parse.User()
  user.set("username", userInfo.username)
  user.set("email", userInfo.email)
  user.set("password", userInfo.password)
  user.set("first_name", userInfo.first_name.toLowerCase())
  user.set("last_name", userInfo.last_name.toLowerCase())
  user.set("captcha_token", userInfo.captcha_token)

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
  user = await user.linkWith("google", {
    authData: userInfo.auth
  })

  // If new user, store profile picture locally
  if (!user.get("profile_image")) {
    const profileImage = userInfo.profile_image
    if (profileImage) {
      const currentUser = await uploadProfilePic(profileImage, user.id)
      if (currentUser) Parse.User.become(currentUser)
    }
  }

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
export async function fetchUserInfo (username, preference = false) {
  // Clear cache
  Parse.User._clearCache()

  // Query user info
  const query = new Parse.Query(Parse.User)
  query.equalTo("username", username)
  const user = await query.first()
  if (user) {
    let ret = parseUserMetadata(user)
    const prefObject = user.get("notification_preference")
    if (preference && prefObject) ret.notification_preference_id = prefObject.id
    return ret
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
  let hasChanged = false
  if (userInfo.username && userInfo.username !== user.get("username")) {
    hasChanged = true
    user.set("username", userInfo.username)
  }
  if (userInfo.first_name) {
    userInfo.first_name = userInfo.first_name.toLowerCase()
    if (userInfo.first_name !== user.get("first_name")) {
      hasChanged = true
      user.set("first_name", userInfo.first_name)
    }
  }
  if (userInfo.last_name) {
    userInfo.last_name = userInfo.last_name.toLowerCase()
    if (userInfo.last_name !== user.get("last_name")) {
      hasChanged = true
      user.set("last_name", userInfo.last_name)
    }
  }
  // Only update user email if it's changed
  // Because every time it's updated, a new verification email will be sent
  if (userInfo.email && userInfo.email !== user.get("email")) {
    hasChanged = true
    user.set("email", userInfo.email)
  }
  if (userInfo.website && userInfo.website !== user.get("website")) {
    hasChanged = true
    user.set("website", userInfo.website)
  }
  if (userInfo.profile_image && userInfo.profile_image !== user.get("profile_image")) {
    hasChanged = true
    user.set("profile_image", userInfo.profile_image)
  }
  if (userInfo.team && userInfo.team !== user.get("team").id) {
    const team = await new Team.fetchById(userInfo.team)
    hasChanged = true
    user.set("team", team)
  }

  // Save user info changes only if anything is changed
  let retUser = user
  if (hasChanged) retUser = await user.save()
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
  if (!Parse.User.current()) return []

  return await Parse.Cloud.run("getRoles")
}

// Get user email preferences
export async function getEmailPreference(id) {
  if (!Parse.User.current()) return

  const query = new Parse.Query("NotificationPreference")
  const setting = await query.get(id)
  if (!setting) return

  return {
    id: setting.id,
    follow_request: setting.get("email_follow_request"),
    project_update: setting.get("email_project_update"),
    team_update: setting.get("email_team_update"),
    newsletter: setting.get("email_newsletter")
  }
}

// Set user email preference
export async function setEmailPreference(id, preference) {
  if (!Parse.User.current()) return

  const query = new Parse.Query("NotificationPreference")
  const setting = await query.get(id)

  setting.set("email_follow_request", preference.follow_request)
  setting.set("email_project_update", preference.project_update)
  setting.set("email_team_update", preference.team_update)
  setting.set("email_newsletter", preference.newsletter)
  return await setting.save()
}