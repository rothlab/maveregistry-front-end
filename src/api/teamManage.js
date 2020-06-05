import { Parse } from "./parseConnect"

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
  format: function () {
    return {
      id: this.id,
      first_name: this.get("first_name"),
      last_name: this.get("last_name"),
      email: this.get("email"),
      affiliation: this.get("affiliation"),
      website: this.get("website"),
    }
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
    if (result.length > 0 || attrs.id) return result
    
    // Create a new team object
    return new Team(attrs)
  }
})

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

export async function fetchTeams(limit, skip) {
  // Fetch teams, applying pagination
  const query = new Parse.Query(Team)
  query.limit(limit)
  query.skip(skip)
  query.withCount() // include total amount of targets in the DB
  let teams = await query.find()
  teams.results = teams.results.map(e => e.format()) // Format targets
  
  // Format and return
  return teams
}

export async function queryByName(name) {
  // TODO: add pagination
  const firstNameQuery = new Parse.Query(Team)
  const lastNameQuery = new Parse.Query(Team)
  firstNameQuery.startsWith('first_name', name.toLowerCase())
  lastNameQuery.startsWith('last_name', name.toLowerCase())

  // Execute OR query
  const query = Parse.Query.or(firstNameQuery, lastNameQuery)
  query.withCount() // include total amount of targets in the DB
  let teams = await query.find()
  teams.results = teams.results.map(e => e.format())

  return teams
}

export async function queryById(id) {
  const team = await new Team.create({ id: id })
  
  return team.format()
}