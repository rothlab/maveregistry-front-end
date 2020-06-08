import Parse from 'parse'

// Initialize Parse connector
Parse.initialize("mave-registry")
Parse.serverURL = process.env.VUE_APP_PARSE_URL || 'http://localhost:1337/parse'

export { Parse }