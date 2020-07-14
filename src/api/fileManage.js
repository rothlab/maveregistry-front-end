import { Parse } from "./parseConnect.js"

export async function uploadFile(file) {
  const parseFile = new Parse.File(file.name, file)

  return await parseFile.save()
}

export async function uploadProfilePic(url, id) {
  return await Parse.Cloud.run("uploadProfilePic", { url: url, id: id})
}