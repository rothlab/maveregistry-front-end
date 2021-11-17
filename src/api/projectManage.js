import { Parse } from "./parseConnect.js"
import { Team } from "./teamManage.js"
import { getFollowStatus, fetchFollowedObjectsByUserId } from "./followManage.js"

// Helper function
// Find unqiue entries
function uniqueById(value, index, self) { 
  return self.map(e => e.id).indexOf(value.id) === index;
}

// Find most recent activity by start date
// If there are multiple, select the first one
function findRecentActivity(activities) {
  if (!activities) return activities

  // If there's only one activity, there's no point to sort
  if (activities.length === 1) return activities[0]

  const sorted = activities.sort((a, b) => b.get("start_date") - a.get("start_date"))
  return sorted[0]
}

async function fetchActivityByProject(projects) {
  const query = new Parse.Query(ProjectActivity)
  query.containedIn("project", projects)

  return await query.find()
}

// Define target object
export const Target = Parse.Object.extend("Target", {
  initialize: function (attrs) {
    // Validate attrs
    if (!attrs) return
    if (attrs.type === "") throw new Error("Target type is empty")
    if (attrs.name === "") throw new Error("Target name is empty")
    if (attrs.organism === "") throw new Error("Target organism is empty")
  },
  format: async function () {
    // Fetch projects
    let projects = this.get("projects").filter(e => e instanceof Project)

    // Handle team object
    const teams = projects.map(e => e.get("team")).filter(Boolean).filter(uniqueById)

    // Get follow status for target and projects
    const targetFollowStatus = await getFollowStatus([this.id], "target", Parse.User.current())
    const projectFollowStatus = await getFollowStatus(projects.map(e => e.id), "project", Parse.User.current())

    // Parse projects
    projects = await Promise.all(projects.map(async (e, i) => {
      const recentActivity = e.get("recent_activity")
      const publicActivity = e.get("public_activity")
      const funding = e.get("funding")
      const creator = e.get("creator")
      
      let ret = {
        id: e.id,
        features: e.get("features")
      }
      
      if (creator) ret.creator = {
        username: creator.get("username"),
        first_name: creator.get("first_name"),
        last_name: creator.get("last_name"),
        profile_image: creator.get("profile_image")
      }
      if (projectFollowStatus.length > i) ret.follow_status = projectFollowStatus[i]
      if (funding && funding.open_for_funding) ret.open_for_funding = funding.open_for_funding
      if (recentActivity) {
        // If having recent activity, meaning we have access to this project,
        // we display the most recent activity
        if (recentActivity.get("type")) ret.type = recentActivity.get("type")
        if (recentActivity.get("description")) ret.description = recentActivity.get("description")
      } else if (publicActivity) {
        // If just having access to the public activity,
        // we display that instead
        if (publicActivity.get("type")) ret.type = publicActivity.get("type")
        if (publicActivity.get("description")) ret.description = publicActivity.get("description")
      } else if (!Parse.User.current()) {
        // If not logged in, don't return projects without recent or public activity
        return undefined
      }

      return ret
    }))

    return {
      id: this.id,
      name: this.get("name"),
      type: this.get("type"),
      organism: this.get("organism"),
      follow_status: targetFollowStatus.length > 0 ? targetFollowStatus[0] : undefined,
      projects: projects.filter(Boolean),
      teams: teams.map((e) => {
        const creator = e.get("creator")

        let ret = {
          id: e.id,
          name: e.get("first_name") + ' ' + e.get("last_name")
        }

        if (creator) ret.creator = {
          username: creator.get("username"),
          first_name: creator.get("first_name"),
          last_name: creator.get("last_name"),
          profile_image: creator.get("profile_image")
        }

        return ret
      })
    }
  }
}, {
  create: async function(attrs) {
    // Check if exists
    const query = new Parse.Query(Target)
    if (attrs.id) {
      // An id is provided, use it as the key
      query.equalTo("objectId", attrs.id)
    } else {
      // Otherwise, search by key fields
      query.equalTo("type", attrs.type)
      query.equalTo("name", attrs.name)
      query.equalTo("organism", attrs.organism)
    }
    const result = await query.find()
    if (result.length >= 1) return result[0] // If found, just return the target object
    
    // Create a new target object
    return new Target(attrs)
  }
})
Parse.Object.registerSubclass('Target', Target);

// Define Project object
const variables = require("@/assets/script/variables.json")
export const Project = Parse.Object.extend("Project", {
  initialize: function (attrs) {
    // Validate
    if (!attrs) return
    if (attrs.features && attrs.features.length > 0 && 
      attrs.features.some(val => variables.genomic_features.indexOf(val) === -1)) throw new Error("Some features are invalid")
  },
  format: async function(detail = false, followers = false, collaborators = false) {
    // Construct return object
    let ret = {
      id: this.id,
      features: this.get("features"),
      create_date: this.get("createdAt"),
      update_date: this.get("updatedAt"),
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

    // Format user
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

    // Access project progress detail
    if (detail) {
      ret.leads = this.get("leads")
      ret.funding = this.get("funding")

      // Format team
      const team = this.get("team")
      if (team && team.isDataAvailable()) ret.team = await team.format()

      // Format activities
      const activities = await fetchActivityByProject([this])
      if (activities && activities.length > 0) ret.activities = await Promise.all(activities.map(e => e.format()))
    } else {
      // Add recent activity
      const recentActivity = this.get("recent_activity")
      const publicActivity = this.get("public_activity")
      if (recentActivity) {
        ret.activities = recentActivity.format()
      } else if (publicActivity) {
        ret.activities = publicActivity.format()
      }
    }
    
    if (followers) {
      // Check if followed by the current user
      ret.follow_status = await getFollowStatus([this.id], "project", Parse.User.current())
    }

    if (collaborators) {
      // Format collaborators
      const collaborators = this.get("collaborators")
      if (collaborators && collaborators.length > 0) ret.collaborators = await Promise.all(collaborators.map(e => e.format()))
    }

    return ret
  }
}, {
  fetchById: async function(id, objects = []) {
    // Set up basic query
    const query = new Parse.Query(Project)
    query.equalTo("objectId", id)

    // Include additional objects
    for (let index = 0; index < objects.length; index++) {
      query.include(objects[index])
    }  
    return await query.first()
  }
})
Parse.Object.registerSubclass('Project', Project);

export const ProjectActivity = Parse.Object.extend("ProjectActivity", {
  initialize: function (attrs) {
    // Validate
    if (!attrs) return
    if (!attrs.project) throw new Error("Empty project")
    if (!attrs.type || !variables.progress_type.includes(attrs.type)) throw new Error("Invalid project activity type")
    if (!attrs.description || attrs.description === "") throw new Error("Empty project activity description")
    if (!attrs.start_date) throw new Error("Empty project activity description")
  },
  format: function () {
    let ret = {
      id: this.id,
      type: this.get("type"),
      description: this.get("description"),
      start_date: this.get("start_date"),
    }

    const endDate = this.get("end_date")
    if (endDate) ret.end_date = endDate
    
    const links = this.get("links")
    if (links) ret.links = links
    
    return ret
  }
}, {
  create: async function(attrs) {
    // If it has ID, we just query
    if (attrs.id) {
      const query = new Parse.Query(ProjectActivity)
      query.equalTo("objectId", attrs.id)
      const result = await query.find()
      if (result.length >= 1) return result[0] // If found, just return the target object
      delete attrs.id // If not found, just drop id and proceed creating a new object
    }
    
    // Create a new target object
    return new ProjectActivity(attrs)
  }
})
Parse.Object.registerSubclass('ProjectActivity', ProjectActivity);

export async function addProject(projectInfo) {
  // Validate if logged in
  if (!Parse.User.current()) throw new Error("Not logged in")

  // Create a target object and check if a target exists
  const target = await Target.create({
    type: projectInfo.type,
    name: projectInfo.name.toLowerCase(),
    organism: projectInfo.organism
  })

  // Create project object
  const project = new Project({
    features: projectInfo.features
  })

  // Associate to target and the current user
  project.set("target", target)
  project.set("creator", Parse.User.current())

  // Save project
  await project.save()

  // Associate project to target
  target.addUnique("projects", project)
  await target.save()

  // Return projectId
  return project.id
}

export async function fetchTargets(limit, skip, filter) {
  // Fetch targets
  let query = new Parse.Query(Target)
  let followedProjectIds = []
  let followedTargetIds = []

  // Apply filter when available
  if (filter.type !== '') query.equalTo("type", filter.type)
  if (filter.organism !== '') query.equalTo("organism", filter.organism)
  if (filter.name !== '') query.startsWith("name", filter.name.toLowerCase())
  if (filter.created_after) query.greaterThanOrEqualTo("updatedAt", filter.created_after) // Using update date because we want to include all targets
  if (filter.conditions.length > 0) {
    const projectQuery = new Parse.Query(Project)
    const followedTargetQuery = new Parse.Query(Target)

    // Creator only
    if (filter.conditions.includes("creator")) projectQuery.equalTo("creator", Parse.User.current())

    // Open for funding
    if (filter.conditions.includes("funding")) projectQuery.equalTo("funding.open_for_funding", true)

    // Follower only
    if (filter.conditions.includes("follower")) {
      followedProjectIds = await fetchFollowedObjectsByUserId(Parse.User.current().id, "project", true)
      projectQuery.containedIn("objectId", followedProjectIds)

      followedTargetIds = await fetchFollowedObjectsByUserId(Parse.User.current().id, "target", false)
      followedTargetQuery.containedIn("objectId", followedTargetIds)
    }
    
    query.matchesQuery("projects", projectQuery)

    if (followedTargetIds.length > 0) query = Parse.Query.or(query, followedTargetQuery)
  }
  
  if (filter.progress) {
    const projectQuery = new Parse.Query(Project)
    const activityQuery = new Parse.Query(ProjectActivity)
    activityQuery.equalTo("type", filter.progress)

    // If published activity, search publish activity field
    projectQuery.matchesQuery(filter.progress === "Publication Available" ? "public_activity" : "recent_activity", activityQuery)
    query.matchesQuery("projects", projectQuery)
  }

  query.exists("projects") // include only targets with projects associated
  query.include(["projects.team", "projects.team.creator", "projects.creator"]) // Include projects and team objects on the return
  query.include(["projects.recent_activity", "projects.public_activity"]) // Include projects and team objects on the return
  query.descending("createdAt") // Sort by creation date

  // Select fields
  query.select(
    [
      "name", "type", "organism",
      "projects.features", "projects.funding", "projects.creator",
      "projects.team", "projects.team.creator", "projects.team.first_name", "projects.team.last_name",
      "projects.team.creator.username", "projects.team.creator.first_name", "projects.team.creator.last_name", "projects.team.creator.profile_image",
      "projects.recent_activity", "projects.recent_activity.type", "projects.recent_activity.description",
      "projects.public_activity", "projects.public_activity.type", "projects.public_activity.description",
    ])

  // Apply pagination
  query.limit(limit)
  query.skip(skip)
  query.withCount() // include total amount of targets in the DB

  let targets = await query.find()

  // Filter projects
  if (filter.created_after || filter.conditions.length > 0 || filter.progress) {
    targets.results = targets.results.map((target) => {
      let projects = target.get("projects")
      // If a created after filter is set
      if (filter.created_after) projects = projects.filter(e => e.get("createdAt") >= filter.created_after)

      // If conditional filters are set
      if (filter.conditions.length > 0) {
        // If owner-only filter is set
        if (filter.conditions.includes("creator")) 
          projects = projects.filter(e => e.get("creator").id === Parse.User.current().id)
        // If seekig funding-only filter is set
        if (filter.conditions.includes("funding")) 
          projects = projects.filter(e => e.get("funding") && e.get("funding").open_for_funding)
        // If follower-only filter is set
        if (filter.conditions.includes("follower"))
          projects = projects.filter(e => followedProjectIds.includes(e.id))
      }

      // If progress filter is set
      if (filter.progress) {
        projects = projects.filter((project) => {
          const activity = project.get(filter.progress === "Publication Available" ? "public_activity" : "recent_activity")
          return activity && activity.get("type") === filter.progress
        })
      }

      target.set("projects", projects)
      return target
    })
  }

  // Format targets
  targets.results = await Promise.all(targets.results.map(e => e.format()))
  targets.results = targets.results.filter(Boolean)
  
  // Format and return
  return targets
}

export async function fetchProject(id, detail = false, follower = false) {
  // Fetch project by ID
  const project = await new Project.fetchById(id, ["target", "creator", "team", "collaborators"])

  // Format and return
  if (!project) return
  return project.format(detail, follower, true)
}

export async function fetchProjectByTeamId(id, objects = []) {
  const teamQuery = new Parse.Query(Team)
  teamQuery.equalTo("objectId", id)
  const query = new Parse.Query(Project)
  query.matchesQuery("team", teamQuery)

  // Include additional objects
  for (let index = 0; index < objects.length; index++) {
    query.include(objects[index])
  }

  // Include fields
  let fields = ["target.type", "target.name", "target.organism", "features", "recent_activity", "public_activity"]
  if (objects.includes("collaborators")) fields.push("collaborators")
  query.select(fields)

  const projects = await query.find()

  // Format and return
  return await Promise.all(projects.map(e => e.format(false, false, objects.includes("collaborators"))))
}

export async function fetchProjectsByUserId(id, objects = []) {
  const userQuery = new Parse.Query(Parse.User)
  userQuery.equalTo("objectId", id)
  const query = new Parse.Query(Project)
  query.matchesQuery("creator", userQuery)

  // Include additional objects
  for (let index = 0; index < objects.length; index++) {
    query.include(objects[index])
  }

  // Exlude fields
  query.select(["target.type", "target.name", "target.organism", "features"])

  const projects = await query.find()

  // Format and return
  return await Promise.all(projects.map(e => e.format()))
}

export async function updateProject(payload) {
  // Fetch project by ID
  let project = await new Project.fetchById(payload.id)

  // Query team
  const team = await new Team.create({ id: payload.team })
  if (team.length < 1) return new Error("Invalid team")
  
  // Query collaborators
  const collaborators = await Promise.all(payload.collaborators.map(e => new Team.create({ id: e })))
  if (collaborators.length > 0 && collaborators.some(e => e.length < 1)) return new Error("Some collaborators are invalid")

  // Construct activities
  const activities = await Promise.all(payload.activities.map(async (e) => {
    // Add project
    e.project = project

    const activity = await new ProjectActivity.create(e)
    if (activity.id) {
      activity.set("type", e.type)
      activity.set("description", e.description)
      activity.set("start_date", e.start_date)
      if (e.end_date) activity.set("end_date", e.end_date)
      if (e.links) activity.set("links", e.links)
    }

    return activity
  }))
  const savedActivities = await Parse.Object.saveAll(activities)
  const recentActivity = findRecentActivity(activities)

  // Update project
  project.set("features", payload.features)
  project.set("leads", payload.leads)
  project.set("team", team)
  project.set("collaborators", collaborators)
  project.set("funding", payload.funding)
  project.set("recent_activity", recentActivity)

  // Set publication status. If it's true, then the current project will be shown to everyone.
  // However, only the publication activity will be made available.
  // Other activities are only available to followers
  const publicActivities = savedActivities.filter(e => e.get("type") === "Publication Available")
  if (publicActivities.length > 0) {
    const recentPublicActivity = findRecentActivity(publicActivities)
    project.set("public_activity", recentPublicActivity)
  }

  // Save project
  await project.save()

  // Use a cloud function to remove no longer needed activities
  await Parse.Cloud.run("updateProjectActivities", { ids: savedActivities.map(e => e.id), project_id: payload.id })
}

export async function deleteProject(id) {
  // Fetch project by ID and delete
  const project = await new Project.fetchById(id)
  return await project.destroy()
}

export async function obtainProject(id) {
  await Parse.Cloud.run("obtainObject", { type: "project", id: id })
}