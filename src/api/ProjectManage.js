import { Parse } from "./parseConnect"

// Define Project object
const variables = require("@/assets/variables.json")
const Project = Parse.Object.extend("Project", {
  initialize: function (attrs) {
    // Validate
    if (!attrs) throw new Error("Project information is empty")

    if (attrs.type === "") throw new Error("Target type is empty")
    this.type = attrs.type

    if (attrs.name === "") throw new Error("Target name is empty")
    this.name = attrs.name

    if (attrs.organism === "") throw new Error("Target organism is empty")
    this.organism = attrs.organism

    if (attrs.features && attrs.features.length > 0 && 
      attrs.features.some(val => variables.genomic_features.indexOf(val) === -1)) throw new Error("Some target features are invalid")
    this.features = attrs.features
  }
})

export async function addProject(projectInfo) {
  // Create project object
  const project = new Project(projectInfo)

  console.log(project)
}