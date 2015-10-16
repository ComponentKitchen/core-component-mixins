This prototype explores some ideas for [using ES6 classes to create web
components](https://docs.google.com/document/d/1DPClTHykvT-AiGxA5XnUSYJFc2uwBHcJh_Rk55IR_5s/edit#heading=h.oc8n7a9071o3).

# Installing

Ideally, only `npm install` should be required to install everything required
to develop for this repo. However, this currently uses web-component-tester
for unit testing, and that doesn't seem to install correctly via npm. For the
time being, you must install web-component-tester via `bower install`.

# Traceur

Just to get up and running, the demos here load Traceur dynamically at runtime,
rather than requiring a build step that transpiles ES6 to ES5. At some point,
this will be fixed with a build step so that the user isn't paying the cost of
compilation.
