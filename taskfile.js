const vm = require ('vm');
const fs = require ('fs');
const path = require('path');

var pkg = require('./package.json');

// Gobble up a JSON file with comments
function getJSON(filepath) {
  const jsonString = "g = " + fs.readFileSync(filepath, 'utf8') + "; g";
  return (new vm.Script(jsonString)).runInNewContext();
}

function *createProductionPackage(file) {
  let packjson = JSON.parse(file.data.toString('utf8'))
  if (packjson.devDependencies) {
    delete packjson.devDependencies
  }
  if (packjson.scripts) {
    delete packjson.scripts
  }
  file.base = path.parse(file.base).name + ".json";
  file.data = new Buffer(JSON.stringify(packjson, null, 2));
}

exports.default = function * (task) {
  yield task.serial(['build']);
}

exports.clean = function * (task) {
  yield task.clear(['lib-test', 'coverage']);
}

exports.superclean = function * (task) {
  task.parallel(['clean']);
  yield task.clear(['lib'])
}

exports.mrproper = function * (task) {
  task.parallel(['superclean']);
  yield task.clear(['node_modules'])
}

exports.build = function * (task) {
  let tsopts = getJSON('./tsconfig.json')
    ;

  yield task.source('src/**/*.ts')
    .typescript(tsopts)
    .target('lib')
}

exports.buildtest = function * (task) {
  let tsopts = getJSON('./tsconfig.json')
    ;

  yield task.serial(['build'])
    .source("test/**/*.ts")
    .typescript(tsopts)
    .target("lib-test")
}

exports.test = function * (task) {
  exports.test = function * (task) {
    yield task.source('test/**/*.js').jest({ bail:true, notify:true });
  }
  yield task.serial(['buildtest'])
    .source("./lib-test/test/**/*.test.js")
    .jest()
}

exports.lint = function * (task) {
  yield task.source('./{src,test}/**/*.ts')
    .shell('tslint --type-check --project $glob')
}
