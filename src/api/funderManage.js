import { Parse } from "./parseConnect.js"

export const FunderMember = Parse.Object.extend("FunderMember", {
  initialize: function (attrs) {
    // Validate attrs
    if (!attrs) return
    if (!attrs.funder_name) throw new Error("Funder name is empty")
    if (!attrs.funder_country) throw new Error("Funder country is empty")
    if (!attrs.member) throw new Error("Member is empty")
    if (!attrs.position) throw new Error("Member position is empty")
  },
  format: function() {
    let ret = {
      id: this.id,
      funder_name: this.get("funder_name"),
      funder_country: this.get("funder_country"),
      position: this.get("position")
    }

    // Check approval status
    if (this.get("approvedAt")) ret.approved_at = this.get("approvedAt")

    return ret
  }
})
Parse.Object.registerSubclass("FunderMember", FunderMember);

export async function queryById(id) {
  const query = new Parse.Query(FunderMember)
  return await query.get(id)
}

export async function queryByUsername(username) {
  const userQuery = new Parse.Query(Parse.User)
  userQuery.equalTo("username", username)
  const query = new Parse.Query(FunderMember)
  query.matchesQuery("member", userQuery)
  
  return await query.find()
}

export async function getFunderMember(user, isRequest = false) {
  // Fetch funder member
  const query = new Parse.Query(FunderMember)
  query.equalTo("member", user)
  if (isRequest) {
    query.doesNotExist("approvedAt")
  } else {
    query.exists("approvedAt")
  }
  return await query.first() // One user should have at most one record
}

export async function setFunderMember(funder) {
  const currentUser = Parse.User.current()
  if (!currentUser) throw new Error("Not logged in")

  // Get funder member status
  let member;
  if (funder.id) member = await queryById(funder.id)

  // Check if funder record changed
  if (member && !member.has("approvedAt")) {
    // If not changed, no need to set again
    let hasChanged = false
    if (member.get("funder_name") !== funder.funder_name) hasChanged = true
    if (member.get("funder_country") !== funder.funder_country) hasChanged = true
    if (member.get("position") !== funder.position) hasChanged = true
    if (!hasChanged) return

    // If not approved, just update it
    member.set("funder_name", funder.funder_name)
    member.set("funder_country", funder.funder_country)
    member.set("position", funder.position)
  } else {
    // If already approved or doesn't exist, create a new member object
    member = new FunderMember({
      funder_name: funder.funder_name,
      funder_country: funder.funder_country,
      member: currentUser,
      position: funder.position
    })
  }

  // Save funder member object
  await member.save()
}

export async function fetchFunderInfo(username) {
  // Get funder member status
  const members = await queryByUsername(username)

  // Format and return
  return members.map(e => e.format())
}

export async function removeFunderStatus(username) {
  // Get funder member status
  const members = await queryByUsername(username)

  if (members.length > 0) await Parse.Object.destroyAll(members)
}

// Count funder requests
export async function countFunderRequest() {
  // Check logged in
  const currentUser = Parse.User.current()
  if (!currentUser) throw new Error("Not logged in")

  // Count funder requests and return
  const query = new Parse.Query(FunderMember)
  query.doesNotExist("approvedAt")
  return await query.count({})
}

// List funders
export async function listFunders(filter = "", limit = 10, skip = 0, requests = true) {
  // Check logged in
  const currentUser = Parse.User.current()
  if (!currentUser) throw new Error("Not logged in")

  // Set member name filter
  const query = new Parse.Query("FunderMember")
  if (filter) {
    // Filter by first and last name
    const firstNameQuery = new Parse.Query(Parse.User)
    const lastNameQuery = new Parse.Query(Parse.User)
    firstNameQuery.startsWith("first_name", filter)
    lastNameQuery.startsWith("last_name", filter)
    const userQuery =  Parse.Query.or(firstNameQuery, lastNameQuery)
    query.matchesQuery("member", userQuery)
  }

  // Set pagination
  query.limit(limit)
  query.skip(skip)

  // Retrieve requests or approved
  if (requests) {
    query.doesNotExist("approvedAt")
  } else {
    query.exists("approvedAt")
  }

  // Retrive funders
  query.include("member")
  query.withCount()
  const funders = await query.find()

  // Format and return
  const formatted = funders.results.map((funder) => {
    const member = funder.get("member")

    let ret = {
      id: funder.id,
      member: {
        first_name: member.get("first_name"),
        last_name: member.get("last_name"),
        username: member.get("username"),
        profile_image: member.get("profile_image")
      },
      position: funder.get("position"),
      agency: {
        name: funder.get("funder_name"),
        country: funder.get("funder_country")
      },
      created_at: funder.get("createdAt")
    }

    if (funder.get("approvedAt")) ret.approved_at = funder.get("approvedAt")

    return ret
  })

  return {
    results: formatted,
    count: funders.count
  }
}

// Approve funder request
export async function approveFunderRequest(requestId) {
  // Check logged in
  const currentUser = Parse.User.current()
  if (!currentUser) throw new Error("Not logged in")

  // Get funder object
  const query = new Parse.Query("FunderMember")
  const funder = await query.get(requestId)
  if (!funder) throw new Error("Invalid fudner ID")

  // Approve request
  funder.set("approvedAt", new Date())
  await funder.save()
}

// Remove funder or request
export async function removeFunder(requestId) {
  // Check logged in
  const currentUser = Parse.User.current()
  if (!currentUser) throw new Error("Not logged in")

  // Get funder object
  const query = new Parse.Query("FunderMember")
  const funder = await query.get(requestId)
  if (!funder) throw new Error("Invalid fudner ID")

  await funder.destroy()
}