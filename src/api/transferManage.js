import { Parse } from "./parseConnect.js"

export const Transfer = Parse.Object.extend("Transfer", {
  initialize: function (attrs) {
    // Validate attrs
    if (!attrs) return
    if (!attrs.from) throw new Error("Origin user is empty")
    if (!attrs.to) throw new Error("Target user is empty")
    if (attrs.type === "") throw new Error("Transfer type is empty")
    if (attrs.target_type === "") throw new Error("Target type is empty")
    if (attrs.target_pointer === "") throw new Error("Target pointer is empty")
  },
  format: function(isOwner = true) {
    let ret = {
      id: this.id,
      type: this.get("type"),
      time: this.get("createdAt")
    }

    // Fetch user information based on owner status
    const user = this.get(isOwner ? "to" : "from")
    ret[isOwner ? "recipient" : "original"] = {
      id: user.id,
      username: user.get("username"),
      first_name: user.get("first_name"),
      last_name: user.get("last_name"),
      profile_image: user.get("profile_image")
    }

    return ret
  }
}, {
  create: async function (attrs) {
    // Fetch originate and recipient
    // No need to handle empty return because we have validations in the init function
    let query = new Parse.Query(Parse.User)
    if (typeof attrs.origin_id === "string") attrs.origin_id = await query.get(attrs.origin_id)
    if (typeof attrs.recipient_id === "string") attrs.recipient_id = await query.get(attrs.recipient_id)

    // Check if any pending transfer exists
    // If exists, just return that transfer
    query = new Parse.Query(Transfer)
    query.equalTo("from", attrs.origin_id)
    query.equalTo("to", attrs.recipient_id),
    query.equalTo("target_pointer", attrs.target_pointer)
    query.equalTo("target_type", attrs.target_type)
    query.equalTo("type", attrs.type)
    query.doesNotExist("approvedAt")
    const transfer = await query.first()
    if (transfer) return transfer

    return new Transfer({
      from: attrs.origin_id,
      to: attrs.recipient_id,
      type: attrs.type,
      target_type: attrs.target_type,
      target_pointer: attrs.target_pointer
    })
  }
})
Parse.Object.registerSubclass('Transfer', Transfer)

export async function transferOwnership(target, recipientId) {
  // Create a Transfer
  const transfer = await Transfer.create({
    type: "owner",
    target_type: target.type,
    target_pointer: target.id,
    origin_id: Parse.User.current(),
    recipient_id: recipientId,
  })

  // If new object, save it first
  if (transfer.isNew()) await transfer.save()
  return transfer.format()
}

export async function requestOwnership(target, ownerId) {
  // Create a Transfer
  const transfer = await Transfer.create({
    type: "request",
    target_type: target.type,
    target_pointer: target.id,
    origin_id: ownerId,
    recipient_id: Parse.User.current(),
  })

  // If new object, save it first
  if (transfer.isNew()) await transfer.save()
  return transfer.format()
}

export async function fetchTransfer(type = undefined, target, isOwner = true) {
  // Fetch transfer
  const query = new Parse.Query(Transfer)
  query.equalTo(isOwner ? "from" : "to", Parse.User.current())
  query.equalTo("target_pointer", target.id)
  query.equalTo("target_type", target.type)
  if (type) query.equalTo("type", type)
  query.doesNotExist("approvedAt") // Don't show approved transfer
  query.include(isOwner ? "to" : "from")
  const transfer = await query.find()

  return transfer.map(e => e.format(isOwner))
}

export async function cancelTransfer(id) {
  // Fetch transfer
  const query = new Parse.Query(Transfer)
  query.equalTo("objectId", id)
  query.doesNotExist("approvedAt") // Don't select approved transfer
  const transfer = await query.first()

  // Delete transfer
  if (!transfer) throw new Error("No transfer found")
  await transfer.destroy()
}

export async function acceptTransfer(id) {
  // Fetch transfer
  const query = new Parse.Query(Transfer)
  query.equalTo("objectId", id)
  query.doesNotExist("approvedAt") // Don't select approved transfer
  let transfer = await query.first()

  // Validate the transfer
  if (!transfer) throw new Error("No transfer found")

  // Approve transfer
  transfer.set("approvedAt", new Date())
  transfer = await transfer.save()
  return transfer.format(true)
}