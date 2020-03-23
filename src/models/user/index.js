'use strict'

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - _id
 *          - email
 *        properties:
 *          _id:
 *            type: objectId
 *          created_at:
 *            type: timestamp
 *          updated_at:
 *            type: timestamp
 *          first_name:
 *            type: string
 *          last_name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *          avatar:
 *            type: string
 *          password:
 *            type: string
 *        example:
 *           first_name: John
 *           last_name: Doe
 *           email: john.doe@email.com
 */

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')
const Schema = mongoose.Schema

const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  first_name: {
    type: String,
    trim: true,
  },
  last_name: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
  },
  avatar: {
    type: String,
    trim: true,
  },
  google: {
    id: {
      type: String,
      trim: true,
    },
    picture: {
      type: String,
      trim: true,
    },
  },
})

userSchema.plugin(timestamp, {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})

userSchema.methods = {
  createToken() {
    return jwt.sign(
      {
        _id: this._id,
      },
      // eslint-disable-next-line no-undef
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    )
  },
  getSoftData() {
    return {
      _id: this._id,
      email: this.email,
      first_name: this.first_name,
      last_name: this.last_name,
      google: this.google,
      token: `Bearer ${this.createToken()}`,
    }
  },
}

module.exports = mongoose.model('User', userSchema)