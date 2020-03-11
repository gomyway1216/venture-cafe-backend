const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../../models/userSchemas/user')
const { findUserHelper } = require('../helper/helper')

require('dotenv').config({
  path: `../../../.env`,
})

module.exports = {
  /**
   * Endpoint to create AdminUser
   * This Endpoint should not be exposed all the time
   *
   * @param {string} firstName firstName of creating admin user.
   * @param {string} lastName lastName of creating admin user.
   * @param {string} email email of creating admin user.
   * @param {string} password password of creating admin user.
   * @param {string} date date of admin user create.
   * @param {string} adminCreateKey adminKey to create the admin user
   * @return {User} created Admin User
   */
  createAdminUser: async (args, req) => {
    try {
      if (
        args.createAdminUserInput.adminCreateKey !==
        process.env.ADMIN_CREATE_KEY
      ) {
        throw new Error('The admin key is wrong!')
      }

      const foundUser = await User.findOne({
        email: args.createAdminUserInput.email,
      })

      if (foundUser) {
        throw new Error('Creating user exists already.')
      }

      const hashedPassword = await bcrypt.hash(
        args.createAdminUserInput.password,
        12
      )

      const newUser = new User({
        firstName: args.createAdminUserInput.firstName,
        lastName: args.createAdminUserInput.lastName,
        email: args.createAdminUserInput.email,
        password: hashedPassword,
        signUpDate: args.createAdminUserInput.date,
        isAdmin: true,
      })

      const result = await newUser.save()
      return { ...result._doc, password: null }
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to login as admin user
   *
   * @param {string} email email of creating admin user.
   * @param {string} password password of creating admin user.
   * @param {string} date date of admin user log in.
   * @return {Object} id of admin user and related token,
   * and the expiration time for the token
   */
  logInAdminUser: async (args, req) => {
    try {
      const foundUser = await User.findOne({
        email: args.logInAdminUserInput.email,
      })

      if (!foundUser) {
        throw new Error('Logging in admin user does not exist!')
      }

      const isEqual = await bcrypt.compare(
        args.logInAdminUserInput.password,
        foundUser.password
      )
      if (!isEqual) {
        throw new Error('Password is incorrect!')
      }

      // this would be removed later
      if (!process.env.TOKEN_SECRET_KEY) {
        throw new Error('Token secret key is not found!')
      }

      const token = jwt.sign(
        { userID: foundUser.id, email: foundUser.email },
        process.env.TOKEN_SECRET_KEY,
        { expiresIn: '1h' }
      )

      foundUser.lastSignInDate = args.logInAdminUserInput.date
      await foundUser.save()

      return { userID: foundUser.id, token: token, tokenExpiration: 1 }
    } catch (err) {
      console.log(err)
      return err
    }
  },

  /**
   * Endpoint to create User
   *
   * @param {string} firstName firstName of creating user.
   * @param {string} lastName lastName of creating user.
   * @param {string} email email of creating user.
   * @param {string} date date of creating user.
   * @return {User} created User
   */
  createUser: async (args, req) => {
    try {
      const foundUser = await User.findOne({
        email: args.createUserInput.email,
      })

      if (foundUser) {
        throw new Error('Creating user exists already.')
      }

      const newUser = new User({
        firstName: args.createUserInput.firstName,
        lastName: args.createUserInput.lastName,
        email: args.createUserInput.email,
        signUpDate: args.createUserInput.date,
        isAdmin: false,
      })

      const result = await newUser.save()
      return result
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to check the existence of user by id
   *
   * @param {string} id id of the searching user
   * @return {boolean} returns true if the searching user is found,
   * otherwise returns false
   */
  existUser: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      const userFound = await findUserHelper(args.id)
      if (userFound) {
        return true
      } else {
        return false
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to return user with passed id
   *
   * @param {string} id id of the searching user
   * @return {User|null} returns registered user object if found,
   * otherwise returns null
   */
  getUser: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      const user = await User.findOne({
        _id: args.id,
      })

      // if user is not found, return null explicitly
      if (!user) {
        return null
      }
      return user
    } catch (err) {
      console.log(err)
      throw err
    }
  },

  /**
   * Endpoint to remove User.
   *
   * @param {string} id id of the removing user
   * @return {boolean} returns true if deletion is successful,
   * otherwise returns false
   */
  deleteUser: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!')
      }

      const userFound = await findUserHelper(args.id)

      if (!userFound) {
        return false
      }

      await User.deleteOne({
        _id: args.id,
      })
      return true
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
