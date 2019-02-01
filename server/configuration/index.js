module.exports = {
  JWT_SECRET: 'tokensecretencodeur',
  oauth: {
    google: {
      clientID: 'console.developers.google.com',
      clientSecret: 'developers.google.com/oauthplayground'
    },
    facebook: {
      clientID: 'developers.facebook.com',
      clientSecret: 'developers.facebook.com/tools/access_token'
    }
  }
}

// use clientSecret: process.env.FB_CLIENT_SECRET
