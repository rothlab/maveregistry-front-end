import { Parse } from "@/api/parseConnect.js"
import Store from "@/store/index.js"

export async function handleError(err) {
  switch (err.code) {
    case Parse.Error.INVALID_SESSION_TOKEN:
      await Store.dispatch("logoutUser")
      return "Invalid user token. Please log in again."
    default:
      return err.message
  }
}