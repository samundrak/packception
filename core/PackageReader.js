const fs = require("fs");
const path = require("path");
const NodeModules = require("./NodeModules");

class PackageReader {
  constructor(location) {
    this._hostLocation = location;
    if (!PackageReader.HOST_LOCATION) {
      PackageReader.HOST_LOCATION = location;
    }
    this._packageLocation = path.join(location, "package.json");
    this._package = null;
    this._dependencies = new Map();
    if (!this.isPackageThere()) {
      throw new Error("No package.json file available");
    }
    this.load();
  }

  isPackageThere() {
    return fs.existsSync(this._packageLocation);
  }
  load() {
    this._package = JSON.parse(fs.readFileSync(this._packageLocation, "utf-8"));
    Object.assign(this, this._package);
    return this;
  }

  _loadAllDependencyInformation() {
    nodeModules.getDependencies().catch(console.log);
  }

  pathToNodeModules() {
    return path.join(this._hostLocation, "node_modules");
  }

  getPackage() {
    return this._package;
  }

  readModules() {
    return new NodeModules(PackageReader.HOST_LOCATION, this);
  }
}
PackageReader.HOST_LOCATION = null;
module.exports = PackageReader;
