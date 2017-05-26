import request = require('request');
import rapi = require('./api');
import { AdmissionClient } from "./admission-client";
import { AcsClient } from "./acs-client";
let admission:AdmissionClient; 
let acs:AcsClient; 
let username:string = 'josep@iti.es';
let password = 'josep'

acs = new AcsClient('http://acs-gra_2tests.slap53.iti.es/acs');
acs.login(username, password)
.then (token => {
  let accessToken = token.access_token;
  console.log('access_token', accessToken);
  admission = new AdmissionClient('http://admission-gra_2tests.slap53.iti.es/admission',accessToken);
  return admission.findDeployments()
})
.then( result => {
  console.log('Deployments');
  for (let k in result){
    console.log(k, result[k].service);
  }
  return admission.findStorage();
})
.then( result => {
  console.log('Registries');
  result.forEach(element => {
      console.log(element);
    });
  console.log('TRUE END');
})
.fail( reason => {
  console.log('Error:', reason);
});


console.log('SYNC END');

