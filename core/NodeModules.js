const fs = require("fs");
const path = require("path");
const Dependency = require("./Dependency");

class NodeModules {
  constructor(location, packageReader) {
    this._location = location;
    this._package = packageReader;
    this._moduleLocation = path.join(this._location, "node_modules");
    if (!this.isLocationThere()) {
      throw new Error(
        `No node modules directory found in location ${this._location}`
      );
    }
  }

  isLocationThere() {
    return fs.existsSync(this._moduleLocation);
  }

  _fetch(packageDependencies = {}, dependencyType) {
    if (!packageDependencies)
      return Promise.reject(new Error(`${dependencyType} not available.`));
    const dependencies = Object.keys(packageDependencies);
    return new Promise((resolve, reject) => {
      try {
        const packages = fs
          .readdirSync(this._moduleLocation)
          .filter(moduleName => {
            return dependencies.includes(moduleName);
          })
          .map(moduleName => {
            const PackageReader = require("./PackageReader");
            const packageReader = new PackageReader(
              path.join(this._moduleLocation, moduleName)
            ).load();
            const dependency = new Dependency({
              name: moduleName,
              type: dependencyType,
              version: packageDependencies[moduleName]
            });
            dependency.setPackage(packageReader);
            return [moduleName, dependency];
          });
        return resolve(new Map(packages));
      } catch (err) {
        reject(err);
      }
    });
  }
  getDependencies() {
    const packageDependencies = this._package.dependencies;
    return this._fetch(packageDependencies, Dependency.TYPE_DEPENDENCY);
  }
  getAllDependencies() {
    return Promise.all([
      this.getDependencies(),
      this.getPeerDependencies(),
      this.getDevDependencies()
    ])
      .then(args => {
        return Promise.resolve([].concat(...args));
      })
      .catch(err => Promise.reject(err));
  }

  getPeerDependencies() {
    const packageDependencies = this._package.peerDependencies;
    return this._fetch(packageDependencies, Dependency.TYPE_PEER_DEPENDENCY);
  }

  getDevDependencies() {
    const packageDependencies = this._package.devDependencies;
    return this._fetch(packageDependencies, Dependency.TYPE_DEV_DEPENDENCY);
  }
}

module.exports = NodeModules;
