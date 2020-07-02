import Parse from 'parse'

// Initialize Parse connector
Parse.initialize("mave-registry")
Parse.serverURL = process.env.VUE_APP_API_URL

export { Parse }