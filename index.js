const jwt = require('jsonwebtoken');
const fs = require('fs');
var axios = require('axios');
var qs = require('qs');

const PUB_KEY = fs.readFileSync(__dirname + '/publickey509.pem', 'utf8');
const PRIV_KEY = fs.readFileSync(__dirname + '/privatekey.pem', 'utf8');

// ============================================================
// -------------------  SIGN ----------------------------------
// ============================================================

const myDate = new Date();
const myEpoch = myDate.getTime() / 1000.0;
const epochTime = Math.floor(myEpoch) + 100;

// console.log(Math.floor(myEpoch))
// console.log(epochTime)

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const payloadObj = {
  "iss": "a41a5b14-476b-4043-8e05-820c16a37395",
  "sub": "a41a5b14-476b-4043-8e05-820c16a37395",
  "aud": "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token",
  "jti": uuidv4(),
  "exp": epochTime,
  "nbf": epochTime,
  "iat": epochTime
};

/**
 * Couple things here:
 * 
 * First, we do not need to pass in the `header` to the function, because the 
 * jsonwebtoken module will automatically generate the header based on the algorithm specified
 * 
 * Second, we can pass in a plain Javascript object because the jsonwebtoken library will automatically
 * pass it into JSON.stringify()
 */
const signedJWT = jwt.sign(payloadObj, PRIV_KEY, { algorithm: 'RS384' });


console.log(signedJWT); // Should get the same exact token that we had in our example


// ============================================================
// -------------------  VERIFY --------------------------------
// ============================================================


// Verify the token we just signed using the public key.  Also validates our algorithm RS256 
jwt.verify(signedJWT, PUB_KEY, { algorithms: ['RS384'] }, (err, payload) => {

  if (err.name === 'TokenExpiredError') {
    console.log('Whoops, your token has expired!');
  }

  if (err.name === 'JsonWebTokenError') {
    console.log('That JWT is malformed!');
  }

  if (err === null) {
    console.log('Your JWT was successfully validated!');
  }

  // Both should be the same
  console.log(payload);
  console.log("error: "+err);
});

// axios
//   .post('https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token', {
//     grant_type: 'client_credentials',
//     client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
//     client_assertion: signedJWT
//   })
//   .then(res => {
//     console.log(`statusCode: ${res.statusCode}`)
//     console.log(res)
//   })
//   .catch(error => {
//     console.error(error)
//   })

var data = qs.stringify({
  'grant_type': 'client_credentials',
  'client_assertion_type': 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
  'client_assertion': signedJWT 
});
var config = {
  method: 'post',
  url: 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token',
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  // console.log(error);
});
