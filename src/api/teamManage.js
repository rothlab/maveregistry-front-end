import { Parse } from "./parseConnect.js"
import { getFollowStatus } from "./followManage.js"
import { fetchProjectByTeamId } from "./projectManage.js"
import { fetchUsersByTeamId } from "./userManage.js"

// Define team object
export const Team = Parse.Object.extend("Team", {
  initialize: function (attrs) {
    // Validate attrs
    if (!attrs) return
    if (attrs.first_name === "") throw new Error("Principal Investigator first name is empty")
    if (attrs.last_name === "") throw new Error("Principal Investigator last name is empty")
    if (attrs.email === "") throw new Error("Principal Investigator email is empty")
    if (attrs.affiliation === "") throw new Error("Principal Investigator affiliation is empty")
  },
  format: async function (detail = false, project = false, follow = false) {
    let ret = {
      id: this.id,
      first_name: this.get("first_name"),
      last_name: this.get("last_name"),
      email: this.get("email"),
      affiliation: this.get("affiliation"),
      website: this.get("website"),
      update_date: this.get("updatedAt")
    }

    if (detail) {
      // Fetch creator
      const user = this.get("creator")
      if (user && user.isDataAvailable()) {
        ret.user = {
          username: user.get("username"),
          first_name: user.get("first_name"),
          last_name: user.get("last_name")
        }
      }

      // Fetch members
      const members = await fetchUsersByTeamId(this.id)
      ret.members = members
    }

    // Fetch Project
    if (project) {
      const projects = await fetchProjectByTeamId(this.id, ["target"])
      if (projects && projects.length > 0) ret.projects = projects
    }

    // Fetch follow status
    if (follow) ret.follow_status = await getFollowStatus([this.id], "team", Parse.User.current())

    return ret
  }
}, {
  create: async function(attrs) {
    // Check if exists
    let query = new Parse.Query(Team)
    if (attrs.id) {
      // An id is provided, use it as the key
      query.equalTo("objectId", attrs.id)
    } else {
      // Otherwise, search by key fields in a case insensitive way
      const nameQuery = new Parse.Query(Team)
      const emailQuery = new Parse.Query(Team)
      nameQuery.equalTo("first_name", attrs.first_name.toLowerCase())
      nameQuery.equalTo("last_name", attrs.last_name.toLowerCase())
      emailQuery.equalTo("email", attrs.email.toLowerCase())

      // Apply OR batch query
      query = Parse.Query.or(nameQuery, emailQuery)
    }

    // Limit to at most one return
    query.limit(1)
    const result = await query.find()

    // If found team object, or we tried to create with an ID, then just return what we have
    // Notice - we might have no result, but it's okay because it just means we didn't find any team object
    // with that given ID
    if (result.length > 0 || attrs.id) return result[0]
    
    // Create a new team object
    return new Team(attrs)
  },
  fetchById: async function(id, objects = []) {
    // Set up basic query
    const query = new Parse.Query(Team)
    query.equalTo("objectId", id)

    // Include additional objects
    for (let index = 0; index < objects.length; index++) {
      query.include(objects[index])
    }

    const res = await query.find()

    return res[0]
  }
})
Parse.Object.registerSubclass('Team', Team);

export async function addTeam(teamInfo) {
  // Validate if logged in
  if (!Parse.User.current()) throw new Error("Not logged in")

  // Initialize team
  // First, last and email are stored in lower case so that it can be queried in a case-insensitive way
  const team = await new Team.create({
    first_name: teamInfo.first_name.toLowerCase(),
    last_name: teamInfo.last_name.toLowerCase(),
    email: teamInfo.email.toLowerCase(),
    affiliation: teamInfo.affiliation,
    website: teamInfo.website
  })

  // If already exists, throw an error
  // Because existing team has an assigned ID, we use that to distinguish
  if (team.id) throw new Error("Team exists")

  // Add creator and save
  team.set("creator", Parse.User.current())
  return await team.save()
}

export async function updateTeam(id, payload) {
  const team = await new Team.fetchById(id)

  // Update
  team.set("first_name", payload.first_name)
  team.set("last_name", payload.last_name)
  team.set("email", payload.email)
  team.set("affiliation", payload.affiliation)
  if (payload.website) team.set("website", payload.website)
  
  return await team.save()
}
export async function fetchTeams(limit, skip, objects = []) {
  // Fetch teams
  const query = new Parse.Query(Team)

  // Apply pagination
  query.limit(limit)
  query.skip(skip)
  query.withCount() // include total amount of targets in the DB
  let teams = await query.find()
  teams.results = await Promise.all(teams.results.map(e => e.format(false, objects.includes("project"), objects.includes("follow")))) // Format targets
  
  // Format and return
  return teams
}

export async function queryByName(name, limit, skip, objects = []) {
  // TODO: add pagination
  const firstNameQuery = new Parse.Query(Team)
  const lastNameQuery = new Parse.Query(Team)
  firstNameQuery.startsWith('first_name', name.toLowerCase())
  lastNameQuery.startsWith('last_name', name.toLowerCase())

  // Execute OR query
  const query = Parse.Query.or(firstNameQuery, lastNameQuery)

  // Apply pagination
  query.limit(limit)
  query.skip(skip)
  query.withCount() // include total amount of targets in the DB
  let teams = await query.find()
  teams.results = await Promise.all(teams.results.map(e => e.format(false, objects.includes("project"), objects.includes("follow"))))

  return teams
}

export async function queryByAffiliation(affiliation, limit, skip, objects = []) {
  const query = new Parse.Query(Team)
  query.fullText("affiliation", affiliation)

  // Apply pagination
  query.limit(limit)
  query.skip(skip)
  query.withCount() // include total amount of targets in the DB
  let teams = await query.find()
  teams.results = await Promise.all(teams.results.map(e => e.format(false, objects.includes("project"), objects.includes("follow"))))

  return teams
}

export async function queryById(id, detail = false, followers = false) {
  let objects = []
  if (detail) objects.push("creator")
  
  const team = await new Team.fetchById(id, objects)
  if (!team) throw new Error("Invalid team ID")

  return team.format(detail, followers)
}

export async function removeMember(teamId, username) {
  // Fetch user
  const query = new Parse.Query(Parse.User)
  query.equalTo("username", username)
  let user = await query.find()
  user = user[0]

  // Valid user belongs to a team and the team ID matches
  const userTeam = user.get("team")
  if (!userTeam || userTeam.id !== teamId) throw Error("User team mismatch")
  user.unset("team")
  await user.save()
}