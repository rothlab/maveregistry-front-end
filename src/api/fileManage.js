import { Parse } from "./parseConnect.js"
import axios from "axios"

export async function uploadFile(name, data) {
  const parseFile = new Parse.File(name, data)

  return await parseFile.save()
}

export async function uploadProfilePic(url, id) {
  if (!url) return
  const response = await axios.get(url, {
    responseType: 'arraybuffer'
  })
  const data = Array.from(Buffer.from(response.data, "binary"))
  const contentType = response.headers['content-type']
  const file = new Parse.File(id, data, contentType)
  return file.save()
}