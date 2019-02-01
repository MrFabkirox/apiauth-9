const JWT = require('jsonwebtoken')
const User = require('../models/user')

const { JWT_SECRET } = require('../configuration')

signToken = user => {
  return JWT.sign({
    iss: 'apiauth9',
    sub: user.id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)
  }, JWT_SECRET)
}

module.exports = {

  signUp: async (req, res, next) => {

    try {
  
      // console.log('signup called')

      const { email, password } = req.value.body
  
      // Check if there is a user with the same email
      const foundUser = await User.findOne({ email })

      if (foundUser) {
        return res.status(403).json({
          error: 'Email already used',
          foundUserId: foundUser,
          foundUserEmail: req.value.body.email
        })
      }
  
      // create a new user
      const newUser = new User({ email, password })
      await newUser.save()
  
      // generate the token
      const token = signToken(newUser)
  
      // respond with the token
//       console.log(res)
      res.status(200).json({
        message: 'apiauth9 signup',
        req: req.value.body,
        token: token
      })

    } catch(error) {
      console.log('error during signup: ', error)
      next(error)
    }
  },

  signIn: async (req, res, next) => {
    
    try {

      const token = signToken(req.user)
      
//       console.log(res)
      res.status(200).json({
        message: 'apiauth9 signin',
        req: req.value.body,
        userId: req.user,
        token: token
      })

    } catch (error) {
      console.log('error during signin: ', error)
      next(error)
    }

  },

  secret: async (req, res, next) => {

    try {
      
//       console.log(res)
      res.status(200).json({
        message: 'apiauth9 secret',
        requser: req.user
      })

    } catch (error) {
      console.log('error during secret: ', error)
      next(error)
    }

  }

}
