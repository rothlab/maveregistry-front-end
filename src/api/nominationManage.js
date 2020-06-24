import { Parse } from "./parseConnect.js"
import { Target } from "./projectManage.js"

// Define vote object
export const Vote = Parse.Object.extend("Vote", {
  initialize: function (attrs) {
    // Validate attrs
    if (!attrs) return
    if (!attrs.target || attrs.target === "") throw new Error("Vote target is empty")
    if (!attrs.action || attrs.action === "") throw new Error("Vote action is empty")
    if (!attrs.by) throw new Error("Voter is empty. Pleaes make sure you have logged in.")
  }
}, {
  async fetchById(id) {
    const query = new Parse.Query(Vote)

    return await query.get(id)
  },
  async query(targets, by) {
    const query = new Parse.Query(Vote)
    query.containedIn("target", targets)
    query.equalTo("by", by)
    return await query.find()
  }
})
Parse.Object.registerSubclass('Vote', Vote);

// Define nomination object
export const Nomination = Parse.Object.extend("Nomination", {
  initialize: function (attrs) {
    // Validate attrs
    if (!attrs) return
    if (!attrs.target || attrs.target === "") throw new Error("Nomination target is empty")
    if (!attrs.reason || attrs.reason.length <= 0) throw new Error("Nomination reason is empty")
    if (!attrs.by) throw new Error("Nominator is empty. Pleaes make sure you have logged in.")
  },
  format: async function() {
    let ret = {
      id: this.id,
      reason: this.get("reason"),
      vote: {
        up: this.get("up_count"),
        down: this.get("down_count"),
      }
    }

    // Format target
    const target = this.get("target")
    if (target && target.isDataAvailable()) {
      ret.target = {
        id: target.id,
        name: target.get("name"),
        type: target.get("type"),
        organism: target.get("organism"),
      }
    }

    // Format nominator
    const user = this.get("by")
    if (user && user.isDataAvailable()) {
      ret.by = {
        username: user.get("username"),
        first_name: user.get("first_name"),
        last_name: user.get("last_name")
      }
    }

    return ret
  }
}, {
  fetchById: async function(id, objects = []) {
    // Set up basic query
    const query = new Parse.Query(Nomination)
    query.equalTo("objectId", id)

    // Include additional objects
    for (let index = 0; index < objects.length; index++) {
      query.include(objects[index])
    }

    const res = await query.find()

    return res[0]
  }
})
Parse.Object.registerSubclass('Nomination', Nomination);

export async function fetchNominations(limit = 10, skip = 0, filter) {
  const query = new Parse.Query(Nomination)

  // Apply filter when available
  if (filter.type + filter.organism + filter.name !== "") {
    const targetQuery = new Parse.Query(Target)
    if (filter.type !== '') targetQuery.equalTo("type", filter.type)
    if (filter.organism !== '') targetQuery.equalTo("organism", filter.organism)
    if (filter.name !== '') targetQuery.startsWith("name", filter.name)
    query.matchesQuery("target", targetQuery)
  }

  // Include objects
  query.include("target")
  query.include("by")
  
  // Apply pagination
  query.limit(limit)
  query.skip(skip)
  query.withCount() // include total amount of targets in the DB

  let nominations = await query.find()
  nominations.results = await Promise.all(nominations.results.map(e => e.format()))

  // Retrieve voting status of the current user
  const currentUser = Parse.User.current()
  if (currentUser) {
    const nominationIds = nominations.results.map(e => e.id)
    // Query multiple votes in one shot to reduce the number of connections
    const vote = await new Vote.query(nominationIds, currentUser)
    if (vote && vote.length > 0) {
      nominations.results = nominations.results.map(e => {
        const found = vote.filter(v => v.get("target").id === e.id)
        if (found && found.length > 0) {
          e.vote.current_user = {
            id: found[0].id,
            action: found[0].get("action")
          }
        }

        return e
      })
    }
  }

  return nominations
}

export async function addNomination(info) {
  // Validate if logged in
  const currentUser = Parse.User.current()
  if (!currentUser) throw new Error("Not logged in")

  // Create a target object and check if a target exists
  const target = await Target.create({
    type: info.type,
    name: info.name.toLowerCase(),
    organism: info.organism
  })

  // Create a nomination
  const nomination = new Nomination({
    target: target,
    reason: info.reason,
    by: currentUser,
    up_count: 0,
    down_count: 0
  })

  // Save target and nomination
  await nomination.save()
}

export async function updateNomination(info) {
  // Validate if logged in
  const currentUser = Parse.User.current()
  if (!currentUser) throw new Error("Not logged in")

  // Fetch nomination object
  const nomination = await new Nomination.fetchById(info.id)

  // Update reason and save
  nomination.set("reason", info.reason)
  await nomination.save()
}

export async function deleteNomination(info) {
  // Validate if logged in
  const currentUser = Parse.User.current()
  if (!currentUser) throw new Error("Not logged in")

  // Fetch nomination
  // Note that we purposely do not delete associated votes here because it will be much slower
  // Instead, we use an afterDelete worker to clean it up from the server end
  const nomination = await new Nomination.fetchById(info.id)

  // Delete object
  await nomination.destroy()
}

export async function voteNomination(id, action, voteId = "") {
  // Validate if logged in
  const currentUser = Parse.User.current()
  if (!currentUser) throw new Error("Not logged in")

  // Otherwise, we need to register vote
  // Fetch the nomination
  const nomination = await new Nomination.fetchById(id)

  // If user has registered vote, we just need to update/remove it
  if (voteId !== "") {
    const vote = await new Vote.fetchById(voteId)
    if (!vote) throw new Error("Invalid vote change. Try refresh the page.")

    // If the registered action and the proposed action is the same,
    // it means the user wants to unregister their vote.
    // Otherwise, we just need to update the vote action.
    const currentAction = vote.get("action")
    if (currentAction === action) {
      await vote.destroy()
      nomination.increment(action + "_count", -1)
    } else {
      vote.set("action", action)
      nomination.increment(currentAction + "_count", -1)
      nomination.increment(action + "_count")
      await vote.save()
    }

    return await nomination.save()
  }

  // Register vote
  const vote = new Vote({
    target: nomination,
    by: currentUser,
    action: action
  })
  await vote.save()

  // Update count and save
  nomination.increment(action + "_count")
  await nomination.save()
}

export async function queryVotes(id) {
  // Extract votes from the nomination
  const nomination = await new Nomination.fetchById(id)
  let votes = {
    up: nomination.get("up_count"),
    down: nomination.get("down_count")
  }

  // If logged in, fetch current user's vote
  const currentUser = Parse.User.current()
  if (currentUser) {
    const vote = await new Vote.query([nomination], currentUser)
    if (vote && vote.length > 0) votes.current_user = {
      id: vote[0].id,
      action: vote[0].get("action")
    }
  }

  return votes
}