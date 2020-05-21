import Parse from 'parse'

// Initialize Parse connector
Parse.initialize("mave-registry")
Parse.serverURL = 'http://localhost:1337/parse'

export { Parse }