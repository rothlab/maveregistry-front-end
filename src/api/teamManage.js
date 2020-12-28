import { Parse } from "./parseConnect.js"
import { getFollowStatus } from "./followManage.js"
import { fetchProjectByTeamId } from "./projectManage.js"

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
  format: async function (detail = false, project = false, follow = false, collaborators = false) {
    let ret = {
      id: this.id,
      first_name: this.get("first_name"),
      last_name: this.get("last_name"),
      email: this.get("email"),
      affiliation: this.get("affiliation"),
      website: this.get("website"),
      update_date: this.get("updatedAt")
    }

    // Fetch creator
    const creator = this.get("creator")
    if (creator && creator.isDataAvailable()) {
      ret.creator = {
        id: creator.id,
        username: creator.get("username"),
        first_name: creator.get("first_name"),
        last_name: creator.get("last_name"),
        profile_image: creator.get("profile_image")
      }
    }

    if (detail) {
      // Fetch members
      const members = await fetchMembers(this)
      ret.members = members
    }

    // Fetch Project
    if (project) {
      let objects = ["target", "recent_activity", "public_activity"]
      if (collaborators) objects.push("collaborators")
      const projects = await fetchProjectByTeamId(this.id, objects)
      if (projects && projects.length > 0) ret.projects = projects
    }

    // Fetch follow status
    if (follow) {
      const follow = await getFollowStatus([this.id], "team", Parse.User.current())
      if (follow && follow.length > 0) ret.follow_status = follow[0]
    }

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

// Define team member object
export const TeamMember = Parse.Object.extend("TeamMember", {
  initialize: function (attrs) {
    // Validate attrs
    if (!attrs) return
    if (!attrs.type) throw new Error("Member request type is not defined")
    if (!["request", "invite"].includes(attrs.type)) throw new Error("Member request type is not valid")
    if (!attrs.member) throw new Error("Member is not defined")
    if (!attrs.target) throw new Error("Member request target is not defined")
  },
  format: function () {
    const member = this.get("member")

    let ret = {
      id: this.id,
      type: this.get("type"),
      created_at: this.get("createdAt"),
      member: {
        id: member.id,
        username: member.get("username"),
        first_name: member.get("first_name"),
        last_name: member.get("last_name"),
        profile_image: member.get("profile_image")
      }
    }

    if (this.get("approvedAt")) ret.approved_at = this.get("approvedAt")

    return ret
  }
}, {
  create: async function(attrs) {
    // Check if exists
    let query = new Parse.Query(TeamMember)
    if (attrs.id) {
      // An id is provided, use it as the key
      query.equalTo("objectId", attrs.id)
    } else {
      query.equalTo("target", attrs.target)
      query.equalTo("member", attrs.member)
      query.equalTo("type", attrs.type)
    }

    const result = await query.first()

    // If a team member is already found, we just need to return it
    if (result) return result
    
    return new TeamMember(attrs)
  }
})
Parse.Object.registerSubclass('TeamMember', TeamMember);

export async function addTeam(teamInfo) {
  // Validate if logged in
  const currentUser = Parse.User.current()
  if (!currentUser) throw new Error("Not logged in")

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

  // Set the current user as the creator of the team
  team.set("creator", currentUser)

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
export async function fetchTeams(limit, skip, filter = undefined, objects = []) {
  Parse.User._clearCache()

  let query = new Parse.Query(Team)
  if (filter) {
    if (filter.pi) {
      const firstNameQuery = new Parse.Query(Team)
      const lastNameQuery = new Parse.Query(Team)
      firstNameQuery.startsWith('first_name', filter.pi.toLowerCase())
      lastNameQuery.startsWith('last_name', filter.pi.toLowerCase())
    
      // Execute OR query
      query = Parse.Query.or(firstNameQuery, lastNameQuery)
    }

    if (filter.created_after) query.greaterThanOrEqualTo("createdAt", filter.created_after)
    
    if (filter.conditions && filter.conditions.length > 0) {
      if (filter.conditions.includes("creator")) query.equalTo("creator", Parse.User.current())
    }
  }
  
  // Apply pagination
  if (objects.includes("creator")) {
    query.include("creator")
    query.select([
      "first_name", "last_name", "email", "affiliation", "website", "updatedAt",
      "creator.username", "creator.first_name", "creator.last_name", "creator.profile_image",
    ])
  }
  query.limit(limit)
  query.skip(skip)
  query.withCount() // include total amount of targets in the DB
  
  let teams = await query.find()
  teams.results = await Promise.all(teams.results.map(e => 
    e.format(false, objects.includes("project"), objects.includes("follow")))) // Format targets
  
  // Format and return
  return teams
}

export async function queryById(id, detail = false, followers = false, collaborators = false) {
  let objects = []
  if (detail) objects.push("creator")
  
  const team = await new Team.fetchById(id, objects)
  if (!team) return

  return team.format(detail, true, followers, collaborators)
}

export async function removeMember(teamId, username) {
  await Parse.Cloud.run("removeMember", { username: username, team_id: teamId})
}

export async function fetchTeamOwnershipsByUserId(id) {
  const userQuery = new Parse.Query(Parse.User)
  userQuery.equalTo("objectId", id)
  const query = new Parse.Query(Team)
  query.matchesQuery("creator", userQuery)

  const teams = await query.find()

  return await Promise.all(teams.map(e => e.format()))
}

export async function fetchMembers(team) {
  // Fetch team members
  const query = new Parse.Query(TeamMember)
  query.equalTo("target", team)
  query.include("member")
  const members = await query.find()
  return members.map(e => e.format())
}

export async function obtainTeam(id) {
  await Parse.Cloud.run("obtainObject", { type: "team", id: id })
}

export async function deleteTeam(teamId) {
  // Fetch team and delete
  const team = await new Team.fetchById(teamId)
  return await team.destroy()
}

export async function fetchTeamAffiliationsByUserId(id) {
  // Fetch team members
  const userQuery = new Parse.Query(Parse.User)
  userQuery.equalTo("objectId", id)
  const query = new Parse.Query(TeamMember)
  query.matchesQuery("member", userQuery)
  query.exists("approvedAt")
  query.include("target")
  const members = await query.find()

  // Format teams
  const teams = members.map(e => e.get("target"))
  return await Promise.all(teams.map(e => e.format()))
}

export async function joinTeam(teamId, type, userId = undefined) {
  // Check current user
  const currentUser = Parse.User.current()
  if (!currentUser) throw new Error("Not logged in")

  // Fetch team
  const team = await new Team.fetchById(teamId)

  // Construct member attributes
  let attrs = {
    type: type,
    target: team,
    member: currentUser,
  }
  // If the request is an invitation from team creator,
  // then member needs to be assigned to the invitee
  if (type === "invite") {
    // Fetch user
    const query = new Parse.Query(Parse.User)
    const user = await query.get(userId)
    if (!user) throw new Error("User does not exist")
    attrs.member = user
  }

  // Create team member
  const member = await new TeamMember.create(attrs)

  // Throw error if member already exist
  if (member.id) throw new Error("Team member exists")

  // Save member and return
  return await member.save()
}

export async function acceptJoinRequest(requestId) {
  // Check current user
  const currentUser = Parse.User.current()
  if (!currentUser) throw new Error("Not logged in")

  // Fetch team member
  const member = await new TeamMember.create({ id: requestId })

  // Approve request
  member.set("approvedAt", new Date())
  await member.save()
}

export async function rejectJoinRequest(requestId) {
    // Check current user
    const currentUser = Parse.User.current()
    if (!currentUser) throw new Error("Not logged in")

    // Fetch team member
    const member = await new TeamMember.create({ id: requestId })

    // Delete team member
    if (!member) throw new Error("Invalid request")
    await member.destroy()
}

export async function leaveTeam(memberId) {
  // Check current user
  const currentUser = Parse.User.current()
  if (!currentUser) throw new Error("Not logged in")

  // Fetch member
  const query = new Parse.Query(TeamMember)
  const member = await query.get(memberId)

  // Remove member
  await member.destroy()
}

export async function acceptInvitation(memberId) {
  // Check current user
  const currentUser = Parse.User.current()
  if (!currentUser) throw new Error("Not logged in")

  // Fetch member
  const query = new Parse.Query(TeamMember)
  const member = await query.get(memberId)

  // Set approved at time
  member.set("approvedAt", new Date())
  await member.save()
}