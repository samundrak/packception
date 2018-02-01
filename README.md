# packeption

A module which can read your package dependence's package dependencies's package dependencies's and on and on

# Usage

Install package through npm using github
and you can use it as.

```
const Packception = require('packception');

const packception = new Packception(process.cwd());

(async () => {
  const mainDep = await packception.readModules().getAllDependencies();
  const reactPackage  = mainDep.get('react')
  .getPackage() // Will return package.json instance
  .readModules() // Will read local node_modules
  const reactDependencies = await reactPackage.getDependencies();
  const reactDevDepencies = await reactPackage.getDevDependencies();

  // To go more deeper of react dependencies
  const artDependencies = reactDevDepencies.get('art').getPackage().readModules().getDependencies();

  // You can go more deep

  console.log(reactDependencies);
  console.log(reactDevDependencies);
})();
```
