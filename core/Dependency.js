class Dependency {
  constructor({ name, type, version }) {
    this._name = name;
    this._version = version;
    this._type = type;
  }
  getType() {
    return this._type;
  }

  setPackage(packageReader) {
    this._package = packageReader;
  }

  getPackage() {
    return this._package;
  }
}

Dependency.TYPE_DEPENDENCY = "dependencies";
Dependency.TYPE_DEV_DEPENDENCY = "devDependencies";
Dependency.TYPE_PEER_DEPENDENCY = "peerDependencies";
module.exports = Dependency;
