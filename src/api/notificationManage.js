import { Parse } from "./parseConnect.js"

// Define notification object
export const Notification = Parse.Object.extend("Notification", {
  initialize: function (attrs) {
    // Validate attrs
    if (!attrs) return
    if (!attrs.id) throw new Error("Notification ID is empty")
    if (!attrs.time) throw new Error("Notification creation time is empty")
    if (!attrs.for) throw new Error("Notification is not addressed to a user")
    if (!attrs.message || attrs.message === "") throw new Error("Notification message is empty")
  },
  format: async function() {
    let ret = {
      id: this.id,
      time: this.get("createdAt"),
      message: this.get("message")
    }
    const targetType = this.get("target_type")

    // If the notification has a target, format it
    if (targetType) {
      const targetBody = this.get("target_body")
      const by = await targetBody.by.fetch()
      switch (targetType) {
        case "follow":
          ret.by = {
            first_name: by.get("first_name"),
            last_name: by.get("last_name"),
            username: by.get("username")
          }
          break;
      
        default:
          break;
      }
    }

    return ret
  }
})
Parse.Object.registerSubclass("Notification", Notification);

export async function subscribe(commit) {
  const currentUser = Parse.User.current()
  const query = new Parse.Query(Notification)
  query.equalTo("for", currentUser)
  const subscription = await query.subscribe()

  Parse.LiveQuery.on('error', (error) => {
    console.log(error);
  });

  subscription.on("create", async (object) => {
    commit("addNotification", await object.format())
  })

  subscription.on("delete", (object) => {
    console.log(object)
    commit("removeNotification", object.id)
  })
}