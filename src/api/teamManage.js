import { Parse } from "./parseConnect"

// Define team object
const Team = Parse.Object.extend("Team", {
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
      website: this.get("website")
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
    const result = await query.find()
    if (result.length >= 1) return result[0] // If found, just return the team object
    
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
  await team.save()
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