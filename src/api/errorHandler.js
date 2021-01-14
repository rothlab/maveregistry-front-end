import { Parse } from "@/api/parseConnect.js"
import Store from "@/store/index.js"
import { ToastProgrammatic as Toast } from 'buefy'

const hasSentry = process.env.NODE_ENV !== "development"

export async function handleError(err) {
  if (!err.code) return err
  switch (err.code) {
    case Parse.Error.INVALID_SESSION_TOKEN:
      await Store.dispatch("logoutUser")
      return "You have been logged out. Please log in again."
    case Parse.Error.OPERATION_FORBIDDEN:
      return "Permission Denied. Please make sure you have access to this function."
    default:
      return err.message
  }
}

export async function displayErrorToast(err) {
  Toast.open({
    duration: 5000,
    message: await handleError(err),
    type: "is-danger",
    queue: false
  })

  // Still report error to sentry
  if (hasSentry) throw err
}