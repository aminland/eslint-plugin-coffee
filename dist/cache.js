'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path2 = require('path');

var _path3 = _interopRequireDefault(_path2);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _findRemove = require('find-remove');

var _findRemove2 = _interopRequireDefault(_findRemove);

var _coffeescript = require('coffeescript');

var _coffeescript2 = _interopRequireDefault(_coffeescript);

var _package = require('./../package.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Originally from original coffeelint
var CACHE_PREFIX, Cache, csVer, localMem;

csVer = ((typeof window !== "undefined" && window !== null ? window.CoffeeScript : void 0) || _coffeescript2.default).VERSION;

CACHE_PREFIX = ".eslintcoffee-";

localMem = {};

exports.default = Cache = function () {
  _createClass(Cache, [{
    key: 'read',
    value: function read(path) {
      return localMem[path];
    }
  }, {
    key: 'write',
    value: function write(path, value) {
      return localMem[path] = value;
    }
  }, {
    key: 'exists',
    value: function exists(path) {
      return !!Object.getOwnPropertyDescriptor(localMem, path);
    }
  }]);

  function Cache() {
    var basepath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$cacheTimeout = _ref.cacheTimeout,
        cacheTimeout = _ref$cacheTimeout === undefined ? 3600 * 60 : _ref$cacheTimeout,
        _ref$config = _ref.config,
        config = _ref$config === undefined ? {} : _ref$config;

    _classCallCheck(this, Cache);

    this.basepath = basepath;
    this.cacheTimeout = cacheTimeout;
    this.setConfig(config);
    if (!!this.basepath) {
      if (!_fs2.default.existsSync(this.basepath)) {
        _fs2.default.mkdirSync(this.basepath);
      }
      this.write = _fs2.default.writeFileSync;
      this.read = _fs2.default.readFileSync;
      this.exists = _fs2.default.existsSync;
      (0, _findRemove2.default)(this.basepath, {
        age: {
          seconds: this.cacheTimeout
        },
        prefix: CACHE_PREFIX
      });
    }
  }

  _createClass(Cache, [{
    key: 'path',
    value: function path(source) {
      return _path3.default.join(this.basepath, CACHE_PREFIX + '-' + csVer + '-' + _package.version + '-' + this.prefix + '-' + this.hash(source));
    }
  }, {
    key: 'get',
    value: function get(source) {
      return JSON.parse(this.read(this.path(source), 'utf8'));
    }
  }, {
    key: 'set',
    value: function set(source, result) {
      return this.write(this.path(source), JSON.stringify(result));
    }
  }, {
    key: 'has',
    value: function has(source) {
      return this.exists(this.path(source));
    }
  }, {
    key: 'hash',
    value: function hash(data) {
      return _crypto2.default.createHash('md5').update('' + data).digest('hex').substring(0, 8);
    }

    // Use user config as a "namespace" so that
    // when he/she changes it the cache becomes invalid

  }, {
    key: 'setConfig',
    value: function setConfig(config) {
      return this.prefix = this.hash(JSON.stringify({
        timeout: this.cacheTimeout,
        basepath: this.basepath
      }) + JSON.stringify(config));
    }
  }]);

  return Cache;
}();