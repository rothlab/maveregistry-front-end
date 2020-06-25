import { Parse } from "./parseConnect.js"
import { Team } from "./teamManage.js"
import { getFollowStatus } from "./followManage.js"

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

  const sorted = activities.sort((a, b) => b.start_date - a.start_date)
  return sorted[0]
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
    const projects = this.get("projects")

    // Handle team object
    const teams = projects.map(e => e.get("team")).filter(Boolean).filter(uniqueById)

    // Get follow status for projects and teams
    const projectFollowStatus = await getFollowStatus(projects.map(e => e.id), "project", Parse.User.current())
    const teamFollowStatus = await getFollowStatus(teams.map(e => e.id), "team", Parse.User.current())

    return {
      id: this.id,
      name: this.get("name"),
      type: this.get("type"),
      organism: this.get("organism"),
      projects: projects.map((e, i) => {
        const recentActivity = findRecentActivity(e.get("activities"))
        const funding = e.get("funding")

        let ret = {
          id: e.id,
          features: e.get("features"),
          follow_status: projectFollowStatus[i]
        }

        if (funding && funding.open_for_funding) ret.funding = funding.open_for_funding
        if (recentActivity && recentActivity.type) ret.type = recentActivity.type
        if (recentActivity && recentActivity.description) ret.description = recentActivity.description

        return ret
      }),
      teams: teams.map((e, i) => {
        return {
          id: e.id,
          name: e.get("first_name").substring(0, 1) + ' ' + e.get("last_name"),
          follow_status: teamFollowStatus[i]
        }
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
  format: async function(detail = false, followers = false) {
    // Construct return object
    let ret = {
      id: this.id,
      features: this.get("features"),
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
    const user = this.get("user")
    if (user && user.isDataAvailable()) {
      ret.user = {
        username: user.get("username"),
        first_name: user.get("first_name"),
        last_name: user.get("last_name")
      }
    }

    // Access project progress detail
    if (detail) {
      ret.leads = this.get("leads")
      ret.funding = this.get("funding")

      // Format team
      const team = this.get("team")
      if (team && team.isDataAvailable()) ret.team = await team.format()

      // Format collaborators
      const collaborators = this.get("collaborators")
      if (collaborators && collaborators.length > 0) ret.collaborators = await Promise.all(collaborators.map(e => e.format()))

      // Format activities
      const activities = this.get("activities")
      if (activities && activities.length > 0) ret.activities = await Promise.all(activities.map(e => e.format()))
    } else {
      // Add recemt activity
      const recentActivity = findRecentActivity(this.get("activities"))
      if (recentActivity) ret.activities = recentActivity
    }
    
    if (followers) {
      // Check if followed by the current user
      ret.follow_status = await getFollowStatus([this.id], "project", Parse.User.current())
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
    const res = await query.find()

    return res[0]
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
      start_date: this.get("start_date")
    }

    const endDate = this.get("end_date")
    if (endDate) ret.end_date = endDate
    
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
  project.set("user", Parse.User.current())

  // Save project
  await project.save()

  // Associate project to target
  target.addUnique("projects", project)
  await target.save()

  // Return projectId
  return project.id
}

export async function fetchTargets(limit, skip, filter) {
  // TODO: enforce ACL
  
  // Fetch targets
  const query = new Parse.Query(Target)

  // Apply filter when available
  if (filter.type !== '') query.equalTo("type", filter.type)
  if (filter.organism !== '') query.equalTo("organism", filter.organism)
  if (filter.name !== '') query.startsWith("name", filter.name)
  query.exists("projects") // include only targets with projects associated
  query.include("projects.team") // Include projects and team objects on the return

  // Apply pagination
  query.limit(limit)
  query.skip(skip)
  query.withCount() // include total amount of targets in the DB

  let targets = await query.find()
  targets.results = await Promise.all(targets.results.map(e => e.format())) // Format targets
  
  // Format and return
  return targets
}

export async function fetchProject(id, detail = false) {
  // Fetch project by ID
  const project = await new Project.fetchById(id, ["target", "user", "team", "collaborators", "activities"])

  // Format and return
  return project.format(detail)
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

  // Exlude fields
  query.select(["target.type", "target.name", "target.organism", "features"])

  const projects = await query.find()

  // Format and return
  return await Promise.all(projects.map(e => e.format()))
}

export async function updateProject(payload) {
  // TODO: enforce ACL

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
    }

    return activity
  }))

  // Update project
  project.set("leads", payload.leads)
  project.set("team", team)
  project.set("collaborators", collaborators)
  project.set("funding", payload.funding)
  project.set("activities", activities)

  // Set publication status. If it's true, then the current project will be shown to everyone.
  // However, only the publication activity will be made available.
  // Other activities are only available to followers
  project.set("has_publication", payload.activities.filter(e => e.type === "Publication Available").length > 0)

  // Save project
  await project.save()

  // TODO: Schedule a cloud job to remove no longer needed activities
}