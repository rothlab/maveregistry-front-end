import Parse from 'parse'

// Initialize Parse connector
Parse.initialize("test")
Parse.serverURL = 'http://localhost:1337/parse'

export { Parse }