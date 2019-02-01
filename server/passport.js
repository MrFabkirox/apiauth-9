const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')
const { JWT_SECRET } = require('./configuration')

// jwt strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
  }, async (payload, done) => {
    try {

      //find the user with the token
      const user = await User.findById(payload.sub)

      if (!user) {
        return done(null, false)
      }

      done(null, user)

    } catch(error) {
      done(error, false)

    }

  }
))

// local strategy
passport.use(new LocalStrategy({
    usernameField: 'email'
  }, async (email, password, done) => {
    try {
      
      const user = await User.findOne({ email })
      
      if (!user) {
        return done(null, false)
      }
    
      const isMatch = await user.isValidPassword(password)
    
      if (!isMatch) {
        return done(null, false)
      }
  
      // if user with a valid password send user with no error
      done(null, user)

    } catch (error) {
      done(error, false) 
    }
}))
