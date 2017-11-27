'use strict'

const express = require('express')
const app = express()
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const cors = require('cors')
const bodyParser = require('body-parser')
const tourPackages = require('./data.json')
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN
const port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const authCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: `https://${AUTH0_DOMAIN}/api/v2/`,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
})

app.get('/api/tour-packages', (req, res) => {
  res.json(tourPackages)
})

app.get('/api/tour-packages/public', (req, res) => {
  res.json(tourPackages.filter(tp => tp.type === 'public'))
})

app.get('/api/tour-packages/private', authCheck, (req, res) => {
  res.json(tourPackages.filter(tp => tp.type === 'private'))
})

app.listen(port)
console.log(`Listening on localhost:${port}`)
