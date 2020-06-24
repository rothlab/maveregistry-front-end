import { Parse } from "@/api/parseConnect.js"
import Store from "@/store/index.js"

export async function handleError(err) {
  switch (err.code) {
    case Parse.Error.INVALID_SESSION_TOKEN:
      try {
        await Store.dispatch("logoutUser")
      } catch (error) {
        // Do nothing
        return "Invalid user token. Please log in again."
      }
      
      return "Invalid user token. Please log in again."
    case Parse.Error.OPERATION_FORBIDDEN:
      return "Permission Denied. Please make sure you have access to this function."
    default:
      return err.message
  }
}