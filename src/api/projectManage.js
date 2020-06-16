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
const Target = Parse.Object.extend("Target", {
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
  format: async function(detail = false) {
    // Fetch target and user
    const target = await this.get("target").fetch()
    const user = await this.get("user").fetch()
    
    // Fetch collaborators
    const collaborators = this.get("collaborators")
    
    // Construct return object
    let ret = {
      id: this.id,
      target: {
        id: target.id,
        name: target.get("name"),
        type: target.get("type"),
        organism: target.get("organism"),
      },
      features: this.get("features"),
      user: {
        username: user.get("username"),
        first_name: user.get("first_name"),
        last_name: user.get("last_name")
      },
      update_date: this.get("updatedAt"),
    }

    // Check if followed by the current user
    const followStatus = await getFollowStatus(this, "project", Parse.User.current())
    ret.follow_status = followStatus
    
    // Add recemt activity
    const recentActivity = findRecentActivity(this.get("activities"))
    if (recentActivity) ret.activities = recentActivity
    
    // Access project progress detail
    if (detail) {
      const team = this.get("team")

      ret.leads = this.get("leads")
      if (team && team.id) ret.team = team.id
      if (collaborators) ret.collaborators = collaborators.map(e => e.id)
      ret.funding = this.get("funding")
      ret.activities = this.get("activities")
    }

    return ret
  }
}, {
  fetchById: async function(id) {
    const query = new Parse.Query(Project)

    return await query.get(id)
  }
})
Parse.Object.registerSubclass('Project', Project);

export async function addProject(projectInfo) {
  // Validate if logged in
  if (!Parse.User.current()) throw new Error("Not logged in")

  // Create a target object and check if a target exists
  const target = await Target.create({
    type: projectInfo.type,
    name: projectInfo.name,
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

export async function fetchTargets(limit, skip) {
  // TODO: enforce ACL
  
  // Fetch targets, applying pagination
  const query = new Parse.Query(Target)
  query.limit(limit)
  query.skip(skip)
  query.withCount() // include total amount of targets in the DB
  query.include("projects.team") // Include projects and team objects on the return
  let targets = await query.find()
  targets.results = await Promise.all(targets.results.map(e => e.format())) // Format targets
  
  // Format and return
  return targets
}

export async function fetchProject(id, detail = false) {
  // TODO: enforce ACL

  // Fetch project by ID
  const project = await new Project.fetchById(id)

  // Format and return
  return project.format(detail)
}

export async function fetchProjectByTeamId(id) {
  const teamQuery = new Parse.Query(Team)
  teamQuery.equalTo("objectId", id)
  const query = new Parse.Query(Project)
  query.matchesQuery("team", teamQuery)
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

  // Update project
  project.set("leads", payload.leads)
  project.set("team", team)
  project.set("collaborators", collaborators)
  project.set("funding", payload.funding)
  project.set("activities", payload.activities)

  // Save project
  return await project.save()
}