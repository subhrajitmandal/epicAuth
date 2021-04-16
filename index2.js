'use strict';
const fs = require('fs');
const jwt = require('jsonwebtoken');
var axios = require('axios');
var privateKEY  = fs.readFileSync('./privatekey.pem', 'utf8');
var publicKEY  = fs.readFileSync('./publickey509.pem', 'utf8');
/*
 ====================   JWT Signing =====================
*/

const myDate = new Date();
const myEpoch = myDate.getTime() / 1000.0;
const epochTime = Math.floor(myEpoch) + 200;

// console.log(Math.floor(myEpoch))
// console.log(epochTime)
// console.log(myDate)

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

var payload = {
    "iss": "a41a5b14-476b-4043-8e05-820c16a37395",
    "sub": "a41a5b14-476b-4043-8e05-820c16a37395",
    "aud": "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token",
    "jti": uuidv4(),
    "exp": epochTime
    // "nbf": 1617933871,
    // "iat": 1617933871
};
var i  = 'HCL Technologies';   
var s  = 'subhrajitm@hcl.com';   
var a  = 'http://hcl.in';
var signOptions = {
//  issuer:  i,
//  subject:  s,
//  audience:  a,
//  expiresIn:  "12h",
 algorithm:  "RS384"   // RSASSA [ "RS256", "RS384", "RS512" ]
};
var token = jwt.sign(payload, privateKEY, signOptions);
console.log("Token :" + token);
/*
 ====================   JWT Verify =====================
*/
var verifyOptions = {
//  issuer:  i,
//  subject:  s,
//  audience:  a,
//  expiresIn:  "12h",
 algorithm:  ["RS384"]
};
var legit = jwt.verify(token, publicKEY, verifyOptions);
console.log("\nJWT verification result: " + JSON.stringify(legit));

// axios
//   .post('https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token', {
//     grant_type: 'client_credentials',
//     client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
//     client_assertion: token
//   })
//   .then(res => {
//     console.log(`statusCode: ${res.statusCode}`)
//     console.log(res)
//   })
//   .catch(error => {
//     console.error(error)
//   })

const axios = require('axios');

// Make a request for a user with a given ID
axios.get('/user?ID=12345')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
