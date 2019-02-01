const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const { expect } = chai
const rewire = require('rewire')
const faker = require('faker')

const User = require('../../../server/models/user')
const userController = rewire('../../../server/controllers/users.js')

chai.use(sinonChai)
let sandbox = null

describe('users controller testing', () => {

  before(async () => {
  //   console.log('\n---- controller test start\n')
  });

  after(async () => {
  //   console.log('\n---- controller test end\n')
  });

  let req = {
    user: { id: faker.random.number() },
    value: {
      body: {
        email: faker.internet.email().toLocaleLowerCase(),
        password: faker.internet.password()
      }
    }
  }

  let res = {
    status: function() {
      return this
    },
    json: function() {
      return this
    }
  }

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })


  describe('controller signup called', () => {

    it('should signup ok when called, token excluded', () => {

      sandbox.spy(console, 'log')
      sandbox.spy(res, 'json')
      sandbox.spy(res, 'status')
      sandbox.stub(User, 'findOne').returns(Promise.resolve(
        false
      ))
      sandbox.stub(User.prototype, 'save').returns(Promise.resolve({
        id: faker.random.number()
      }))

      return userController.signUp(req, res).then(() => {
        // expect(console.log).to.have.been.called
        expect(res.status).to.have.been.calledWith(200)
        expect(res.json.callCount).to.equal(1)
// don t include the response for test token separatly next test
//         expect(res.json).to.have.been.calledWith({
//           message: 'apiauth9 signup',
//           req: req.value.body,
//           token: 'fakeTokenNumberTwo'
//         })
      })

    })

    it('should signup ok, fake testing token included', () => {

      sandbox.spy(console, 'log')
      sandbox.spy(res, 'json')
      sandbox.spy(res, 'status')
      sandbox.stub(User, 'findOne').returns(Promise.resolve(
        false
      ))
      sandbox.stub(User.prototype, 'save').returns(Promise.resolve({
        id: faker.random.number()
      }))

// why does it make should display secret ko in users.test routes
      let signToken = userController.__set__(
        'signToken', user => 'fakeTokenNumberTwo'
      )

      return userController.signUp(req, res).then(() => {
        expect(res.json).to.have.been.calledWith({
          message: 'apiauth9 signup',
          req: req.value.body,
          token: 'fakeTokenNumberTwo'
        })
        expect(res.status).to.have.been.calledWith(200)
        expect(res.json.callCount).to.equal(1)
        signToken()
      })

    })

    it('403 if email already in db', () => {

      sandbox.spy(console, 'log')
      sandbox.spy(res, 'status')
      sandbox.spy(res, 'json')
      sandbox.stub(User, 'findOne').returns(Promise.resolve({
        // id: faker.random.number()
        id: req.user.id
      }))

      return userController.signUp(req, res).then(() => {
        // expect(console.log).to.have.been.called
        expect(res.status).to.have.been.calledWith(403)
        expect(res.json.callCount).to.equal(1)
        expect(res.json).to.have.been.calledWith({
          error: 'Email already used',
          foundUserId: req.user,
          foundUserEmail: req.value.body.email
        })
      })

    })


  })

  describe('controller signin called', () => {

    it('should return signin when called', () => {

      sandbox.spy(console, 'log')
      sandbox.spy(res, 'status')
      sandbox.spy(res, 'json')

      // fake jwt token with rewire
      let signToken = userController.__set__('signToken', user => 'fakeSinToken')

      return userController.signIn(req, res).then(() => {
        // expect(console.log).to.have.been.called
        expect(res.status).to.have.been.calledWith(200)
        expect(res.json.callCount).to.equal(1)
        expect(res.json).to.have.been.calledWith({
          message: 'apiauth9 signin',
          req: req.value.body,
          userId: req.user,
          token: 'fakeSinToken'
        }) // why signToken() next keep from route signin test to fail?
        signToken()
      })

    })


  })

  describe('controller secret called', () => {

    it('should return secret when called', () => {

      sandbox.spy(console, 'log')
      sandbox.spy(res, 'status')
      sandbox.spy(res, 'json')

      return userController.secret(req, res).then(() => {
        // expect(console.log).to.have.been.called
        expect(res.status).to.have.been.calledWith(200)
        expect(res.json.callCount).to.equal(1)
        expect(res.json).to.have.been.calledWith({
          message: 'apiauth9 secret',
          requser: req.user
        })
      })

    })

  })


})
