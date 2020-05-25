import { Parse } from "./parseConnect"

export async function uploadFile(file) {
  const parseFile = new Parse.File(file.name, file)

  let res = new Object
  try {
    res.file = await parseFile.save()
  } catch (e) {
    res.error = e
  }

  return res
}