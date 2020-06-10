import { Parse } from "./parseConnect.js"

// Define follow object
export const Follow = Parse.Object.extend("Follow", {
  initialize: function (attrs) {
    // Validate attrs
    if (!attrs) return
    if (!attrs.type || attrs.type === "") throw new Error("Follow type is empty")
    if (!attrs.target || attrs.target === "") throw new Error("Follow target is empty")
    if (!attrs.reason || attrs.reason.length <= 0) throw new Error("Follow reason is empty")
    if (!attrs.by) throw new Error("Follower is empty. Pleaes make sure you have logged in.")
  },
  format: async function () {
    // Fetch user
    const user = await this.get("by").fetch()

    return {
      id: this.id,
      type: this.get("type"),
      by: {
        username: user.get("username"),
        first_name: user.get("first_name"),
        last_name: user.get("last_name"),
        profile_image: user.get("profile_image")
      },
      create_date: this.get("createdAt"),
      reason: this.get("reason")
    }
  }
}, {
  create: async function(attrs) {
    // An id is provided, use it as the key and check if it exists
    const query = new Parse.Query(Follow)
    if (attrs.id) {
      query.equalTo("objectId", attrs.id)
    } else {
      // Otherwise, search by key field
      query.equalTo("type", attrs.type)
      query.equalTo("target", attrs.target)
      query.equalTo("by", attrs.by)
    }

    const result = await query.find()
    if (result.length >= 1) return result[0] // If found, just return the target object

    // Create a new target object
    return new Follow(attrs)
  }
})
Parse.Object.registerSubclass('Follow', Follow);

export async function queryFollowById(id) {
  const query = new Parse.Query(Follow)
  query.equalTo("objectId", id)
  const follow = await query.find()

  return follow[0]
}

export async function getFollowStatus(target, type, by) {
  // Fetch follow object
  const query = new Parse.Query(Follow)
  query.equalTo("type", type)
  query.equalTo("target", target)
  query.equalTo("by", by)
  let follow = await query.find()

  let ret = {
    id: undefined,
    status: "no"
  }
  
  // If no result, just return ret
  if (follow && follow.length < 1) return ret

  follow = follow[0]
  // If follow object does exist, but is not approved
  ret.id = follow.id
  ret.status = follow.get("is_approved") ? "yes" : "pending"

  return ret
}

export async function follow(target, type, reason) {
  const currentUser = Parse.User.current()
  
  let follow = await new Follow.create({
    target: target,
    type: type,
    reason: reason,
    by: currentUser
  })

  // If not existing, save it
  if (!follow.id) follow = await follow.save()

  return follow
}

export async function unfollow(id) {
  const follow = await queryFollowById(id)
  
  // Remove the follow object
  if (follow) await follow.destroy()
}

export async function fetchFollows(target, type, limit = 10, skip = 0) {
  const query = new Parse.Query(Follow)
  query.equalTo("type", type)
  query.equalTo("target", target)
  query.limit(limit)
  query.skip(skip)
  query.withCount() // include total amount of targets in the DB
  let follows = await query.find()
  follows.results = await Promise.all(follows.results.map(e => e.format()))

  return follows 
}

export async function queryByName(target, type, keyword, limit = 10, skip = 0) {
  // Set user query
  const firstNameQuery = new Parse.Query(Parse.User)
  const lastNameQuery = new Parse.Query(Parse.User)
  firstNameQuery.startsWith("first_name", keyword)
  lastNameQuery.startsWith("last_name", keyword)
  const userQuery =  Parse.Query.or(firstNameQuery, lastNameQuery)

  // Set follow query
  const followQuery = new Parse.Query(Follow)
  followQuery.equalTo("type", type)
  followQuery.equalTo("target", target)
  followQuery.matchesQuery("by", userQuery)
  followQuery.limit(limit)
  followQuery.skip(skip)
  followQuery.withCount() // include total amount of targets in the DB
  let follows = await followQuery.find()
  follows.results = await Promise.all(follows.results.map(e => e.format()))

  return follows
}