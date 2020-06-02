import { Parse } from "./parseConnect"

// Helper function
// Find unqiue entries
function uniqueById(value, index, self) { 
  return self.map(e => e.id).indexOf(value.id) === index;
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
    // Fetch projects and users
    const projects = await Promise.all(this.get("projects").map(e => e.fetch()))
    const userId = projects.map(e => e.get("user")).filter(uniqueById)
    const users = await Promise.all(userId.map(e => e.fetch()))

    return {
      id: this.id,
      name: this.get("name"),
      type: this.get("type"),
      organism: this.get("organism"),
      projects: projects.map(e => {
        return {
          id: e.id,
          features: e.get("features")
        }
      }),
      teams: users.map(e => {
        return {
          id: e.get("username"),
          name: e.get("first_name").substring(0, 1) + ' ' + e.get("last_name")
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
const variables = require("@/assets/variables.json")
const Project = Parse.Object.extend("Project", {
  initialize: function (attrs) {
    // Validate
    if (!attrs) return
    if (attrs.features && attrs.features.length > 0 && 
      attrs.features.some(val => variables.genomic_features.indexOf(val) === -1)) throw new Error("Some features are invalid")
  },
  format: async function() {
    // Fetch target and user
    const target = await this.get("target").fetch()
    const user = await this.get("user").fetch()

    return {
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
      update_date: this.get("updatedAt")
      // TODO: progress: this.progress
    }
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
}

export async function fetchTargets(limit, skip) {
  // TODO: enforce ACL
  
  // Fetch targets, applying pagination
  const query = new Parse.Query(Target)
  query.limit(limit)
  query.skip(skip)
  query.withCount() // include total amount of targets in the DB
  let targets = await query.find()
  targets.results = await Promise.all(targets.results.map(e => e.format())) // Format targets
  
  // Format and return
  return targets
}

export async function fetchProject(id) {
  // TODO: enforce ACL

  // Fetch project by ID
  const query = new Parse.Query(Project)
  const res = await query.get(id)

  // Format and return
  return res.format()
}