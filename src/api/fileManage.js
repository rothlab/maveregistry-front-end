import { Parse } from "./parseConnect.js"

export async function uploadFile(name, data) {
  const parseFile = new Parse.File(name, data)

  return await parseFile.save()
}

export async function uploadProfilePic(url, id) {
  return await Parse.Cloud.run("uploadProfilePic", { url: url, id: id})
}