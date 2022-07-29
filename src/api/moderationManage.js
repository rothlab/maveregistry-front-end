import { Parse } from "./parseConnect.js"

// List users
export async function listUsers(filter = "", limit = undefined, skip = 0) {
  return await Parse.Cloud.run("listUsers", { filter: filter, limit: limit, skip: skip })
}

// Block and unblock user
export async function blockUnblockUser(userId, state) {
  return await Parse.Cloud.run("blockUnblockUser", { user_id: userId, state: state })
}

// Grant moderator role
export async function grantModeratorRole(userId, state) {
  return await Parse.Cloud.run("setModeratorRole", { user_id: userId, state: state })
}

// List projects
export async function listProjects(filter = "", limit = 10, skip = 0) {
  return await Parse.Cloud.run("listProjects", { filter: filter, limit: limit, skip: skip })
}