import Parse from 'parse'

// Initialize Parse connector
Parse.initialize("mave-registry")
Parse.serverURL = process.env.VUE_APP_PARSE_URL || 'http://localhost:1337/parse'

// Global Error Handling
function handleParseError (err) {
  switch (err.code) {
    case Parse.Error.INVALID_SESSION_TOKEN:
      Parse.User.logOut()
      break;
  }
}

export { Parse, handleParseError }