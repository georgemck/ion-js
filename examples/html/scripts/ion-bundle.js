(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ion = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IonTypes_1 = require("./IonTypes");

var AbstractWriter =
/*#__PURE__*/
function () {
  function AbstractWriter() {
    (0, _classCallCheck2["default"])(this, AbstractWriter);
    this._annotations = [];
  }

  (0, _createClass2["default"])(AbstractWriter, [{
    key: "addAnnotation",
    value: function addAnnotation(annotation) {
      if (!this._isString(annotation)) {
        throw new Error('Annotation must be of type string.');
      }

      this._annotations.push(annotation);
    }
  }, {
    key: "setAnnotations",
    value: function setAnnotations(annotations) {
      if (annotations === undefined || annotations === null) {
        throw new Error('Annotations were undefined or null.');
      } else if (!this._validateAnnotations(annotations)) {
        throw new Error('Annotations must be of type string[].');
      } else {
        this._annotations = annotations;
      }
    }
  }, {
    key: "writeValues",
    value: function writeValues(reader) {
      this._writeValues(reader);
    }
  }, {
    key: "writeValue",
    value: function writeValue(reader) {
      this._writeValue(reader);
    }
  }, {
    key: "_clearAnnotations",
    value: function _clearAnnotations() {
      this._annotations = [];
    }
  }, {
    key: "_writeValues",
    value: function _writeValues(reader) {
      var _depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      var type = reader.type();

      if (type === null) {
        type = reader.next();
      }

      while (type !== null) {
        this._writeValue(reader, _depth);

        type = reader.next();
      }
    }
  }, {
    key: "_writeValue",
    value: function _writeValue(reader) {
      var _depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      var type = reader.type();

      if (type === null) {
        return;
      }

      if (_depth > 0) {
        if (reader.fieldName() != null) {
          this.writeFieldName(reader.fieldName());
        }
      }

      this.setAnnotations(reader.annotations());

      if (reader.isNull()) {
        this.writeNull(type);
      } else {
        switch (type) {
          case IonTypes_1.IonTypes.BOOL:
            this.writeBoolean(reader.booleanValue());
            break;

          case IonTypes_1.IonTypes.INT:
            this.writeInt(reader.bigIntValue());
            break;

          case IonTypes_1.IonTypes.FLOAT:
            this.writeFloat64(reader.numberValue());
            break;

          case IonTypes_1.IonTypes.DECIMAL:
            this.writeDecimal(reader.decimalValue());
            break;

          case IonTypes_1.IonTypes.TIMESTAMP:
            this.writeTimestamp(reader.timestampValue());
            break;

          case IonTypes_1.IonTypes.SYMBOL:
            this.writeSymbol(reader.stringValue());
            break;

          case IonTypes_1.IonTypes.STRING:
            this.writeString(reader.stringValue());
            break;

          case IonTypes_1.IonTypes.CLOB:
            this.writeClob(reader.byteValue());
            break;

          case IonTypes_1.IonTypes.BLOB:
            this.writeBlob(reader.byteValue());
            break;

          case IonTypes_1.IonTypes.LIST:
            this.stepIn(IonTypes_1.IonTypes.LIST);
            break;

          case IonTypes_1.IonTypes.SEXP:
            this.stepIn(IonTypes_1.IonTypes.SEXP);
            break;

          case IonTypes_1.IonTypes.STRUCT:
            this.stepIn(IonTypes_1.IonTypes.STRUCT);
            break;

          default:
            throw new Error('Unrecognized type ' + (type !== null ? type.name : type));
        }

        if (type.isContainer) {
          reader.stepIn();

          this._writeValues(reader, _depth + 1);

          this.stepOut();
          reader.stepOut();
        }
      }
    }
  }, {
    key: "_validateAnnotations",
    value: function _validateAnnotations(input) {
      if (!Array.isArray(input)) {
        return false;
      }

      for (var i = 0; i < input.length; i++) {
        if (!this._isString(input[i])) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: "_isString",
    value: function _isString(input) {
      return typeof input === 'string';
    }
  }]);
  return AbstractWriter;
}();

exports.AbstractWriter = AbstractWriter;

},{"./IonTypes":26,"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/interopRequireDefault":42}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var IntSize;

(function (IntSize) {
  IntSize[IntSize["Number"] = 0] = "Number";
  IntSize[IntSize["BigInt"] = 1] = "BigInt";
})(IntSize = exports.IntSize || (exports.IntSize = {}));

exports["default"] = IntSize;

},{}],3:[function(require,module,exports){
"use strict";

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IonBinaryReader_1 = require("./IonBinaryReader");

var IonConstants_1 = require("./IonConstants");

var IonSpan_1 = require("./IonSpan");

var IonTextReader_1 = require("./IonTextReader");

var IonTextWriter_1 = require("./IonTextWriter");

var IonPrettyTextWriter_1 = require("./IonPrettyTextWriter");

var IonWriteable_1 = require("./IonWriteable");

var IonBinaryWriter_1 = require("./IonBinaryWriter");

var IonLocalSymbolTable_1 = require("./IonLocalSymbolTable");

var IonUnicode_1 = require("./IonUnicode");

var IntSize_1 = __importDefault(require("./IntSize"));

exports.IntSize = IntSize_1["default"];

function isBinary(buffer) {
  if (buffer.length < 4) {
    return false;
  }

  for (var i = 0; i < 4; i++) {
    if (buffer[i] !== IonConstants_1.IVM.binary[i]) return false;
  }

  return true;
}

function makeReader(buf) {
  var catalog = null;

  if (typeof buf === "string") {
    return new IonTextReader_1.TextReader(new IonSpan_1.StringSpan(buf), catalog);
  }

  var bufArray = new Uint8Array(buf);

  if (isBinary(bufArray)) {
    return new IonBinaryReader_1.BinaryReader(new IonSpan_1.BinarySpan(bufArray), catalog);
  } else {
    return new IonTextReader_1.TextReader(new IonSpan_1.StringSpan(IonUnicode_1.decodeUtf8(bufArray)), catalog);
  }
}

exports.makeReader = makeReader;

function makeTextWriter() {
  return new IonTextWriter_1.TextWriter(new IonWriteable_1.Writeable());
}

exports.makeTextWriter = makeTextWriter;

function makePrettyWriter(indentSize) {
  return new IonPrettyTextWriter_1.PrettyTextWriter(new IonWriteable_1.Writeable(), indentSize);
}

exports.makePrettyWriter = makePrettyWriter;

function makeBinaryWriter() {
  var localSymbolTable = IonLocalSymbolTable_1.defaultLocalSymbolTable();
  return new IonBinaryWriter_1.BinaryWriter(localSymbolTable, new IonWriteable_1.Writeable());
}

exports.makeBinaryWriter = makeBinaryWriter;

var IonCatalog_1 = require("./IonCatalog");

exports.Catalog = IonCatalog_1.Catalog;

var IonDecimal_1 = require("./IonDecimal");

exports.Decimal = IonDecimal_1.Decimal;

var IonLocalSymbolTable_2 = require("./IonLocalSymbolTable");

exports.defaultLocalSymbolTable = IonLocalSymbolTable_2.defaultLocalSymbolTable;

var IonType_1 = require("./IonType");

exports.IonType = IonType_1.IonType;

var IonTypes_1 = require("./IonTypes");

exports.IonTypes = IonTypes_1.IonTypes;

var IonSharedSymbolTable_1 = require("./IonSharedSymbolTable");

exports.SharedSymbolTable = IonSharedSymbolTable_1.SharedSymbolTable;

var IonTimestamp_1 = require("./IonTimestamp");

exports.TimestampPrecision = IonTimestamp_1.TimestampPrecision;
exports.Timestamp = IonTimestamp_1.Timestamp;

var IonText_1 = require("./IonText");

exports.toBase64 = IonText_1.toBase64;

var IonUnicode_2 = require("./IonUnicode");

exports.decodeUtf8 = IonUnicode_2.decodeUtf8;

},{"./IntSize":2,"./IonBinaryReader":5,"./IonBinaryWriter":6,"./IonCatalog":7,"./IonConstants":8,"./IonDecimal":9,"./IonLocalSymbolTable":11,"./IonPrettyTextWriter":15,"./IonSharedSymbolTable":16,"./IonSpan":17,"./IonText":21,"./IonTextReader":22,"./IonTextWriter":23,"./IonTimestamp":24,"./IonType":25,"./IonTypes":26,"./IonUnicode":27,"./IonWriteable":28}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NIBBLE_MASK = 0xf;
exports.BYTE_MASK = 0xff;
exports.TYPE_SHIFT = 4;
exports.BYTE_SHIFT = 8;
exports.LEN_MASK = 0xf;
exports.LEN_VAR = 14;
exports.LEN_NULL = 15;
exports.TB_NULL = 0;
exports.TB_BOOL = 1;
exports.TB_INT = 2;
exports.TB_NEG_INT = 3;
exports.TB_FLOAT = 4;
exports.TB_DECIMAL = 5;
exports.TB_TIMESTAMP = 6;
exports.TB_SYMBOL = 7;
exports.TB_STRING = 8;
exports.TB_CLOB = 9;
exports.TB_BLOB = 10;
exports.TB_LIST = 11;
exports.TB_SEXP = 12;
exports.TB_STRUCT = 13;
exports.TB_ANNOTATION = 14;

},{}],5:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IonCatalog_1 = require("./IonCatalog");

var IonLocalSymbolTable_1 = require("./IonLocalSymbolTable");

var IonSymbols_1 = require("./IonSymbols");

var IonType_1 = require("./IonType");

var IonTypes_1 = require("./IonTypes");

var IonConstants_1 = require("./IonConstants");

var IonParserBinaryRaw_1 = require("./IonParserBinaryRaw");

var IntSize_1 = __importDefault(require("./IntSize"));

var JsbiSupport_1 = require("./JsbiSupport");

var RAW_STRING = new IonType_1.IonType(-1, "raw_input", true, false, false, false);
var ERROR = -3;
var BOC = -2;
var EOF = -1;
var TB_NULL = 0;
var TB_BOOL = 1;
var TB_INT = 2;
var TB_NEG_INT = 3;
var TB_FLOAT = 4;
var TB_DECIMAL = 5;
var TB_TIMESTAMP = 6;
var TB_SYMBOL = 7;
var TB_STRING = 8;
var TB_CLOB = 9;
var TB_BLOB = 10;
var TB_LIST = 11;
var TB_SEXP = 12;
var TB_STRUCT = 13;
var TB_ANNOTATION = 14;
var TB_UNUSED__ = 15;
var TB_SEXP_CLOSE = 21;
var TB_LIST_CLOSE = 22;
var TB_STRUCT_CLOSE = 23;

function get_ion_type(t) {
  switch (t) {
    case TB_NULL:
      return IonTypes_1.IonTypes.NULL;

    case TB_BOOL:
      return IonTypes_1.IonTypes.BOOL;

    case TB_INT:
      return IonTypes_1.IonTypes.INT;

    case TB_NEG_INT:
      return IonTypes_1.IonTypes.INT;

    case TB_FLOAT:
      return IonTypes_1.IonTypes.FLOAT;

    case TB_DECIMAL:
      return IonTypes_1.IonTypes.DECIMAL;

    case TB_TIMESTAMP:
      return IonTypes_1.IonTypes.TIMESTAMP;

    case TB_SYMBOL:
      return IonTypes_1.IonTypes.SYMBOL;

    case TB_STRING:
      return IonTypes_1.IonTypes.STRING;

    case TB_CLOB:
      return IonTypes_1.IonTypes.CLOB;

    case TB_BLOB:
      return IonTypes_1.IonTypes.BLOB;

    case TB_LIST:
      return IonTypes_1.IonTypes.LIST;

    case TB_SEXP:
      return IonTypes_1.IonTypes.SEXP;

    case TB_STRUCT:
      return IonTypes_1.IonTypes.STRUCT;

    default:
      return null;
  }
}

var BinaryReader =
/*#__PURE__*/
function () {
  function BinaryReader(source, catalog) {
    (0, _classCallCheck2["default"])(this, BinaryReader);
    this._annotations = null;
    this._parser = new IonParserBinaryRaw_1.ParserBinaryRaw(source);
    this._cat = catalog ? catalog : new IonCatalog_1.Catalog();
    this._symtab = IonLocalSymbolTable_1.defaultLocalSymbolTable();
    this._raw_type = BOC;
  }

  (0, _createClass2["default"])(BinaryReader, [{
    key: "next",
    value: function next() {
      this._annotations = null;
      if (this._raw_type === EOF) return null;

      for (this._raw_type = this._parser.next(); this.depth() === 0; this._raw_type = this._parser.next()) {
        if (this._raw_type === TB_SYMBOL) {
          var raw = this._parser._getSid();

          if (raw !== IonConstants_1.IVM.sid) break;
          this._symtab = IonLocalSymbolTable_1.defaultLocalSymbolTable();
        } else if (this._raw_type === TB_STRUCT) {
          if (!this._parser.hasAnnotations()) break;
          if (this._parser.getAnnotation(0) !== IonSymbols_1.ion_symbol_table_sid) break;
          this._symtab = IonSymbols_1.makeSymbolTable(this._cat, this);
        } else {
          break;
        }
      }

      return get_ion_type(this._raw_type);
    }
  }, {
    key: "stepIn",
    value: function stepIn() {
      if (!get_ion_type(this._raw_type).isContainer) throw new Error("Can't step in to a scalar value");

      this._parser.stepIn();

      this._raw_type = BOC;
    }
  }, {
    key: "stepOut",
    value: function stepOut() {
      this._parser.stepOut();

      this._raw_type = BOC;
    }
  }, {
    key: "type",
    value: function type() {
      return get_ion_type(this._raw_type);
    }
  }, {
    key: "depth",
    value: function depth() {
      return this._parser.depth();
    }
  }, {
    key: "fieldName",
    value: function fieldName() {
      return this.getSymbolString(this._parser.getFieldId());
    }
  }, {
    key: "hasAnnotations",
    value: function hasAnnotations() {
      return this._parser.hasAnnotations();
    }
  }, {
    key: "annotations",
    value: function annotations() {
      this._loadAnnotations();

      return this._annotations;
    }
  }, {
    key: "getAnnotation",
    value: function getAnnotation(index) {
      this._loadAnnotations();

      return this._annotations[index];
    }
  }, {
    key: "isNull",
    value: function isNull() {
      return this._raw_type === TB_NULL || this._parser.isNull();
    }
  }, {
    key: "byteValue",
    value: function byteValue() {
      return this._parser.byteValue();
    }
  }, {
    key: "booleanValue",
    value: function booleanValue() {
      return this._parser.booleanValue();
    }
  }, {
    key: "decimalValue",
    value: function decimalValue() {
      return this._parser.decimalValue();
    }
  }, {
    key: "bigIntValue",
    value: function bigIntValue() {
      return this._parser.bigIntValue();
    }
  }, {
    key: "intSize",
    value: function intSize() {
      if (JsbiSupport_1.JsbiSupport.isSafeInteger(this.bigIntValue())) {
        return IntSize_1["default"].Number;
      }

      return IntSize_1["default"].BigInt;
    }
  }, {
    key: "numberValue",
    value: function numberValue() {
      return this._parser.numberValue();
    }
  }, {
    key: "stringValue",
    value: function stringValue() {
      var t = this;
      var p = t._parser;

      switch (get_ion_type(t._raw_type)) {
        case IonTypes_1.IonTypes.NULL:
          return null;

        case IonTypes_1.IonTypes.STRING:
          if (this.isNull()) {
            return null;
          }

          return p.stringValue();

        case IonTypes_1.IonTypes.SYMBOL:
          if (this.isNull()) {
            return null;
          }

          return this.getSymbolString(p._getSid());
      }

      throw new Error('Current value is not a string or symbol.');
    }
  }, {
    key: "timestampValue",
    value: function timestampValue() {
      return this._parser.timestampValue();
    }
  }, {
    key: "value",
    value: function value() {
      var type = this.type();

      if (type && type.isContainer) {
        if (this.isNull()) {
          return null;
        }

        throw new Error('Unable to provide a value for ' + type.name + ' containers.');
      }

      switch (type) {
        case IonTypes_1.IonTypes.NULL:
          return null;

        case IonTypes_1.IonTypes.BLOB:
        case IonTypes_1.IonTypes.CLOB:
          return this.byteValue();

        case IonTypes_1.IonTypes.BOOL:
          return this.booleanValue();

        case IonTypes_1.IonTypes.DECIMAL:
          return this.decimalValue();

        case IonTypes_1.IonTypes.INT:
          return this.bigIntValue();

        case IonTypes_1.IonTypes.FLOAT:
          return this.numberValue();

        case IonTypes_1.IonTypes.STRING:
        case IonTypes_1.IonTypes.SYMBOL:
          return this.stringValue();

        case IonTypes_1.IonTypes.TIMESTAMP:
          return this.timestampValue();

        default:
          throw new Error('There is no current value.');
      }
    }
  }, {
    key: "_loadAnnotations",
    value: function _loadAnnotations() {
      var _this = this;

      if (this._annotations === null) {
        this._annotations = [];

        this._parser.getAnnotations().forEach(function (id) {
          _this._annotations.push(_this.getSymbolString(id));
        });
      }
    }
  }, {
    key: "getSymbolString",
    value: function getSymbolString(symbolId) {
      var s = null;

      if (symbolId > 0) {
        s = this._symtab.getSymbolText(symbolId);

        if (typeof s == 'undefined') {
          s = "$" + symbolId.toString();
        }
      }

      return s;
    }
  }]);
  return BinaryReader;
}();

exports.BinaryReader = BinaryReader;

},{"./IntSize":2,"./IonCatalog":7,"./IonConstants":8,"./IonLocalSymbolTable":11,"./IonParserBinaryRaw":13,"./IonSymbols":19,"./IonType":25,"./IonTypes":26,"./JsbiSupport":30,"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/interopRequireDefault":42}],6:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var AbstractWriter_1 = require("./AbstractWriter");

var IonDecimal_1 = require("./IonDecimal");

var IonUnicode_1 = require("./IonUnicode");

var IonTypes_1 = require("./IonTypes");

var IonLowLevelBinaryWriter_1 = require("./IonLowLevelBinaryWriter");

var IonTimestamp_1 = require("./IonTimestamp");

var IonWriteable_1 = require("./IonWriteable");

var util_1 = require("./util");

var jsbi_1 = __importDefault(require("jsbi"));

var JsbiSupport_1 = require("./JsbiSupport");

var JsbiSerde_1 = require("./JsbiSerde");

var MAJOR_VERSION = 1;
var MINOR_VERSION = 0;
var MAX_VALUE_LENGTH = 14;
var MAX_VALUE_LENGTH_FLAG = 14;
var NULL_VALUE_FLAG = 15;
var TYPE_DESCRIPTOR_LENGTH = 1;
var States;

(function (States) {
  States[States["VALUE"] = 0] = "VALUE";
  States[States["STRUCT_FIELD"] = 1] = "STRUCT_FIELD";
  States[States["STRUCT_VALUE"] = 2] = "STRUCT_VALUE";
  States[States["CLOSED"] = 3] = "CLOSED";
})(States || (States = {}));

var TypeCodes;

(function (TypeCodes) {
  TypeCodes[TypeCodes["NULL"] = 0] = "NULL";
  TypeCodes[TypeCodes["BOOL"] = 1] = "BOOL";
  TypeCodes[TypeCodes["POSITIVE_INT"] = 2] = "POSITIVE_INT";
  TypeCodes[TypeCodes["NEGATIVE_INT"] = 3] = "NEGATIVE_INT";
  TypeCodes[TypeCodes["FLOAT"] = 4] = "FLOAT";
  TypeCodes[TypeCodes["DECIMAL"] = 5] = "DECIMAL";
  TypeCodes[TypeCodes["TIMESTAMP"] = 6] = "TIMESTAMP";
  TypeCodes[TypeCodes["SYMBOL"] = 7] = "SYMBOL";
  TypeCodes[TypeCodes["STRING"] = 8] = "STRING";
  TypeCodes[TypeCodes["CLOB"] = 9] = "CLOB";
  TypeCodes[TypeCodes["BLOB"] = 10] = "BLOB";
  TypeCodes[TypeCodes["LIST"] = 11] = "LIST";
  TypeCodes[TypeCodes["SEXP"] = 12] = "SEXP";
  TypeCodes[TypeCodes["STRUCT"] = 13] = "STRUCT";
  TypeCodes[TypeCodes["ANNOTATION"] = 14] = "ANNOTATION";
})(TypeCodes || (TypeCodes = {}));

var BinaryWriter =
/*#__PURE__*/
function (_AbstractWriter_1$Abs) {
  (0, _inherits2["default"])(BinaryWriter, _AbstractWriter_1$Abs);

  function BinaryWriter(symbolTable, writeable) {
    var _this;

    (0, _classCallCheck2["default"])(this, BinaryWriter);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(BinaryWriter).call(this));
    _this.datagram = [];
    _this.containers = [];
    _this.state = States.VALUE;
    _this.symbolTable = symbolTable;
    _this.writer = new IonLowLevelBinaryWriter_1.LowLevelBinaryWriter(writeable);
    return _this;
  }

  (0, _createClass2["default"])(BinaryWriter, [{
    key: "getBytes",
    value: function getBytes() {
      return this.writer.getBytes();
    }
  }, {
    key: "writeBlob",
    value: function writeBlob(value) {
      this.checkWriteValue();

      if (value === null || value === undefined) {
        this.writeNull(IonTypes_1.IonTypes.BLOB);
        return;
      }

      this.addNode(new BytesNode(this.writer, this.getCurrentContainer(), IonTypes_1.IonTypes.BLOB, this.encodeAnnotations(this._annotations), value));
    }
  }, {
    key: "writeBoolean",
    value: function writeBoolean(value) {
      this.checkWriteValue();

      if (value === null || value === undefined) {
        this.writeNull(IonTypes_1.IonTypes.BOOL);
        return;
      }

      this.addNode(new BooleanNode(this.writer, this.getCurrentContainer(), this.encodeAnnotations(this._annotations), value));
    }
  }, {
    key: "writeClob",
    value: function writeClob(value) {
      this.checkWriteValue();

      if (value === null || value === undefined) {
        this.writeNull(IonTypes_1.IonTypes.CLOB);
        return;
      }

      this.addNode(new BytesNode(this.writer, this.getCurrentContainer(), IonTypes_1.IonTypes.CLOB, this.encodeAnnotations(this._annotations), value));
    }
  }, {
    key: "writeDecimal",
    value: function writeDecimal(value) {
      this.checkWriteValue();

      if (value === null || value === undefined) {
        this.writeNull(IonTypes_1.IonTypes.DECIMAL);
        return;
      }

      if (typeof value == 'string') value = IonDecimal_1.Decimal.parse(value);
      var exponent = value.getExponent();
      var coefficient = value.getCoefficient();
      var isPositiveZero = jsbi_1["default"].equal(coefficient, JsbiSupport_1.JsbiSupport.ZERO) && !value.isNegative();

      if (isPositiveZero && exponent === 0 && util_1._sign(exponent) === 1) {
        this.addNode(new BytesNode(this.writer, this.getCurrentContainer(), IonTypes_1.IonTypes.DECIMAL, this.encodeAnnotations(this._annotations), new Uint8Array(0)));
        return;
      }

      var isNegative = value.isNegative();
      var writeCoefficient = isNegative || jsbi_1["default"].notEqual(coefficient, JsbiSupport_1.JsbiSupport.ZERO);
      var coefficientBytes = writeCoefficient ? JsbiSerde_1.JsbiSerde.toSignedIntBytes(coefficient, isNegative) : null;
      var bufLen = IonLowLevelBinaryWriter_1.LowLevelBinaryWriter.getVariableLengthSignedIntSize(exponent) + (writeCoefficient ? coefficientBytes.length : 0);
      var writer = new IonLowLevelBinaryWriter_1.LowLevelBinaryWriter(new IonWriteable_1.Writeable(bufLen));
      writer.writeVariableLengthSignedInt(exponent);

      if (writeCoefficient) {
        writer.writeBytes(coefficientBytes);
      }

      this.addNode(new BytesNode(this.writer, this.getCurrentContainer(), IonTypes_1.IonTypes.DECIMAL, this.encodeAnnotations(this._annotations), writer.getBytes()));
    }
  }, {
    key: "writeFloat32",
    value: function writeFloat32(value) {
      this.checkWriteValue();

      if (value === null || value === undefined) {
        this.writeNull(IonTypes_1.IonTypes.FLOAT);
        return;
      }

      var bytes;

      if (Object.is(value, 0)) {
        bytes = new Uint8Array(0);
      } else {
        var buffer = new ArrayBuffer(4);
        var dataview = new DataView(buffer);
        dataview.setFloat32(0, value, false);
        bytes = new Uint8Array(buffer);
      }

      this.addNode(new BytesNode(this.writer, this.getCurrentContainer(), IonTypes_1.IonTypes.FLOAT, this.encodeAnnotations(this._annotations), bytes));
    }
  }, {
    key: "writeFloat64",
    value: function writeFloat64(value) {
      this.checkWriteValue();

      if (value === null || value === undefined) {
        this.writeNull(IonTypes_1.IonTypes.FLOAT);
        return;
      }

      var bytes;

      if (Object.is(value, 0)) {
        bytes = new Uint8Array(0);
      } else {
        var buffer = new ArrayBuffer(8);
        var dataview = new DataView(buffer);
        dataview.setFloat64(0, value, false);
        bytes = new Uint8Array(buffer);
      }

      this.addNode(new BytesNode(this.writer, this.getCurrentContainer(), IonTypes_1.IonTypes.FLOAT, this.encodeAnnotations(this._annotations), bytes));
    }
  }, {
    key: "writeInt",
    value: function writeInt(value) {
      this.checkWriteValue();

      if (value === null || value === undefined) {
        this.writeNull(IonTypes_1.IonTypes.INT);
        return;
      }

      this.addNode(new IntNode(this.writer, this.getCurrentContainer(), this.encodeAnnotations(this._annotations), value));
    }
  }, {
    key: "writeNull",
    value: function writeNull() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : IonTypes_1.IonTypes.NULL;
      this.checkWriteValue();
      this.addNode(new NullNode(this.writer, this.getCurrentContainer(), type, this.encodeAnnotations(this._annotations)));
    }
  }, {
    key: "writeString",
    value: function writeString(value) {
      this.checkWriteValue();

      if (value === null || value === undefined) {
        this.writeNull(IonTypes_1.IonTypes.STRING);
        return;
      }

      this.addNode(new BytesNode(this.writer, this.getCurrentContainer(), IonTypes_1.IonTypes.STRING, this.encodeAnnotations(this._annotations), IonUnicode_1.encodeUtf8(value)));
    }
  }, {
    key: "writeSymbol",
    value: function writeSymbol(value) {
      this.checkWriteValue();

      if (value === null || value === undefined) {
        this.writeNull(IonTypes_1.IonTypes.SYMBOL);
      } else {
        var symbolId = this.symbolTable.addSymbol(value);
        var writer = new IonLowLevelBinaryWriter_1.LowLevelBinaryWriter(new IonWriteable_1.Writeable(IonLowLevelBinaryWriter_1.LowLevelBinaryWriter.getUnsignedIntSize(symbolId)));
        writer.writeUnsignedInt(symbolId);
        this.addNode(new BytesNode(this.writer, this.getCurrentContainer(), IonTypes_1.IonTypes.SYMBOL, this.encodeAnnotations(this._annotations), writer.getBytes()));
      }
    }
  }, {
    key: "writeTimestamp",
    value: function writeTimestamp(value) {
      this.checkWriteValue();

      if (value === null || value === undefined) {
        this.writeNull(IonTypes_1.IonTypes.TIMESTAMP);
        return;
      }

      var writer = new IonLowLevelBinaryWriter_1.LowLevelBinaryWriter(new IonWriteable_1.Writeable(12));
      writer.writeVariableLengthSignedInt(value.getLocalOffset());
      var date = value.getDate();
      writer.writeVariableLengthUnsignedInt(date.getUTCFullYear());

      if (value.getPrecision() >= IonTimestamp_1.TimestampPrecision.MONTH) {
        writer.writeVariableLengthUnsignedInt(date.getUTCMonth() + 1);
      }

      if (value.getPrecision() >= IonTimestamp_1.TimestampPrecision.DAY) {
        writer.writeVariableLengthUnsignedInt(date.getUTCDate());
      }

      if (value.getPrecision() >= IonTimestamp_1.TimestampPrecision.HOUR_AND_MINUTE) {
        writer.writeVariableLengthUnsignedInt(date.getUTCHours());
        writer.writeVariableLengthUnsignedInt(date.getUTCMinutes());
      }

      if (value.getPrecision() >= IonTimestamp_1.TimestampPrecision.SECONDS) {
        writer.writeVariableLengthUnsignedInt(value.getSecondsInt());

        var fractionalSeconds = value._getFractionalSeconds();

        if (fractionalSeconds.getExponent() !== 0) {
          writer.writeVariableLengthSignedInt(fractionalSeconds.getExponent());

          if (!JsbiSupport_1.JsbiSupport.isZero(fractionalSeconds.getCoefficient())) {
            writer.writeBytes(JsbiSerde_1.JsbiSerde.toSignedIntBytes(fractionalSeconds.getCoefficient(), fractionalSeconds.isNegative()));
          }
        }
      }

      this.addNode(new BytesNode(this.writer, this.getCurrentContainer(), IonTypes_1.IonTypes.TIMESTAMP, this.encodeAnnotations(this._annotations), writer.getBytes()));
    }
  }, {
    key: "stepIn",
    value: function stepIn(type) {
      this.checkWriteValue();

      switch (type) {
        case IonTypes_1.IonTypes.LIST:
        case IonTypes_1.IonTypes.SEXP:
          this.addNode(new SequenceNode(this.writer, this.getCurrentContainer(), type, this.encodeAnnotations(this._annotations)));
          break;

        case IonTypes_1.IonTypes.STRUCT:
          this.addNode(new StructNode(this.writer, this.getCurrentContainer(), this.encodeAnnotations(this._annotations)));
          this.state = States.STRUCT_FIELD;
          break;

        default:
          throw new Error("Unrecognized container type");
      }
    }
  }, {
    key: "stepOut",
    value: function stepOut() {
      if (this.depth() === 0) {
        throw new Error("Not currently in a container");
      }

      if (this.state === States.STRUCT_VALUE) {
        throw new Error("Cannot exit a struct with a partially written field");
      }

      this.containers.pop();

      if (this.depth() > 0) {
        this.state = this.getCurrentContainer() instanceof StructNode ? States.STRUCT_FIELD : States.VALUE;
      } else {
        this.state = States.VALUE;
      }
    }
  }, {
    key: "writeFieldName",
    value: function writeFieldName(fieldName) {
      if (this.state !== States.STRUCT_FIELD) {
        throw new Error("Cannot write a field name outside of a struct");
      }

      this.fieldName = this.encodeAnnotations([fieldName]);
      this.state = States.STRUCT_VALUE;
    }
  }, {
    key: "depth",
    value: function depth() {
      return this.containers.length;
    }
  }, {
    key: "close",
    value: function close() {
      this.checkClosed();

      if (this.depth() > 0) {
        throw new Error("Writer has one or more open containers; call stepOut() for each container prior to close()");
      }

      this.writeIvm();
      var datagram = this.datagram;
      this.datagram = [];
      this.writeSymbolTable();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = datagram[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var node = _step.value;
          node.write();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.state = States.CLOSED;
    }
  }, {
    key: "writeIvm",
    value: function writeIvm() {
      this.writer.writeByte(0xE0);
      this.writer.writeByte(MAJOR_VERSION);
      this.writer.writeByte(MINOR_VERSION);
      this.writer.writeByte(0xEA);
    }
  }, {
    key: "encodeAnnotations",
    value: function encodeAnnotations(annotations) {
      if (annotations.length === 0) {
        return new Uint8Array(0);
      }

      var writeable = new IonWriteable_1.Writeable();
      var writer = new IonLowLevelBinaryWriter_1.LowLevelBinaryWriter(writeable);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = annotations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var annotation = _step2.value;
          var symbolId = this.symbolTable.addSymbol(annotation);
          writer.writeVariableLengthUnsignedInt(symbolId);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this._clearAnnotations();

      return writeable.getBytes();
    }
  }, {
    key: "getCurrentContainer",
    value: function getCurrentContainer() {
      return this.containers[this.containers.length - 1];
    }
  }, {
    key: "addNode",
    value: function addNode(node) {
      if (this.depth() === 0) {
        this.datagram.push(node);
      } else {
        if (this.state === States.STRUCT_VALUE) {
          this.getCurrentContainer().addChild(node, this.fieldName);
          this.state = States.STRUCT_FIELD;
        } else {
          this.getCurrentContainer().addChild(node);
        }
      }

      if (node.isContainer()) {
        this.containers.push(node);
        this.state = States.VALUE;
      }
    }
  }, {
    key: "checkWriteValue",
    value: function checkWriteValue() {
      this.checkClosed();

      if (this.state === States.STRUCT_FIELD) {
        throw new Error("Expected a struct field name instead of a value, call writeFieldName(string) with the desired name before calling stepIn(IonType) or writeIonType()");
      }
    }
  }, {
    key: "checkClosed",
    value: function checkClosed() {
      if (this.state === States.CLOSED) {
        throw new Error("Writer is closed, no further operations are available");
      }
    }
  }, {
    key: "writeSymbolTable",
    value: function writeSymbolTable() {
      var hasImports = this.symbolTable["import"].symbolTable.name != "$ion";
      var hasLocalSymbols = this.symbolTable.symbols.length > 0;

      if (!(hasImports || hasLocalSymbols)) {
        return;
      }

      this.setAnnotations(['$ion_symbol_table']);
      this.stepIn(IonTypes_1.IonTypes.STRUCT);

      if (hasImports) {
        this.writeFieldName('imports');
        this.stepIn(IonTypes_1.IonTypes.LIST);
        this.writeImport(this.symbolTable["import"]);
        this.stepOut();
      }

      if (hasLocalSymbols) {
        this.writeFieldName('symbols');
        this.stepIn(IonTypes_1.IonTypes.LIST);
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.symbolTable.symbols[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var symbol_ = _step3.value;

            if (symbol_ !== undefined) {
              this.writeString(symbol_);
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
              _iterator3["return"]();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        this.stepOut();
      }

      this.stepOut();
      this.datagram[0].write();
    }
  }, {
    key: "writeImport",
    value: function writeImport(import_) {
      if (!import_) {
        return;
      }

      this.writeImport(import_.parent);
      this.stepIn(IonTypes_1.IonTypes.STRUCT);
      this.writeFieldName('name');
      this.writeString(import_.symbolTable.name);
      this.writeFieldName('version');
      this.writeInt(import_.symbolTable.version);
      this.writeFieldName('max_id');
      this.writeInt(import_.length);
      this.stepOut();
    }
  }]);
  return BinaryWriter;
}(AbstractWriter_1.AbstractWriter);

exports.BinaryWriter = BinaryWriter;

var AbstractNode =
/*#__PURE__*/
function () {
  function AbstractNode(_writer, parent, _type, annotations) {
    (0, _classCallCheck2["default"])(this, AbstractNode);
    this._writer = _writer;
    this.parent = parent;
    this._type = _type;
    this.annotations = annotations;
  }

  (0, _createClass2["default"])(AbstractNode, [{
    key: "writeTypeDescriptorAndLength",
    value: function writeTypeDescriptorAndLength(typeCode, isNull, length) {
      var typeDescriptor = typeCode << 4;

      if (isNull) {
        typeDescriptor |= NULL_VALUE_FLAG;
        this.writer.writeByte(typeDescriptor);
      } else if (length < MAX_VALUE_LENGTH) {
        typeDescriptor |= length;
        this.writer.writeByte(typeDescriptor);
      } else {
        typeDescriptor |= MAX_VALUE_LENGTH_FLAG;
        this.writer.writeByte(typeDescriptor);
        this.writer.writeVariableLengthUnsignedInt(length);
      }
    }
  }, {
    key: "getContainedValueLength",
    value: function getContainedValueLength() {
      var valueLength = this.getValueLength();
      var valueLengthLength = AbstractNode.getLengthLength(valueLength);
      return TYPE_DESCRIPTOR_LENGTH + valueLengthLength + valueLength;
    }
  }, {
    key: "getAnnotatedContainerLength",
    value: function getAnnotatedContainerLength() {
      var annotationsLength = this.annotations.length;
      var annotationsLengthLength = IonLowLevelBinaryWriter_1.LowLevelBinaryWriter.getVariableLengthUnsignedIntSize(annotationsLength);
      var containedValueLength = this.getContainedValueLength();
      return annotationsLength + annotationsLengthLength + containedValueLength;
    }
  }, {
    key: "getAnnotationsLength",
    value: function getAnnotationsLength() {
      if (this.hasAnnotations()) {
        var annotationsLength = this.annotations.length;
        var annotationsLengthLength = IonLowLevelBinaryWriter_1.LowLevelBinaryWriter.getVariableLengthUnsignedIntSize(annotationsLength);
        var containedValueLength = this.getContainedValueLength();
        var containedValueLengthLength = AbstractNode.getLengthLength(containedValueLength);
        return TYPE_DESCRIPTOR_LENGTH + containedValueLengthLength + annotationsLengthLength + annotationsLength;
      }

      return 0;
    }
  }, {
    key: "getLength",
    value: function getLength() {
      var annotationsLength = this.getAnnotationsLength();
      var containedValueLength = this.getContainedValueLength();
      return annotationsLength + containedValueLength;
    }
  }, {
    key: "writeAnnotations",
    value: function writeAnnotations() {
      if (!this.hasAnnotations()) {
        return;
      }

      var annotatedContainerLength = this.getAnnotatedContainerLength();
      this.writeTypeDescriptorAndLength(TypeCodes.ANNOTATION, false, annotatedContainerLength);
      this.writer.writeVariableLengthUnsignedInt(this.annotations.length);
      this.writer.writeBytes(new Uint8Array(this.annotations));
    }
  }, {
    key: "hasAnnotations",
    value: function hasAnnotations() {
      return this.annotations.length > 0;
    }
  }, {
    key: "typeCode",
    get: function get() {
      return this._type.binaryTypeId;
    }
  }, {
    key: "writer",
    get: function get() {
      return this._writer;
    }
  }], [{
    key: "getLengthLength",
    value: function getLengthLength(length) {
      if (length < MAX_VALUE_LENGTH) {
        return 0;
      } else {
        return IonLowLevelBinaryWriter_1.LowLevelBinaryWriter.getVariableLengthUnsignedIntSize(length);
      }
    }
  }]);
  return AbstractNode;
}();

exports.AbstractNode = AbstractNode;

var ContainerNode =
/*#__PURE__*/
function (_AbstractNode) {
  (0, _inherits2["default"])(ContainerNode, _AbstractNode);

  function ContainerNode(writer, parent, type, annotations) {
    (0, _classCallCheck2["default"])(this, ContainerNode);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ContainerNode).call(this, writer, parent, type, annotations));
  }

  (0, _createClass2["default"])(ContainerNode, [{
    key: "isContainer",
    value: function isContainer() {
      return true;
    }
  }]);
  return ContainerNode;
}(AbstractNode);

var SequenceNode =
/*#__PURE__*/
function (_ContainerNode) {
  (0, _inherits2["default"])(SequenceNode, _ContainerNode);

  function SequenceNode(writer, parent, type, annotations) {
    var _this2;

    (0, _classCallCheck2["default"])(this, SequenceNode);
    _this2 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(SequenceNode).call(this, writer, parent, type, annotations));
    _this2.children = [];
    return _this2;
  }

  (0, _createClass2["default"])(SequenceNode, [{
    key: "addChild",
    value: function addChild(child, name) {
      this.children.push(child);
    }
  }, {
    key: "write",
    value: function write() {
      this.writeAnnotations();
      this.writeTypeDescriptorAndLength(this.typeCode, false, this.getValueLength());
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var child = _step4.value;
          child.write();
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
  }, {
    key: "getValueLength",
    value: function getValueLength() {
      var valueLength = 0;
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.children[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var child = _step5.value;
          valueLength += child.getLength();
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return valueLength;
    }
  }, {
    key: "getLength",
    value: function getLength() {
      if (this.length === undefined) {
        this.length = (0, _get2["default"])((0, _getPrototypeOf2["default"])(SequenceNode.prototype), "getLength", this).call(this);
      }

      return this.length;
    }
  }]);
  return SequenceNode;
}(ContainerNode);

var StructNode =
/*#__PURE__*/
function (_ContainerNode2) {
  (0, _inherits2["default"])(StructNode, _ContainerNode2);

  function StructNode(writer, parent, annotations) {
    var _this3;

    (0, _classCallCheck2["default"])(this, StructNode);
    _this3 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(StructNode).call(this, writer, parent, IonTypes_1.IonTypes.STRUCT, annotations));
    _this3.fields = [];
    return _this3;
  }

  (0, _createClass2["default"])(StructNode, [{
    key: "addChild",
    value: function addChild(child, fieldName) {
      if (fieldName === null || fieldName === undefined) throw new Error("Cannot add a value to a struct without a field name");
      this.fields.push({
        name: fieldName,
        value: child
      });
    }
  }, {
    key: "getValueLength",
    value: function getValueLength() {
      var valueLength = 0;
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = this.fields[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var field = _step6.value;
          valueLength += field.name.length;
          valueLength += field.value.getLength();
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
            _iterator6["return"]();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      return valueLength;
    }
  }, {
    key: "getLength",
    value: function getLength() {
      if (this.length === undefined) {
        this.length = (0, _get2["default"])((0, _getPrototypeOf2["default"])(StructNode.prototype), "getLength", this).call(this);
      }

      return this.length;
    }
  }, {
    key: "write",
    value: function write() {
      this.writeAnnotations();
      this.writeTypeDescriptorAndLength(this.typeCode, false, this.getValueLength());
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = this.fields[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var field = _step7.value;
          this.writer.writeBytes(new Uint8Array(field.name));
          field.value.write();
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
            _iterator7["return"]();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }
    }
  }]);
  return StructNode;
}(ContainerNode);

var LeafNode =
/*#__PURE__*/
function (_AbstractNode2) {
  (0, _inherits2["default"])(LeafNode, _AbstractNode2);

  function LeafNode() {
    (0, _classCallCheck2["default"])(this, LeafNode);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(LeafNode).apply(this, arguments));
  }

  (0, _createClass2["default"])(LeafNode, [{
    key: "addChild",
    value: function addChild(child, name) {
      throw new Error("Cannot add a child to a leaf node");
    }
  }, {
    key: "isContainer",
    value: function isContainer() {
      return false;
    }
  }]);
  return LeafNode;
}(AbstractNode);

exports.LeafNode = LeafNode;

var BooleanNode =
/*#__PURE__*/
function (_LeafNode) {
  (0, _inherits2["default"])(BooleanNode, _LeafNode);

  function BooleanNode(writer, parent, annotations, value) {
    var _this4;

    (0, _classCallCheck2["default"])(this, BooleanNode);
    _this4 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(BooleanNode).call(this, writer, parent, IonTypes_1.IonTypes.BOOL, annotations));
    _this4.value = value;
    return _this4;
  }

  (0, _createClass2["default"])(BooleanNode, [{
    key: "write",
    value: function write() {
      this.writeAnnotations();
      this.writeTypeDescriptorAndLength(this.typeCode, false, this.value ? 1 : 0);
    }
  }, {
    key: "getValueLength",
    value: function getValueLength() {
      return 0;
    }
  }]);
  return BooleanNode;
}(LeafNode);

var IntNode =
/*#__PURE__*/
function (_LeafNode2) {
  (0, _inherits2["default"])(IntNode, _LeafNode2);

  function IntNode(writer, parent, annotations, value) {
    var _this5;

    (0, _classCallCheck2["default"])(this, IntNode);
    _this5 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(IntNode).call(this, writer, parent, IonTypes_1.IonTypes.INT, annotations));
    _this5.value = value;

    if (!(typeof _this5.value === 'number' || _this5.value instanceof jsbi_1["default"])) {
      throw new Error('Expected ' + _this5.value + ' to be a number or JSBI');
    }

    if (jsbi_1["default"].GT(_this5.value, 0)) {
      _this5.intTypeCode = TypeCodes.POSITIVE_INT;

      var _writer2 = new IonLowLevelBinaryWriter_1.LowLevelBinaryWriter(new IonWriteable_1.Writeable(IonLowLevelBinaryWriter_1.LowLevelBinaryWriter.getUnsignedIntSize(_this5.value)));

      _writer2.writeUnsignedInt(_this5.value);

      _this5.bytes = _writer2.getBytes();
    } else if (jsbi_1["default"].LT(_this5.value, 0)) {
      _this5.intTypeCode = TypeCodes.NEGATIVE_INT;
      var magnitude;

      if (value instanceof jsbi_1["default"]) {
        if (JsbiSupport_1.JsbiSupport.isNegative(value)) {
          magnitude = jsbi_1["default"].unaryMinus(value);
        }
      } else {
        magnitude = Math.abs(value);
      }

      var _writer3 = new IonLowLevelBinaryWriter_1.LowLevelBinaryWriter(new IonWriteable_1.Writeable(IonLowLevelBinaryWriter_1.LowLevelBinaryWriter.getUnsignedIntSize(magnitude)));

      _writer3.writeUnsignedInt(magnitude);

      _this5.bytes = _writer3.getBytes();
    } else {
      _this5.intTypeCode = TypeCodes.POSITIVE_INT;
      _this5.bytes = new Uint8Array(0);
    }

    return _this5;
  }

  (0, _createClass2["default"])(IntNode, [{
    key: "write",
    value: function write() {
      this.writeAnnotations();
      this.writeTypeDescriptorAndLength(this.intTypeCode, false, this.bytes.length);
      this.writer.writeBytes(this.bytes);
    }
  }, {
    key: "getValueLength",
    value: function getValueLength() {
      return this.bytes.length;
    }
  }]);
  return IntNode;
}(LeafNode);

var BytesNode =
/*#__PURE__*/
function (_LeafNode3) {
  (0, _inherits2["default"])(BytesNode, _LeafNode3);

  function BytesNode(writer, parent, type, annotations, value) {
    var _this6;

    (0, _classCallCheck2["default"])(this, BytesNode);
    _this6 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(BytesNode).call(this, writer, parent, type, annotations));
    _this6.value = value;
    return _this6;
  }

  (0, _createClass2["default"])(BytesNode, [{
    key: "write",
    value: function write() {
      this.writeAnnotations();
      this.writeTypeDescriptorAndLength(this.typeCode, false, this.value.length);
      this.writer.writeBytes(this.value);
    }
  }, {
    key: "getValueLength",
    value: function getValueLength() {
      return this.value.length;
    }
  }]);
  return BytesNode;
}(LeafNode);

var NullNode =
/*#__PURE__*/
function (_LeafNode4) {
  (0, _inherits2["default"])(NullNode, _LeafNode4);

  function NullNode(writer, parent, type, annotations) {
    (0, _classCallCheck2["default"])(this, NullNode);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(NullNode).call(this, writer, parent, type, annotations));
  }

  (0, _createClass2["default"])(NullNode, [{
    key: "write",
    value: function write() {
      this.writeAnnotations();
      this.writeTypeDescriptorAndLength(this.typeCode, true, 0);
    }
  }, {
    key: "getValueLength",
    value: function getValueLength() {
      return 0;
    }
  }]);
  return NullNode;
}(LeafNode);

exports.NullNode = NullNode;

},{"./AbstractWriter":1,"./IonDecimal":9,"./IonLowLevelBinaryWriter":12,"./IonTimestamp":24,"./IonTypes":26,"./IonUnicode":27,"./IonWriteable":28,"./JsbiSerde":29,"./JsbiSupport":30,"./util":32,"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/get":39,"@babel/runtime/helpers/getPrototypeOf":40,"@babel/runtime/helpers/inherits":41,"@babel/runtime/helpers/interopRequireDefault":42,"@babel/runtime/helpers/possibleConstructorReturn":45,"jsbi":50}],7:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IonSystemSymbolTable_1 = require("./IonSystemSymbolTable");

function byVersion(x, y) {
  return x.version - y.version;
}

var Catalog =
/*#__PURE__*/
function () {
  function Catalog() {
    (0, _classCallCheck2["default"])(this, Catalog);
    this.symbolTables = {};
    this.add(IonSystemSymbolTable_1.getSystemSymbolTable());
  }

  (0, _createClass2["default"])(Catalog, [{
    key: "add",
    value: function add(symbolTable) {
      if (symbolTable.name === undefined || symbolTable.name === null) throw new Error("SymbolTable name must be defined.");
      var versions = this.symbolTables[symbolTable.name];
      if (versions === undefined) this.symbolTables[symbolTable.name] = [];
      this.symbolTables[symbolTable.name][symbolTable.version] = symbolTable;
    }
  }, {
    key: "getVersion",
    value: function getVersion(name, version) {
      var tables = this.symbolTables[name];
      if (!tables) return null;
      var table = tables[version];
      if (!table) table = tables[tables.length];
      return table ? table : null;
    }
  }, {
    key: "getTable",
    value: function getTable(name) {
      var versions = this.symbolTables[name],
          table;
      if (versions === undefined) return null;
      return versions[versions.length - 1];
    }
  }]);
  return Catalog;
}();

exports.Catalog = Catalog;

},{"./IonSystemSymbolTable":20,"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/interopRequireDefault":42}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EOF = -1;
exports.IVM = {
  text: "$ion_1_0",
  binary: new Uint8Array([0xE0, 0x01, 0x00, 0xEA]),
  sid: 2
};

},{}],9:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var jsbi_1 = __importDefault(require("jsbi"));

var util_1 = require("./util");

var JsbiSupport_1 = require("./JsbiSupport");

var Decimal =
/*#__PURE__*/
function () {
  function Decimal(coefficient, exponent, isNegative) {
    (0, _classCallCheck2["default"])(this, Decimal);

    if (typeof coefficient === "string") {
      return Decimal.parse(coefficient);
    }

    if (!util_1._hasValue(exponent)) {
      throw new Error("Decimal's constructor was called with a numeric coefficient but no exponent.");
    }

    if (typeof coefficient === "number") {
      return Decimal._fromNumberCoefficient(coefficient, exponent);
    }

    if (coefficient instanceof jsbi_1["default"]) {
      if (!util_1._hasValue(isNegative)) {
        isNegative = JsbiSupport_1.JsbiSupport.isNegative(coefficient);
      } else if (isNegative != JsbiSupport_1.JsbiSupport.isNegative(coefficient)) {
        coefficient = jsbi_1["default"].unaryMinus(coefficient);
      }

      return Decimal._fromBigIntCoefficient(isNegative, coefficient, exponent);
    }

    throw new Error("Unsupported parameter set (".concat(coefficient, ", ").concat(exponent, ", ").concat(isNegative, " passed to Decimal constructor."));
  }

  (0, _createClass2["default"])(Decimal, [{
    key: "isNegative",
    value: function isNegative() {
      return this._isNegative;
    }
  }, {
    key: "numberValue",
    value: function numberValue() {
      if (this._isNegativeZero()) {
        return -0;
      }

      return jsbi_1["default"].toNumber(this._coefficient) * Math.pow(10, this._exponent);
    }
  }, {
    key: "intValue",
    value: function intValue() {
      return Math.trunc(this.numberValue());
    }
  }, {
    key: "toString",
    value: function toString() {
      var cStr = this._coefficient.toString();

      if (cStr[0] === '-') {
        cStr = cStr.substr(1, cStr.length);
      }

      var precision = cStr.length;
      var adjustedExponent = this._exponent + (precision - 1);
      var s = '';

      if (this._exponent <= 0 && adjustedExponent >= -6) {
        if (this._exponent === 0) {
          s += cStr;
        } else {
          if (cStr.length <= -this._exponent) {
            cStr = '0'.repeat(-this._exponent - cStr.length + 1) + cStr;
            s += cStr.substr(0, 1) + '.' + cStr.substr(1);
          } else {
            s += cStr.substr(0, precision + this._exponent) + '.' + cStr.substr(precision + this._exponent);
          }
        }
      } else {
        s += cStr[0];

        if (cStr.length > 1) {
          s += '.' + cStr.substr(1);
        }

        s += 'E' + (adjustedExponent > 0 ? '+' : '') + adjustedExponent;
      }

      return (this.isNegative() ? '-' : '') + s;
    }
  }, {
    key: "getCoefficient",
    value: function getCoefficient() {
      return this._coefficient;
    }
  }, {
    key: "getExponent",
    value: function getExponent() {
      return this._exponent;
    }
  }, {
    key: "equals",
    value: function equals(that) {
      return this.getExponent() === that.getExponent() && util_1._sign(this.getExponent()) === util_1._sign(that.getExponent()) && this.isNegative() === that.isNegative() && jsbi_1["default"].equal(this.getCoefficient(), that.getCoefficient());
    }
  }, {
    key: "compareTo",
    value: function compareTo(that) {
      if (JsbiSupport_1.JsbiSupport.isZero(this._coefficient) && JsbiSupport_1.JsbiSupport.isZero(that._coefficient)) {
        return 0;
      }

      var neg = this.isNegative();

      if (neg !== that.isNegative()) {
        return neg ? -1 : 1;
      }

      var _this$_compareToParam = this._compareToParams(),
          _this$_compareToParam2 = (0, _slicedToArray2["default"])(_this$_compareToParam, 3),
          thisCoefficientStr = _this$_compareToParam2[0],
          thisPrecision = _this$_compareToParam2[1],
          thisMagnitude = _this$_compareToParam2[2];

      var _that$_compareToParam = that._compareToParams(),
          _that$_compareToParam2 = (0, _slicedToArray2["default"])(_that$_compareToParam, 3),
          thatCoefficientStr = _that$_compareToParam2[0],
          thatPrecision = _that$_compareToParam2[1],
          thatMagnitude = _that$_compareToParam2[2];

      if (thisMagnitude > thatMagnitude) {
        return neg ? -1 : 1;
      } else if (thisMagnitude < thatMagnitude) {
        return neg ? 1 : -1;
      }

      if (thisCoefficientStr.length < thatCoefficientStr.length) {
        thisCoefficientStr += '0'.repeat(thatPrecision - thisPrecision);
      } else if (thisCoefficientStr.length > thatCoefficientStr.length) {
        thatCoefficientStr += '0'.repeat(thisPrecision - thatPrecision);
      }

      var thisJsbi = jsbi_1["default"].BigInt(thisCoefficientStr);
      var thatJsbi = jsbi_1["default"].BigInt(thatCoefficientStr);

      if (jsbi_1["default"].greaterThan(thisJsbi, thatJsbi)) {
        return neg ? -1 : 1;
      } else if (jsbi_1["default"].lessThan(thisJsbi, thatJsbi)) {
        return neg ? 1 : -1;
      }

      return 0;
    }
  }, {
    key: "_initialize",
    value: function _initialize(isNegative, coefficient, exponent) {
      this._isNegative = isNegative;
      this._coefficient = coefficient;

      if (Object.is(-0, exponent)) {
        exponent = 0;
      }

      this._exponent = exponent;
    }
  }, {
    key: "_isNegativeZero",
    value: function _isNegativeZero() {
      return this.isNegative() && JsbiSupport_1.JsbiSupport.isZero(this._coefficient);
    }
  }, {
    key: "_compareToParams",
    value: function _compareToParams() {
      var coefficientStr = this.isNegative() ? this._coefficient.toString().substring(1) : this._coefficient.toString();
      var precision = coefficientStr.length;
      var magnitude = precision + this._exponent;

      if (magnitude <= 0) {
        magnitude -= 1;
      }

      if (JsbiSupport_1.JsbiSupport.isZero(this._coefficient)) {
        magnitude = -Infinity;
      }

      return [coefficientStr, precision, magnitude];
    }
  }], [{
    key: "_fromNumberCoefficient",
    value: function _fromNumberCoefficient(coefficient, exponent) {
      if (!Number.isInteger(coefficient)) {
        throw new Error("The provided coefficient was not an integer. (" + coefficient + ")");
      }

      var isNegative = coefficient < 0 || Object.is(coefficient, -0);
      return this._fromBigIntCoefficient(isNegative, jsbi_1["default"].BigInt(coefficient), exponent);
    }
  }, {
    key: "_fromBigIntCoefficient",
    value: function _fromBigIntCoefficient(isNegative, coefficient, exponent) {
      var value = Object.create(this.prototype);

      value._initialize(isNegative, coefficient, exponent);

      return value;
    }
  }, {
    key: "parse",
    value: function parse(str) {
      var exponent = 0;
      if (str === 'null' || str === 'null.decimal') return null;
      var d = str.match('[d|D]');
      var exponentDelimiterIndex = str.length;

      if (d) {
        exponent = Number(str.substring(d.index + 1, str.length));
        exponentDelimiterIndex = d.index;
      }

      var f = str.match('\\.');
      var coefficientText;

      if (f) {
        var exponentShift = d ? d.index - 1 - f.index : str.length - 1 - f.index;
        exponent -= exponentShift;
        coefficientText = str.substring(0, f.index) + str.substring(f.index + 1, exponentDelimiterIndex);
      } else {
        coefficientText = str.substring(0, exponentDelimiterIndex);
      }

      var coefficient = jsbi_1["default"].BigInt(coefficientText);
      var isNegative = JsbiSupport_1.JsbiSupport.isNegative(coefficient) || coefficientText.startsWith("-0");
      return Decimal._fromBigIntCoefficient(isNegative, coefficient, exponent);
    }
  }]);
  return Decimal;
}();

exports.Decimal = Decimal;
Decimal.ZERO = new Decimal(0, 0);
Decimal.ONE = new Decimal(1, 0);

},{"./JsbiSupport":30,"./util":32,"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/interopRequireDefault":42,"@babel/runtime/helpers/slicedToArray":47,"jsbi":50}],10:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Import =
/*#__PURE__*/
function () {
  function Import(parent, symbolTable, length) {
    (0, _classCallCheck2["default"])(this, Import);
    this._parent = parent;
    this._symbolTable = symbolTable;
    this._offset = this.parent ? this.parent.offset + this.parent.length : 1;
    this._length = length || this.symbolTable.numberOfSymbols;
  }

  (0, _createClass2["default"])(Import, [{
    key: "getSymbolText",
    value: function getSymbolText(symbolId) {
      if (this.parent === undefined) throw new Error("Illegal parent state.");

      if (this.parent !== null) {
        var parentSymbol = this.parent.getSymbolText(symbolId);

        if (parentSymbol) {
          return parentSymbol;
        }
      }

      var index = symbolId - this.offset;

      if (index >= 0 && index < this.length) {
        return this.symbolTable.getSymbolText(index);
      }

      return undefined;
    }
  }, {
    key: "getSymbolId",
    value: function getSymbolId(symbolText) {
      var symbolId;

      if (this.parent !== null) {
        symbolId = this.parent.getSymbolId(symbolText);

        if (symbolId) {
          return symbolId;
        }
      }

      symbolId = this.symbolTable.getSymbolId(symbolText);

      if (symbolId !== null && symbolId !== undefined && symbolId < this.length) {
        return symbolId + this.offset;
      }

      return undefined;
    }
  }, {
    key: "parent",
    get: function get() {
      return this._parent;
    }
  }, {
    key: "offset",
    get: function get() {
      return this._offset;
    }
  }, {
    key: "length",
    get: function get() {
      return this._length;
    }
  }, {
    key: "symbolTable",
    get: function get() {
      return this._symbolTable;
    }
  }]);
  return Import;
}();

exports.Import = Import;

},{"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/interopRequireDefault":42}],11:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IonSystemSymbolTable_1 = require("./IonSystemSymbolTable");

var LocalSymbolTable =
/*#__PURE__*/
function () {
  function LocalSymbolTable() {
    var _import = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : IonSystemSymbolTable_1.getSystemSymbolTableImport();

    var symbols = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    (0, _classCallCheck2["default"])(this, LocalSymbolTable);
    this._import = _import;
    this.index = {};
    this._symbols = [];
    this.offset = _import.offset + _import.length;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = symbols[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var symbol_ = _step.value;
        this.addSymbol(symbol_);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  (0, _createClass2["default"])(LocalSymbolTable, [{
    key: "getSymbolId",
    value: function getSymbolId(symbol_) {
      return this._import.getSymbolId(symbol_) || this.index[symbol_];
    }
  }, {
    key: "addSymbol",
    value: function addSymbol(symbol_) {
      var existingSymbolId = this.getSymbolId(symbol_);
      if (existingSymbolId !== undefined) return existingSymbolId;
      var symbolId = this.offset + this.symbols.length;
      this.symbols.push(symbol_);
      this.index[symbol_] = symbolId;
      return symbolId;
    }
  }, {
    key: "getSymbolText",
    value: function getSymbolText(symbolId) {
      if (symbolId > this.maxId) throw new Error("SymbolID greater than maxID.");
      var importedSymbol = this["import"].getSymbolText(symbolId);
      if (importedSymbol !== undefined) return importedSymbol;
      var index = symbolId - this.offset;
      return this.symbols[index];
    }
  }, {
    key: "numberOfSymbols",
    value: function numberOfSymbols() {
      return this._symbols.length;
    }
  }, {
    key: "symbols",
    get: function get() {
      return this._symbols;
    }
  }, {
    key: "maxId",
    get: function get() {
      return this.offset + this._symbols.length - 1;
    }
  }, {
    key: "import",
    get: function get() {
      return this._import;
    }
  }]);
  return LocalSymbolTable;
}();

exports.LocalSymbolTable = LocalSymbolTable;

function defaultLocalSymbolTable() {
  return new LocalSymbolTable(IonSystemSymbolTable_1.getSystemSymbolTableImport());
}

exports.defaultLocalSymbolTable = defaultLocalSymbolTable;

},{"./IonSystemSymbolTable":20,"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/interopRequireDefault":42}],12:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var jsbi_1 = __importDefault(require("jsbi"));

var JsbiSerde_1 = require("./JsbiSerde");

var LowLevelBinaryWriter =
/*#__PURE__*/
function () {
  function LowLevelBinaryWriter(writeable) {
    (0, _classCallCheck2["default"])(this, LowLevelBinaryWriter);
    this.writeable = writeable;
  }

  (0, _createClass2["default"])(LowLevelBinaryWriter, [{
    key: "writeSignedInt",
    value: function writeSignedInt(originalValue) {
      var length = LowLevelBinaryWriter.getSignedIntSize(originalValue);
      var value = Math.abs(originalValue);
      var tempBuf = new Uint8Array(length);
      var i = tempBuf.length;

      while (value >= 128) {
        tempBuf[--i] = value & 0xFF;
        value >>>= 8;
      }

      tempBuf[--i] = value & 0xFF;
      if (1 / originalValue < 0) tempBuf[0] |= 0x80;
      this.writeable.writeBytes(tempBuf);
    }
  }, {
    key: "writeUnsignedInt",
    value: function writeUnsignedInt(originalValue) {
      if (originalValue instanceof jsbi_1["default"]) {
        var encodedBytes = JsbiSerde_1.JsbiSerde.toUnsignedIntBytes(originalValue);
        this.writeable.writeBytes(encodedBytes);
        return;
      }

      var length = LowLevelBinaryWriter.getUnsignedIntSize(originalValue);
      var tempBuf = new Uint8Array(length);
      var value = originalValue;
      var i = tempBuf.length;

      while (value > 0) {
        tempBuf[--i] = value % 256;
        value = Math.trunc(value / 256);
      }

      this.writeable.writeBytes(tempBuf);
    }
  }, {
    key: "writeVariableLengthSignedInt",
    value: function writeVariableLengthSignedInt(originalValue) {
      var tempBuf = new Uint8Array(LowLevelBinaryWriter.getVariableLengthSignedIntSize(originalValue));
      var value = Math.abs(originalValue);
      var i = tempBuf.length - 1;

      while (value >= 64) {
        tempBuf[i--] = value & 0x7F;
        value >>>= 7;
      }

      tempBuf[i] = value;

      if (1 / originalValue < 0) {
        tempBuf[i] |= 0x40;
      }

      tempBuf[tempBuf.length - 1] |= 0x80;
      this.writeable.writeBytes(tempBuf);
    }
  }, {
    key: "writeVariableLengthUnsignedInt",
    value: function writeVariableLengthUnsignedInt(originalValue) {
      var tempBuf = new Uint8Array(LowLevelBinaryWriter.getVariableLengthUnsignedIntSize(originalValue));
      var value = originalValue;
      var i = tempBuf.length;
      tempBuf[--i] = value & 0x7F | 0x80;
      value >>>= 7;

      while (value > 0) {
        tempBuf[--i] = value & 0x7F;
        value >>>= 7;
      }

      this.writeable.writeBytes(tempBuf);
    }
  }, {
    key: "writeByte",
    value: function writeByte(_byte) {
      this.writeable.writeByte(_byte);
    }
  }, {
    key: "writeBytes",
    value: function writeBytes(bytes) {
      this.writeable.writeBytes(bytes);
    }
  }, {
    key: "getBytes",
    value: function getBytes() {
      return this.writeable.getBytes();
    }
  }], [{
    key: "getSignedIntSize",
    value: function getSignedIntSize(value) {
      if (value === 0) {
        return 1;
      }

      var numberOfSignBits = 1;
      var magnitude = Math.abs(value);
      var numberOfMagnitudeBits = Math.ceil(Math.log2(magnitude + 1));
      var numberOfBits = numberOfMagnitudeBits + numberOfSignBits;
      return Math.ceil(numberOfBits / 8);
    }
  }, {
    key: "getUnsignedIntSize",
    value: function getUnsignedIntSize(value) {
      if (value instanceof jsbi_1["default"]) {
        return JsbiSerde_1.JsbiSerde.getUnsignedIntSizeInBytes(value);
      }

      if (value === 0) {
        return 1;
      }

      var numberOfBits = Math.floor(Math['log2'](value)) + 1;
      var numberOfBytes = Math.ceil(numberOfBits / 8);
      return numberOfBytes;
    }
  }, {
    key: "getVariableLengthSignedIntSize",
    value: function getVariableLengthSignedIntSize(value) {
      var absoluteValue = Math.abs(value);

      if (absoluteValue === 0) {
        return 1;
      }

      var valueBits = Math.floor(Math['log2'](absoluteValue)) + 1;
      var trailingStopBits = Math.floor(valueBits / 7);
      var leadingStopBit = 1;
      var signBit = 1;
      return Math.ceil((valueBits + trailingStopBits + leadingStopBit + signBit) / 8);
    }
  }, {
    key: "getVariableLengthUnsignedIntSize",
    value: function getVariableLengthUnsignedIntSize(value) {
      if (value === 0) {
        return 1;
      }

      var valueBits = Math.floor(Math['log2'](value)) + 1;
      var stopBits = Math.ceil(valueBits / 7);
      return Math.ceil((valueBits + stopBits) / 8);
    }
  }]);
  return LowLevelBinaryWriter;
}();

exports.LowLevelBinaryWriter = LowLevelBinaryWriter;

},{"./JsbiSerde":29,"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/interopRequireDefault":42,"jsbi":50}],13:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var __importStar = void 0 && (void 0).__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var jsbi_1 = __importDefault(require("jsbi"));

var JsbiSupport_1 = require("./JsbiSupport");

var IonBinary = __importStar(require("./IonBinary"));

var IonUnicode_1 = require("./IonUnicode");

var IonDecimal_1 = require("./IonDecimal");

var IonTypes_1 = require("./IonTypes");

var IonConstants_1 = require("./IonConstants");

var IonTimestamp_1 = require("./IonTimestamp");

var SignAndMagnitudeInt_1 = __importDefault(require("./SignAndMagnitudeInt"));

var JsbiSerde_1 = require("./JsbiSerde");

var DEBUG_FLAG = true;
var EOF = -1;
var ERROR = -2;
var TB_UNUSED__ = 15;
var TB_DATAGRAM = 20;
var TB_SEXP_CLOSE = 21;
var TB_LIST_CLOSE = 22;
var TB_STRUCT_CLOSE = 23;

function get_ion_type(rt) {
  switch (rt) {
    case IonBinary.TB_NULL:
      return IonTypes_1.IonTypes.NULL;

    case IonBinary.TB_BOOL:
      return IonTypes_1.IonTypes.BOOL;

    case IonBinary.TB_INT:
      return IonTypes_1.IonTypes.INT;

    case IonBinary.TB_NEG_INT:
      return IonTypes_1.IonTypes.INT;

    case IonBinary.TB_FLOAT:
      return IonTypes_1.IonTypes.FLOAT;

    case IonBinary.TB_DECIMAL:
      return IonTypes_1.IonTypes.DECIMAL;

    case IonBinary.TB_TIMESTAMP:
      return IonTypes_1.IonTypes.TIMESTAMP;

    case IonBinary.TB_SYMBOL:
      return IonTypes_1.IonTypes.SYMBOL;

    case IonBinary.TB_STRING:
      return IonTypes_1.IonTypes.STRING;

    case IonBinary.TB_CLOB:
      return IonTypes_1.IonTypes.CLOB;

    case IonBinary.TB_BLOB:
      return IonTypes_1.IonTypes.BLOB;

    case IonBinary.TB_SEXP:
      return IonTypes_1.IonTypes.SEXP;

    case IonBinary.TB_LIST:
      return IonTypes_1.IonTypes.LIST;

    case IonBinary.TB_STRUCT:
      return IonTypes_1.IonTypes.STRUCT;

    default:
      return undefined;
  }
}

var TS_SHIFT = 5;
var TS_MASK = 0x1f;

function encode_type_stack(type_, len) {
  var ts = len << TS_SHIFT | type_ & TS_MASK;
  return ts;
}

function decode_type_stack_type(ts) {
  return ts & TS_MASK;
}

function decode_type_stack_len(ts) {
  return ts >>> TS_SHIFT;
}

var VINT_SHIFT = 7;
var VINT_MASK = 0x7f;
var VINT_FLAG = 0x80;

function high_nibble(tb) {
  return tb >> IonBinary.TYPE_SHIFT & IonBinary.NIBBLE_MASK;
}

function low_nibble(tb) {
  return tb & IonBinary.NIBBLE_MASK;
}

var empty_array = [];
var ivm_sid = IonConstants_1.IVM.sid;
var ivm_image_0 = IonConstants_1.IVM.binary[0];
var ivm_image_1 = IonConstants_1.IVM.binary[1];
var ivm_image_2 = IonConstants_1.IVM.binary[2];
var ivm_image_3 = IonConstants_1.IVM.binary[3];

var ParserBinaryRaw =
/*#__PURE__*/
function () {
  function ParserBinaryRaw(source) {
    (0, _classCallCheck2["default"])(this, ParserBinaryRaw);
    this._raw_type = EOF;
    this._len = -1;
    this._curr = undefined;
    this._null = false;
    this._fid = -1;
    this._as = -1;
    this._ae = -1;
    this._a = [];
    this._ts = [TB_DATAGRAM];
    this._in_struct = false;
    this._in = source;
  }

  (0, _createClass2["default"])(ParserBinaryRaw, [{
    key: "next",
    value: function next() {
      if (this._curr === undefined && this._len > 0) {
        this._in.skip(this._len);
      } else {
        this.clear_value();
      }

      if (this._in_struct) {
        this._fid = this.readVarUnsignedInt();
      }

      return this.load_next();
    }
  }, {
    key: "stepIn",
    value: function stepIn() {
      var len,
          ts,
          t = this;

      switch (t._raw_type) {
        case IonBinary.TB_STRUCT:
        case IonBinary.TB_LIST:
        case IonBinary.TB_SEXP:
          break;

        default:
          throw new Error("you can only 'stepIn' to a container");
      }

      len = t._in.getRemaining() - t._len;
      ts = encode_type_stack(t._raw_type, len);

      t._ts.push(ts);

      t._in_struct = t._raw_type === IonBinary.TB_STRUCT;

      t._in.setRemaining(t._len);

      t.clear_value();
    }
  }, {
    key: "stepOut",
    value: function stepOut() {
      var parent_type,
          ts,
          l,
          r,
          t = this;

      if (t._ts.length < 2) {
        throw new Error("you can't stepOut unless you stepped in");
      }

      ts = t._ts.pop();
      l = decode_type_stack_len(ts);
      parent_type = decode_type_stack_type(t._ts[t._ts.length - 1]);
      t._in_struct = parent_type === IonBinary.TB_STRUCT;
      t.clear_value();
      r = t._in.getRemaining();

      t._in.skip(r);

      t._in.setRemaining(l);
    }
  }, {
    key: "isNull",
    value: function isNull() {
      return this._null;
    }
  }, {
    key: "depth",
    value: function depth() {
      return this._ts.length - 1;
    }
  }, {
    key: "getFieldId",
    value: function getFieldId() {
      return this._fid;
    }
  }, {
    key: "hasAnnotations",
    value: function hasAnnotations() {
      return this._as >= 0;
    }
  }, {
    key: "getAnnotations",
    value: function getAnnotations() {
      var a,
          t = this;

      if (t._a === undefined || t._a.length === 0) {
        t.load_annotation_values();
      }

      return t._a;
    }
  }, {
    key: "getAnnotation",
    value: function getAnnotation(index) {
      var a,
          t = this;

      if (t._a === undefined || t._a.length === 0) {
        t.load_annotation_values();
      }

      return t._a[index];
    }
  }, {
    key: "ionType",
    value: function ionType() {
      return get_ion_type(this._raw_type);
    }
  }, {
    key: "_getSid",
    value: function _getSid() {
      this.load_value();

      if (this._raw_type == IonBinary.TB_SYMBOL) {
        return this._curr === undefined ? null : this._curr;
      }

      return null;
    }
  }, {
    key: "_stringRepresentation",
    value: function _stringRepresentation() {
      var t = this;

      switch (t._raw_type) {
        case IonBinary.TB_NULL:
        case IonBinary.TB_BOOL:
        case IonBinary.TB_INT:
        case IonBinary.TB_NEG_INT:
        case IonBinary.TB_FLOAT:
        case IonBinary.TB_DECIMAL:
        case IonBinary.TB_TIMESTAMP:
        case IonBinary.TB_SYMBOL:
        case IonBinary.TB_STRING:
          break;

        default:
          throw new Error("Cannot convert to string.");
      }

      if (t.isNull()) {
        switch (t._raw_type) {
          case IonBinary.TB_BOOL:
          case IonBinary.TB_INT:
          case IonBinary.TB_NEG_INT:
          case IonBinary.TB_FLOAT:
          case IonBinary.TB_DECIMAL:
          case IonBinary.TB_TIMESTAMP:
          case IonBinary.TB_SYMBOL:
          case IonBinary.TB_STRING:
            "null." + t.ionType().name;
            break;
        }
      } else {
        t.load_value();

        switch (t._raw_type) {
          case IonBinary.TB_BOOL:
          case IonBinary.TB_INT:
          case IonBinary.TB_NEG_INT:
          case IonBinary.TB_DECIMAL:
          case IonBinary.TB_TIMESTAMP:
            return t._curr.toString();

          case IonBinary.TB_FLOAT:
            var s = t.numberValue().toString();
            if (s.indexOf("e") === -1) return s + "e0";

          case IonBinary.TB_STRING:
            if (t._null) {
              return null;
            }

            return t._curr;
        }
      }
    }
  }, {
    key: "byteValue",
    value: function byteValue() {
      switch (this._raw_type) {
        case IonBinary.TB_NULL:
          return null;

        case IonBinary.TB_CLOB:
        case IonBinary.TB_BLOB:
          if (this.isNull()) {
            return null;
          }

          this.load_value();
          return this._curr;

        default:
          throw new Error('Current value is not a blob or clob.');
      }
    }
  }, {
    key: "booleanValue",
    value: function booleanValue() {
      switch (this._raw_type) {
        case IonBinary.TB_NULL:
          return null;

        case IonBinary.TB_BOOL:
          if (this.isNull()) {
            return null;
          }

          return this._curr;
      }

      throw new Error('Current value is not a Boolean.');
    }
  }, {
    key: "decimalValue",
    value: function decimalValue() {
      switch (this._raw_type) {
        case IonBinary.TB_NULL:
          return null;

        case IonBinary.TB_DECIMAL:
          if (this.isNull()) {
            return null;
          }

          this.load_value();
          return this._curr;
      }

      throw new Error('Current value is not a decimal.');
    }
  }, {
    key: "bigIntValue",
    value: function bigIntValue() {
      switch (this._raw_type) {
        case IonBinary.TB_NULL:
          return null;

        case IonBinary.TB_INT:
        case IonBinary.TB_NEG_INT:
          if (this.isNull()) {
            return null;
          }

          this.load_value();
          return this._curr;

        default:
          throw new Error('bigIntValue() was called when the current value was not an int.');
      }
    }
  }, {
    key: "numberValue",
    value: function numberValue() {
      switch (this._raw_type) {
        case IonBinary.TB_NULL:
          return null;

        case IonBinary.TB_INT:
        case IonBinary.TB_NEG_INT:
          if (this.isNull()) {
            return null;
          }

          this.load_value();
          var bigInt = this._curr;
          return JsbiSupport_1.JsbiSupport.clampToSafeIntegerRange(bigInt);

        case IonBinary.TB_FLOAT:
          if (this.isNull()) {
            return null;
          }

          this.load_value();
          return this._curr;

        default:
          throw new Error('Current value is not a float or int.');
      }
    }
  }, {
    key: "stringValue",
    value: function stringValue() {
      switch (this._raw_type) {
        case IonBinary.TB_NULL:
          return null;

        case IonBinary.TB_STRING:
        case IonBinary.TB_SYMBOL:
          if (this.isNull()) {
            return null;
          }

          this.load_value();
          return this._curr;
      }

      throw new Error('Current value is not a string or symbol.');
    }
  }, {
    key: "timestampValue",
    value: function timestampValue() {
      switch (this._raw_type) {
        case IonBinary.TB_NULL:
          return null;

        case IonBinary.TB_TIMESTAMP:
          if (this.isNull()) {
            return null;
          }

          this.load_value();
          return this._curr;
      }

      throw new Error('Current value is not a timestamp.');
    }
  }, {
    key: "read_binary_float",
    value: function read_binary_float() {
      return ParserBinaryRaw._readFloatFrom(this._in, this._len);
    }
  }, {
    key: "readVarUnsignedInt",
    value: function readVarUnsignedInt() {
      return ParserBinaryRaw._readVarUnsignedIntFrom(this._in);
    }
  }, {
    key: "readVarSignedInt",
    value: function readVarSignedInt() {
      return ParserBinaryRaw._readVarSignedIntFrom(this._in);
    }
  }, {
    key: "readUnsignedIntAsBigInt",
    value: function readUnsignedIntAsBigInt() {
      return ParserBinaryRaw._readUnsignedIntAsBigIntFrom(this._in, this._len);
    }
  }, {
    key: "readUnsignedIntAsNumber",
    value: function readUnsignedIntAsNumber() {
      return ParserBinaryRaw._readUnsignedIntAsNumberFrom(this._in, this._len);
    }
  }, {
    key: "read_decimal_value",
    value: function read_decimal_value() {
      return ParserBinaryRaw.readDecimalValueFrom(this._in, this._len);
    }
  }, {
    key: "read_timestamp_value",
    value: function read_timestamp_value() {
      if (!(this._len > 0)) {
        return null;
      }

      var offset;
      var year;
      var month;
      var day;
      var hour;
      var minute;
      var secondInt;
      var fractionalSeconds = IonDecimal_1.Decimal.ZERO;
      var precision = IonTimestamp_1.TimestampPrecision.YEAR;

      var end = this._in.position() + this._len;

      offset = this.readVarSignedInt();

      if (this._in.position() < end) {
        year = this.readVarUnsignedInt();
      } else {
        throw new Error('Timestamps must include a year.');
      }

      if (this._in.position() < end) {
        month = this.readVarUnsignedInt();
        precision = IonTimestamp_1.TimestampPrecision.MONTH;
      }

      if (this._in.position() < end) {
        day = this.readVarUnsignedInt();
        precision = IonTimestamp_1.TimestampPrecision.DAY;
      }

      if (this._in.position() < end) {
        hour = this.readVarUnsignedInt();

        if (this._in.position() >= end) {
          throw new Error('Timestamps with an hour must include a minute.');
        } else {
          minute = this.readVarUnsignedInt();
        }

        precision = IonTimestamp_1.TimestampPrecision.HOUR_AND_MINUTE;
      }

      if (this._in.position() < end) {
        secondInt = this.readVarUnsignedInt();
        precision = IonTimestamp_1.TimestampPrecision.SECONDS;
      }

      if (this._in.position() < end) {
        var exponent = this.readVarSignedInt();
        var coefficient = JsbiSupport_1.JsbiSupport.ZERO;
        var isNegative = false;

        if (this._in.position() < end) {
          var deserializedSignedInt = ParserBinaryRaw._readSignedIntFrom(this._in, end - this._in.position());

          isNegative = deserializedSignedInt._isNegative;
          coefficient = deserializedSignedInt._magnitude;
        }

        var dec = IonDecimal_1.Decimal._fromBigIntCoefficient(isNegative, coefficient, exponent);

        var _IonTimestamp_1$Times = IonTimestamp_1.Timestamp._splitSecondsDecimal(dec),
            _IonTimestamp_1$Times2 = (0, _slicedToArray2["default"])(_IonTimestamp_1$Times, 2),
            _ = _IonTimestamp_1$Times2[0],
            fractionStr = _IonTimestamp_1$Times2[1];

        fractionalSeconds = IonDecimal_1.Decimal.parse(secondInt + '.' + fractionStr);
      }

      var msSinceEpoch = Date.UTC(year, month ? month - 1 : 0, day ? day : 1, hour ? hour : 0, minute ? minute : 0, secondInt ? secondInt : 0, 0);
      msSinceEpoch = IonTimestamp_1.Timestamp._adjustMsSinceEpochIfNeeded(year, msSinceEpoch);
      var date = new Date(msSinceEpoch);
      return IonTimestamp_1.Timestamp._valueOf(date, offset, fractionalSeconds, precision);
    }
  }, {
    key: "read_string_value",
    value: function read_string_value() {
      return IonUnicode_1.decodeUtf8(this._in.chunk(this._len));
    }
  }, {
    key: "clear_value",
    value: function clear_value() {
      this._raw_type = EOF;
      this._curr = undefined;
      this._a = empty_array;
      this._as = -1;
      this._null = false;
      this._fid = -1;
      this._len = -1;
    }
  }, {
    key: "load_length",
    value: function load_length(tb) {
      var t = this;
      t._len = low_nibble(tb);

      switch (t._len) {
        case 1:
          if (high_nibble(tb) === IonBinary.TB_STRUCT) {
            t._len = this.readVarUnsignedInt();
          }

          t._null = false;
          break;

        case IonBinary.LEN_VAR:
          t._null = false;
          t._len = this.readVarUnsignedInt();
          break;

        case IonBinary.LEN_NULL:
          t._null = true;
          t._len = 0;
          break;

        default:
          t._null = false;
          break;
      }
    }
  }, {
    key: "load_next",
    value: function load_next() {
      var t = this;
      var rt, tb;
      t._as = -1;

      if (t._in.is_empty()) {
        t.clear_value();
        return undefined;
      }

      tb = t._in.next();
      rt = high_nibble(tb);
      t.load_length(tb);

      if (rt === IonBinary.TB_ANNOTATION) {
        if (t._len < 1 && t.depth() === 0) {
          rt = t.load_ivm();
        } else {
          rt = t.load_annotations();
        }
      }

      switch (rt) {
        case IonBinary.TB_NULL:
          t._null = true;
          break;

        case IonBinary.TB_BOOL:
          if (t._len === 0 || t._len === 1) {
            t._curr = t._len === 1;
            t._len = 0;
          }

          break;
      }

      t._raw_type = rt;
      return rt;
    }
  }, {
    key: "load_annotations",
    value: function load_annotations() {
      var t = this;
      var tb, type_, annotation_len;

      if (t._len < 1 && t.depth() === 0) {
        type_ = t.load_ivm();
      } else {
        annotation_len = this.readVarUnsignedInt();
        t._as = t._in.position();

        t._in.skip(annotation_len);

        t._ae = t._in.position();
        tb = t._in.next();
        t.load_length(tb);
        type_ = high_nibble(tb);
      }

      return type_;
    }
  }, {
    key: "load_ivm",
    value: function load_ivm() {
      var t = this;
      var span = t._in;
      if (span.next() !== ivm_image_1) throw new Error("invalid binary Ion at " + span.position());
      if (span.next() !== ivm_image_2) throw new Error("invalid binary Ion at " + span.position());
      if (span.next() !== ivm_image_3) throw new Error("invalid binary Ion at " + span.position());
      t._curr = ivm_sid;
      t._len = 0;
      return IonBinary.TB_SYMBOL;
    }
  }, {
    key: "load_annotation_values",
    value: function load_annotation_values() {
      var t = this;
      var a, b, pos, limit, arr;
      if ((pos = t._as) < 0) return;
      arr = [];
      limit = t._ae;
      a = 0;

      while (pos < limit) {
        b = t._in.valueAt(pos);
        pos++;
        a = a << VINT_SHIFT | b & VINT_MASK;

        if ((b & VINT_FLAG) !== 0) {
          arr.push(a);
          a = 0;
        }
      }

      t._a = arr;
    }
  }, {
    key: "_readIntegerMagnitude",
    value: function _readIntegerMagnitude() {
      if (this._len === 0) {
        return JsbiSupport_1.JsbiSupport.ZERO;
      }

      return this.readUnsignedIntAsBigInt();
    }
  }, {
    key: "load_value",
    value: function load_value() {
      if (this._curr != undefined) return;
      if (this.isNull()) return null;

      switch (this._raw_type) {
        case IonBinary.TB_BOOL:
          break;

        case IonBinary.TB_INT:
          this._curr = this._readIntegerMagnitude();
          break;

        case IonBinary.TB_NEG_INT:
          this._curr = jsbi_1["default"].unaryMinus(this._readIntegerMagnitude());
          break;

        case IonBinary.TB_FLOAT:
          this._curr = this.read_binary_float();
          break;

        case IonBinary.TB_DECIMAL:
          if (this._len === 0) {
            this._curr = IonDecimal_1.Decimal.ZERO;
          } else {
            this._curr = this.read_decimal_value();
          }

          break;

        case IonBinary.TB_TIMESTAMP:
          this._curr = this.read_timestamp_value();
          break;

        case IonBinary.TB_SYMBOL:
          this._curr = this.readUnsignedIntAsNumber();
          break;

        case IonBinary.TB_STRING:
          this._curr = this.read_string_value();
          break;

        case IonBinary.TB_CLOB:
        case IonBinary.TB_BLOB:
          if (this.isNull()) break;
          this._curr = this._in.chunk(this._len);
          break;

        default:
          throw new Error('Unexpected type: ' + this._raw_type);
      }
    }
  }], [{
    key: "_readFloatFrom",
    value: function _readFloatFrom(input, numberOfBytes) {
      var tempBuf;

      switch (numberOfBytes) {
        case 0:
          return 0.0;

        case 4:
          tempBuf = new DataView(input.chunk(4).buffer);
          return tempBuf.getFloat32(0, false);

        case 8:
          tempBuf = new DataView(input.chunk(8).buffer);
          return tempBuf.getFloat64(0, false);

        case 15:
          return null;

        default:
          throw new Error("Illegal float length: " + numberOfBytes);
      }
    }
  }, {
    key: "_readVarUnsignedIntFrom",
    value: function _readVarUnsignedIntFrom(input) {
      var numberOfBits = 0;

      var _byte;

      var magnitude = 0;

      while (true) {
        _byte = input.next();
        magnitude = magnitude << 7 | _byte & 0x7F;
        numberOfBits += 7;

        if (_byte & 0x80) {
          break;
        }
      }

      if (numberOfBits > 31) {
        throw new Error("VarUInt values larger than 31 bits must be read using LongInt.");
      }

      return magnitude;
    }
  }, {
    key: "_readVarSignedIntFrom",
    value: function _readVarSignedIntFrom(input) {
      var v = input.next(),
          _byte2;

      var isNegative = v & 0x40;
      var stopBit = v & 0x80;
      v &= 0x3F;
      var bits = 6;

      while (!stopBit) {
        _byte2 = input.next();
        stopBit = _byte2 & 0x80;
        _byte2 &= 0x7F;
        v <<= 7;
        v |= _byte2;
        bits += 7;
      }

      if (bits > 32) {
        throw new Error("VarInt values larger than 32 bits must be read using LongInt");
      }

      return isNegative ? -v : v;
    }
  }, {
    key: "_readSignedIntFrom",
    value: function _readSignedIntFrom(input, numberOfBytes) {
      if (numberOfBytes == 0) {
        return new SignAndMagnitudeInt_1["default"](JsbiSupport_1.JsbiSupport.ZERO);
      }

      var bytes = input.view(numberOfBytes);
      var isNegative = (bytes[0] & 0x80) == 0x80;
      var numbers = Array.prototype.slice.call(bytes);
      numbers[0] = bytes[0] & 0x7F;
      var magnitude = JsbiSerde_1.JsbiSerde.fromUnsignedBytes(numbers);
      return new SignAndMagnitudeInt_1["default"](magnitude, isNegative);
    }
  }, {
    key: "_readUnsignedIntAsBigIntFrom",
    value: function _readUnsignedIntAsBigIntFrom(input, numberOfBytes) {
      return JsbiSerde_1.JsbiSerde.fromUnsignedBytes(Array.prototype.slice.call(input.view(numberOfBytes)));
    }
  }, {
    key: "_readUnsignedIntAsNumberFrom",
    value: function _readUnsignedIntAsNumberFrom(input, numberOfBytes) {
      var value = 0;
      var bytesRead = 0;
      var bytesAvailable = input.getRemaining();

      var _byte3;

      if (numberOfBytes < 1) {
        return 0;
      } else if (numberOfBytes > 6) {
        throw new Error("Attempted to read a ".concat(numberOfBytes, "-byte unsigned integer,") + " which is too large for a to be stored in a number without losing precision.");
      }

      if (bytesAvailable < numberOfBytes) {
        throw new Error("Attempted to read a ".concat(numberOfBytes, "-byte unsigned integer,") + " but only ".concat(bytesAvailable, " bytes were available."));
      }

      while (bytesRead < numberOfBytes) {
        _byte3 = input.next();
        bytesRead++;
        value *= 256;
        value = value + _byte3;
      }

      return value;
    }
  }, {
    key: "readDecimalValueFrom",
    value: function readDecimalValueFrom(input, numberOfBytes) {
      var initialPosition = input.position();

      var exponent = ParserBinaryRaw._readVarSignedIntFrom(input);

      var numberOfExponentBytes = input.position() - initialPosition;
      var numberOfCoefficientBytes = numberOfBytes - numberOfExponentBytes;

      var signedInt = ParserBinaryRaw._readSignedIntFrom(input, numberOfCoefficientBytes);

      var isNegative = signedInt.isNegative;
      var coefficient = isNegative ? jsbi_1["default"].unaryMinus(signedInt.magnitude) : signedInt.magnitude;
      return IonDecimal_1.Decimal._fromBigIntCoefficient(isNegative, coefficient, exponent);
    }
  }]);
  return ParserBinaryRaw;
}();

exports.ParserBinaryRaw = ParserBinaryRaw;

},{"./IonBinary":4,"./IonConstants":8,"./IonDecimal":9,"./IonTimestamp":24,"./IonTypes":26,"./IonUnicode":27,"./JsbiSerde":29,"./JsbiSupport":30,"./SignAndMagnitudeInt":31,"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/interopRequireDefault":42,"@babel/runtime/helpers/slicedToArray":47,"jsbi":50}],14:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var __importStar = void 0 && (void 0).__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IonText = __importStar(require("./IonText"));

var IonText_1 = require("./IonText");

var IonTypes_1 = require("./IonTypes");

var JsbiSupport_1 = require("./JsbiSupport");

var EOF = -1;
var ERROR = -2;
var T_NULL = 1;
var T_BOOL = 2;
var T_INT = 3;
var T_HEXINT = 4;
var T_FLOAT = 5;
var T_FLOAT_SPECIAL = 6;
var T_DECIMAL = 7;
var T_TIMESTAMP = 8;
var T_IDENTIFIER = 9;
var T_OPERATOR = 10;
var T_STRING1 = 11;
var T_STRING2 = 12;
var T_STRING3 = 13;
var T_CLOB2 = 14;
var T_CLOB3 = 15;
var T_BLOB = 16;
var T_SEXP = 17;
var T_LIST = 18;
var T_STRUCT = 19;
var CH_CR = 13;
var CH_NL = 10;
var CH_BS = 92;
var CH_FORWARD_SLASH = "/".charCodeAt(0);
var CH_AS = 42;
var CH_SQ = 39;
var CH_DOUBLE_QUOTE = "\"".charCodeAt(0);
var CH_CM = 44;
var CH_OP = 40;
var CH_CP = 41;
var CH_LEFT_CURLY = "{".charCodeAt(0);
var CH_CC = 125;
var CH_OS = 91;
var CH_CS = 93;
var CH_CL = 58;
var CH_DT = 46;
var CH_EQ = 61;
var CH_PS = 43;
var CH_MS = 45;
var CH_0 = 48;
var CH_D = 68;
var CH_E = 69;
var CH_F = 70;
var CH_T = 84;
var CH_X = 88;
var CH_Z = 90;
var CH_d = 100;
var CH_e = 101;
var CH_f = 102;
var CH_i = 105;
var CH_n = 110;
var CH_x = 120;
var ESC_0 = 48;
var ESC_a = 97;
var ESC_b = 98;
var ESC_t = 116;
var ESC_nl = 110;
var ESC_ff = 102;
var ESC_cr = 114;
var ESC_v = 118;
var ESC_dq = CH_DOUBLE_QUOTE;
var ESC_sq = CH_SQ;
var ESC_qm = 63;
var ESC_bs = 92;
var ESC_fs = 47;
var ESC_nl2 = 10;
var ESC_nl3 = 13;
var ESC_x = CH_x;
var ESC_u = 117;
var ESC_U = 85;
var empty_array = [];
var INF = [CH_i, CH_n, CH_f];
var _UTF16_MASK = 0x03ff;

function get_ion_type(t) {
  switch (t) {
    case EOF:
      return null;

    case ERROR:
      return null;

    case T_NULL:
      return IonTypes_1.IonTypes.NULL;

    case T_BOOL:
      return IonTypes_1.IonTypes.BOOL;

    case T_INT:
      return IonTypes_1.IonTypes.INT;

    case T_HEXINT:
      return IonTypes_1.IonTypes.INT;

    case T_FLOAT:
      return IonTypes_1.IonTypes.FLOAT;

    case T_FLOAT_SPECIAL:
      return IonTypes_1.IonTypes.FLOAT;

    case T_DECIMAL:
      return IonTypes_1.IonTypes.DECIMAL;

    case T_TIMESTAMP:
      return IonTypes_1.IonTypes.TIMESTAMP;

    case T_IDENTIFIER:
      return IonTypes_1.IonTypes.SYMBOL;

    case T_OPERATOR:
      return IonTypes_1.IonTypes.SYMBOL;

    case T_STRING1:
      return IonTypes_1.IonTypes.SYMBOL;

    case T_STRING2:
      return IonTypes_1.IonTypes.STRING;

    case T_STRING3:
      return IonTypes_1.IonTypes.STRING;

    case T_CLOB2:
      return IonTypes_1.IonTypes.CLOB;

    case T_CLOB3:
      return IonTypes_1.IonTypes.CLOB;

    case T_BLOB:
      return IonTypes_1.IonTypes.BLOB;

    case T_SEXP:
      return IonTypes_1.IonTypes.SEXP;

    case T_LIST:
      return IonTypes_1.IonTypes.LIST;

    case T_STRUCT:
      return IonTypes_1.IonTypes.STRUCT;

    default:
      throw new Error("Unknown type: " + String(t) + ".");
  }
}

exports.get_ion_type = get_ion_type;

function get_keyword_type(str) {
  if (str === "null") return T_NULL;
  if (str === "true") return T_BOOL;
  if (str === "false") return T_BOOL;
  if (str === "nan") return T_FLOAT_SPECIAL;
  if (str === "+inf") return T_FLOAT_SPECIAL;
  if (str === "-inf") return T_FLOAT_SPECIAL;
  throw new Error("Unknown keyword: " + str + ".");
}

function get_type_from_name(str) {
  if (str === "null") return T_NULL;
  if (str === "bool") return T_BOOL;
  if (str === "int") return T_INT;
  if (str === "float") return T_FLOAT;
  if (str === "decimal") return T_DECIMAL;
  if (str === "timestamp") return T_TIMESTAMP;
  if (str === "symbol") return T_IDENTIFIER;
  if (str === "string") return T_STRING2;
  if (str === "clob") return T_CLOB2;
  if (str === "blob") return T_BLOB;
  if (str === "sexp") return T_SEXP;
  if (str === "list") return T_LIST;
  if (str === "struct") return T_STRUCT;
  throw new Error("Unknown type: " + str + ".");
}

function get_hex_value(ch) {
  switch (ch) {
    case 48:
      return 0;

    case 49:
      return 1;

    case 50:
      return 2;

    case 51:
      return 3;

    case 52:
      return 4;

    case 53:
      return 5;

    case 54:
      return 6;

    case 55:
      return 7;

    case 56:
      return 8;

    case 57:
      return 9;

    case 97:
      return 10;

    case 98:
      return 11;

    case 99:
      return 12;

    case 100:
      return 13;

    case 101:
      return 14;

    case 102:
      return 15;

    case 65:
      return 10;

    case 66:
      return 11;

    case 67:
      return 12;

    case 68:
      return 13;

    case 69:
      return 14;

    case 70:
      return 15;
  }

  throw new Error("Unexpected bad hex digit in checked data.");
}

function is_valid_base64_length(char_length, trailer_length) {
  if (trailer_length > 2) return false;
  if ((char_length + trailer_length & 0x3) != 0) return false;
  return true;
}

function is_valid_string_char(ch, allow_new_line) {
  if (ch == CH_CR) return allow_new_line;
  if (ch == CH_NL) return allow_new_line;
  if (IonText.is_whitespace(ch)) return true;
  if (ch < 32) return false;
  return true;
}

var ParserTextRaw =
/*#__PURE__*/
function () {
  function ParserTextRaw(source) {
    (0, _classCallCheck2["default"])(this, ParserTextRaw);
    this._value_null = false;
    this._curr_null = false;

    this._read_value_helper_minus = function (ch1, accept_operator_symbols, calling_op) {
      var op = undefined,
          ch2 = this._peek();

      if (ch2 == CH_i) {
        ch2 = this._peek("inf");

        if (IonText.isNumericTerminator(ch2)) {
          op = this._read_minus_inf;
        } else if (accept_operator_symbols) {
          op = this._read_operator_symbol;
        }
      } else if (IonText.is_digit(ch2)) {
        op = this._read_number;
      } else if (accept_operator_symbols) {
        op = this._read_operator_symbol;
      }

      if (op != undefined) {
        this._ops.unshift(op);

        this._unread(ch1);
      } else {
        this._error("operator symbols are not valid outside of sexps");
      }
    };

    this._read_string_helper = function (terminator, allow_new_line) {
      var ch;
      this._start = this._in.position();

      for (;;) {
        ch = this._read();

        if (ch == CH_BS) {
          this._read_string_escape_sequence();
        } else if (ch == terminator) {
          break;
        } else if (!is_valid_string_char(ch, allow_new_line)) throw new Error("invalid character " + ch + " in string");
      }
    };

    this._in = source;
    this._ops = [this._read_datagram_values];
    this._value_type = ERROR;
    this._value = [];
    this._start = -1;
    this._end = -1;
    this._esc_len = -1;
    this._curr = EOF;
    this._ann = [];
    this._msg = "";
    this._fieldname = null;
    this._fieldnameType = null;
    var helpers = {
      40: this._read_value_helper_paren,
      91: this._read_value_helper_square,
      123: this._read_value_helper_curly,
      43: this._read_value_helper_plus,
      45: this._read_value_helper_minus,
      39: this._read_value_helper_single,
      34: this._read_value_helper_double
    };

    var set_helper = function set_helper(str, fn) {
      var i = str.length,
          ch;

      while (i > 0) {
        i--;
        ch = str.charCodeAt(i);
        helpers[ch] = fn;
      }
    };

    set_helper("0123456789", this._read_value_helper_digit);
    set_helper("_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", this._read_value_helper_letter);
    set_helper("!#%&*+-./;<=>?@^`|~", this._read_value_helper_operator);
    helpers[CH_PS] = this._read_value_helper_plus;
    helpers[CH_MS] = this._read_value_helper_minus;
    this._read_value_helper_helpers = helpers;
  }

  (0, _createClass2["default"])(ParserTextRaw, [{
    key: "fieldName",
    value: function fieldName() {
      return this._fieldname;
    }
  }, {
    key: "fieldNameType",
    value: function fieldNameType() {
      return this._fieldnameType;
    }
  }, {
    key: "annotations",
    value: function annotations() {
      return this._ann;
    }
  }, {
    key: "clearFieldName",
    value: function clearFieldName() {
      this._fieldname = null;
      this._fieldnameType = null;
    }
  }, {
    key: "isNull",
    value: function isNull() {
      return this._curr_null;
    }
  }, {
    key: "bigIntValue",
    value: function bigIntValue() {
      if (this.isNull()) {
        return null;
      }

      var intText = this.get_value_as_string(this._curr);

      switch (this._curr) {
        case T_INT:
        case T_HEXINT:
          return JsbiSupport_1.JsbiSupport.bigIntFromString(intText);

        default:
          throw new Error("intValue() was called when the current value was not an integer.");
      }
    }
  }, {
    key: "numberValue",
    value: function numberValue() {
      if (this.isNull()) return null;
      var s = this.get_value_as_string(this._curr);

      switch (this._curr) {
        case T_INT:
        case T_HEXINT:
          return JsbiSupport_1.JsbiSupport.clampToSafeIntegerRange(JsbiSupport_1.JsbiSupport.bigIntFromString(s));

        case T_FLOAT:
          return Number(s);

        case T_FLOAT_SPECIAL:
          if (s == "+inf") return Number.POSITIVE_INFINITY;else if (s == "-inf") return Number.NEGATIVE_INFINITY;else if (s == "nan") return Number.NaN;

        default:
          throw new Error("can't convert to number");
      }
    }
  }, {
    key: "booleanValue",
    value: function booleanValue() {
      if (this.isNull()) return null;
      var s = this.get_value_as_string(T_BOOL);

      if (s == "true") {
        return true;
      } else if (s == "false") {
        return false;
      } else {
        return undefined;
      }
    }
  }, {
    key: "get_value_as_string",
    value: function get_value_as_string(t) {
      var index;
      var ch;
      var s = "";

      switch (t) {
        case T_NULL:
        case T_BOOL:
        case T_INT:
        case T_HEXINT:
        case T_FLOAT:
        case T_FLOAT_SPECIAL:
        case T_DECIMAL:
        case T_TIMESTAMP:
        case T_IDENTIFIER:
        case T_OPERATOR:
          for (index = this._start; index < this._end; index++) {
            s += String.fromCharCode(this._in.valueAt(index));
          }

          break;

        case T_BLOB:
          for (index = this._start; index < this._end; index++) {
            ch = this._in.valueAt(index);

            if (IonText.is_base64_char(ch)) {
              s += String.fromCharCode(ch);
            }
          }

          break;

        case T_STRING1:
        case T_STRING2:
        case T_STRING3:
          for (index = this._start; index < this._end; index++) {
            var isEscaped = false;
            ch = this._in.valueAt(index);

            if (ch == CH_BS) {
              ch = this._read_escape_sequence(index, this._end);
              index += this._esc_len;
              isEscaped = true;
            }

            if (this.isHighSurrogate(ch)) {
              index++;

              var tempChar = this._in.valueAt(index);

              if (tempChar == CH_BS) {
                tempChar = this._read_escape_sequence(index, this._end);
                index += this._esc_len;
              }

              if (this.isLowSurrogate(tempChar)) {
                var hiSurrogate = ch;
                var loSurrogate = tempChar;
                var codepoint = 0x10000 + ((hiSurrogate & _UTF16_MASK) << 10) + (loSurrogate & _UTF16_MASK);
                s += String.fromCodePoint(codepoint);
              } else {
                throw new Error("expected a low surrogate, but found: " + ch);
              }
            } else if (this.isLowSurrogate(ch)) {
              throw new Error("unexpected low surrogate: " + ch);
            } else if (t === T_STRING3 && ch === CH_SQ && !isEscaped && this.verifyTriple(index)) {
              index = this._skip_triple_quote_gap(index, this._end, true);
            } else if (ch >= 0) {
              s += String.fromCharCode(ch);
            }
          }

          break;

        default:
          throw new Error("can't get this value as a string");
      }

      return s;
    }
  }, {
    key: "get_value_as_uint8array",
    value: function get_value_as_uint8array(t) {
      var bytes = [];

      switch (t) {
        case T_CLOB2:
          for (var index = this._start; index < this._end; index++) {
            var ch = this._in.valueAt(index);

            if (ch === CH_BS) {
              bytes.push(this.readClobEscapes(index, this._end));
              index += this._esc_len;
            } else if (ch < 128) {
              bytes.push(ch);
            } else {
              throw new Error("Non-Ascii values illegal within clob.");
            }
          }

          break;

        case T_CLOB3:
          for (var _index = this._start; _index < this._end; _index++) {
            var _ch = this._in.valueAt(_index);

            if (_ch === CH_BS) {
              var escaped = this.readClobEscapes(_index, this._end);

              if (escaped >= 0) {
                bytes.push(escaped);
              }

              _index += this._esc_len;
            } else if (_ch === CH_SQ) {
              if (this.verifyTriple(_index)) {
                _index = this._skip_triple_quote_gap(_index, this._end, false);
              } else {
                bytes.push(_ch);
              }
            } else if (_ch < 128) {
              bytes.push(_ch);
            } else {
              throw new Error("Non-Ascii values illegal within clob.");
            }
          }

          break;

        default:
          throw new Error("can't get this value as a Uint8Array");
      }

      return Uint8Array.from(bytes);
    }
  }, {
    key: "next",
    value: function next() {
      this.clearFieldName();
      this._ann = [];

      if (this._value_type === ERROR) {
        this._run();
      }

      this._curr = this._value_pop();
      var t;

      if (this._curr === ERROR) {
        this._value.push(ERROR);

        t = undefined;
      } else {
        t = this._curr;
      }

      this._curr_null = this._value_null;
      this._value_null = false;
      return t;
    }
  }, {
    key: "_read_datagram_values",
    value: function _read_datagram_values() {
      var ch = this._peek();

      if (ch == EOF) {
        this._value_push(EOF);
      } else {
        this._ops.unshift(this._read_datagram_values);

        this._ops.unshift(this._read_value);
      }
    }
  }, {
    key: "_read_sexp_values",
    value: function _read_sexp_values() {
      var ch = this._read_after_whitespace(true);

      if (ch == CH_CP) {
        this._value_push(EOF);
      } else if (ch === EOF) {
        throw new Error("Expected closing ).");
      } else {
        this._unread(ch);

        this._ops.unshift(this._read_sexp_values);

        this._ops.unshift(this._read_sexp_value);
      }
    }
  }, {
    key: "_read_list_values",
    value: function _read_list_values() {
      var ch = this._read_after_whitespace(true);

      if (ch == CH_CS) {
        this._value_push(EOF);
      } else {
        this._unread(ch);

        this._ops.unshift(this._read_list_comma);

        this._ops.unshift(this._read_value);
      }
    }
  }, {
    key: "_read_struct_values",
    value: function _read_struct_values() {
      var op = this._done_with_error,
          ch = this._read_after_whitespace(true);

      switch (ch) {
        case CH_SQ:
          op = this._read_string1;

          if (this._peek("\'\'") != ERROR) {
            op = this._read_string3;
          }

          break;

        case CH_DOUBLE_QUOTE:
          op = this._read_string2;
          break;

        case CH_CC:
          this._value_push(EOF);

          return;

        default:
          if (IonText.is_letter(ch)) {
            op = this._read_symbol;
          }

          break;
      }

      if (op === this._done_with_error) {
        this._error("expected field name (or close struct '}') not found");
      } else {
        op.call(this);

        this._load_field_name();

        ch = this._read_after_whitespace(true);
        if (ch != CH_CL) this._error("expected ':'");

        this._ops.unshift(this._read_struct_comma);

        this._ops.unshift(this._read_value);
      }
    }
  }, {
    key: "_read_list_comma",
    value: function _read_list_comma() {
      var ch = this._read_after_whitespace(true);

      if (ch == CH_CM) {
        ch = this._read_after_whitespace(true);

        if (ch == CH_CS) {
          this._value_push(EOF);
        } else {
          this._unread(ch);

          this._ops.unshift(this._read_list_comma);

          this._ops.unshift(this._read_value);
        }
      } else if (ch == CH_CS) {
        this._value_push(EOF);
      } else {
        this._error("expected ',' or ']'");
      }
    }
  }, {
    key: "_read_struct_comma",
    value: function _read_struct_comma() {
      var ch = this._read_after_whitespace(true);

      if (ch == CH_CM) {
        ch = this._read_after_whitespace(true);

        if (ch == CH_CC) {
          this._value_push(EOF);
        } else {
          this._unread(ch);

          this._ops.unshift(this._read_struct_values);
        }
      } else if (ch == CH_CC) {
        this._value_push(EOF);
      } else {
        this._error("expected ',' or '}'");
      }
    }
  }, {
    key: "_load_field_name",
    value: function _load_field_name() {
      this._fieldnameType = this._value_pop();
      var s = this.get_value_as_string(this._fieldnameType);

      switch (this._fieldnameType) {
        case T_IDENTIFIER:
          if (IonText_1.is_keyword(s)) throw new Error("can't use '" + s + "' as a fieldname without quotes");

        case T_STRING1:
        case T_STRING2:
        case T_STRING3:
          this._fieldname = s;
          break;

        default:
          throw new Error("invalid fieldname" + s);
      }
    }
  }, {
    key: "_read_value",
    value: function _read_value() {
      this._read_value_helper(false, this._read_value);
    }
  }, {
    key: "_read_sexp_value",
    value: function _read_sexp_value() {
      this._read_value_helper(true, this._read_sexp_value);
    }
  }, {
    key: "_read_value_helper",
    value: function _read_value_helper(accept_operator_symbols, calling_op) {
      var ch = this._read_after_whitespace(true);

      if (ch == EOF) {
        this._read_value_helper_EOF(ch, accept_operator_symbols, calling_op);
      } else {
        var fn = this._read_value_helper_helpers[ch];

        if (fn != undefined) {
          fn.call(this, ch, accept_operator_symbols, calling_op);
        } else {
          this._error("unexpected character '" + IonText.asAscii(ch) + "'");
        }
      }
    }
  }, {
    key: "_read_value_helper_EOF",
    value: function _read_value_helper_EOF(ch1, accept_operator_symbols, calling_op) {
      this._ops.unshift(this._done);
    }
  }, {
    key: "_read_value_helper_paren",
    value: function _read_value_helper_paren(ch1, accept_operator_symbols, calling_op) {
      this._value_push(T_SEXP);

      this._ops.unshift(this._read_sexp_values);
    }
  }, {
    key: "_read_value_helper_square",
    value: function _read_value_helper_square(ch1, accept_operator_symbols, calling_op) {
      this._value_push(T_LIST);

      this._ops.unshift(this._read_list_values);
    }
  }, {
    key: "_read_value_helper_curly",
    value: function _read_value_helper_curly(ch1, accept_operator_symbols, calling_op) {
      var ch3,
          ch2 = this._read();

      if (ch2 == CH_LEFT_CURLY) {
        ch3 = this._read_after_whitespace(false);

        if (ch3 == CH_SQ) {
          this._ops.unshift(this._read_clob_string3);
        } else if (ch3 == CH_DOUBLE_QUOTE) {
          this._ops.unshift(this._read_clob_string2);
        } else {
          this._unread(ch3);

          this._ops.unshift(this._read_blob);
        }
      } else {
        this._unread(ch2);

        this._value_push(T_STRUCT);

        this._ops.unshift(this._read_struct_values);
      }
    }
  }, {
    key: "_read_value_helper_plus",
    value: function _read_value_helper_plus(ch1, accept_operator_symbols, calling_op) {
      var ch2 = this._peek("inf");

      this._unread(ch1);

      if (IonText.isNumericTerminator(ch2)) {
        this._ops.unshift(this._read_plus_inf);
      } else if (accept_operator_symbols) {
        this._ops.unshift(this._read_operator_symbol);
      } else {
        this._error("unexpected '+'");
      }
    }
  }, {
    key: "_read_value_helper_digit",
    value: function _read_value_helper_digit(ch1, accept_operator_symbols, calling_op) {
      var ch2 = this._peek_4_digits(ch1);

      this._unread(ch1);

      if (ch2 == CH_T || ch2 == CH_MS) {
        this._ops.unshift(this._readTimestamp);
      } else {
        this._ops.unshift(this._read_number);
      }
    }
  }, {
    key: "_read_value_helper_single",
    value: function _read_value_helper_single(ch1, accept_operator_symbols, calling_op) {
      var op;

      if (this._peek("\'\'") != ERROR) {
        op = this._read_string3;
        op.call(this);
      } else {
        op = this._read_string1;
        op.call(this);

        if (this._test_string_as_annotation(op)) {
          this._ops.unshift(calling_op);
        }
      }
    }
  }, {
    key: "_read_value_helper_double",
    value: function _read_value_helper_double(ch1, accept_operator_symbols, calling_op) {
      this._ops.unshift(this._read_string2);
    }
  }, {
    key: "_read_value_helper_letter",
    value: function _read_value_helper_letter(ch1, accept_operator_symbols, calling_op) {
      var tempNullStart = this._start;

      this._read_symbol();

      var type = this._value_pop();

      if (type != T_IDENTIFIER) throw new Error("Expecting symbol here.");
      var symbol = this.get_value_as_string(type);

      if (IonText_1.is_keyword(symbol)) {
        var kwt = get_keyword_type(symbol);

        if (kwt === T_NULL) {
          this._value_null = true;

          if (this._peek() === CH_DT) {
            this._read();

            var ch = this._read();

            if (IonText.is_letter(ch) !== true) throw new Error("Expected type name after 'null.'");

            this._read_symbol();

            if (this._value_pop() !== T_IDENTIFIER) throw new Error("Expected type name after 'null.'");
            symbol = this.get_value_as_string(T_IDENTIFIER);
            kwt = get_type_from_name(symbol);
          }

          this._start = -1;
          this._end = -1;
        }

        this._value_push(kwt);
      } else {
        var _ch2 = this._read_after_whitespace(true);

        if (_ch2 == CH_CL && this._peek() == CH_CL) {
          this._read();

          this._ann.push(symbol);

          this._ops.unshift(calling_op);
        } else {
          var _kwt = T_IDENTIFIER;

          this._unread(_ch2);

          this._value_push(_kwt);
        }
      }
    }
  }, {
    key: "_read_value_helper_operator",
    value: function _read_value_helper_operator(ch1, accept_operator_symbols, calling_op) {
      if (accept_operator_symbols) {
        this._unread(ch1);

        this._ops.unshift(this._read_operator_symbol);
      } else {
        this._error("unexpected operator character");
      }
    }
  }, {
    key: "_done",
    value: function _done() {
      this._value_push(EOF);
    }
  }, {
    key: "_done_with_error",
    value: function _done_with_error() {
      this._value_push(ERROR);

      throw new Error(this._error_msg);
    }
  }, {
    key: "_read_number",
    value: function _read_number() {
      var ch, t;
      this._start = this._in.position();
      ch = this._read();
      if (ch == CH_MS) ch = this._read();

      if (ch == CH_0) {
        ch = this._peek();

        if (ch == CH_x || ch == CH_X) {
          this._read_hex_int();

          return;
        }

        if (IonText.is_digit(ch)) {
          this._error("leading zeros are not allowed");
        }

        ch = CH_0;
      }

      t = T_INT;
      ch = this._read_required_digits(ch);

      if (ch == CH_DT) {
        t = T_DECIMAL;
        ch = this._read_optional_digits(this._read());
      }

      if (!IonText.isNumericTerminator(ch)) {
        if (ch == CH_d || ch == CH_D) {
          t = T_DECIMAL;
          ch = this._read_exponent();
        } else if (ch == CH_e || ch == CH_E || ch == CH_f || ch == CH_F) {
          t = T_FLOAT;
          ch = this._read_exponent();
        }
      }

      if (!IonText.isNumericTerminator(ch)) {
        this._error("invalid character after number");
      } else {
        this._unread(ch);

        this._end = this._in.position();

        this._value_push(t);
      }
    }
  }, {
    key: "_read_hex_int",
    value: function _read_hex_int() {
      var ch = this._read();

      if (ch == CH_x || ch == CH_X) {
        ch = this._read();
        ch = this._read_required_hex_digits(ch);
      }

      if (IonText.isNumericTerminator(ch)) {
        this._unread(ch);

        this._end = this._in.position();

        this._value_push(T_HEXINT);
      } else {
        this._error("invalid character after number");
      }
    }
  }, {
    key: "_read_exponent",
    value: function _read_exponent() {
      var ch = this._read();

      if (ch == CH_MS || ch == CH_PS) {
        ch = this._read();
      }

      ch = this._read_required_digits(ch);
      return ch;
    }
  }, {
    key: "_read_plus_inf",
    value: function _read_plus_inf() {
      this._start = this._in.position();

      if (this._read() == CH_PS) {
        this._read_inf_helper();
      } else {
        this._error("expected +inf");
      }
    }
  }, {
    key: "_read_minus_inf",
    value: function _read_minus_inf() {
      this._start = this._in.position();

      if (this._read() == CH_MS) {
        this._read_inf_helper();
      } else {
        this._error("expected -inf");
      }
    }
  }, {
    key: "_read_inf_helper",
    value: function _read_inf_helper() {
      var ii, ch;

      for (ii = 0; ii < 3; ii++) {
        ch = this._read();

        if (ch != INF[ii]) {
          this._error("expected 'inf'");

          return;
        }
      }

      if (IonText.isNumericTerminator(this._peek())) {
        this._end = this._in.position();

        this._value_push(T_FLOAT_SPECIAL);
      } else {
        this._error("invalid numeric terminator after 'inf'");
      }
    }
  }, {
    key: "_readTimestamp",
    value: function _readTimestamp() {
      this._start = this._in.position();

      var ch = this._readPastNDigits(4);

      if (ch === CH_T) {
        this._end = this._in.position();

        this._value_push(T_TIMESTAMP);

        return;
      } else if (ch !== CH_MS) {
        throw new Error("Timestamp year must be followed by '-' or 'T'.");
      }

      ch = this._readPastNDigits(2);

      if (ch === CH_T) {
        this._end = this._in.position();

        this._value_push(T_TIMESTAMP);

        return;
      } else if (ch !== CH_MS) {
        throw new Error("Timestamp month must be followed by '-' or 'T'.");
      }

      ch = this._readPastNDigits(2);

      if (IonText.isNumericTerminator(ch)) {
        this._unread(ch);

        this._end = this._in.position();

        this._value_push(T_TIMESTAMP);

        return;
      } else if (ch !== CH_T) {
        throw new Error("Timestamp day must be followed by a numeric stop character .");
      }

      var peekChar = this._in.peek();

      if (IonText.isNumericTerminator(peekChar)) {
        this._end = this._in.position();

        this._value_push(T_TIMESTAMP);

        return;
      } else if (!IonText.is_digit(peekChar)) {
        throw new Error("Timestamp DATE must be followed by numeric terminator or additional TIME digits.");
      }

      ch = this._readPastNDigits(2);

      if (ch !== CH_CL) {
        throw new Error("Timestamp time(hr:min) requires format of 00:00");
      }

      ch = this._readPastNDigits(2);

      if (ch === CH_CL) {
        ch = this._readPastNDigits(2);

        if (ch === CH_DT) {
          if (!IonText.is_digit(this._read())) throw new Error("W3C timestamp spec requires atleast one digit after decimal point.");

          while (IonText.is_digit(ch = this._read())) {}
        }
      }

      if (ch === CH_Z) {
        if (!IonText.isNumericTerminator(this._peek())) throw new Error("Illegal terminator after Zulu offset.");
        this._end = this._in.position();

        this._value_push(T_TIMESTAMP);

        return;
      } else if (ch !== CH_PS && ch !== CH_MS) {
        throw new Error("Timestamps require an offset.");
      }

      ch = this._readPastNDigits(2);
      if (ch !== CH_CL) throw new Error("Timestamp offset(hr:min) requires format of +/-00:00.");

      this._readNDigits(2);

      ch = this._peek();
      if (!IonText.isNumericTerminator(ch)) throw new Error("Improperly formatted timestamp.");
      this._end = this._in.position();

      this._value_push(T_TIMESTAMP);
    }
  }, {
    key: "_read_symbol",
    value: function _read_symbol() {
      var ch;
      this._start = this._in.position() - 1;

      for (;;) {
        ch = this._read();
        if (!IonText.is_letter_or_digit(ch)) break;
      }

      this._unread(ch);

      this._end = this._in.position();

      this._value_push(T_IDENTIFIER);
    }
  }, {
    key: "_read_operator_symbol",
    value: function _read_operator_symbol() {
      var ch;
      this._start = this._in.position();

      for (;;) {
        ch = this._read();
        if (!IonText.is_operator_char(ch)) break;
      }

      this._end = this._in.position() - 1;

      this._unread(ch);

      this._value_push(T_OPERATOR);
    }
  }, {
    key: "_read_string1",
    value: function _read_string1() {
      this._read_string_helper(CH_SQ, false);

      this._end = this._in.position() - 1;

      this._value_push(T_STRING1);
    }
  }, {
    key: "_read_string2",
    value: function _read_string2() {
      this._read_string_helper(CH_DOUBLE_QUOTE, false);

      this._end = this._in.position() - 1;

      this._value_push(T_STRING2);
    }
  }, {
    key: "_read_string3",
    value: function _read_string3(recognizeComments) {
      if (recognizeComments === undefined) recognizeComments = true;
      var ch;

      this._unread(this._peek(""));

      for (this._start = this._in.position() + 3; this._peek("\'\'\'") !== ERROR; this._in.unread(this._read_after_whitespace(recognizeComments))) {
        for (var i = 0; i < 3; i++) {
          this._read();
        }

        while (this._peek("\'\'\'") === ERROR) {
          ch = this._read();

          if (ch == CH_BS) {
            this._read_string_escape_sequence();
          }

          if (ch === EOF) throw new Error('Closing triple quotes not found.');
          if (!is_valid_string_char(ch, true)) throw new Error("invalid character " + ch + " in string");
        }

        this._end = this._in.position();

        for (var _i = 0; _i < 3; _i++) {
          this._read();
        }
      }

      this._value_push(T_STRING3);
    }
  }, {
    key: "verifyTriple",
    value: function verifyTriple(entryIndex) {
      return this._in.valueAt(entryIndex) === CH_SQ && this._in.valueAt(entryIndex + 1) === CH_SQ && this._in.valueAt(entryIndex + 2) === CH_SQ;
    }
  }, {
    key: "_read_string_escape_sequence",
    value: function _read_string_escape_sequence() {
      var ch = this._read();

      switch (ch) {
        case ESC_0:
        case ESC_a:
        case ESC_b:
        case ESC_t:
        case ESC_nl:
        case ESC_ff:
        case ESC_cr:
        case ESC_v:
        case ESC_dq:
        case ESC_sq:
        case ESC_qm:
        case ESC_bs:
        case ESC_fs:
        case ESC_nl2:
          break;

        case ESC_nl3:
          ch = this._read();
          if (ch != ESC_nl2) this._unread(ch);
          break;

        case ESC_x:
          ch = this._read_N_hexdigits(2);

          this._unread(ch);

          break;

        case ESC_u:
          ch = this._read_N_hexdigits(4);

          this._unread(ch);

          break;

        case ESC_U:
          ch = this._read_N_hexdigits(8);

          this._unread(ch);

          break;

        default:
          this._error('unexpected character: ' + ch + ' after escape slash');

      }
    }
  }, {
    key: "_test_string_as_annotation",
    value: function _test_string_as_annotation(op) {
      var s,
          ch,
          is_ann,
          t = this._value_pop();

      if (t != T_STRING1 && t != T_STRING3) this._error("expecting quoted symbol here");
      s = this.get_value_as_string(t);
      ch = this._read_after_whitespace(true);

      if (ch == CH_CL && this._peek() == CH_CL) {
        this._read();

        this._ann.push(s);

        is_ann = true;
      } else {
        this._unread(ch);

        this._value_push(t);

        is_ann = false;
      }

      return is_ann;
    }
  }, {
    key: "_read_clob_string2",
    value: function _read_clob_string2() {
      var t;

      this._read_string2();

      t = this._value_pop();
      if (t != T_STRING2) this._error("string expected");

      this._value_push(T_CLOB2);

      this._ops.unshift(this._read_close_double_brace);
    }
  }, {
    key: "_read_clob_string3",
    value: function _read_clob_string3() {
      var t;

      this._read_string3(false);

      t = this._value_pop();
      if (t != T_STRING3) this._error("string expected");

      this._value_push(T_CLOB3);

      this._ops.unshift(this._read_close_double_brace);
    }
  }, {
    key: "_read_blob",
    value: function _read_blob() {
      var ch,
          base64_chars = 0,
          trailers = 0;
      this._start = this._in.position();

      while (true) {
        ch = this._read();

        if (IonText.is_base64_char(ch)) {
          base64_chars++;
          this._end = this._in.position();
        } else if (!IonText.is_whitespace(ch)) {
          break;
        }
      }

      while (ch == CH_EQ) {
        trailers++;
        ch = this._read_after_whitespace(false);
      }

      if (ch != CH_CC || this._read() != CH_CC) throw new Error("Invalid blob");
      if (!is_valid_base64_length(base64_chars, trailers)) throw new Error("Invalid base64 value");

      this._value_push(T_BLOB);
    }
  }, {
    key: "_read_comma",
    value: function _read_comma() {
      var ch = this._read_after_whitespace(true);

      if (ch != CH_CM) this._error("expected ','");
    }
  }, {
    key: "_read_close_double_brace",
    value: function _read_close_double_brace() {
      var ch = this._read_after_whitespace(false);

      if (ch != CH_CC || this._read() != CH_CC) {
        this._error("expected '}}'");
      }
    }
  }, {
    key: "isHighSurrogate",
    value: function isHighSurrogate(ch) {
      return ch >= 0xD800 && ch <= 0xDBFF;
    }
  }, {
    key: "isLowSurrogate",
    value: function isLowSurrogate(ch) {
      return ch >= 0xDC00 && ch <= 0xDFFF;
    }
  }, {
    key: "indexWhiteSpace",
    value: function indexWhiteSpace(index, acceptComments) {
      var ch = this._in.valueAt(index);

      if (!acceptComments) {
        for (; IonText_1.is_whitespace(ch); ch = this._in.valueAt(index++)) {}
      } else {
        for (; IonText_1.is_whitespace(ch) || ch === CH_FORWARD_SLASH; ch = this._in.valueAt(index++)) {
          if (ch === CH_FORWARD_SLASH) {
            ch = this._in.valueAt(index++);

            switch (ch) {
              case CH_FORWARD_SLASH:
                index = this.indexToNewLine(index);
                break;

              case CH_AS:
                index = this.indexToCloseComment(index);
                break;

              default:
                index--;
                break;
            }
          }
        }
      }

      return index;
    }
  }, {
    key: "indexToNewLine",
    value: function indexToNewLine(index) {
      var ch = this._in.valueAt(index);

      while (ch !== EOF && ch !== CH_NL) {
        if (ch === CH_CR) {
          if (this._in.valueAt(index + 1) !== CH_NL) {
            return index;
          }
        }

        ch = this._in.valueAt(index++);
      }

      return index;
    }
  }, {
    key: "indexToCloseComment",
    value: function indexToCloseComment(index) {
      while (this._in.valueAt(index) !== CH_AS && this._in.valueAt(index + 1) !== CH_FORWARD_SLASH) {
        index++;
      }

      return index;
    }
  }, {
    key: "_skip_triple_quote_gap",
    value: function _skip_triple_quote_gap(entryIndex, end, acceptComments) {
      var tempIndex = entryIndex + 3;

      var ch = this._in.valueAt(tempIndex);

      tempIndex = this.indexWhiteSpace(tempIndex, acceptComments);

      if (tempIndex + 2 <= end && this.verifyTriple(tempIndex)) {
        return tempIndex + 4;
      } else {
        return tempIndex + 1;
      }
    }
  }, {
    key: "readClobEscapes",
    value: function readClobEscapes(ii, end) {
      var ch;

      if (ii + 1 >= end) {
        this._error("invalid escape sequence");

        return;
      }

      ch = this._in.valueAt(ii + 1);
      this._esc_len = 1;

      switch (ch) {
        case ESC_0:
          return 0;

        case ESC_a:
          return 7;

        case ESC_b:
          return 8;

        case ESC_t:
          return 9;

        case ESC_nl:
          return 10;

        case ESC_ff:
          return 12;

        case ESC_cr:
          return 13;

        case ESC_v:
          return 11;

        case ESC_dq:
          return 34;

        case ESC_sq:
          return 39;

        case ESC_qm:
          return 63;

        case ESC_bs:
          return 92;

        case ESC_fs:
          return 47;

        case ESC_nl2:
          return -1;

        case ESC_nl3:
          if (ii + 3 < end && this._in.valueAt(ii + 3) == CH_NL) {
            this._esc_len = 2;
          }

          return IonText.ESCAPED_NEWLINE;

        case ESC_x:
          if (ii + 3 >= end) {
            this._error("invalid escape sequence");

            return;
          }

          ch = this._get_N_hexdigits(ii + 2, ii + 4);
          this._esc_len = 3;
          break;

        default:
          throw new Error("Invalid escape: /" + ch);
      }

      return ch;
    }
  }, {
    key: "_read_escape_sequence",
    value: function _read_escape_sequence(ii, end) {
      var ch;
      if (ii + 1 >= end) throw new Error("Invalid escape sequence.");
      ch = this._in.valueAt(ii + 1);
      this._esc_len = 1;

      switch (ch) {
        case ESC_0:
          return 0;

        case ESC_a:
          return 7;

        case ESC_b:
          return 8;

        case ESC_t:
          return 9;

        case ESC_nl:
          return 10;

        case ESC_ff:
          return 12;

        case ESC_cr:
          return 13;

        case ESC_v:
          return 11;

        case ESC_dq:
          return 34;

        case ESC_sq:
          return 39;

        case ESC_qm:
          return 63;

        case ESC_bs:
          return 92;

        case ESC_fs:
          return 47;

        case ESC_nl2:
          return -1;

        case ESC_nl3:
          if (ii + 3 < end && this._in.valueAt(ii + 3) == CH_NL) {
            this._esc_len = 2;
          }

          return IonText.ESCAPED_NEWLINE;

        case ESC_x:
          if (ii + 3 >= end) {
            this._error("invalid escape sequence");

            return;
          }

          ch = this._get_N_hexdigits(ii + 2, ii + 4);
          this._esc_len = 3;
          break;

        case ESC_u:
          if (ii + 5 >= end) {
            this._error("invalid escape sequence");

            return;
          }

          ch = this._get_N_hexdigits(ii + 2, ii + 6);
          this._esc_len = 5;
          break;

        case ESC_U:
          if (ii + 9 >= end) {
            this._error("invalid escape sequence");

            return;
          }

          ch = this._get_N_hexdigits(ii + 2, ii + 10);
          this._esc_len = 9;
          break;

        default:
          this._error("unexpected character after escape slash");

      }

      return ch;
    }
  }, {
    key: "_get_N_hexdigits",
    value: function _get_N_hexdigits(ii, end) {
      var ch,
          v = 0;

      while (ii < end) {
        ch = this._in.valueAt(ii);
        v = v * 16 + get_hex_value(ch);
        ii++;
      }

      return v;
    }
  }, {
    key: "_value_push",
    value: function _value_push(t) {
      if (this._value_type !== ERROR) {
        this._error("unexpected double push of value type!");
      }

      this._value_type = t;
    }
  }, {
    key: "_value_pop",
    value: function _value_pop() {
      var t = this._value_type;
      this._value_type = ERROR;
      return t;
    }
  }, {
    key: "_run",
    value: function _run() {
      var op;

      while (this._ops.length > 0 && this._value_type === ERROR) {
        op = this._ops.shift();
        op.call(this);
      }
    }
  }, {
    key: "_read",
    value: function _read() {
      var ch = this._in.next();

      return ch;
    }
  }, {
    key: "_read_skipping_comments",
    value: function _read_skipping_comments() {
      var ch = this._read();

      if (ch == CH_FORWARD_SLASH) {
        ch = this._read();

        if (ch == CH_FORWARD_SLASH) {
          this._read_to_newline();

          ch = IonText.WHITESPACE_COMMENT1;
        } else if (ch == CH_AS) {
          this._read_to_close_comment();

          ch = IonText.WHITESPACE_COMMENT2;
        } else {
          this._unread(ch);

          ch = CH_FORWARD_SLASH;
        }
      }

      return ch;
    }
  }, {
    key: "_read_to_newline",
    value: function _read_to_newline() {
      var ch;

      for (;;) {
        ch = this._read();
        if (ch == EOF) break;
        if (ch == CH_NL) break;

        if (ch == CH_CR) {
          ch = this._read();
          if (ch != CH_NL) this._unread(ch);
          break;
        }
      }
    }
  }, {
    key: "_read_to_close_comment",
    value: function _read_to_close_comment() {
      var ch;

      for (;;) {
        ch = this._read();
        if (ch == EOF) break;

        if (ch == CH_AS) {
          ch = this._read();
          if (ch == CH_FORWARD_SLASH) break;
        }
      }
    }
  }, {
    key: "_unread",
    value: function _unread(ch) {
      this._in.unread(ch);
    }
  }, {
    key: "_read_after_whitespace",
    value: function _read_after_whitespace(recognize_comments) {
      var ch;

      if (recognize_comments) {
        ch = this._read_skipping_comments();

        while (IonText.is_whitespace(ch)) {
          ch = this._read_skipping_comments();
        }
      } else {
        ch = this._read();

        while (IonText.is_whitespace(ch)) {
          ch = this._read();
        }
      }

      return ch;
    }
  }, {
    key: "_peek",
    value: function _peek(expected) {
      var ch,
          ii = 0;

      if (expected === undefined || expected.length < 1) {
        return this._in.valueAt(this._in.position());
      }

      while (ii < expected.length) {
        ch = this._read();
        if (ch != expected.charCodeAt(ii)) break;
        ii++;
      }

      if (ii === expected.length) {
        ch = this._peek();
      } else {
        this._unread(ch);

        ch = ERROR;
      }

      while (ii > 0) {
        ii--;

        this._unread(expected.charCodeAt(ii));
      }

      return ch;
    }
  }, {
    key: "_peek_after_whitespace",
    value: function _peek_after_whitespace(recognize_comments) {
      var ch = this._read_after_whitespace(recognize_comments);

      this._unread(ch);

      return ch;
    }
  }, {
    key: "_peek_4_digits",
    value: function _peek_4_digits(ch1) {
      var ii,
          ch,
          is_digits = true,
          chars = [];
      if (!IonText.is_digit(ch1)) return ERROR;

      for (ii = 0; ii < 3; ii++) {
        ch = this._read();
        chars.push(ch);

        if (!IonText.is_digit(ch)) {
          is_digits = false;
          break;
        }
      }

      ch = is_digits && ii == 3 ? this._peek() : ERROR;

      while (chars.length > 0) {
        this._unread(chars.pop());
      }

      return ch;
    }
  }, {
    key: "_read_required_digits",
    value: function _read_required_digits(ch) {
      if (!IonText.is_digit(ch)) return ERROR;

      for (;;) {
        ch = this._read();
        if (!IonText.is_digit(ch)) break;
      }

      return ch;
    }
  }, {
    key: "_read_optional_digits",
    value: function _read_optional_digits(ch) {
      while (IonText.is_digit(ch)) {
        ch = this._read();
      }

      return ch;
    }
  }, {
    key: "_readNDigits",
    value: function _readNDigits(n) {
      var ch;
      if (n <= 0) throw new Error("Cannot read a lack of or negative number of digits.");

      while (n--) {
        if (!IonText.is_digit(ch = this._read())) throw new Error("Expected digit, got: " + String.fromCharCode(ch));
      }

      return ch;
    }
  }, {
    key: "_readPastNDigits",
    value: function _readPastNDigits(n) {
      this._readNDigits(n);

      return this._read();
    }
  }, {
    key: "_read_required_hex_digits",
    value: function _read_required_hex_digits(ch) {
      if (!IonText.is_hex_digit(ch)) return ERROR;

      for (;;) {
        ch = this._read();
        if (!IonText.is_hex_digit(ch)) break;
      }

      return ch;
    }
  }, {
    key: "_read_N_hexdigits",
    value: function _read_N_hexdigits(n) {
      var ch,
          ii = 0;

      while (ii < n) {
        ch = this._read();

        if (!IonText.is_hex_digit(ch)) {
          this._error("" + n + " digits required " + ii + " found");

          return ERROR;
        }

        ii++;
      }

      return ch;
    }
  }, {
    key: "_read_hours_and_minutes",
    value: function _read_hours_and_minutes(ch) {
      if (!IonText.is_digit(ch)) return ERROR;
      ch = this._readPastNDigits(1);

      if (ch == CH_CL) {
        ch = this._readPastNDigits(2);
      } else {
        ch = ERROR;
      }

      return ch;
    }
  }, {
    key: "_check_for_keywords",
    value: function _check_for_keywords() {
      var len,
          s,
          v = this._value_pop();

      if (v == T_IDENTIFIER) {
        len = this._end - this._start;

        if (len >= 3 && len <= 5) {
          s = this.get_value_as_string(v);
          v = get_keyword_type(s);
        }
      }

      this._value_push(v);
    }
  }, {
    key: "_error",
    value: function _error(msg) {
      this._ops.unshift(this._done_with_error);

      this._error_msg = msg;
    }
  }]);
  return ParserTextRaw;
}();

exports.ParserTextRaw = ParserTextRaw;

},{"./IonText":21,"./IonTypes":26,"./JsbiSupport":30,"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/interopRequireDefault":42}],15:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IonTextWriter_1 = require("./IonTextWriter");

var IonText_1 = require("./IonText");

var IonTypes_1 = require("./IonTypes");

var PrettyTextWriter =
/*#__PURE__*/
function (_IonTextWriter_1$Text) {
  (0, _inherits2["default"])(PrettyTextWriter, _IonTextWriter_1$Text);

  function PrettyTextWriter(writeable) {
    var _this;

    var indentSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    (0, _classCallCheck2["default"])(this, PrettyTextWriter);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(PrettyTextWriter).call(this, writeable));
    _this.indentSize = indentSize;
    _this.indentCount = 0;
    return _this;
  }

  (0, _createClass2["default"])(PrettyTextWriter, [{
    key: "writeFieldName",
    value: function writeFieldName(fieldName) {
      if (this.currentContainer.containerType !== IonTypes_1.IonTypes.STRUCT) {
        throw new Error("Cannot write field name outside of a struct");
      }

      if (this.currentContainer.state !== IonTextWriter_1.State.STRUCT_FIELD) {
        throw new Error("Expecting a struct value");
      }

      if (!this.currentContainer.clean) {
        this.writeable.writeByte(IonText_1.CharCodes.COMMA);
        this.writePrettyNewLine(0);
      }

      this.writePrettyIndent(0);
      this.writeSymbolToken(fieldName);
      this.writeable.writeByte(IonText_1.CharCodes.COLON);
      this.currentContainer.state = IonTextWriter_1.State.VALUE;
    }
  }, {
    key: "writeNull",
    value: function writeNull(type) {
      if (type === null || type === undefined || type.binaryTypeId < 0 || type.binaryTypeId > 13) {
        throw new Error("Cannot write null for type ".concat(type));
      }

      this.handleSeparator();
      this.writePrettyValue();
      this.writeAnnotations();
      this.writeUtf8("null." + type.name);
      if (this.currentContainer.containerType === IonTypes_1.IonTypes.STRUCT) this.currentContainer.state = IonTextWriter_1.State.STRUCT_FIELD;
    }
  }, {
    key: "stepOut",
    value: function stepOut() {
      var currentContainer = this.containerContext.pop();

      if (!currentContainer || !currentContainer.containerType) {
        throw new Error("Can't step out when not in a container");
      } else if (currentContainer.containerType === IonTypes_1.IonTypes.STRUCT && currentContainer.state === IonTextWriter_1.State.VALUE) {
        throw new Error("Expecting a struct value");
      }

      if (!currentContainer.clean) {
        this.writePrettyNewLine(0);
      }

      this.writePrettyIndent(-1);

      switch (currentContainer.containerType) {
        case IonTypes_1.IonTypes.LIST:
          this.writeable.writeByte(IonText_1.CharCodes.RIGHT_BRACKET);
          break;

        case IonTypes_1.IonTypes.SEXP:
          this.writeable.writeByte(IonText_1.CharCodes.RIGHT_PARENTHESIS);
          break;

        case IonTypes_1.IonTypes.STRUCT:
          this.writeable.writeByte(IonText_1.CharCodes.RIGHT_BRACE);
          break;

        default:
          throw new Error("Unexpected container type");
      }
    }
  }, {
    key: "_serializeValue",
    value: function _serializeValue(type, value, serialize) {
      if (this.currentContainer.state === IonTextWriter_1.State.STRUCT_FIELD) throw new Error("Expecting a struct field");

      if (value === null || value === undefined) {
        this.writeNull(type);
        return;
      }

      this.handleSeparator();
      this.writePrettyValue();
      this.writeAnnotations();
      serialize(value);
      if (this.currentContainer.containerType === IonTypes_1.IonTypes.STRUCT) this.currentContainer.state = IonTextWriter_1.State.STRUCT_FIELD;
    }
  }, {
    key: "writeContainer",
    value: function writeContainer(type, openingCharacter) {
      if (this.currentContainer.containerType === IonTypes_1.IonTypes.STRUCT && this.currentContainer.state === IonTextWriter_1.State.VALUE) {
        this.currentContainer.state = IonTextWriter_1.State.STRUCT_FIELD;
      }

      this.handleSeparator();
      this.writePrettyValue();
      this.writeAnnotations();
      this.writeable.writeByte(openingCharacter);
      this.writePrettyNewLine(1);

      this._stepIn(type);
    }
  }, {
    key: "handleSeparator",
    value: function handleSeparator() {
      if (this.depth() === 0) {
        if (this.currentContainer.clean) {
          this.currentContainer.clean = false;
        } else {
          this.writeable.writeByte(IonText_1.CharCodes.LINE_FEED);
        }
      } else {
        if (this.currentContainer.clean) {
          this.currentContainer.clean = false;
        } else {
          switch (this.currentContainer.containerType) {
            case IonTypes_1.IonTypes.LIST:
              this.writeable.writeByte(IonText_1.CharCodes.COMMA);
              this.writePrettyNewLine(0);
              break;

            case IonTypes_1.IonTypes.SEXP:
              this.writeable.writeByte(IonText_1.CharCodes.SPACE);
              this.writePrettyNewLine(0);
              break;

            default:
          }
        }
      }
    }
  }, {
    key: "writePrettyValue",
    value: function writePrettyValue() {
      if (this.depth() > 0 && this.currentContainer.containerType && this.currentContainer.containerType !== IonTypes_1.IonTypes.STRUCT) {
        this.writePrettyIndent(0);
      }
    }
  }, {
    key: "writePrettyNewLine",
    value: function writePrettyNewLine(incrementValue) {
      this.indentCount = this.indentCount + incrementValue;

      if (this.indentSize && this.indentSize > 0) {
        this.writeable.writeByte(IonText_1.CharCodes.LINE_FEED);
      }
    }
  }, {
    key: "writePrettyIndent",
    value: function writePrettyIndent(incrementValue) {
      this.indentCount = this.indentCount + incrementValue;

      if (this.indentSize && this.indentSize > 0) {
        for (var i = 0; i < this.indentCount * this.indentSize; i++) {
          this.writeable.writeByte(IonText_1.CharCodes.SPACE);
        }
      }
    }
  }]);
  return PrettyTextWriter;
}(IonTextWriter_1.TextWriter);

exports.PrettyTextWriter = PrettyTextWriter;

},{"./IonText":21,"./IonTextWriter":23,"./IonTypes":26,"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/getPrototypeOf":40,"@babel/runtime/helpers/inherits":41,"@babel/runtime/helpers/interopRequireDefault":42,"@babel/runtime/helpers/possibleConstructorReturn":45}],16:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SharedSymbolTable =
/*#__PURE__*/
function () {
  function SharedSymbolTable(_name, _version, _symbols) {
    (0, _classCallCheck2["default"])(this, SharedSymbolTable);
    this._name = _name;
    this._version = _version;
    this._symbols = _symbols;
    this._idsByText = new Map();
    this._numberOfSymbols = this._symbols.length;

    for (var m = _symbols.length - 1; m >= 0; m--) {
      this._idsByText[_symbols[m]] = m;
    }
  }

  (0, _createClass2["default"])(SharedSymbolTable, [{
    key: "getSymbolText",
    value: function getSymbolText(symbolId) {
      if (symbolId < 0) {
        throw new Error("Index ".concat(symbolId, " is out of bounds for the SharedSymbolTable name=").concat(this.name, ", version=").concat(this.version));
      }

      if (symbolId >= this.numberOfSymbols) {
        return undefined;
      }

      return this._symbols[symbolId];
    }
  }, {
    key: "getSymbolId",
    value: function getSymbolId(text) {
      var symbolId = this._idsByText[text];

      if (symbolId === undefined) {
        return null;
      }

      return symbolId;
    }
  }, {
    key: "numberOfSymbols",
    get: function get() {
      return this._numberOfSymbols;
    }
  }, {
    key: "name",
    get: function get() {
      return this._name;
    }
  }, {
    key: "version",
    get: function get() {
      return this._version;
    }
  }]);
  return SharedSymbolTable;
}();

exports.SharedSymbolTable = SharedSymbolTable;

},{"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/interopRequireDefault":42}],17:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IonConstants_1 = require("./IonConstants");

var SPAN_TYPE_STRING = 0;
var SPAN_TYPE_BINARY = 1;
var SPAN_TYPE_SUB_FLAG = 2;
var SPAN_TYPE_SUB_STRING = SPAN_TYPE_SUB_FLAG | SPAN_TYPE_STRING;
var SPAN_TYPE_SUB_BINARY = SPAN_TYPE_SUB_FLAG | SPAN_TYPE_BINARY;
var MAX_POS = 1024 * 1024 * 1024;
var LINE_FEED = 10;
var CARRAIGE_RETURN = 13;
var DEBUG_FLAG = true;

var Span =
/*#__PURE__*/
function () {
  function Span(_type) {
    (0, _classCallCheck2["default"])(this, Span);
    this._type = _type;
  }

  (0, _createClass2["default"])(Span, [{
    key: "write",
    value: function write(b) {
      throw new Error("not implemented");
    }
  }], [{
    key: "error",
    value: function error() {
      throw new Error("span error");
    }
  }]);
  return Span;
}();

exports.Span = Span;

var StringSpan =
/*#__PURE__*/
function (_Span) {
  (0, _inherits2["default"])(StringSpan, _Span);

  function StringSpan(src) {
    var _this;

    (0, _classCallCheck2["default"])(this, StringSpan);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(StringSpan).call(this, SPAN_TYPE_STRING));
    _this._line = 1;
    _this._src = src;
    _this._limit = src.length;
    _this._start = 0;
    _this._pos = 0;
    _this._line_start = 0;
    _this._old_line_start = 0;
    return _this;
  }

  (0, _createClass2["default"])(StringSpan, [{
    key: "viewSource",
    value: function viewSource() {
      return this._src;
    }
  }, {
    key: "position",
    value: function position() {
      return this._pos - this._start;
    }
  }, {
    key: "getRemaining",
    value: function getRemaining() {
      return this._limit - this._pos;
    }
  }, {
    key: "setRemaining",
    value: function setRemaining(r) {
      this._limit = r + this._pos;
    }
  }, {
    key: "is_empty",
    value: function is_empty() {
      return this._pos >= this._limit;
    }
  }, {
    key: "next",
    value: function next() {
      var ch;

      if (this.is_empty()) {
        if (this._pos > MAX_POS) {
          throw new Error("span position is out of bounds");
        }

        this._pos++;
        return IonConstants_1.EOF;
      }

      ch = this._src.charCodeAt(this._pos);

      if (ch === CARRAIGE_RETURN) {
        if (this.peek() != LINE_FEED) {
          this._inc_line();
        }
      } else if (ch == LINE_FEED) {
        this._inc_line();
      }

      this._pos++;
      return ch;
    }
  }, {
    key: "_inc_line",
    value: function _inc_line() {
      this._old_line_start = this._line_start;
      this._line++;
      this._line_start = this._pos;
    }
  }, {
    key: "unread",
    value: function unread(ch) {
      if (this._pos <= this._start) Span.error();
      this._pos--;

      if (ch < 0) {
        if (this.is_empty() != true) Span.error();
        return;
      }

      if (this._pos == this._line_start) {
        this._line_start = this._old_line_start;
        this._line--;
      }

      if (ch != this.peek()) Span.error();
    }
  }, {
    key: "peek",
    value: function peek() {
      return this.valueAt(this._pos);
    }
  }, {
    key: "skip",
    value: function skip(dist) {
      this._pos += dist;

      if (this._pos > this._limit) {
        this._pos = this._limit;
      }
    }
  }, {
    key: "valueAt",
    value: function valueAt(ii) {
      if (ii < this._start || ii >= this._limit) return IonConstants_1.EOF;
      return this._src.charCodeAt(ii);
    }
  }, {
    key: "chunk",
    value: function chunk(length) {
      var tempStr = this._src.substr(this._pos, length);

      this._pos += length;
      return tempStr;
    }
  }, {
    key: "getCodePoint",
    value: function getCodePoint(index) {
      return this._src.codePointAt(index);
    }
  }, {
    key: "line_number",
    value: function line_number() {
      return this._line;
    }
  }, {
    key: "offset",
    value: function offset() {
      return this._pos - this._line_start;
    }
  }, {
    key: "clone",
    value: function clone(start) {
      return new StringSpan(this._src.substr(this._pos));
    }
  }]);
  return StringSpan;
}(Span);

exports.StringSpan = StringSpan;

var BinarySpan =
/*#__PURE__*/
function (_Span2) {
  (0, _inherits2["default"])(BinarySpan, _Span2);

  function BinarySpan(src) {
    var _this2;

    (0, _classCallCheck2["default"])(this, BinarySpan);
    _this2 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(BinarySpan).call(this, SPAN_TYPE_BINARY));
    _this2._src = src;
    _this2._limit = src.length;
    _this2._start = 0;
    _this2._pos = 0;
    return _this2;
  }

  (0, _createClass2["default"])(BinarySpan, [{
    key: "position",
    value: function position() {
      return this._pos - this._start;
    }
  }, {
    key: "getRemaining",
    value: function getRemaining() {
      return this._limit - this._pos;
    }
  }, {
    key: "setRemaining",
    value: function setRemaining(r) {
      this._limit = r + this._pos;
    }
  }, {
    key: "is_empty",
    value: function is_empty() {
      return this._pos >= this._limit;
    }
  }, {
    key: "next",
    value: function next() {
      if (this.is_empty()) {
        return IonConstants_1.EOF;
      }

      return this._src[this._pos++];
    }
  }, {
    key: "view",
    value: function view(length) {
      if (this._pos + length > this._limit) {
        throw new Error('Unable to read ' + length + ' bytes (position: ' + this.position() + ', limit: ' + this._limit + ')');
      }

      return this._src.subarray(this._pos, this._pos += length);
    }
  }, {
    key: "chunk",
    value: function chunk(length) {
      return new Uint8Array(this.view(length));
    }
  }, {
    key: "unread",
    value: function unread(b) {
      if (this._pos <= this._start) Span.error();
      this._pos--;

      if (b == IonConstants_1.EOF) {
        if (this.is_empty() == false) Span.error();
      }

      if (b != this.peek()) Span.error();
    }
  }, {
    key: "peek",
    value: function peek() {
      if (this.is_empty()) return IonConstants_1.EOF;
      return this._src[this._pos];
    }
  }, {
    key: "skip",
    value: function skip(dist) {
      this._pos += dist;
      if (this._pos > this._limit) throw new Error("Skipped over end of source.");
    }
  }, {
    key: "valueAt",
    value: function valueAt(ii) {
      if (ii < this._start || ii >= this._limit) return undefined;
      return this._src[ii];
    }
  }, {
    key: "clone",
    value: function clone(start, len) {
      return new BinarySpan(this._src.subarray(this._pos));
    }
  }]);
  return BinarySpan;
}(Span);

exports.BinarySpan = BinarySpan;

},{"./IonConstants":8,"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/getPrototypeOf":40,"@babel/runtime/helpers/inherits":41,"@babel/runtime/helpers/interopRequireDefault":42,"@babel/runtime/helpers/possibleConstructorReturn":45}],18:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IonSharedSymbolTable_1 = require("./IonSharedSymbolTable");

var SubstituteSymbolTable =
/*#__PURE__*/
function (_IonSharedSymbolTable) {
  (0, _inherits2["default"])(SubstituteSymbolTable, _IonSharedSymbolTable);

  function SubstituteSymbolTable(length) {
    var _this;

    (0, _classCallCheck2["default"])(this, SubstituteSymbolTable);

    if (length < 0) {
      throw new Error("Cannot instantiate a SubstituteSymbolTable with a negative length. (" + length + ")");
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(SubstituteSymbolTable).call(this, "_substitute", undefined, []));
    _this._numberOfSymbols = length;
    return _this;
  }

  (0, _createClass2["default"])(SubstituteSymbolTable, [{
    key: "getSymbolText",
    value: function getSymbolText(symbolId) {
      if (symbolId < 0) {
        throw new Error("Index ".concat(symbolId, " is out of bounds for the SharedSymbolTable name=").concat(this.name, ", version=").concat(this.version));
      }

      return undefined;
    }
  }, {
    key: "getSymbolId",
    value: function getSymbolId(text) {
      return undefined;
    }
  }]);
  return SubstituteSymbolTable;
}(IonSharedSymbolTable_1.SharedSymbolTable);

exports.SubstituteSymbolTable = SubstituteSymbolTable;

},{"./IonSharedSymbolTable":16,"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/getPrototypeOf":40,"@babel/runtime/helpers/inherits":41,"@babel/runtime/helpers/interopRequireDefault":42,"@babel/runtime/helpers/possibleConstructorReturn":45}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IonSystemSymbolTable_1 = require("./IonSystemSymbolTable");

var IonImport_1 = require("./IonImport");

var IonLocalSymbolTable_1 = require("./IonLocalSymbolTable");

var IonSubstituteSymbolTable_1 = require("./IonSubstituteSymbolTable");

exports.ion_symbol_table = "$ion_symbol_table";
exports.ion_symbol_table_sid = 3;
var empty_struct = {};

function load_imports(reader, catalog) {
  var import_ = IonSystemSymbolTable_1.getSystemSymbolTableImport();
  reader.stepIn();

  while (reader.next()) {
    reader.stepIn();
    var name = void 0;
    var version = 1;
    var maxId = void 0;

    while (reader.next()) {
      switch (reader.fieldName()) {
        case "name":
          name = reader.stringValue();
          break;

        case "version":
          version = reader.numberValue();
          break;

        case "max_id":
          maxId = reader.numberValue();
      }
    }

    if (version < 1) {
      version = 1;
    }

    if (name && name !== "$ion") {
      var symbolTable = catalog.getVersion(name, version);

      if (!symbolTable) {
        if (maxId === undefined) {
          throw new Error("No exact match found when trying to import symbol table ".concat(name, " version ").concat(version));
        } else {
          symbolTable = catalog.getTable(name);
        }
      }

      if (!symbolTable) {
        symbolTable = new IonSubstituteSymbolTable_1.SubstituteSymbolTable(maxId);
      }

      import_ = new IonImport_1.Import(import_, symbolTable, maxId);
    }

    reader.stepOut();
  }

  reader.stepOut();
  return import_;
}

function load_symbols(reader) {
  var symbols = [];
  reader.stepIn();

  while (reader.next()) {
    symbols.push(reader.stringValue());
  }

  reader.stepOut();
  return symbols;
}

function makeSymbolTable(catalog, reader) {
  var import_;
  var symbols;
  var maxId;
  var foundSymbols = false;
  var foundImports = false;
  reader.stepIn();

  while (reader.next()) {
    switch (reader.fieldName()) {
      case "imports":
        if (foundImports) throw new Error("Multiple import fields found.");
        import_ = load_imports(reader, catalog);
        foundImports = true;
        break;

      case "symbols":
        if (foundSymbols) throw new Error("Multiple symbol fields found.");
        symbols = load_symbols(reader);
        foundSymbols = true;
        break;
    }
  }

  reader.stepOut();
  return new IonLocalSymbolTable_1.LocalSymbolTable(import_, symbols);
}

exports.makeSymbolTable = makeSymbolTable;

},{"./IonImport":10,"./IonLocalSymbolTable":11,"./IonSubstituteSymbolTable":18,"./IonSystemSymbolTable":20}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IonImport_1 = require("./IonImport");

var IonSharedSymbolTable_1 = require("./IonSharedSymbolTable");

var systemSymbolTable = new IonSharedSymbolTable_1.SharedSymbolTable("$ion", 1, ["$ion", "$ion_1_0", "$ion_symbol_table", "name", "version", "imports", "symbols", "max_id", "$ion_shared_symbol_table"]);

function getSystemSymbolTable() {
  return systemSymbolTable;
}

exports.getSystemSymbolTable = getSystemSymbolTable;

function getSystemSymbolTableImport() {
  return new IonImport_1.Import(null, getSystemSymbolTable());
}

exports.getSystemSymbolTableImport = getSystemSymbolTableImport;

},{"./IonImport":10,"./IonSharedSymbolTable":16}],21:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WHITESPACE_COMMENT1 = -2;
exports.WHITESPACE_COMMENT2 = -3;
exports.ESCAPED_NEWLINE = -4;
var DOUBLE_QUOTE = 34;
var SINGLE_QUOTE = 39;
var SLASH = 92;
var _escapeStrings = {
  0: "\\0",
  8: "\\b",
  9: "\\t",
  10: "\\n",
  13: "\\r",
  DOUBLE_QUOTE: "\\\"",
  SINGLE_QUOTE: "\\\'",
  SLASH: "\\\\"
};

function _make_bool_array(str) {
  var i = str.length;
  var a = [];
  a[128] = false;

  while (i > 0) {
    --i;
    a[str.charCodeAt(i)] = true;
  }

  return a;
}

var _is_base64_char = _make_bool_array("+/0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");

var _is_hex_digit = _make_bool_array("0123456789abcdefABCDEF");

var _is_letter = _make_bool_array("_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");

var _is_letter_or_digit = _make_bool_array("_$0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");

var _is_numeric_terminator = _make_bool_array("{}[](),\"' \t\n\r\x0B\f");

var _is_operator_char = _make_bool_array("!#%&*+-./;<=>?@^`|~");

var _is_whitespace = _make_bool_array(" \t\r\n\x0B\f");

var isIdentifierArray = _make_bool_array("_$0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");

function is_digit(ch) {
  if (ch < 48 || ch > 57) return false;
  return true;
}

exports.is_digit = is_digit;

function is_keyword(str) {
  return str === "null" || str === "true" || str === "false" || str === "nan" || str === "+inf" || str === "-inf";
}

exports.is_keyword = is_keyword;

function asAscii(s) {
  if (typeof s === 'undefined') {
    s = "undefined::null";
  } else if (typeof s == 'number') {
    s = "" + s;
  } else if (typeof s != 'string') {
    var esc = nextEscape(s, s.length);

    if (esc >= 0) {
      s = escapeString(s, esc);
    }
  }

  return s;
}

exports.asAscii = asAscii;

function nextEscape(s, prev) {
  while (prev-- > 0) {
    if (needsEscape(s.charCodeAt(prev))) break;
  }

  return prev;
}

exports.nextEscape = nextEscape;

function needsEscape(c) {
  if (c < 32) return true;
  if (c > 126) return true;
  if (c === DOUBLE_QUOTE || c === SINGLE_QUOTE || c === SLASH) return true;
  return false;
}

exports.needsEscape = needsEscape;

function escapeString(s, pos) {
  var fixes = [],
      c,
      old_len,
      new_len,
      ii,
      s2;

  while (pos >= 0) {
    c = s.charCodeAt(pos);
    if (!needsEscape(c)) break;
    fixes.push([pos, c]);
    pos = nextEscape(s, pos);
  }

  if (fixes.length > 0) {
    s2 = "";
    ii = fixes.length;
    pos = s.length;

    while (ii--) {
      var fix = fixes[ii];
      var tail_len = pos - fix[0] - 1;

      if (tail_len > 0) {
        s2 = escapeSequence(fix[1]) + s.substring(fix[0] + 1, pos) + s2;
      } else {
        s2 = s.substring(fix[0] + 1, pos) + s2;
      }

      pos = fix[0] - 1;
    }

    if (pos >= 0) {
      s2 = s.substring(0, pos) + s2;
    }

    s = s2;
  }

  return s;
}

exports.escapeString = escapeString;

function escapeSequence(c) {
  var s = _escapeStrings[c];

  if (typeof s === 'undefined') {
    if (c < 256) {
      s = "\\x" + toHex(c, 2);
    } else if (c <= 0xFFFF) {
      s = "\\u" + toHex(c, 4);
    } else {
      s = "\\U" + toHex(c, 8);
    }
  }

  return s;
}

exports.escapeSequence = escapeSequence;

function toHex(c, len) {
  var s = "";

  while (c > 0) {
    s += "0123456789ABCDEF".charAt(c && 0xf);
    c = c / 16;
  }

  if (s.length < len) {
    s = "000000000" + s;
    s = s.substring(s.length - len, s.length);
  }

  return s;
}

exports.toHex = toHex;

function is_letter(ch) {
  return _is_letter[ch];
}

exports.is_letter = is_letter;

function isNumericTerminator(ch) {
  if (ch == -1) return true;
  return _is_numeric_terminator[ch];
}

exports.isNumericTerminator = isNumericTerminator;

function is_letter_or_digit(ch) {
  return _is_letter_or_digit[ch];
}

exports.is_letter_or_digit = is_letter_or_digit;

function is_operator_char(ch) {
  return _is_operator_char[ch];
}

exports.is_operator_char = is_operator_char;

function is_whitespace(ch) {
  if (ch > 32) return false;
  if (ch == this.WHITESPACE_COMMENT1) return true;
  if (ch == this.WHITESPACE_COMMENT2) return true;
  if (ch == this.ESCAPED_NEWLINE) return true;
  return _is_whitespace[ch];
}

exports.is_whitespace = is_whitespace;

function is_base64_char(ch) {
  return _is_base64_char[ch];
}

exports.is_base64_char = is_base64_char;

function is_hex_digit(ch) {
  return _is_hex_digit[ch];
}

exports.is_hex_digit = is_hex_digit;
var base64chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'];
var base64inv = {
  'A': 0,
  'B': 1,
  'C': 2,
  'D': 3,
  'E': 4,
  'F': 5,
  'G': 6,
  'H': 7,
  'I': 8,
  'J': 9,
  'K': 10,
  'L': 11,
  'M': 12,
  'N': 13,
  'O': 14,
  'P': 15,
  'Q': 16,
  'R': 17,
  'S': 18,
  'T': 19,
  'U': 20,
  'V': 21,
  'W': 22,
  'X': 23,
  'Y': 24,
  'Z': 25,
  'a': 26,
  'b': 27,
  'c': 28,
  'd': 29,
  'e': 30,
  'f': 31,
  'g': 32,
  'h': 33,
  'i': 34,
  'j': 35,
  'k': 36,
  'l': 37,
  'm': 38,
  'n': 39,
  'o': 40,
  'p': 41,
  'q': 42,
  'r': 43,
  's': 44,
  't': 45,
  'u': 46,
  'v': 47,
  'w': 48,
  'x': 49,
  'y': 50,
  'z': 51,
  '0': 52,
  '1': 53,
  '2': 54,
  '3': 55,
  '4': 56,
  '5': 57,
  '6': 58,
  '7': 59,
  '8': 60,
  '9': 61,
  '+': 62,
  '/': 63
};

function fromBase64(str) {
  var pad = 0;

  for (var i = str.length - 1; str.charAt(i) == '='; i--) {
    pad++;
  }

  var buf = new Uint8Array(str.length * 3 / 4 - pad);

  for (var _i = 0; _i < str.length - pad; _i += 4) {
    var c0 = base64inv[str.charAt(_i)],
        c1 = base64inv[str.charAt(_i + 1)],
        c2 = base64inv[str.charAt(_i + 2)],
        c3 = base64inv[str.charAt(_i + 3)];
    buf[_i * 3 / 4] = c0 << 2 & 255 | c1 >>> 4;

    if (_i + 2 < str.length - pad) {
      buf[_i * 3 / 4 + 1] = c1 << 4 & 255 | c2 >>> 2;

      if (_i + 3 < str.length - pad) {
        buf[_i * 3 / 4 + 2] = c2 << 6 & 255 | c3;
      }
    }
  }

  return buf;
}

exports.fromBase64 = fromBase64;

function toBase64(buf) {
  var str = new Array(Math.ceil(buf.length * 4 / 3));

  for (var i = 0; i < buf.length; i += 3) {
    var b0 = buf[i],
        b1 = buf[i + 1],
        b2 = buf[i + 2],
        b3 = buf[i + 3];
    str[i * 4 / 3] = base64chars[b0 >>> 2];
    str[i * 4 / 3 + 1] = base64chars[b0 << 4 & 63 | (b1 || 0) >>> 4];

    if (i + 1 < buf.length) {
      str[i * 4 / 3 + 2] = base64chars[b1 << 2 & 63 | (b2 || 0) >>> 6];

      if (i + 2 < buf.length) {
        str[i * 4 / 3 + 3] = base64chars[b2 & 63];
      } else {
        return str.join('') + '=';
      }
    } else {
      return str.join('') + '==';
    }
  }

  return str.join('');
}

exports.toBase64 = toBase64;
var CharCodes;

(function (CharCodes) {
  CharCodes[CharCodes["NULL"] = 0] = "NULL";
  CharCodes[CharCodes["BELL"] = 7] = "BELL";
  CharCodes[CharCodes["BACKSPACE"] = 8] = "BACKSPACE";
  CharCodes[CharCodes["HORIZONTAL_TAB"] = 9] = "HORIZONTAL_TAB";
  CharCodes[CharCodes["LINE_FEED"] = 10] = "LINE_FEED";
  CharCodes[CharCodes["VERTICAL_TAB"] = 11] = "VERTICAL_TAB";
  CharCodes[CharCodes["FORM_FEED"] = 12] = "FORM_FEED";
  CharCodes[CharCodes["CARRIAGE_RETURN"] = 13] = "CARRIAGE_RETURN";
  CharCodes[CharCodes["DOUBLE_QUOTE"] = 34] = "DOUBLE_QUOTE";
  CharCodes[CharCodes["SINGLE_QUOTE"] = 39] = "SINGLE_QUOTE";
  CharCodes[CharCodes["FORWARD_SLASH"] = 47] = "FORWARD_SLASH";
  CharCodes[CharCodes["QUESTION_MARK"] = 63] = "QUESTION_MARK";
  CharCodes[CharCodes["BACKSLASH"] = 92] = "BACKSLASH";
  CharCodes[CharCodes["LEFT_PARENTHESIS"] = 40] = "LEFT_PARENTHESIS";
  CharCodes[CharCodes["RIGHT_PARENTHESIS"] = 41] = "RIGHT_PARENTHESIS";
  CharCodes[CharCodes["LEFT_BRACE"] = 123] = "LEFT_BRACE";
  CharCodes[CharCodes["RIGHT_BRACE"] = 125] = "RIGHT_BRACE";
  CharCodes[CharCodes["LEFT_BRACKET"] = 91] = "LEFT_BRACKET";
  CharCodes[CharCodes["RIGHT_BRACKET"] = 93] = "RIGHT_BRACKET";
  CharCodes[CharCodes["COMMA"] = 44] = "COMMA";
  CharCodes[CharCodes["SPACE"] = 32] = "SPACE";
  CharCodes[CharCodes["LOWERCASE_X"] = 120] = "LOWERCASE_X";
  CharCodes[CharCodes["COLON"] = 58] = "COLON";
})(CharCodes = exports.CharCodes || (exports.CharCodes = {}));

function backslashEscape(s) {
  return [CharCodes.BACKSLASH, s.charCodeAt(0)];
}

function toCharCodes(s) {
  var charCodes = new Array(s.length);

  for (var i = 0; i < s.length; i++) {
    charCodes[i] = s.charCodeAt(i);
  }

  return charCodes;
}

var _HEX_ESCAPE_PREFIX = [CharCodes.BACKSLASH, CharCodes.LOWERCASE_X];

function hexEscape(codePoint) {
  var hexEscape = codePoint.toString(16);

  while (hexEscape.length < 2) {
    hexEscape = "0" + hexEscape;
  }

  return _HEX_ESCAPE_PREFIX.concat(toCharCodes(hexEscape));
}

function populateWithHexEscapes(escapes, start, end) {
  if (end === undefined) {
    escapes[start] = hexEscape(start);
  } else {
    for (var i = start; i < end; i++) {
      escapes[i] = hexEscape(i);
    }
  }
}

var CommonEscapes = {};
CommonEscapes[CharCodes.NULL] = backslashEscape('0');
populateWithHexEscapes(CommonEscapes, 1, 7);
CommonEscapes[CharCodes.BELL] = backslashEscape('a');
CommonEscapes[CharCodes.BACKSPACE] = backslashEscape('b');
CommonEscapes[CharCodes.HORIZONTAL_TAB] = backslashEscape('t');
CommonEscapes[CharCodes.LINE_FEED] = backslashEscape('n');
CommonEscapes[CharCodes.VERTICAL_TAB] = backslashEscape('v');
CommonEscapes[CharCodes.FORM_FEED] = backslashEscape('f');
CommonEscapes[CharCodes.CARRIAGE_RETURN] = backslashEscape('r');
populateWithHexEscapes(CommonEscapes, 14, 32);
CommonEscapes[CharCodes.BACKSLASH] = backslashEscape('\\');
populateWithHexEscapes(CommonEscapes, 0x7f, 0xa0);
exports.ClobEscapes = (0, _extends2["default"])({}, CommonEscapes);
exports.ClobEscapes[CharCodes.DOUBLE_QUOTE] = backslashEscape('"');
exports.ClobEscapes[CharCodes.SINGLE_QUOTE] = backslashEscape("'");
exports.ClobEscapes[CharCodes.FORWARD_SLASH] = backslashEscape("/");
exports.ClobEscapes[CharCodes.QUESTION_MARK] = backslashEscape("?");
exports.StringEscapes = (0, _extends2["default"])({}, CommonEscapes);
exports.StringEscapes[CharCodes.DOUBLE_QUOTE] = backslashEscape('"');
exports.SymbolEscapes = (0, _extends2["default"])({}, CommonEscapes);
exports.SymbolEscapes[CharCodes.SINGLE_QUOTE] = backslashEscape("'");

function isIdentifier(s) {
  if (is_digit(s.charCodeAt(0))) {
    return false;
  }

  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i);
    var b = isIdentifierArray[c];

    if (!b) {
      return false;
    }
  }

  return true;
}

exports.isIdentifier = isIdentifier;

function isOperator(s) {
  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i);
    var b = _is_operator_char[c];

    if (!b) {
      return false;
    }
  }

  return true;
}

exports.isOperator = isOperator;

function isDigit(charCode) {
  return charCode < 58 && charCode > 47;
}

exports.isDigit = isDigit;

function escape(input, escapes) {
  var escapedString = '';
  var escapeSeq = '';
  var charCode;
  var escape;
  var lastIndex = 0;

  for (var i = 0; i < input.length; i++) {
    charCode = input.charCodeAt(i);
    escape = escapes[charCode];

    if (escape !== undefined) {
      for (var j = 0; j < escape.length; j++) {
        escapeSeq += String.fromCharCode(escape[j]);
      }

      escapedString += input.slice(lastIndex, i) + escapeSeq;
      lastIndex = i + 1;
      escapeSeq = '';
    }
  }

  return escapedString + input.slice(lastIndex, input.length);
}

exports.escape = escape;

},{"@babel/runtime/helpers/extends":38,"@babel/runtime/helpers/interopRequireDefault":42}],22:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IonCatalog_1 = require("./IonCatalog");

var IonDecimal_1 = require("./IonDecimal");

var IonLocalSymbolTable_1 = require("./IonLocalSymbolTable");

var IonParserTextRaw_1 = require("./IonParserTextRaw");

var IonSymbols_1 = require("./IonSymbols");

var IonType_1 = require("./IonType");

var IonTypes_1 = require("./IonTypes");

var IonTimestamp_1 = require("./IonTimestamp");

var IonText_1 = require("./IonText");

var JsbiSupport_1 = require("./JsbiSupport");

var IntSize_1 = __importDefault(require("./IntSize"));

var RAW_STRING = new IonType_1.IonType(-1, "raw_input", true, false, false, false);
var BEGINNING_OF_CONTAINER = -2;
var EOF = -1;
var T_IDENTIFIER = 9;
var T_STRING1 = 11;
var T_CLOB2 = 14;
var T_CLOB3 = 15;
var T_STRUCT = 19;

var TextReader =
/*#__PURE__*/
function () {
  function TextReader(source, catalog) {
    (0, _classCallCheck2["default"])(this, TextReader);

    if (!source) {
      throw new Error("a source Span is required to make a reader");
    }

    this._parser = new IonParserTextRaw_1.ParserTextRaw(source);
    this._depth = 0;
    this._cat = catalog ? catalog : new IonCatalog_1.Catalog();
    this._symtab = IonLocalSymbolTable_1.defaultLocalSymbolTable();
    this._type = null;
    this._raw_type = undefined;
    this._raw = undefined;
  }

  (0, _createClass2["default"])(TextReader, [{
    key: "load_raw",
    value: function load_raw() {
      var t = this;
      if (t._raw !== undefined) return;

      if (t._raw_type === T_CLOB2 || t._raw_type === T_CLOB3) {
        t._raw = t._parser.get_value_as_uint8array(t._raw_type);
      } else {
        t._raw = t._parser.get_value_as_string(t._raw_type);
      }
    }
  }, {
    key: "skip_past_container",
    value: function skip_past_container() {
      var type;
      var d = this.depth();
      this.stepIn();

      while (this.depth() > d) {
        type = this.next();

        if (type === null) {
          this.stepOut();
        } else if (type.isContainer && !this.isNull()) {
          this.stepIn();
        }
      }
    }
  }, {
    key: "isIVM",
    value: function isIVM(input, depth, annotations) {
      if (depth > 0) return false;
      var ivm = "$ion_1_0";
      var prefix = "$ion_";
      if (input.length < ivm.length || annotations.length > 0) return false;
      var i = 0;

      while (i < prefix.length) {
        if (prefix.charAt(i) !== input.charAt(i)) return false;
        i++;
      }

      while (i < input.length && input.charAt(i) != '_') {
        var ch = input.charAt(i);
        if (ch < '0' || ch > '9') return false;
        i++;
      }

      i++;

      while (i < input.length) {
        var _ch = input.charAt(i);

        if (_ch < '0' || _ch > '9') return false;
        i++;
      }

      if (input !== ivm) throw new Error("Only Ion version 1.0 is supported.");
      return true;
    }
  }, {
    key: "isLikeIVM",
    value: function isLikeIVM() {
      return false;
    }
  }, {
    key: "next",
    value: function next() {
      this._raw = undefined;
      if (this._raw_type === EOF) return null;
      var should_skip = this._raw_type !== BEGINNING_OF_CONTAINER && !this.isNull() && this._type && this._type.isContainer;
      if (should_skip) this.skip_past_container();
      var p = this._parser;

      for (;;) {
        this._raw_type = p.next();

        if (this._raw_type === T_IDENTIFIER) {
          if (this._depth > 0) break;
          this.load_raw();
          if (!this.isIVM(this._raw, this.depth(), this.annotations())) break;
          this._symtab = IonLocalSymbolTable_1.defaultLocalSymbolTable();
          this._raw = undefined;
          this._raw_type = undefined;
        } else if (this._raw_type === T_STRING1) {
          if (this._depth > 0) break;
          this.load_raw();
          if (this._raw !== "$ion_1_0") break;
          this._raw = undefined;
          this._raw_type = undefined;
        } else if (this._raw_type === T_STRUCT) {
          if (p.annotations().length !== 1) break;
          if (p.annotations()[0] != IonSymbols_1.ion_symbol_table) break;
          this._type = IonParserTextRaw_1.get_ion_type(this._raw_type);
          this._symtab = IonSymbols_1.makeSymbolTable(this._cat, this);
          this._raw = undefined;
          this._raw_type = undefined;
        } else {
          break;
        }
      }

      this._type = IonParserTextRaw_1.get_ion_type(this._raw_type);
      return this._type;
    }
  }, {
    key: "stepIn",
    value: function stepIn() {
      if (!this._type.isContainer) {
        throw new Error("can't step in to a scalar value");
      }

      if (this.isNull()) {
        throw new Error("Can't step into a null container");
      }

      this._parser.clearFieldName();

      this._type = null;
      this._raw_type = BEGINNING_OF_CONTAINER;
      this._depth++;
    }
  }, {
    key: "stepOut",
    value: function stepOut() {
      this._parser.clearFieldName();

      while (this._raw_type != EOF) {
        this.next();
      }

      this._raw_type = undefined;
      this._depth--;
    }
  }, {
    key: "type",
    value: function type() {
      return this._type;
    }
  }, {
    key: "depth",
    value: function depth() {
      return this._depth;
    }
  }, {
    key: "fieldName",
    value: function fieldName() {
      var str = this._parser.fieldName();

      var raw_type = this._parser.fieldNameType();

      if (raw_type === T_IDENTIFIER && str.length > 1 && str.charAt(0) === '$'.charAt(0)) {
        var tempStr = str.substr(1, str.length);

        if (+tempStr === +tempStr) {
          var symbol = this._symtab.getSymbolText(Number(tempStr));

          if (symbol === undefined) throw new Error("Unresolveable symbol ID, symboltokens unsupported.");
          return symbol;
        }
      }

      return str;
    }
  }, {
    key: "annotations",
    value: function annotations() {
      return this._parser.annotations();
    }
  }, {
    key: "isNull",
    value: function isNull() {
      if (this._type === IonTypes_1.IonTypes.NULL) return true;
      return this._parser.isNull();
    }
  }, {
    key: "_stringRepresentation",
    value: function _stringRepresentation() {
      this.load_raw();
      if (this.isNull()) return this._type === IonTypes_1.IonTypes.NULL ? "null" : "null." + this._type.name;

      if (this._type.isScalar) {
        switch (this._type) {
          case IonTypes_1.IonTypes.BLOB:
            return this._raw;

          case IonTypes_1.IonTypes.SYMBOL:
            if (this._raw_type === T_IDENTIFIER && this._raw.length > 1 && this._raw.charAt(0) === '$'.charAt(0)) {
              var tempStr = this._raw.substr(1, this._raw.length);

              if (+tempStr === +tempStr) {
                var symbol = this._symtab.getSymbolText(Number(tempStr));

                if (symbol === undefined) throw new Error("Unresolvable symbol ID, symboltokens unsupported.");
                return symbol;
              }
            }

            return this._raw;

          default:
            return this._raw;
        }
      } else {
        throw new Error("Cannot create string representation of non-scalar values.");
      }
    }
  }, {
    key: "booleanValue",
    value: function booleanValue() {
      switch (this._type) {
        case IonTypes_1.IonTypes.NULL:
          return null;

        case IonTypes_1.IonTypes.BOOL:
          return this._parser.booleanValue();
      }

      throw new Error('Current value is not a Boolean.');
    }
  }, {
    key: "byteValue",
    value: function byteValue() {
      this.load_raw();

      switch (this._type) {
        case IonTypes_1.IonTypes.NULL:
          return null;

        case IonTypes_1.IonTypes.BLOB:
          if (this.isNull()) {
            return null;
          }

          return IonText_1.fromBase64(this._raw);

        case IonTypes_1.IonTypes.CLOB:
          if (this.isNull()) {
            return null;
          }

          return this._raw;
      }

      throw new Error('Current value is not a blob or clob.');
    }
  }, {
    key: "decimalValue",
    value: function decimalValue() {
      switch (this._type) {
        case IonTypes_1.IonTypes.NULL:
          return null;

        case IonTypes_1.IonTypes.DECIMAL:
          return IonDecimal_1.Decimal.parse(this._stringRepresentation());
      }

      throw new Error('Current value is not a decimal.');
    }
  }, {
    key: "bigIntValue",
    value: function bigIntValue() {
      switch (this._type) {
        case IonTypes_1.IonTypes.NULL:
          return null;

        case IonTypes_1.IonTypes.INT:
          return this._parser.bigIntValue();
      }

      throw new Error('bigIntValue() was called when the current value was a(n) ' + this._type.name);
    }
  }, {
    key: "intSize",
    value: function intSize() {
      if (JsbiSupport_1.JsbiSupport.isSafeInteger(this.bigIntValue())) {
        return IntSize_1["default"].Number;
      }

      return IntSize_1["default"].BigInt;
    }
  }, {
    key: "numberValue",
    value: function numberValue() {
      switch (this._type) {
        case IonTypes_1.IonTypes.NULL:
          return null;

        case IonTypes_1.IonTypes.FLOAT:
        case IonTypes_1.IonTypes.INT:
          return this._parser.numberValue();
      }

      throw new Error('Current value is not a float or int.');
    }
  }, {
    key: "stringValue",
    value: function stringValue() {
      this.load_raw();

      switch (this._type) {
        case IonTypes_1.IonTypes.NULL:
          return null;

        case IonTypes_1.IonTypes.STRING:
          if (this._parser.isNull()) {
            return null;
          }

          return this._raw;

        case IonTypes_1.IonTypes.SYMBOL:
          if (this._parser.isNull()) {
            return null;
          }

          if (this._raw_type === T_IDENTIFIER && this._raw.length > 1 && this._raw.charAt(0) === '$'.charAt(0)) {
            var tempStr = this._raw.substr(1, this._raw.length);

            if (+tempStr === +tempStr) {
              var symbolId = Number(tempStr);

              var symbol = this._symtab.getSymbolText(symbolId);

              if (symbol === undefined) throw new Error("Unresolvable symbol ID, symboltokens unsupported.");
              return symbol;
            }
          }

          return this._raw;
      }

      throw new Error('Current value is not a string or symbol.');
    }
  }, {
    key: "timestampValue",
    value: function timestampValue() {
      switch (this._type) {
        case IonTypes_1.IonTypes.NULL:
          return null;

        case IonTypes_1.IonTypes.TIMESTAMP:
          return IonTimestamp_1.Timestamp.parse(this._stringRepresentation());
      }

      throw new Error('Current value is not a timestamp.');
    }
  }, {
    key: "value",
    value: function value() {
      if (this._type && this._type.isContainer) {
        if (this.isNull()) {
          return null;
        }

        throw new Error('Unable to provide a value for ' + this._type.name + ' containers.');
      }

      switch (this._type) {
        case IonTypes_1.IonTypes.NULL:
          return null;

        case IonTypes_1.IonTypes.BLOB:
        case IonTypes_1.IonTypes.CLOB:
          return this.byteValue();

        case IonTypes_1.IonTypes.BOOL:
          return this.booleanValue();

        case IonTypes_1.IonTypes.DECIMAL:
          return this.decimalValue();

        case IonTypes_1.IonTypes.INT:
          return this.bigIntValue();

        case IonTypes_1.IonTypes.FLOAT:
          return this.numberValue();

        case IonTypes_1.IonTypes.STRING:
        case IonTypes_1.IonTypes.SYMBOL:
          return this.stringValue();

        case IonTypes_1.IonTypes.TIMESTAMP:
          return this.timestampValue();

        default:
          throw new Error('There is no current value.');
      }
    }
  }]);
  return TextReader;
}();

exports.TextReader = TextReader;

},{"./IntSize":2,"./IonCatalog":7,"./IonDecimal":9,"./IonLocalSymbolTable":11,"./IonParserTextRaw":14,"./IonSymbols":19,"./IonText":21,"./IonTimestamp":24,"./IonType":25,"./IonTypes":26,"./JsbiSupport":30,"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/interopRequireDefault":42}],23:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var AbstractWriter_1 = require("./AbstractWriter");

var IonUnicode_1 = require("./IonUnicode");

var IonText_1 = require("./IonText");

var IonTypes_1 = require("./IonTypes");

var util_1 = require("./util");

var JsbiSupport_1 = require("./JsbiSupport");

var State;

(function (State) {
  State[State["VALUE"] = 0] = "VALUE";
  State[State["STRUCT_FIELD"] = 1] = "STRUCT_FIELD";
})(State = exports.State || (exports.State = {}));

var Context = function Context(myType) {
  (0, _classCallCheck2["default"])(this, Context);
  this.state = myType === IonTypes_1.IonTypes.STRUCT ? State.STRUCT_FIELD : State.VALUE;
  this.clean = true;
  this.containerType = myType;
};

exports.Context = Context;

var TextWriter =
/*#__PURE__*/
function (_AbstractWriter_1$Abs) {
  (0, _inherits2["default"])(TextWriter, _AbstractWriter_1$Abs);

  function TextWriter(writeable) {
    var _this;

    (0, _classCallCheck2["default"])(this, TextWriter);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(TextWriter).call(this));
    _this.writeable = writeable;

    _this._floatSerializer = function (value) {
      TextWriter._serializeFloat((0, _assertThisInitialized2["default"])(_this), value);
    };

    _this.containerContext = [new Context(undefined)];
    return _this;
  }

  (0, _createClass2["default"])(TextWriter, [{
    key: "getBytes",
    value: function getBytes() {
      return this.writeable.getBytes();
    }
  }, {
    key: "writeBlob",
    value: function writeBlob(value) {
      var _this2 = this;

      this._serializeValue(IonTypes_1.IonTypes.BLOB, value, function (value) {
        _this2.writeable.writeBytes(IonUnicode_1.encodeUtf8('{{' + IonText_1.toBase64(value) + '}}'));
      });
    }
  }, {
    key: "writeBoolean",
    value: function writeBoolean(value) {
      var _this3 = this;

      this._serializeValue(IonTypes_1.IonTypes.BOOL, value, function (value) {
        _this3.writeUtf8(value ? "true" : "false");
      });
    }
  }, {
    key: "writeClob",
    value: function writeClob(value) {
      var _this4 = this;

      this._serializeValue(IonTypes_1.IonTypes.CLOB, value, function (value) {
        var hexStr;

        _this4.writeUtf8('{{"');

        for (var i = 0; i < value.length; i++) {
          var c = value[i];

          if (c > 127 && c < 256) {
            hexStr = "\\x" + c.toString(16);

            for (var j = 0; j < hexStr.length; j++) {
              _this4.writeable.writeByte(hexStr.charCodeAt(j));
            }
          } else {
            var _escape = IonText_1.ClobEscapes[c];

            if (_escape === undefined) {
              if (c < 32) {
                hexStr = "\\x" + c.toString(16);

                for (var _j = 0; _j < hexStr.length; _j++) {
                  _this4.writeable.writeByte(hexStr.charCodeAt(_j));
                }
              } else {
                _this4.writeable.writeByte(c);
              }
            } else {
              _this4.writeable.writeBytes(new Uint8Array(_escape));
            }
          }
        }

        _this4.writeUtf8('"}}');
      });
    }
  }, {
    key: "writeDecimal",
    value: function writeDecimal(value) {
      var _this5 = this;

      this._serializeValue(IonTypes_1.IonTypes.DECIMAL, value, function (value) {
        if (value === null) {
          _this5.writeUtf8("null.decimal");
        } else {
          var s = '';
          var coefficient = value.getCoefficient();

          if (JsbiSupport_1.JsbiSupport.isZero(coefficient) && value.isNegative()) {
            s += '-';
          }

          s += coefficient.toString() + 'd';
          var exponent = value.getExponent();

          if (exponent === 0 && util_1._sign(exponent) === -1) {
            s += '-';
          }

          s += exponent;

          _this5.writeUtf8(s);
        }
      });
    }
  }, {
    key: "writeFieldName",
    value: function writeFieldName(fieldName) {
      if (this.currentContainer.containerType !== IonTypes_1.IonTypes.STRUCT) {
        throw new Error("Cannot write field name outside of a struct");
      }

      if (this.currentContainer.state !== State.STRUCT_FIELD) {
        throw new Error("Expecting a struct value");
      }

      if (!this.currentContainer.clean) {
        this.writeable.writeByte(IonText_1.CharCodes.COMMA);
      }

      this.writeSymbolToken(fieldName);
      this.writeable.writeByte(IonText_1.CharCodes.COLON);
      this.currentContainer.state = State.VALUE;
    }
  }, {
    key: "writeFloat32",
    value: function writeFloat32(value) {
      this._writeFloat(value);
    }
  }, {
    key: "writeFloat64",
    value: function writeFloat64(value) {
      this._writeFloat(value);
    }
  }, {
    key: "writeInt",
    value: function writeInt(value) {
      var _this6 = this;

      this._serializeValue(IonTypes_1.IonTypes.INT, value, function (value) {
        _this6.writeUtf8(value.toString(10));
      });
    }
  }, {
    key: "writeNull",
    value: function writeNull(type) {
      if (type === null || type === undefined || type.binaryTypeId < 0 || type.binaryTypeId > 13) {
        throw new Error("Cannot write null for type ".concat(type));
      }

      this.handleSeparator();
      this.writeAnnotations();
      this.writeUtf8("null." + type.name);
      if (this.currentContainer.containerType === IonTypes_1.IonTypes.STRUCT) this.currentContainer.state = State.STRUCT_FIELD;
    }
  }, {
    key: "writeString",
    value: function writeString(value) {
      var _this7 = this;

      this._serializeValue(IonTypes_1.IonTypes.STRING, value, function (value) {
        _this7.writeable.writeBytes(IonUnicode_1.encodeUtf8('"' + IonText_1.escape(value, IonText_1.StringEscapes) + '"'));
      });
    }
  }, {
    key: "writeSymbol",
    value: function writeSymbol(value) {
      var _this8 = this;

      this._serializeValue(IonTypes_1.IonTypes.SYMBOL, value, function (value) {
        _this8.writeSymbolToken(value);
      });
    }
  }, {
    key: "writeTimestamp",
    value: function writeTimestamp(value) {
      var _this9 = this;

      this._serializeValue(IonTypes_1.IonTypes.TIMESTAMP, value, function (value) {
        _this9.writeUtf8(value.toString());
      });
    }
  }, {
    key: "stepIn",
    value: function stepIn(type) {
      if (this.currentContainer.state === State.STRUCT_FIELD) {
        throw new Error("Started writing a ".concat(this.currentContainer.containerType.name, " inside a struct without writing the field name first. Call writeFieldName(string) with the desired name before calling stepIn(").concat(this.currentContainer.containerType.name, ")."));
      }

      switch (type) {
        case IonTypes_1.IonTypes.LIST:
          this.writeContainer(type, IonText_1.CharCodes.LEFT_BRACKET);
          break;

        case IonTypes_1.IonTypes.SEXP:
          this.writeContainer(type, IonText_1.CharCodes.LEFT_PARENTHESIS);
          break;

        case IonTypes_1.IonTypes.STRUCT:
          if (this._annotations !== undefined && this._annotations[0] === '$ion_symbol_table' && this.depth() === 0) {
            throw new Error("Unable to alter symbol table context, it allows invalid ion to be written.");
          }

          this.writeContainer(type, IonText_1.CharCodes.LEFT_BRACE);
          break;

        default:
          throw new Error("Unrecognized container type");
      }
    }
  }, {
    key: "stepOut",
    value: function stepOut() {
      var currentContainer = this.containerContext.pop();

      if (!currentContainer || !currentContainer.containerType) {
        throw new Error("Can't step out when not in a container");
      } else if (currentContainer.containerType === IonTypes_1.IonTypes.STRUCT && currentContainer.state === State.VALUE) {
        throw new Error("Expecting a struct value");
      }

      switch (currentContainer.containerType) {
        case IonTypes_1.IonTypes.LIST:
          this.writeable.writeByte(IonText_1.CharCodes.RIGHT_BRACKET);
          break;

        case IonTypes_1.IonTypes.SEXP:
          this.writeable.writeByte(IonText_1.CharCodes.RIGHT_PARENTHESIS);
          break;

        case IonTypes_1.IonTypes.STRUCT:
          this.writeable.writeByte(IonText_1.CharCodes.RIGHT_BRACE);
          break;

        default:
          throw new Error("Unexpected container TypeCode");
      }
    }
  }, {
    key: "close",
    value: function close() {
      if (this.depth() > 0) {
        throw new Error("Writer has one or more open containers; call stepOut() for each container prior to close()");
      }
    }
  }, {
    key: "depth",
    value: function depth() {
      return this.containerContext.length - 1;
    }
  }, {
    key: "_serializeValue",
    value: function _serializeValue(type, value, serialize) {
      if (this.currentContainer.state === State.STRUCT_FIELD) throw new Error("Expecting a struct field");

      if (value === null || value === undefined) {
        this.writeNull(type);
        return;
      }

      this.handleSeparator();
      this.writeAnnotations();
      serialize(value);
      if (this.currentContainer.containerType === IonTypes_1.IonTypes.STRUCT) this.currentContainer.state = State.STRUCT_FIELD;
    }
  }, {
    key: "writeContainer",
    value: function writeContainer(type, openingCharacter) {
      if (this.currentContainer.containerType === IonTypes_1.IonTypes.STRUCT && this.currentContainer.state === State.VALUE) {
        this.currentContainer.state = State.STRUCT_FIELD;
      }

      this.handleSeparator();
      this.writeAnnotations();
      this.writeable.writeByte(openingCharacter);

      this._stepIn(type);
    }
  }, {
    key: "handleSeparator",
    value: function handleSeparator() {
      if (this.depth() === 0) {
        if (this.currentContainer.clean) {
          this.currentContainer.clean = false;
        } else {
          this.writeable.writeByte(IonText_1.CharCodes.LINE_FEED);
        }
      } else {
        if (this.currentContainer.clean) {
          this.currentContainer.clean = false;
        } else {
          switch (this.currentContainer.containerType) {
            case IonTypes_1.IonTypes.LIST:
              this.writeable.writeByte(IonText_1.CharCodes.COMMA);
              break;

            case IonTypes_1.IonTypes.SEXP:
              this.writeable.writeByte(IonText_1.CharCodes.SPACE);
              break;

            default:
          }
        }
      }
    }
  }, {
    key: "writeUtf8",
    value: function writeUtf8(s) {
      this.writeable.writeBytes(IonUnicode_1.encodeUtf8(s));
    }
  }, {
    key: "writeAnnotations",
    value: function writeAnnotations() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._annotations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var annotation = _step.value;
          this.writeSymbolToken(annotation);
          this.writeUtf8('::');
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this._clearAnnotations();
    }
  }, {
    key: "_stepIn",
    value: function _stepIn(container) {
      this.containerContext.push(new Context(container));
    }
  }, {
    key: "writeSymbolToken",
    value: function writeSymbolToken(s) {
      if (s.length === 0 || IonText_1.is_keyword(s) || this.isSid(s) || !IonText_1.isIdentifier(s) && !IonText_1.isOperator(s) || IonText_1.isOperator(s) && this.currentContainer.containerType != IonTypes_1.IonTypes.SEXP) {
        this.writeable.writeBytes(IonUnicode_1.encodeUtf8("'" + IonText_1.escape(s, IonText_1.SymbolEscapes) + "'"));
      } else {
        this.writeUtf8(s);
      }
    }
  }, {
    key: "_writeFloat",
    value: function _writeFloat(value) {
      this._serializeValue(IonTypes_1.IonTypes.FLOAT, value, this._floatSerializer);
    }
  }, {
    key: "isSid",
    value: function isSid(s) {
      if (s.length > 1 && s.charAt(0) === '$'.charAt(0)) {
        var t = s.substr(1, s.length);
        return +t === +t;
      }

      return false;
    }
  }, {
    key: "isTopLevel",
    get: function get() {
      return this.depth() === 0;
    }
  }, {
    key: "currentContainer",
    get: function get() {
      return this.containerContext[this.depth()];
    }
  }], [{
    key: "_serializeFloat",
    value: function _serializeFloat(writer, value) {
      var text;

      if (value === Number.POSITIVE_INFINITY) {
        text = "+inf";
      } else if (value === Number.NEGATIVE_INFINITY) {
        text = "-inf";
      } else if (Object.is(value, Number.NaN)) {
        text = "nan";
      } else if (Object.is(value, -0)) {
        text = "-0e0";
      } else {
        text = value.toExponential();
        var plusSignIndex = text.lastIndexOf('+');

        if (plusSignIndex > -1) {
          text = text.slice(0, plusSignIndex) + text.slice(plusSignIndex + 1);
        }
      }

      writer.writeUtf8(text);
    }
  }]);
  return TextWriter;
}(AbstractWriter_1.AbstractWriter);

exports.TextWriter = TextWriter;

},{"./AbstractWriter":1,"./IonText":21,"./IonTypes":26,"./IonUnicode":27,"./JsbiSupport":30,"./util":32,"@babel/runtime/helpers/assertThisInitialized":34,"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/getPrototypeOf":40,"@babel/runtime/helpers/inherits":41,"@babel/runtime/helpers/interopRequireDefault":42,"@babel/runtime/helpers/possibleConstructorReturn":45}],24:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _TimestampParser$_tim;

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IonDecimal_1 = require("./IonDecimal");

var IonText_1 = require("./IonText");

var util_1 = require("./util");

var TimestampPrecision;

(function (TimestampPrecision) {
  TimestampPrecision[TimestampPrecision["YEAR"] = 1] = "YEAR";
  TimestampPrecision[TimestampPrecision["MONTH"] = 2] = "MONTH";
  TimestampPrecision[TimestampPrecision["DAY"] = 3] = "DAY";
  TimestampPrecision[TimestampPrecision["HOUR_AND_MINUTE"] = 4] = "HOUR_AND_MINUTE";
  TimestampPrecision[TimestampPrecision["SECONDS"] = 5] = "SECONDS";
})(TimestampPrecision = exports.TimestampPrecision || (exports.TimestampPrecision = {}));

var Timestamp =
/*#__PURE__*/
function () {
  function Timestamp(localOffset, year, month, day, hour, minutes, seconds) {
    (0, _classCallCheck2["default"])(this, Timestamp);
    this._localOffset = localOffset;
    this._year = year;
    this._precision = TimestampPrecision.YEAR;

    this._checkRequiredField('Offset', this._localOffset, Timestamp._MIN_OFFSET, Timestamp._MAX_OFFSET);

    this._checkRequiredField('Year', this._year, Timestamp._MIN_YEAR, Timestamp._MAX_YEAR);

    this._month = this._checkOptionalField('Month', month, Timestamp._MIN_MONTH, Timestamp._MAX_MONTH, 1, TimestampPrecision.MONTH);
    this._day = this._checkOptionalField('Day', day, Timestamp._MIN_DAY, Timestamp._MAX_DAY, 1, TimestampPrecision.DAY);
    this._hour = this._checkOptionalField('Hour', hour, Timestamp._MIN_HOUR, Timestamp._MAX_HOUR, 0, TimestampPrecision.HOUR_AND_MINUTE);
    this._minutes = this._checkOptionalField('Minutes', minutes, Timestamp._MIN_MINUTE, Timestamp._MAX_MINUTE, 0, TimestampPrecision.HOUR_AND_MINUTE);

    if (typeof seconds === 'number') {
      if (!Number.isInteger(seconds)) {
        throw new Error('The provided seconds number was not an integer (' + seconds + ')');
      }

      this._secondsDecimal = new IonDecimal_1.Decimal(seconds, 0);
    } else {
      this._secondsDecimal = seconds;
    }

    if (this._secondsDecimal === null || this._secondsDecimal === undefined) {
      this._secondsDecimal = IonDecimal_1.Decimal.ZERO;
    } else {
      this._checkFieldRange('Seconds', this._secondsDecimal, Timestamp._MIN_SECONDS, Timestamp._MAX_SECONDS);

      this._precision = TimestampPrecision.SECONDS;
    }

    if (this._precision <= TimestampPrecision.DAY) {
      this._localOffset = -0;
    }

    if (this._precision > TimestampPrecision.MONTH) {
      var tempDate = new Date(this._year, this._month, 0);
      tempDate.setUTCFullYear(this._year);

      if (this._day > tempDate.getDate()) {
        throw new Error("Month ".concat(this._month, " has less than ").concat(this._day, " days"));
      }

      if (this._month === 2 && this._day === 29) {
        if (!this._isLeapYear(this._year)) {
          throw new Error("Given February 29th but year ".concat(this._year, " is not a leap year"));
        }
      }
    }

    var utcYear = this.getDate().getUTCFullYear();

    this._checkFieldRange('Year', utcYear, Timestamp._MIN_YEAR, Timestamp._MAX_YEAR);
  }

  (0, _createClass2["default"])(Timestamp, [{
    key: "getLocalOffset",
    value: function getLocalOffset() {
      return this._localOffset;
    }
  }, {
    key: "getPrecision",
    value: function getPrecision() {
      return this._precision;
    }
  }, {
    key: "getDate",
    value: function getDate() {
      var ms = null;

      if (this._precision === TimestampPrecision.SECONDS) {
        ms = Math.round((this._secondsDecimal.numberValue() - this.getSecondsInt()) * 1000);
      }

      var msSinceEpoch = Date.UTC(this._year, this._precision === TimestampPrecision.YEAR ? 0 : this._month - 1, this._day, this._hour, this._minutes, this.getSecondsInt(), ms);
      msSinceEpoch = Timestamp._adjustMsSinceEpochIfNeeded(this._year, msSinceEpoch);
      var offsetShiftMs = this._localOffset * 60 * 1000;
      return new Date(msSinceEpoch - offsetShiftMs);
    }
  }, {
    key: "getSecondsInt",
    value: function getSecondsInt() {
      return this._secondsDecimal.intValue();
    }
  }, {
    key: "getSecondsDecimal",
    value: function getSecondsDecimal() {
      return this._secondsDecimal;
    }
  }, {
    key: "_getFractionalSeconds",
    value: function _getFractionalSeconds() {
      var _Timestamp$_splitSeco = Timestamp._splitSecondsDecimal(this._secondsDecimal),
          _Timestamp$_splitSeco2 = (0, _slicedToArray2["default"])(_Timestamp$_splitSeco, 2),
          _ = _Timestamp$_splitSeco2[0],
          fractionStr = _Timestamp$_splitSeco2[1];

      if (fractionStr === '') {
        return IonDecimal_1.Decimal.ZERO;
      }

      return IonDecimal_1.Decimal.parse(fractionStr + 'd-' + fractionStr.length);
    }
  }, {
    key: "equals",
    value: function equals(that) {
      return this.getPrecision() === that.getPrecision() && this.getLocalOffset() === that.getLocalOffset() && util_1._sign(this.getLocalOffset()) === util_1._sign(that.getLocalOffset()) && this.compareTo(that) === 0 && this._secondsDecimal.equals(that._secondsDecimal);
    }
  }, {
    key: "compareTo",
    value: function compareTo(that) {
      var thisMs = this.getDate().getTime();
      var thatMs = that.getDate().getTime();

      if (thisMs === thatMs) {
        return this.getSecondsDecimal().compareTo(that.getSecondsDecimal());
      }

      return thisMs < thatMs ? -1 : 1;
    }
  }, {
    key: "toString",
    value: function toString() {
      var strVal = "";

      switch (this._precision) {
        default:
          throw new Error("unrecognized timestamp precision " + this._precision);

        case TimestampPrecision.SECONDS:
          var _Timestamp$_splitSeco3 = Timestamp._splitSecondsDecimal(this._secondsDecimal),
              _Timestamp$_splitSeco4 = (0, _slicedToArray2["default"])(_Timestamp$_splitSeco3, 2),
              secondsStr = _Timestamp$_splitSeco4[0],
              fractionStr = _Timestamp$_splitSeco4[1];

          strVal = this._lpadZeros(secondsStr, 2);

          if (fractionStr.length > 0) {
            strVal += '.' + fractionStr;
          }

        case TimestampPrecision.HOUR_AND_MINUTE:
          strVal = this._lpadZeros(this._minutes, 2) + (strVal ? ":" + strVal : "");
          strVal = this._lpadZeros(this._hour, 2) + (strVal ? ":" + strVal : "");

        case TimestampPrecision.DAY:
          strVal = this._lpadZeros(this._day, 2) + (strVal ? "T" + strVal : "T");

        case TimestampPrecision.MONTH:
          strVal = this._lpadZeros(this._month, 2) + (strVal ? "-" + strVal : "");

        case TimestampPrecision.YEAR:
          if (this._precision === TimestampPrecision.YEAR) {
            strVal = this._lpadZeros(this._year, 4) + "T";
          } else if (this._precision === TimestampPrecision.MONTH) {
            strVal = this._lpadZeros(this._year, 4) + "-" + strVal + "T";
          } else {
            strVal = this._lpadZeros(this._year, 4) + "-" + strVal;
          }

      }

      var o = this._localOffset;

      if (this._precision > TimestampPrecision.DAY) {
        if (o === 0 && util_1._sign(o) === 1) {
          strVal = strVal + "Z";
        } else {
          strVal += (util_1._sign(o) === -1 ? '-' : '+') + this._lpadZeros(Math.floor(Math.abs(o) / 60), 2) + ':' + this._lpadZeros(Math.abs(o) % 60, 2);
        }
      }

      return strVal;
    }
  }, {
    key: "_checkRequiredField",
    value: function _checkRequiredField(fieldName, value, min, max) {
      if (!util_1._hasValue(value)) {
        throw new Error("".concat(fieldName, " cannot be ").concat(value));
      }

      this._checkFieldRange(fieldName, value, min, max);
    }
  }, {
    key: "_checkOptionalField",
    value: function _checkOptionalField(fieldName, value, min, max, defaultValue, precision) {
      if (!util_1._hasValue(value)) {
        return defaultValue;
      }

      this._checkFieldRange(fieldName, value, min, max);

      this._precision = precision;
      return value;
    }
  }, {
    key: "_checkFieldRange",
    value: function _checkFieldRange(fieldName, value, min, max) {
      if (value instanceof IonDecimal_1.Decimal) {
        if (util_1._hasValue(value) && (value.compareTo(min) < 0 || value.compareTo(max) >= 0)) {
          throw new Error("".concat(fieldName, " ").concat(value, " must be between ").concat(min, " inclusive, and ").concat(max, " exclusive"));
        }
      } else {
        if (!Number.isInteger(value)) {
          throw new Error("".concat(fieldName, " ").concat(value, " must be an integer"));
        }

        if (value < min || value > max) {
          throw new Error("".concat(fieldName, " ").concat(value, " must be between ").concat(min, " and ").concat(max, " inclusive"));
        }
      }
    }
  }, {
    key: "_isLeapYear",
    value: function _isLeapYear(year) {
      if (year % 4 !== 0) {
        return false;
      }

      if (year % 400 === 0) {
        return true;
      }

      if (year % 100 === 0) {
        return year < 1600;
      }

      return true;
    }
  }, {
    key: "_lpadZeros",
    value: function _lpadZeros(v, size) {
      var s = v.toString();

      if (s.length <= size) {
        return '0'.repeat(size - s.length) + s;
      }

      throw new Error("Unable to fit '" + s + "' into " + size + " characters");
    }
  }], [{
    key: "parse",
    value: function parse(str) {
      return _TimestampParser._parse(str);
    }
  }, {
    key: "_adjustMsSinceEpochIfNeeded",
    value: function _adjustMsSinceEpochIfNeeded(year, msSinceEpoch) {
      if (year >= 100) {
        return msSinceEpoch;
      }

      var date = new Date(msSinceEpoch);
      date.setUTCFullYear(year);
      return date.getTime();
    }
  }, {
    key: "_splitSecondsDecimal",
    value: function _splitSecondsDecimal(secondsDecimal) {
      var coefStr = secondsDecimal.getCoefficient().toString();
      var exp = secondsDecimal.getExponent();
      var secondsStr = '';
      var fractionStr = '';

      if (exp < 0) {
        var idx = Math.max(coefStr.length + exp, 0);
        secondsStr = coefStr.substr(0, idx);
        fractionStr = coefStr.substr(idx);

        if (-secondsDecimal.getExponent() - coefStr.length > 0) {
          fractionStr = '0'.repeat(-exp - coefStr.length) + fractionStr;
        }
      } else if (exp > 0) {
        secondsStr = coefStr + '0'.repeat(exp);
      } else {
        secondsStr = coefStr;
      }

      return [secondsStr, fractionStr];
    }
  }, {
    key: "_valueOf",
    value: function _valueOf(date, localOffset, fractionalSeconds, precision) {
      var msSinceEpoch = date.getTime() + localOffset * 60 * 1000;
      date = new Date(msSinceEpoch);
      var secondsDecimal;

      if (fractionalSeconds != null) {
        var _Timestamp$_splitSeco5 = Timestamp._splitSecondsDecimal(fractionalSeconds),
            _Timestamp$_splitSeco6 = (0, _slicedToArray2["default"])(_Timestamp$_splitSeco5, 2),
            _ = _Timestamp$_splitSeco6[0],
            fractionStr = _Timestamp$_splitSeco6[1];

        secondsDecimal = IonDecimal_1.Decimal.parse(date.getUTCSeconds() + '.' + fractionStr);
      } else {
        secondsDecimal = IonDecimal_1.Decimal.parse(date.getUTCSeconds() + '.' + date.getUTCMilliseconds());
      }

      switch (precision) {
        case TimestampPrecision.YEAR:
          return new Timestamp(localOffset, date.getUTCFullYear());

        case TimestampPrecision.MONTH:
          return new Timestamp(localOffset, date.getUTCFullYear(), date.getUTCMonth() + 1);

        case TimestampPrecision.DAY:
          return new Timestamp(localOffset, date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());

        case TimestampPrecision.HOUR_AND_MINUTE:
          return new Timestamp(localOffset, date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes());

        case TimestampPrecision.SECONDS:
        default:
          return new Timestamp(localOffset, date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), secondsDecimal);
      }
    }
  }]);
  return Timestamp;
}();

exports.Timestamp = Timestamp;
Timestamp._MIN_SECONDS = IonDecimal_1.Decimal.ZERO;
Timestamp._MAX_SECONDS = IonDecimal_1.Decimal.parse('60');
Timestamp._MIN_MINUTE = 0;
Timestamp._MAX_MINUTE = 59;
Timestamp._MIN_HOUR = 0;
Timestamp._MAX_HOUR = 23;
Timestamp._MIN_DAY = 1;
Timestamp._MAX_DAY = 31;
Timestamp._MIN_MONTH = 1;
Timestamp._MAX_MONTH = 12;
Timestamp._MIN_YEAR = 1;
Timestamp._MAX_YEAR = 9999;
Timestamp._MIN_OFFSET = -23 * 60 - 59;
Timestamp._MAX_OFFSET = 23 * 60 + 59;

var _States;

(function (_States) {
  _States[_States["YEAR"] = 0] = "YEAR";
  _States[_States["MONTH"] = 1] = "MONTH";
  _States[_States["DAY"] = 2] = "DAY";
  _States[_States["HOUR"] = 3] = "HOUR";
  _States[_States["MINUTE"] = 4] = "MINUTE";
  _States[_States["SECONDS"] = 5] = "SECONDS";
  _States[_States["FRACTIONAL_SECONDS"] = 6] = "FRACTIONAL_SECONDS";
  _States[_States["OFFSET_POSITIVE"] = 7] = "OFFSET_POSITIVE";
  _States[_States["OFFSET_NEGATIVE"] = 8] = "OFFSET_NEGATIVE";
  _States[_States["OFFSET_MINUTES"] = 9] = "OFFSET_MINUTES";
  _States[_States["OFFSET_ZULU"] = 10] = "OFFSET_ZULU";
  _States[_States["OFFSET_UNKNOWN"] = 11] = "OFFSET_UNKNOWN";
})(_States || (_States = {}));

var _TimeParserState = function _TimeParserState(f, len, t) {
  (0, _classCallCheck2["default"])(this, _TimeParserState);
  this.f = f;
  this.len = len;
  this.t = t;
};

var _TimestampParser =
/*#__PURE__*/
function () {
  function _TimestampParser() {
    (0, _classCallCheck2["default"])(this, _TimestampParser);
  }

  (0, _createClass2["default"])(_TimestampParser, null, [{
    key: "_parse",
    value: function _parse(str) {
      if (str.length < 1) {
        return null;
      }

      if (str.charCodeAt(0) === 110) {
        if (str === "null" || str === "null.timestamp") {
          return null;
        }

        throw new Error("Illegal timestamp: " + str);
      }

      var offsetSign;
      var offset;
      var year = 0;
      var month;
      var day;
      var hour;
      var minute;
      var secondsInt;
      var fractionStr = '';
      var pos = 0;
      var state = _TimestampParser._timeParserStates[_States.YEAR];
      var limit = str.length;
      var v;

      while (pos < limit) {
        if (state.len === undefined) {
          var digits = _TimestampParser._readUnknownDigits(str, pos);

          if (digits.length === 0) throw new Error("No digits found at pos: " + pos);
          v = parseInt(digits, 10);
          pos += digits.length;
        } else if (state.len > 0) {
          v = _TimestampParser._readDigits(str, pos, state.len);
          if (v < 0) throw new Error("Non digit value found at pos " + pos);
          pos = pos + state.len;
        }

        switch (state.f) {
          case _States.YEAR:
            year = v;
            break;

          case _States.MONTH:
            month = v;
            break;

          case _States.DAY:
            day = v;
            break;

          case _States.HOUR:
            hour = v;
            break;

          case _States.MINUTE:
            minute = v;
            break;

          case _States.SECONDS:
            secondsInt = v;
            break;

          case _States.FRACTIONAL_SECONDS:
            fractionStr = str.substring(20, pos);
            break;

          case _States.OFFSET_POSITIVE:
            offsetSign = 1;
            offset = v * 60;
            break;

          case _States.OFFSET_NEGATIVE:
            offsetSign = -1;
            offset = v * 60;
            break;

          case _States.OFFSET_MINUTES:
            offset += v;
            if (v >= 60) throw new Error("Minute offset " + String(v) + " above maximum or equal to : 60");
            break;

          case _States.OFFSET_ZULU:
            offsetSign = 1;
            offset = 0;
            break;

          case _States.OFFSET_UNKNOWN:
            offset = -0;
            break;

          default:
            throw new Error("invalid internal state");
        }

        if (pos >= limit) {
          break;
        }

        if (state.t !== undefined) {
          var c = String.fromCharCode(str.charCodeAt(pos));
          state = _TimestampParser._timeParserStates[state.t[c]];
          if (state === undefined) throw new Error("State was not set pos:" + pos);

          if (state.f === _States.OFFSET_ZULU) {
            offsetSign = 1;
            offset = 0;
          }
        }

        pos++;
      }

      if (offset === undefined) {
        if (minute !== undefined) {
          throw new Error('invalid timestamp, missing local offset: "' + str + '"');
        }

        offset = -0;
      } else {
        offset = offsetSign * offset;
      }

      var seconds;

      if (secondsInt !== undefined && secondsInt !== null || fractionStr) {
        seconds = IonDecimal_1.Decimal.parse(secondsInt + '.' + (fractionStr ? fractionStr : ''));
      }

      return new Timestamp(offset, year, month, day, hour, minute, seconds);
    }
  }, {
    key: "_readUnknownDigits",
    value: function _readUnknownDigits(str, pos) {
      var i = pos;

      for (; i < str.length; i++) {
        if (!IonText_1.isDigit(str.charCodeAt(i))) {
          break;
        }
      }

      return str.substring(pos, i);
    }
  }, {
    key: "_readDigits",
    value: function _readDigits(str, pos, len) {
      var v = 0;

      for (var i = pos; i < pos + len; i++) {
        var c = str.charCodeAt(i) - 48;

        if (c < 0 && c > 9) {
          return -1;
        }

        v = v * 10 + c;
      }

      return v;
    }
  }]);
  return _TimestampParser;
}();

_TimestampParser._timeParserStates = (_TimestampParser$_tim = {}, (0, _defineProperty2["default"])(_TimestampParser$_tim, _States.YEAR, new _TimeParserState(_States.YEAR, 4, {
  "T": _States.OFFSET_UNKNOWN,
  "-": _States.MONTH
})), (0, _defineProperty2["default"])(_TimestampParser$_tim, _States.MONTH, new _TimeParserState(_States.MONTH, 2, {
  "T": _States.OFFSET_UNKNOWN,
  "-": _States.DAY
})), (0, _defineProperty2["default"])(_TimestampParser$_tim, _States.DAY, new _TimeParserState(_States.DAY, 2, {
  "T": _States.HOUR
})), (0, _defineProperty2["default"])(_TimestampParser$_tim, _States.HOUR, new _TimeParserState(_States.HOUR, 2, {
  ":": _States.MINUTE
})), (0, _defineProperty2["default"])(_TimestampParser$_tim, _States.MINUTE, new _TimeParserState(_States.MINUTE, 2, {
  ":": _States.SECONDS,
  "+": _States.OFFSET_POSITIVE,
  "-": _States.OFFSET_NEGATIVE,
  "Z": _States.OFFSET_ZULU
})), (0, _defineProperty2["default"])(_TimestampParser$_tim, _States.SECONDS, new _TimeParserState(_States.SECONDS, 2, {
  ".": _States.FRACTIONAL_SECONDS,
  "+": _States.OFFSET_POSITIVE,
  "-": _States.OFFSET_NEGATIVE,
  "Z": _States.OFFSET_ZULU
})), (0, _defineProperty2["default"])(_TimestampParser$_tim, _States.FRACTIONAL_SECONDS, new _TimeParserState(_States.FRACTIONAL_SECONDS, undefined, {
  "+": _States.OFFSET_POSITIVE,
  "-": _States.OFFSET_NEGATIVE,
  "Z": _States.OFFSET_ZULU
})), (0, _defineProperty2["default"])(_TimestampParser$_tim, _States.OFFSET_POSITIVE, new _TimeParserState(_States.OFFSET_POSITIVE, 2, {
  ":": _States.OFFSET_MINUTES
})), (0, _defineProperty2["default"])(_TimestampParser$_tim, _States.OFFSET_NEGATIVE, new _TimeParserState(_States.OFFSET_NEGATIVE, 2, {
  ":": _States.OFFSET_MINUTES
})), (0, _defineProperty2["default"])(_TimestampParser$_tim, _States.OFFSET_MINUTES, new _TimeParserState(_States.OFFSET_MINUTES, 2, undefined)), (0, _defineProperty2["default"])(_TimestampParser$_tim, _States.OFFSET_ZULU, new _TimeParserState(_States.OFFSET_ZULU, 0, undefined)), (0, _defineProperty2["default"])(_TimestampParser$_tim, _States.OFFSET_UNKNOWN, new _TimeParserState(_States.OFFSET_UNKNOWN, 0, undefined)), _TimestampParser$_tim);

},{"./IonDecimal":9,"./IonText":21,"./util":32,"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/defineProperty":37,"@babel/runtime/helpers/interopRequireDefault":42,"@babel/runtime/helpers/slicedToArray":47}],25:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IonType = function IonType(binaryTypeId, name, isScalar, isLob, isNumeric, isContainer) {
  (0, _classCallCheck2["default"])(this, IonType);
  this.binaryTypeId = binaryTypeId;
  this.name = name;
  this.isScalar = isScalar;
  this.isLob = isLob;
  this.isNumeric = isNumeric;
  this.isContainer = isContainer;
};

exports.IonType = IonType;

},{"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/interopRequireDefault":42}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var IonType_1 = require("./IonType");

exports.IonTypes = {
  NULL: new IonType_1.IonType(0, "null", true, false, false, false),
  BOOL: new IonType_1.IonType(1, "bool", true, false, false, false),
  INT: new IonType_1.IonType(2, "int", true, false, true, false),
  FLOAT: new IonType_1.IonType(4, "float", true, false, true, false),
  DECIMAL: new IonType_1.IonType(5, "decimal", true, false, false, false),
  TIMESTAMP: new IonType_1.IonType(6, "timestamp", true, false, false, false),
  SYMBOL: new IonType_1.IonType(7, "symbol", true, false, false, false),
  STRING: new IonType_1.IonType(8, "string", true, false, false, false),
  CLOB: new IonType_1.IonType(9, "clob", true, true, false, false),
  BLOB: new IonType_1.IonType(10, "blob", true, true, false, false),
  LIST: new IonType_1.IonType(11, "list", false, false, false, true),
  SEXP: new IonType_1.IonType(12, "sexp", false, false, false, true),
  STRUCT: new IonType_1.IonType(13, "struct", false, false, false, true)
};

},{"./IonType":25}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function encodeUtf8(s) {
  var i = 0,
      bytes = new Uint8Array(s.length * 4),
      c;

  for (var ci = 0; ci < s.length; ci++) {
    c = s.charCodeAt(ci);

    if (c < 128) {
      bytes[i++] = c;
      continue;
    }

    if (c < 2048) {
      bytes[i++] = c >> 6 | 192;
    } else {
      if (c > 0xd7ff && c < 0xdc00) {
        if (++ci >= s.length) throw new Error('UTF-8 encode: incomplete surrogate pair');
        var c2 = s.charCodeAt(ci);
        if (c2 < 0xdc00 || c2 > 0xdfff) throw new Error('UTF-8 encode: second surrogate character 0x' + c2.toString(16) + ' at index ' + ci + ' out of range');
        c = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
        bytes[i++] = c >> 18 | 240;
        bytes[i++] = c >> 12 & 63 | 128;
      } else bytes[i++] = c >> 12 | 224;

      bytes[i++] = c >> 6 & 63 | 128;
    }

    bytes[i++] = c & 63 | 128;
  }

  return bytes.subarray(0, i);
}

exports.encodeUtf8 = encodeUtf8;

function decodeUtf8(bytes) {
  var i = 0,
      s = '',
      c;

  while (i < bytes.length) {
    c = bytes[i++];

    if (c > 127) {
      if (c > 191 && c < 224) {
        if (i >= bytes.length) throw new Error('UTF-8 decode: incomplete 2-byte sequence');
        c = (c & 31) << 6 | bytes[i++] & 63;
      } else if (c > 223 && c < 240) {
        if (i + 1 >= bytes.length) throw new Error('UTF-8 decode: incomplete 3-byte sequence');
        c = (c & 15) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
      } else if (c > 239 && c < 248) {
        if (i + 2 >= bytes.length) throw new Error('UTF-8 decode: incomplete 4-byte sequence');
        c = (c & 7) << 18 | (bytes[i++] & 63) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
      } else throw new Error('UTF-8 decode: unknown multibyte start 0x' + c.toString(16) + ' at index ' + (i - 1));
    }

    if (c <= 0xffff) s += String.fromCharCode(c);else if (c <= 0x10ffff) {
      c -= 0x10000;
      s += String.fromCharCode(c >> 10 | 0xd800);
      s += String.fromCharCode(c & 0x3FF | 0xdc00);
    } else throw new Error('UTF-8 decode: code point 0x' + c.toString(16) + ' exceeds UTF-16 reach');
  }

  return s;
}

exports.decodeUtf8 = decodeUtf8;

},{}],28:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Writeable =
/*#__PURE__*/
function () {
  function Writeable(bufferSize) {
    (0, _classCallCheck2["default"])(this, Writeable);
    this.bufferSize = bufferSize ? bufferSize : 4096;
    this.buffers = [new Uint8Array(this.bufferSize)];
    this.index = 0;
    this.clean = false;
  }

  (0, _createClass2["default"])(Writeable, [{
    key: "writeByte",
    value: function writeByte(_byte) {
      this.clean = false;
      this.currentBuffer[this.index] = _byte;
      this.index++;

      if (this.index === this.bufferSize) {
        this.buffers.push(new Uint8Array(this.bufferSize));
        this.index = 0;
      }
    }
  }, {
    key: "writeBytes",
    value: function writeBytes(buf, offset, length) {
      if (offset === undefined) offset = 0;
      var writeLength = length !== undefined ? Math.min(buf.length - offset, length) : buf.length - offset;

      if (writeLength < this.currentBuffer.length - this.index - 1) {
        this.currentBuffer.set(buf.subarray(offset, offset + writeLength), this.index);
        this.index += writeLength;
      } else {
        this.buffers[this.buffers.length - 1] = this.currentBuffer.slice(0, this.index);
        this.buffers.push(buf.subarray(offset, length));
        this.buffers.push(new Uint8Array(this.bufferSize));
        this.clean = false;
        this.index = 0;
      }
    }
  }, {
    key: "getBytes",
    value: function getBytes() {
      if (this.clean) return this.buffers[0];
      var buffer = new Uint8Array(this.totalSize);
      var tempLength = 0;

      for (var i = 0; i < this.buffers.length - 1; i++) {
        buffer.set(this.buffers[i], tempLength);
        tempLength += this.buffers[i].length;
      }

      buffer.set(this.currentBuffer.subarray(0, this.index), tempLength);
      this.buffers = [buffer, new Uint8Array(this.bufferSize)];
      this.index = 0;
      this.clean = true;
      return buffer;
    }
  }, {
    key: "currentBuffer",
    get: function get() {
      return this.buffers[this.buffers.length - 1];
    }
  }, {
    key: "totalSize",
    get: function get() {
      var size = 0;

      for (var i = 0; i < this.buffers.length - 1; i++) {
        size += this.buffers[i].length;
      }

      return size + this.index;
    }
  }]);
  return Writeable;
}();

exports.Writeable = Writeable;

},{"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/interopRequireDefault":42}],29:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var jsbi_1 = __importDefault(require("jsbi"));

var JsbiSupport_1 = require("./JsbiSupport");

var JsbiSerde =
/*#__PURE__*/
function () {
  function JsbiSerde() {
    (0, _classCallCheck2["default"])(this, JsbiSerde);
  }

  (0, _createClass2["default"])(JsbiSerde, null, [{
    key: "toSignedIntBytes",
    value: function toSignedIntBytes(value, isNegative) {
      var bytes = this.toUnsignedIntBytes(value);

      if (bytes[0] >= 128) {
        var extendedBytes = new Uint8Array(bytes.length + 1);
        extendedBytes.set(bytes, 1);
        bytes = extendedBytes;
      }

      if (isNegative) {
        bytes[0] += 0x80;
      }

      return bytes;
    }
  }, {
    key: "fromUnsignedBytes",
    value: function fromUnsignedBytes(bytes) {
      var magnitude = JsbiSupport_1.JsbiSupport.ZERO;

      for (var m = 0; m < bytes.length; m++) {
        var _byte = jsbi_1["default"].BigInt(bytes[m]);

        magnitude = jsbi_1["default"].leftShift(magnitude, this.BITS_PER_BYTE);
        magnitude = jsbi_1["default"].bitwiseOr(magnitude, _byte);
      }

      return magnitude;
    }
  }, {
    key: "toUnsignedIntBytes",
    value: function toUnsignedIntBytes(value) {
      if (JsbiSupport_1.JsbiSupport.isNegative(value)) {
        value = jsbi_1["default"].unaryMinus(value);
      }

      var sizeInBytes = this.getUnsignedIntSizeInBytes(value);
      var bytes = new Uint8Array(sizeInBytes);

      for (var m = sizeInBytes - 1; m >= 0; m--) {
        var lastByte = jsbi_1["default"].toNumber(jsbi_1["default"].bitwiseAnd(value, this.BYTE_MAX_VALUE));
        value = jsbi_1["default"].signedRightShift(value, this.BITS_PER_BYTE);
        bytes[m] = lastByte;
      }

      return bytes;
    }
  }, {
    key: "getUnsignedIntSizeInBytes",
    value: function getUnsignedIntSizeInBytes(value) {
      for (var m = 0; m < this.SIZE_THRESHOLDS.length; m++) {
        var _threshold = this.SIZE_THRESHOLDS[m];

        if (jsbi_1["default"].lessThanOrEqual(value, _threshold)) {
          return m + 1;
        }
      }

      var sizeInBytes = this.SIZE_THRESHOLDS.length;
      var threshold = this.calculateSizeThreshold(sizeInBytes);

      while (jsbi_1["default"].greaterThan(value, threshold)) {
        sizeInBytes++;
        threshold = this.calculateSizeThreshold(sizeInBytes);
      }

      return sizeInBytes;
    }
  }, {
    key: "calculateSizeThresholds",
    value: function calculateSizeThresholds() {
      var thresholds = [];

      for (var m = 1; m <= this.SERIALIZED_JSBI_SIZES_TO_PRECOMPUTE; m++) {
        thresholds.push(this.calculateSizeThreshold(m));
      }

      return thresholds;
    }
  }, {
    key: "calculateSizeThreshold",
    value: function calculateSizeThreshold(numberOfBytes) {
      var exponent = jsbi_1["default"].multiply(jsbi_1["default"].BigInt(numberOfBytes), this.BITS_PER_BYTE);
      var threshold = jsbi_1["default"].exponentiate(JsbiSupport_1.JsbiSupport.TWO, exponent);
      return jsbi_1["default"].subtract(threshold, JsbiSupport_1.JsbiSupport.ONE);
    }
  }]);
  return JsbiSerde;
}();

exports.JsbiSerde = JsbiSerde;
JsbiSerde.SERIALIZED_JSBI_SIZES_TO_PRECOMPUTE = 64;
JsbiSerde.BITS_PER_BYTE = jsbi_1["default"].BigInt(8);
JsbiSerde.BYTE_MAX_VALUE = jsbi_1["default"].BigInt(0xFF);
JsbiSerde.SIZE_THRESHOLDS = JsbiSerde.calculateSizeThresholds();

},{"./JsbiSupport":30,"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/interopRequireDefault":42,"jsbi":50}],30:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var jsbi_1 = __importDefault(require("jsbi"));

var JsbiSupport =
/*#__PURE__*/
function () {
  function JsbiSupport() {
    (0, _classCallCheck2["default"])(this, JsbiSupport);
  }

  (0, _createClass2["default"])(JsbiSupport, null, [{
    key: "isZero",
    value: function isZero(value) {
      return jsbi_1["default"].equal(value, JsbiSupport.ZERO);
    }
  }, {
    key: "isNegative",
    value: function isNegative(value) {
      return jsbi_1["default"].lessThan(value, JsbiSupport.ZERO);
    }
  }, {
    key: "bigIntFromString",
    value: function bigIntFromString(text) {
      var isNegative = false;
      var magnitudeText = text.trimLeft();

      if (text.startsWith('-')) {
        isNegative = true;
        magnitudeText = text.substring(1);
      }

      var bigInt = jsbi_1["default"].BigInt(magnitudeText);

      if (isNegative) {
        bigInt = jsbi_1["default"].unaryMinus(bigInt);
      }

      return bigInt;
    }
  }, {
    key: "clampToSafeIntegerRange",
    value: function clampToSafeIntegerRange(value) {
      if (jsbi_1["default"].greaterThan(value, this.NUMBER_MAX_SAFE_INTEGER)) {
        return Number.MAX_SAFE_INTEGER;
      }

      if (jsbi_1["default"].lessThan(value, this.NUMBER_MIN_SAFE_INTEGER)) {
        return Number.MIN_SAFE_INTEGER;
      }

      return jsbi_1["default"].toNumber(value);
    }
  }, {
    key: "isSafeInteger",
    value: function isSafeInteger(value) {
      return jsbi_1["default"].greaterThanOrEqual(value, this.NUMBER_MIN_SAFE_INTEGER) && jsbi_1["default"].lessThanOrEqual(value, this.NUMBER_MAX_SAFE_INTEGER);
    }
  }]);
  return JsbiSupport;
}();

exports.JsbiSupport = JsbiSupport;
JsbiSupport.ZERO = jsbi_1["default"].BigInt(0);
JsbiSupport.ONE = jsbi_1["default"].BigInt(1);
JsbiSupport.TWO = jsbi_1["default"].BigInt(2);
JsbiSupport.NUMBER_MAX_SAFE_INTEGER = jsbi_1["default"].BigInt(Number.MAX_SAFE_INTEGER);
JsbiSupport.NUMBER_MIN_SAFE_INTEGER = jsbi_1["default"].BigInt(Number.MIN_SAFE_INTEGER);

},{"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/interopRequireDefault":42,"jsbi":50}],31:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var jsbi_1 = __importDefault(require("jsbi"));

var JsbiSupport_1 = require("./JsbiSupport");

var SignAndMagnitudeInt =
/*#__PURE__*/
function () {
  function SignAndMagnitudeInt(_magnitude) {
    var _isNegative = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : JsbiSupport_1.JsbiSupport.isNegative(_magnitude);

    (0, _classCallCheck2["default"])(this, SignAndMagnitudeInt);
    this._magnitude = _magnitude;
    this._isNegative = _isNegative;
  }

  (0, _createClass2["default"])(SignAndMagnitudeInt, [{
    key: "equals",
    value: function equals(other) {
      return jsbi_1["default"].equal(this._magnitude, other._magnitude) && this._isNegative === other._isNegative;
    }
  }, {
    key: "magnitude",
    get: function get() {
      return this._magnitude;
    }
  }, {
    key: "isNegative",
    get: function get() {
      return this._isNegative;
    }
  }], [{
    key: "fromNumber",
    value: function fromNumber(value) {
      var isNegative = value < 0 || Object.is(value, -0);
      var absoluteValue = Math.abs(value);
      var magnitude = jsbi_1["default"].BigInt(absoluteValue);
      return new SignAndMagnitudeInt(magnitude, isNegative);
    }
  }]);
  return SignAndMagnitudeInt;
}();

exports["default"] = SignAndMagnitudeInt;

},{"./JsbiSupport":30,"@babel/runtime/helpers/classCallCheck":35,"@babel/runtime/helpers/createClass":36,"@babel/runtime/helpers/interopRequireDefault":42,"jsbi":50}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _sign(x) {
  return x < 0 || x === 0 && 1 / x === -Infinity ? -1 : 1;
}

exports._sign = _sign;

function _hasValue(v) {
  return v !== undefined && v !== null;
}

exports._hasValue = _hasValue;

},{}],33:[function(require,module,exports){
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
},{}],34:[function(require,module,exports){
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;
},{}],35:[function(require,module,exports){
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],36:[function(require,module,exports){
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
},{}],37:[function(require,module,exports){
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
},{}],38:[function(require,module,exports){
function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

module.exports = _extends;
},{}],39:[function(require,module,exports){
var superPropBase = require("./superPropBase");

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    module.exports = _get = Reflect.get;
  } else {
    module.exports = _get = function _get(target, property, receiver) {
      var base = superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

module.exports = _get;
},{"./superPropBase":48}],40:[function(require,module,exports){
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
},{}],41:[function(require,module,exports){
var setPrototypeOf = require("./setPrototypeOf");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;
},{"./setPrototypeOf":46}],42:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
},{}],43:[function(require,module,exports){
function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;
},{}],44:[function(require,module,exports){
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

module.exports = _nonIterableRest;
},{}],45:[function(require,module,exports){
var _typeof = require("../helpers/typeof");

var assertThisInitialized = require("./assertThisInitialized");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;
},{"../helpers/typeof":49,"./assertThisInitialized":34}],46:[function(require,module,exports){
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
},{}],47:[function(require,module,exports){
var arrayWithHoles = require("./arrayWithHoles");

var iterableToArrayLimit = require("./iterableToArrayLimit");

var nonIterableRest = require("./nonIterableRest");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
},{"./arrayWithHoles":33,"./iterableToArrayLimit":43,"./nonIterableRest":44}],48:[function(require,module,exports){
var getPrototypeOf = require("./getPrototypeOf");

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

module.exports = _superPropBase;
},{"./getPrototypeOf":40}],49:[function(require,module,exports){
function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
},{}],50:[function(require,module,exports){
(function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self,e.JSBI=t())})(this,function(){'use strict';function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){for(var _,n=0;n<t.length;n++)_=t[n],_.enumerable=_.enumerable||!1,_.configurable=!0,"value"in _&&(_.writable=!0),Object.defineProperty(e,_.key,_)}function _(e,t,_){return t&&i(e.prototype,t),_&&i(e,_),e}function n(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&l(e,t)}function g(e){return g=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},g(e)}function l(e,t){return l=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},l(e,t)}function o(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}function a(){return a=o()?Reflect.construct:function(e,t,i){var _=[null];_.push.apply(_,t);var n=Function.bind.apply(e,_),g=new n;return i&&l(g,i.prototype),g},a.apply(null,arguments)}function s(e){return-1!==Function.toString.call(e).indexOf("[native code]")}function u(e){var t="function"==typeof Map?new Map:void 0;return u=function(e){function i(){return a(e,arguments,g(this).constructor)}if(null===e||!s(e))return e;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if("undefined"!=typeof t){if(t.has(e))return t.get(e);t.set(e,i)}return i.prototype=Object.create(e.prototype,{constructor:{value:i,enumerable:!1,writable:!0,configurable:!0}}),l(i,e)},u(e)}function r(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function d(e,t){return t&&("object"==typeof t||"function"==typeof t)?t:r(e)}var h=function(i){var o=Math.abs,a=Math.max,s=Math.imul,u=Math.clz32;function l(e,i){var _;if(t(this,l),e>l.__kMaxLength)throw new RangeError("Maximum BigInt size exceeded");return _=d(this,g(l).call(this,e)),_.sign=i,_}return n(l,i),_(l,[{key:"toDebugString",value:function(){var e=["BigInt["],t=!0,i=!1,_=void 0;try{for(var n,g,l=this[Symbol.iterator]();!(t=(n=l.next()).done);t=!0)g=n.value,e.push((g?(g>>>0).toString(16):g)+", ")}catch(e){i=!0,_=e}finally{try{t||null==l.return||l.return()}finally{if(i)throw _}}return e.push("]"),e.join("")}},{key:"toString",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:10;if(2>e||36<e)throw new RangeError("toString() radix argument must be between 2 and 36");return 0===this.length?"0":0==(e&e-1)?l.__toStringBasePowerOfTwo(this,e):l.__toStringGeneric(this,e,!1)}},{key:"__copy",value:function(){for(var e=new l(this.length,this.sign),t=0;t<this.length;t++)e[t]=this[t];return e}},{key:"__trim",value:function(){for(var e=this.length,t=this[e-1];0===t;)e--,t=this[e-1],this.pop();return 0===e&&(this.sign=!1),this}},{key:"__initializeDigits",value:function(){for(var e=0;e<this.length;e++)this[e]=0}},{key:"__clzmsd",value:function(){return u(this[this.length-1])}},{key:"__inplaceMultiplyAdd",value:function(e,t,_){_>this.length&&(_=this.length);for(var n=65535&e,g=e>>>16,l=0,o=65535&t,a=t>>>16,u=0;u<_;u++){var r=this.__digit(u),d=65535&r,h=r>>>16,b=s(d,n),m=s(d,g),c=s(h,n),v=s(h,g),y=o+(65535&b),f=a+l+(y>>>16)+(b>>>16)+(65535&m)+(65535&c);o=(m>>>16)+(c>>>16)+(65535&v)+(f>>>16),l=o>>>16,o&=65535,a=v>>>16;this.__setDigit(u,65535&y|f<<16)}if(0!==l||0!==o||0!==a)throw new Error("implementation bug")}},{key:"__inplaceAdd",value:function(e,t,_){for(var n,g=0,l=0;l<_;l++)n=this.__halfDigit(t+l)+e.__halfDigit(l)+g,g=n>>>16,this.__setHalfDigit(t+l,n);return g}},{key:"__inplaceSub",value:function(e,t,_){var n=0;if(1&t){t>>=1;for(var g=this.__digit(t),l=65535&g,o=0;o<_-1>>>1;o++){var a=e.__digit(o),s=(g>>>16)-(65535&a)-n;n=1&s>>>16,this.__setDigit(t+o,s<<16|65535&l),g=this.__digit(t+o+1),l=(65535&g)-(a>>>16)-n,n=1&l>>>16}var u=e.__digit(o),r=(g>>>16)-(65535&u)-n;n=1&r>>>16,this.__setDigit(t+o,r<<16|65535&l);if(t+o+1>=this.length)throw new RangeError("out of bounds");0==(1&_)&&(g=this.__digit(t+o+1),l=(65535&g)-(u>>>16)-n,n=1&l>>>16,this.__setDigit(t+e.length,4294901760&g|65535&l))}else{t>>=1;for(var d=0;d<e.length-1;d++){var h=this.__digit(t+d),b=e.__digit(d),m=(65535&h)-(65535&b)-n;n=1&m>>>16;var c=(h>>>16)-(b>>>16)-n;n=1&c>>>16,this.__setDigit(t+d,c<<16|65535&m)}var v=this.__digit(t+d),y=e.__digit(d),f=(65535&v)-(65535&y)-n;n=1&f>>>16;var k=0;0==(1&_)&&(k=(v>>>16)-(y>>>16)-n,n=1&k>>>16),this.__setDigit(t+d,k<<16|65535&f)}return n}},{key:"__inplaceRightShift",value:function(e){if(0!==e){for(var t,_=this.__digit(0)>>>e,n=this.length-1,g=0;g<n;g++)t=this.__digit(g+1),this.__setDigit(g,t<<32-e|_),_=t>>>e;this.__setDigit(n,_)}}},{key:"__digit",value:function(e){return this[e]}},{key:"__unsignedDigit",value:function(e){return this[e]>>>0}},{key:"__setDigit",value:function(e,t){this[e]=0|t}},{key:"__setDigitGrow",value:function(e,t){this[e]=0|t}},{key:"__halfDigitLength",value:function(){var e=this.length;return 65535>=this.__unsignedDigit(e-1)?2*e-1:2*e}},{key:"__halfDigit",value:function(e){return 65535&this[e>>>1]>>>((1&e)<<4)}},{key:"__setHalfDigit",value:function(e,t){var i=e>>>1,_=this.__digit(i),n=1&e?65535&_|t<<16:4294901760&_|65535&t;this.__setDigit(i,n)}}],[{key:"BigInt",value:function(t){var i=Math.floor,_=Number.isFinite;if("number"==typeof t){if(0===t)return l.__zero();if((0|t)===t)return 0>t?l.__oneDigit(-t,!0):l.__oneDigit(t,!1);if(!_(t)||i(t)!==t)throw new RangeError("The number "+t+" cannot be converted to BigInt because it is not an integer");return l.__fromDouble(t)}if("string"==typeof t){var n=l.__fromString(t);if(null===n)throw new SyntaxError("Cannot convert "+t+" to a BigInt");return n}if("boolean"==typeof t)return!0===t?l.__oneDigit(1,!1):l.__zero();if("object"===e(t)){if(t.constructor===l)return t;var g=l.__toPrimitive(t);return l.BigInt(g)}throw new TypeError("Cannot convert "+t+" to a BigInt")}},{key:"toNumber",value:function(e){var t=e.length;if(0===t)return 0;if(1===t){var i=e.__unsignedDigit(0);return e.sign?-i:i}var _=e.__digit(t-1),n=u(_),g=32*t-n;if(1024<g)return e.sign?-Infinity:1/0;var o=g-1,a=_,s=t-1,r=n+1,d=32===r?0:a<<r;d>>>=12;var h=r-12,b=12<=r?0:a<<20+r,m=20+r;0<h&&0<s&&(s--,a=e.__digit(s),d|=a>>>32-h,b=a<<h,m=h),0<m&&0<s&&(s--,a=e.__digit(s),b|=a>>>32-m,m-=32);var c=l.__decideRounding(e,m,s,a);if((1===c||0===c&&1==(1&b))&&(b=b+1>>>0,0===b&&(d++,0!=d>>>20&&(d=0,o++,1023<o))))return e.sign?-Infinity:1/0;var v=e.sign?-2147483648:0;return o=o+1023<<20,l.__kBitConversionInts[1]=v|o|d,l.__kBitConversionInts[0]=b,l.__kBitConversionDouble[0]}},{key:"unaryMinus",value:function(e){if(0===e.length)return e;var t=e.__copy();return t.sign=!e.sign,t}},{key:"bitwiseNot",value:function(e){return e.sign?l.__absoluteSubOne(e).__trim():l.__absoluteAddOne(e,!0)}},{key:"exponentiate",value:function(e,t){if(t.sign)throw new RangeError("Exponent must be positive");if(0===t.length)return l.__oneDigit(1,!1);if(0===e.length)return e;if(1===e.length&&1===e.__digit(0))return e.sign&&0==(1&t.__digit(0))?l.unaryMinus(e):e;if(1<t.length)throw new RangeError("BigInt too big");var i=t.__unsignedDigit(0);if(1===i)return e;if(i>=l.__kMaxLengthBits)throw new RangeError("BigInt too big");if(1===e.length&&2===e.__digit(0)){var _=1+(i>>>5),n=e.sign&&0!=(1&i),g=new l(_,n);g.__initializeDigits();var o=1<<(31&i);return g.__setDigit(_-1,o),g}var a=null,s=e;for(0!=(1&i)&&(a=e),i>>=1;0!==i;i>>=1)s=l.multiply(s,s),0!=(1&i)&&(null===a?a=s:a=l.multiply(a,s));return a}},{key:"multiply",value:function(e,t){if(0===e.length)return e;if(0===t.length)return t;var _=e.length+t.length;32<=e.__clzmsd()+t.__clzmsd()&&_--;var n=new l(_,e.sign!==t.sign);n.__initializeDigits();for(var g=0;g<e.length;g++)l.__multiplyAccumulate(t,e.__digit(g),n,g);return n.__trim()}},{key:"divide",value:function(e,t){if(0===t.length)throw new RangeError("Division by zero");if(0>l.__absoluteCompare(e,t))return l.__zero();var i,_=e.sign!==t.sign,n=t.__unsignedDigit(0);if(1===t.length&&65535>=n){if(1===n)return _===e.sign?e:l.unaryMinus(e);i=l.__absoluteDivSmall(e,n,null)}else i=l.__absoluteDivLarge(e,t,!0,!1);return i.sign=_,i.__trim()}},{key:"remainder",value:function e(t,i){if(0===i.length)throw new RangeError("Division by zero");if(0>l.__absoluteCompare(t,i))return t;var _=i.__unsignedDigit(0);if(1===i.length&&65535>=_){if(1===_)return l.__zero();var n=l.__absoluteModSmall(t,_);return 0===n?l.__zero():l.__oneDigit(n,t.sign)}var e=l.__absoluteDivLarge(t,i,!1,!0);return e.sign=t.sign,e.__trim()}},{key:"add",value:function(e,t){var i=e.sign;return i===t.sign?l.__absoluteAdd(e,t,i):0<=l.__absoluteCompare(e,t)?l.__absoluteSub(e,t,i):l.__absoluteSub(t,e,!i)}},{key:"subtract",value:function(e,t){var i=e.sign;return i===t.sign?0<=l.__absoluteCompare(e,t)?l.__absoluteSub(e,t,i):l.__absoluteSub(t,e,!i):l.__absoluteAdd(e,t,i)}},{key:"leftShift",value:function(e,t){return 0===t.length||0===e.length?e:t.sign?l.__rightShiftByAbsolute(e,t):l.__leftShiftByAbsolute(e,t)}},{key:"signedRightShift",value:function(e,t){return 0===t.length||0===e.length?e:t.sign?l.__leftShiftByAbsolute(e,t):l.__rightShiftByAbsolute(e,t)}},{key:"unsignedRightShift",value:function(){throw new TypeError("BigInts have no unsigned right shift; use >> instead")}},{key:"lessThan",value:function(e,t){return 0>l.__compareToBigInt(e,t)}},{key:"lessThanOrEqual",value:function(e,t){return 0>=l.__compareToBigInt(e,t)}},{key:"greaterThan",value:function(e,t){return 0<l.__compareToBigInt(e,t)}},{key:"greaterThanOrEqual",value:function(e,t){return 0<=l.__compareToBigInt(e,t)}},{key:"equal",value:function(e,t){if(e.sign!==t.sign)return!1;if(e.length!==t.length)return!1;for(var _=0;_<e.length;_++)if(e.__digit(_)!==t.__digit(_))return!1;return!0}},{key:"notEqual",value:function(e,t){return!l.equal(e,t)}},{key:"bitwiseAnd",value:function(e,t){if(!e.sign&&!t.sign)return l.__absoluteAnd(e,t).__trim();if(e.sign&&t.sign){var i=a(e.length,t.length)+1,_=l.__absoluteSubOne(e,i),n=l.__absoluteSubOne(t);return _=l.__absoluteOr(_,n,_),l.__absoluteAddOne(_,!0,_).__trim()}if(e.sign){var g=[t,e];e=g[0],t=g[1]}return l.__absoluteAndNot(e,l.__absoluteSubOne(t)).__trim()}},{key:"bitwiseXor",value:function(e,t){if(!e.sign&&!t.sign)return l.__absoluteXor(e,t).__trim();if(e.sign&&t.sign){var i=a(e.length,t.length),_=l.__absoluteSubOne(e,i),n=l.__absoluteSubOne(t);return l.__absoluteXor(_,n,_).__trim()}var g=a(e.length,t.length)+1;if(e.sign){var o=[t,e];e=o[0],t=o[1]}var s=l.__absoluteSubOne(t,g);return s=l.__absoluteXor(s,e,s),l.__absoluteAddOne(s,!0,s).__trim()}},{key:"bitwiseOr",value:function(e,t){var i=a(e.length,t.length);if(!e.sign&&!t.sign)return l.__absoluteOr(e,t).__trim();if(e.sign&&t.sign){var _=l.__absoluteSubOne(e,i),n=l.__absoluteSubOne(t);return _=l.__absoluteAnd(_,n,_),l.__absoluteAddOne(_,!0,_).__trim()}if(e.sign){var g=[t,e];e=g[0],t=g[1]}var o=l.__absoluteSubOne(t,i);return o=l.__absoluteAndNot(o,e,o),l.__absoluteAddOne(o,!0,o).__trim()}},{key:"asIntN",value:function(e,t){if(0===t.length)return t;if(0===e)return l.__zero();if(e>=l.__kMaxLengthBits)return t;var _=e+31>>>5;if(t.length<_)return t;var n=t.__unsignedDigit(_-1),g=1<<(31&e-1);if(t.length===_&&n<g)return t;if(!((n&g)===g))return l.__truncateToNBits(e,t);if(!t.sign)return l.__truncateAndSubFromPowerOfTwo(e,t,!0);if(0==(n&g-1)){for(var o=_-2;0<=o;o--)if(0!==t.__digit(o))return l.__truncateAndSubFromPowerOfTwo(e,t,!1);return t.length===_&&n===g?t:l.__truncateToNBits(e,t)}return l.__truncateAndSubFromPowerOfTwo(e,t,!1)}},{key:"asUintN",value:function(e,t){if(0===t.length)return t;if(0===e)return l.__zero();if(t.sign){if(e>l.__kMaxLengthBits)throw new RangeError("BigInt too big");return l.__truncateAndSubFromPowerOfTwo(e,t,!1)}if(e>=l.__kMaxLengthBits)return t;var i=e+31>>>5;if(t.length<i)return t;var _=31&e;if(t.length==i){if(0==_)return t;var n=t.__digit(i-1);if(0==n>>>_)return t}return l.__truncateToNBits(e,t)}},{key:"ADD",value:function(e,t){if(e=l.__toPrimitive(e),t=l.__toPrimitive(t),"string"==typeof e)return"string"!=typeof t&&(t=t.toString()),e+t;if("string"==typeof t)return e.toString()+t;if(e=l.__toNumeric(e),t=l.__toNumeric(t),l.__isBigInt(e)&&l.__isBigInt(t))return l.add(e,t);if("number"==typeof e&&"number"==typeof t)return e+t;throw new TypeError("Cannot mix BigInt and other types, use explicit conversions")}},{key:"LT",value:function(e,t){return l.__compare(e,t,0)}},{key:"LE",value:function(e,t){return l.__compare(e,t,1)}},{key:"GT",value:function(e,t){return l.__compare(e,t,2)}},{key:"GE",value:function(e,t){return l.__compare(e,t,3)}},{key:"EQ",value:function(t,i){for(;;){if(l.__isBigInt(t))return l.__isBigInt(i)?l.equal(t,i):l.EQ(i,t);if("number"==typeof t){if(l.__isBigInt(i))return l.__equalToNumber(i,t);if("object"!==e(i))return t==i;i=l.__toPrimitive(i)}else if("string"==typeof t){if(l.__isBigInt(i))return t=l.__fromString(t),null!==t&&l.equal(t,i);if("object"!==e(i))return t==i;i=l.__toPrimitive(i)}else if("boolean"==typeof t){if(l.__isBigInt(i))return l.__equalToNumber(i,+t);if("object"!==e(i))return t==i;i=l.__toPrimitive(i)}else if("symbol"===e(t)){if(l.__isBigInt(i))return!1;if("object"!==e(i))return t==i;i=l.__toPrimitive(i)}else if("object"===e(t)){if("object"===e(i)&&i.constructor!==l)return t==i;t=l.__toPrimitive(t)}else return t==i}}},{key:"NE",value:function(e,t){return!l.EQ(e,t)}},{key:"__zero",value:function(){return new l(0,!1)}},{key:"__oneDigit",value:function(e,t){var i=new l(1,t);return i.__setDigit(0,e),i}},{key:"__decideRounding",value:function(e,t,i,_){if(0<t)return-1;var n;if(0>t)n=-t-1;else{if(0===i)return-1;i--,_=e.__digit(i),n=31}var g=1<<n;if(0==(_&g))return-1;if(g-=1,0!=(_&g))return 1;for(;0<i;)if(i--,0!==e.__digit(i))return 1;return 0}},{key:"__fromDouble",value:function(e){l.__kBitConversionDouble[0]=e;var t,i=2047&l.__kBitConversionInts[1]>>>20,_=i-1023,n=(_>>>5)+1,g=new l(n,0>e),o=1048575&l.__kBitConversionInts[1]|1048576,a=l.__kBitConversionInts[0],s=20,u=31&_,r=0;if(u<s){var d=s-u;r=d+32,t=o>>>d,o=o<<32-d|a>>>d,a<<=32-d}else if(u===s)r=32,t=o,o=a;else{var h=u-s;r=32-h,t=o<<h|a>>>32-h,o=a<<h}g.__setDigit(n-1,t);for(var b=n-2;0<=b;b--)0<r?(r-=32,t=o,o=a):t=0,g.__setDigit(b,t);return g.__trim()}},{key:"__isWhitespace",value:function(e){return!!(13>=e&&9<=e)||(159>=e?32==e:131071>=e?160==e||5760==e:196607>=e?(e&=131071,10>=e||40==e||41==e||47==e||95==e||4096==e):65279==e)}},{key:"__fromString",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,i=0,_=e.length,n=0;if(n===_)return l.__zero();for(var g=e.charCodeAt(n);l.__isWhitespace(g);){if(++n===_)return l.__zero();g=e.charCodeAt(n)}if(43===g){if(++n===_)return null;g=e.charCodeAt(n),i=1}else if(45===g){if(++n===_)return null;g=e.charCodeAt(n),i=-1}if(0===t){if(t=10,48===g){if(++n===_)return l.__zero();if(g=e.charCodeAt(n),88===g||120===g){if(t=16,++n===_)return null;g=e.charCodeAt(n)}else if(79===g||111===g){if(t=8,++n===_)return null;g=e.charCodeAt(n)}else if(66===g||98===g){if(t=2,++n===_)return null;g=e.charCodeAt(n)}}}else if(16===t&&48===g){if(++n===_)return l.__zero();if(g=e.charCodeAt(n),88===g||120===g){if(++n===_)return null;g=e.charCodeAt(n)}}for(;48===g;){if(++n===_)return l.__zero();g=e.charCodeAt(n)}var o=_-n,a=l.__kMaxBitsPerChar[t],s=l.__kBitsPerCharTableMultiplier-1;if(o>1073741824/a)return null;var u=a*o+s>>>l.__kBitsPerCharTableShift,r=new l(u+31>>>5,!1),h=10>t?t:10,b=10<t?t-10:0;if(0==(t&t-1)){a>>=l.__kBitsPerCharTableShift;var c=[],v=[],y=!1;do{for(var f,k=0,D=0;;){if(f=void 0,g-48>>>0<h)f=g-48;else if((32|g)-97>>>0<b)f=(32|g)-87;else{y=!0;break}if(D+=a,k=k<<a|f,++n===_){y=!0;break}if(g=e.charCodeAt(n),32<D+a)break}c.push(k),v.push(D)}while(!y);l.__fillFromParts(r,c,v)}else{r.__initializeDigits();var p=!1,B=0;do{for(var S,C=0,A=1;;){if(S=void 0,g-48>>>0<h)S=g-48;else if((32|g)-97>>>0<b)S=(32|g)-87;else{p=!0;break}var T=A*t;if(4294967295<T)break;if(A=T,C=C*t+S,B++,++n===_){p=!0;break}g=e.charCodeAt(n)}s=32*l.__kBitsPerCharTableMultiplier-1;var m=a*B+s>>>l.__kBitsPerCharTableShift+5;r.__inplaceMultiplyAdd(A,C,m)}while(!p)}for(;n!==_;){if(!l.__isWhitespace(g))return null;g=e.charCodeAt(n++)}return 0!==i&&10!==t?null:(r.sign=-1===i,r.__trim())}},{key:"__fillFromParts",value:function(e,t,_){for(var n=0,g=0,l=0,o=t.length-1;0<=o;o--){var a=t[o],s=_[o];g|=a<<l,l+=s,32===l?(e.__setDigit(n++,g),l=0,g=0):32<l&&(e.__setDigit(n++,g),l-=32,g=a>>>s-l)}if(0!==g){if(n>=e.length)throw new Error("implementation bug");e.__setDigit(n++,g)}for(;n<e.length;n++)e.__setDigit(n,0)}},{key:"__toStringBasePowerOfTwo",value:function(e,t){var _=e.length,n=t-1;n=(85&n>>>1)+(85&n),n=(51&n>>>2)+(51&n),n=(15&n>>>4)+(15&n);var g=n,o=t-1,a=e.__digit(_-1),s=u(a),r=0|(32*_-s+g-1)/g;if(e.sign&&r++,268435456<r)throw new Error("string too long");for(var d=Array(r),h=r-1,b=0,m=0,c=0;c<_-1;c++){var v=e.__digit(c),y=(b|v<<m)&o;d[h--]=l.__kConversionChars[y];var f=g-m;for(b=v>>>f,m=32-f;m>=g;)d[h--]=l.__kConversionChars[b&o],b>>>=g,m-=g}var k=(b|a<<m)&o;for(d[h--]=l.__kConversionChars[k],b=a>>>g-m;0!==b;)d[h--]=l.__kConversionChars[b&o],b>>>=g;if(e.sign&&(d[h--]="-"),-1!==h)throw new Error("implementation bug");return d.join("")}},{key:"__toStringGeneric",value:function(e,t,_){var n=e.length;if(0===n)return"";if(1===n){var g=e.__unsignedDigit(0).toString(t);return!1===_&&e.sign&&(g="-"+g),g}var o=32*n-u(e.__digit(n-1)),a=l.__kMaxBitsPerChar[t],s=a-1,r=o*l.__kBitsPerCharTableMultiplier;r+=s-1,r=0|r/s;var d,h,b=r+1>>1,m=l.exponentiate(l.__oneDigit(t,!1),l.__oneDigit(b,!1)),c=m.__unsignedDigit(0);if(1===m.length&&65535>=c){d=new l(e.length,!1),d.__initializeDigits();for(var v,y=0,f=2*e.length-1;0<=f;f--)v=y<<16|e.__halfDigit(f),d.__setHalfDigit(f,0|v/c),y=0|v%c;h=y.toString(t)}else{var k=l.__absoluteDivLarge(e,m,!0,!0);d=k.quotient;var D=k.remainder.__trim();h=l.__toStringGeneric(D,t,!0)}d.__trim();for(var p=l.__toStringGeneric(d,t,!0);h.length<b;)h="0"+h;return!1===_&&e.sign&&(p="-"+p),p+h}},{key:"__unequalSign",value:function(e){return e?-1:1}},{key:"__absoluteGreater",value:function(e){return e?-1:1}},{key:"__absoluteLess",value:function(e){return e?1:-1}},{key:"__compareToBigInt",value:function(e,t){var i=e.sign;if(i!==t.sign)return l.__unequalSign(i);var _=l.__absoluteCompare(e,t);return 0<_?l.__absoluteGreater(i):0>_?l.__absoluteLess(i):0}},{key:"__compareToNumber",value:function(e,t){if(!0|t){var i=e.sign,_=0>t;if(i!==_)return l.__unequalSign(i);if(0===e.length){if(_)throw new Error("implementation bug");return 0===t?0:-1}if(1<e.length)return l.__absoluteGreater(i);var n=o(t),g=e.__unsignedDigit(0);return g>n?l.__absoluteGreater(i):g<n?l.__absoluteLess(i):0}return l.__compareToDouble(e,t)}},{key:"__compareToDouble",value:function(e,t){if(t!==t)return t;if(t===1/0)return-1;if(t===-Infinity)return 1;var i=e.sign;if(i!==0>t)return l.__unequalSign(i);if(0===t)throw new Error("implementation bug: should be handled elsewhere");if(0===e.length)return-1;l.__kBitConversionDouble[0]=t;var _=2047&l.__kBitConversionInts[1]>>>20;if(2047==_)throw new Error("implementation bug: handled elsewhere");var n=_-1023;if(0>n)return l.__absoluteGreater(i);var g=e.length,o=e.__digit(g-1),a=u(o),s=32*g-a,r=n+1;if(s<r)return l.__absoluteLess(i);if(s>r)return l.__absoluteGreater(i);var d=1048576|1048575&l.__kBitConversionInts[1],h=l.__kBitConversionInts[0],b=20,m=31-a;if(m!==(s-1)%31)throw new Error("implementation bug");var c,v=0;if(m<b){var y=b-m;v=y+32,c=d>>>y,d=d<<32-y|h>>>y,h<<=32-y}else if(m===b)v=32,c=d,d=h;else{var f=m-b;v=32-f,c=d<<f|h>>>32-f,d=h<<f}if(o>>>=0,c>>>=0,o>c)return l.__absoluteGreater(i);if(o<c)return l.__absoluteLess(i);for(var k=g-2;0<=k;k--){0<v?(v-=32,c=d>>>0,d=h,h=0):c=0;var D=e.__unsignedDigit(k);if(D>c)return l.__absoluteGreater(i);if(D<c)return l.__absoluteLess(i)}if(0!==d||0!==h){if(0===v)throw new Error("implementation bug");return l.__absoluteLess(i)}return 0}},{key:"__equalToNumber",value:function(e,t){return t|0===t?0===t?0===e.length:1===e.length&&e.sign===0>t&&e.__unsignedDigit(0)===o(t):0===l.__compareToDouble(e,t)}},{key:"__comparisonResultToBool",value:function(e,t){switch(t){case 0:return 0>e;case 1:return 0>=e;case 2:return 0<e;case 3:return 0<=e;}throw new Error("unreachable")}},{key:"__compare",value:function(e,t,i){if(e=l.__toPrimitive(e),t=l.__toPrimitive(t),"string"==typeof e&&"string"==typeof t)switch(i){case 0:return e<t;case 1:return e<=t;case 2:return e>t;case 3:return e>=t;}if(l.__isBigInt(e)&&"string"==typeof t)return t=l.__fromString(t),null!==t&&l.__comparisonResultToBool(l.__compareToBigInt(e,t),i);if("string"==typeof e&&l.__isBigInt(t))return e=l.__fromString(e),null!==e&&l.__comparisonResultToBool(l.__compareToBigInt(e,t),i);if(e=l.__toNumeric(e),t=l.__toNumeric(t),l.__isBigInt(e)){if(l.__isBigInt(t))return l.__comparisonResultToBool(l.__compareToBigInt(e,t),i);if("number"!=typeof t)throw new Error("implementation bug");return l.__comparisonResultToBool(l.__compareToNumber(e,t),i)}if("number"!=typeof e)throw new Error("implementation bug");if(l.__isBigInt(t))return l.__comparisonResultToBool(l.__compareToNumber(t,e),2^i);if("number"!=typeof t)throw new Error("implementation bug");return 0===i?e<t:1===i?e<=t:2===i?e>t:3===i?e>=t:void 0}},{key:"__absoluteAdd",value:function(e,t,_){if(e.length<t.length)return l.__absoluteAdd(t,e,_);if(0===e.length)return e;if(0===t.length)return e.sign===_?e:l.unaryMinus(e);var n=e.length;(0===e.__clzmsd()||t.length===e.length&&0===t.__clzmsd())&&n++;for(var g=new l(n,_),o=0,a=0;a<t.length;a++){var s=t.__digit(a),u=e.__digit(a),r=(65535&u)+(65535&s)+o,d=(u>>>16)+(s>>>16)+(r>>>16);o=d>>>16,g.__setDigit(a,65535&r|d<<16)}for(;a<e.length;a++){var h=e.__digit(a),b=(65535&h)+o,m=(h>>>16)+(b>>>16);o=m>>>16,g.__setDigit(a,65535&b|m<<16)}return a<g.length&&g.__setDigit(a,o),g.__trim()}},{key:"__absoluteSub",value:function(e,t,_){if(0===e.length)return e;if(0===t.length)return e.sign===_?e:l.unaryMinus(e);for(var n=new l(e.length,_),g=0,o=0;o<t.length;o++){var a=e.__digit(o),s=t.__digit(o),u=(65535&a)-(65535&s)-g;g=1&u>>>16;var r=(a>>>16)-(s>>>16)-g;g=1&r>>>16,n.__setDigit(o,65535&u|r<<16)}for(;o<e.length;o++){var d=e.__digit(o),h=(65535&d)-g;g=1&h>>>16;var b=(d>>>16)-g;g=1&b>>>16,n.__setDigit(o,65535&h|b<<16)}return n.__trim()}},{key:"__absoluteAddOne",value:function(e,t){var _=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null,n=e.length;null===_?_=new l(n,t):_.sign=t;for(var g=!0,o=0;o<n;o++){var a=e.__digit(o),s=-1===a;g&&(a=0|a+1),g=s,_.__setDigit(o,a)}return g&&_.__setDigitGrow(n,1),_}},{key:"__absoluteSubOne",value:function(e,t){var _=e.length;t=t||_;for(var n=new l(t,!1),g=!0,o=0;o<_;o++){var a=e.__digit(o),s=0===a;g&&(a=0|a-1),g=s,n.__setDigit(o,a)}for(var u=_;u<t;u++)n.__setDigit(u,0);return n}},{key:"__absoluteAnd",value:function(e,t){var _=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null,n=e.length,g=t.length,o=g;if(n<g){o=n;var a=e,s=n;e=t,n=g,t=a,g=s}var u=o;null===_?_=new l(u,!1):u=_.length;for(var r=0;r<o;r++)_.__setDigit(r,e.__digit(r)&t.__digit(r));for(;r<u;r++)_.__setDigit(r,0);return _}},{key:"__absoluteAndNot",value:function(e,t){var _=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null,n=e.length,g=t.length,o=g;n<g&&(o=n);var a=n;null===_?_=new l(a,!1):a=_.length;for(var s=0;s<o;s++)_.__setDigit(s,e.__digit(s)&~t.__digit(s));for(;s<n;s++)_.__setDigit(s,e.__digit(s));for(;s<a;s++)_.__setDigit(s,0);return _}},{key:"__absoluteOr",value:function(e,t){var _=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null,n=e.length,g=t.length,o=g;if(n<g){o=n;var a=e,s=n;e=t,n=g,t=a,g=s}var u=n;null===_?_=new l(u,!1):u=_.length;for(var r=0;r<o;r++)_.__setDigit(r,e.__digit(r)|t.__digit(r));for(;r<n;r++)_.__setDigit(r,e.__digit(r));for(;r<u;r++)_.__setDigit(r,0);return _}},{key:"__absoluteXor",value:function(e,t){var _=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null,n=e.length,g=t.length,o=g;if(n<g){o=n;var a=e,s=n;e=t,n=g,t=a,g=s}var u=n;null===_?_=new l(u,!1):u=_.length;for(var r=0;r<o;r++)_.__setDigit(r,e.__digit(r)^t.__digit(r));for(;r<n;r++)_.__setDigit(r,e.__digit(r));for(;r<u;r++)_.__setDigit(r,0);return _}},{key:"__absoluteCompare",value:function(e,t){var _=e.length-t.length;if(0!=_)return _;for(var n=e.length-1;0<=n&&e.__digit(n)===t.__digit(n);)n--;return 0>n?0:e.__unsignedDigit(n)>t.__unsignedDigit(n)?1:-1}},{key:"__multiplyAccumulate",value:function(e,t,_,n){if(0!==t){for(var g=65535&t,l=t>>>16,o=0,a=0,u=0,r=0;r<e.length;r++,n++){var d=_.__digit(n),h=65535&d,b=d>>>16,m=e.__digit(r),c=65535&m,v=m>>>16,y=s(c,g),f=s(c,l),k=s(v,g),D=s(v,l);h+=a+(65535&y),b+=u+o+(h>>>16)+(y>>>16)+(65535&f)+(65535&k),o=b>>>16,a=(f>>>16)+(k>>>16)+(65535&D)+o,o=a>>>16,a&=65535,u=D>>>16,d=65535&h|b<<16,_.__setDigit(n,d)}for(;0!==o||0!==a||0!==u;n++){var p=_.__digit(n),B=(65535&p)+a,S=(p>>>16)+(B>>>16)+u+o;a=0,u=0,o=S>>>16,p=65535&B|S<<16,_.__setDigit(n,p)}}}},{key:"__internalMultiplyAdd",value:function(e,t,_,g,l){for(var o=_,a=0,u=0;u<g;u++){var r=e.__digit(u),d=s(65535&r,t),h=(65535&d)+a+o;o=h>>>16;var b=s(r>>>16,t),m=(65535&b)+(d>>>16)+o;o=m>>>16,a=b>>>16,l.__setDigit(u,m<<16|65535&h)}if(l.length>g)for(l.__setDigit(g++,o+a);g<l.length;)l.__setDigit(g++,0);else if(0!==o+a)throw new Error("implementation bug")}},{key:"__absoluteDivSmall",value:function(e,t,_){null===_&&(_=new l(e.length,!1));for(var n=0,g=2*e.length-1;0<=g;g-=2){var o=(n<<16|e.__halfDigit(g))>>>0,a=0|o/t;n=0|o%t,o=(n<<16|e.__halfDigit(g-1))>>>0;var s=0|o/t;n=0|o%t,_.__setDigit(g>>>1,a<<16|s)}return _}},{key:"__absoluteModSmall",value:function(e,t){for(var _,n=0,g=2*e.length-1;0<=g;g--)_=(n<<16|e.__halfDigit(g))>>>0,n=0|_%t;return n}},{key:"__absoluteDivLarge",value:function(e,t,i,_){var g=t.__halfDigitLength(),n=t.length,o=e.__halfDigitLength()-g,a=null;i&&(a=new l(o+2>>>1,!1),a.__initializeDigits());var r=new l(g+2>>>1,!1);r.__initializeDigits();var d=l.__clz16(t.__halfDigit(g-1));0<d&&(t=l.__specialLeftShift(t,d,0));for(var h=l.__specialLeftShift(e,d,1),u=t.__halfDigit(g-1),b=0,m=o;0<=m;m--){var v=65535,y=h.__halfDigit(m+g);if(y!==u){var f=(y<<16|h.__halfDigit(m+g-1))>>>0;v=0|f/u;for(var k=0|f%u,D=t.__halfDigit(g-2),p=h.__halfDigit(m+g-2);s(v,D)>>>0>(k<<16|p)>>>0&&(v--,k+=u,!(65535<k)););}l.__internalMultiplyAdd(t,v,0,n,r);var B=h.__inplaceSub(r,m,g+1);0!==B&&(B=h.__inplaceAdd(t,m,g),h.__setHalfDigit(m+g,h.__halfDigit(m+g)+B),v--),i&&(1&m?b=v<<16:a.__setDigit(m>>>1,b|v))}return _?(h.__inplaceRightShift(d),i?{quotient:a,remainder:h}:h):i?a:void 0}},{key:"__clz16",value:function(e){return u(e)-16}},{key:"__specialLeftShift",value:function(e,t,_){var g=e.length,n=new l(g+_,!1);if(0===t){for(var o=0;o<g;o++)n.__setDigit(o,e.__digit(o));return 0<_&&n.__setDigit(g,0),n}for(var a,s=0,u=0;u<g;u++)a=e.__digit(u),n.__setDigit(u,a<<t|s),s=a>>>32-t;return 0<_&&n.__setDigit(g,s),n}},{key:"__leftShiftByAbsolute",value:function(e,t){var _=l.__toShiftAmount(t);if(0>_)throw new RangeError("BigInt too big");var n=_>>>5,g=31&_,o=e.length,a=0!==g&&0!=e.__digit(o-1)>>>32-g,s=o+n+(a?1:0),u=new l(s,e.sign);if(0===g){for(var r=0;r<n;r++)u.__setDigit(r,0);for(;r<s;r++)u.__setDigit(r,e.__digit(r-n))}else{for(var h=0,b=0;b<n;b++)u.__setDigit(b,0);for(var m,c=0;c<o;c++)m=e.__digit(c),u.__setDigit(c+n,m<<g|h),h=m>>>32-g;if(a)u.__setDigit(o+n,h);else if(0!==h)throw new Error("implementation bug")}return u.__trim()}},{key:"__rightShiftByAbsolute",value:function(e,t){var _=e.length,n=e.sign,g=l.__toShiftAmount(t);if(0>g)return l.__rightShiftByMaximum(n);var o=g>>>5,a=31&g,s=_-o;if(0>=s)return l.__rightShiftByMaximum(n);var u=!1;if(n){if(0!=(e.__digit(o)&(1<<a)-1))u=!0;else for(var r=0;r<o;r++)if(0!==e.__digit(r)){u=!0;break}}if(u&&0===a){var h=e.__digit(_-1);0==~h&&s++}var b=new l(s,n);if(0===a)for(var m=o;m<_;m++)b.__setDigit(m-o,e.__digit(m));else{for(var c,v=e.__digit(o)>>>a,y=_-o-1,f=0;f<y;f++)c=e.__digit(f+o+1),b.__setDigit(f,c<<32-a|v),v=c>>>a;b.__setDigit(y,v)}return u&&(b=l.__absoluteAddOne(b,!0,b)),b.__trim()}},{key:"__rightShiftByMaximum",value:function(e){return e?l.__oneDigit(1,!0):l.__zero()}},{key:"__toShiftAmount",value:function(e){if(1<e.length)return-1;var t=e.__unsignedDigit(0);return t>l.__kMaxLengthBits?-1:t}},{key:"__toPrimitive",value:function(t){var i=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"default";if("object"!==e(t))return t;if(t.constructor===l)return t;var _=t[Symbol.toPrimitive];if(_){var n=_(i);if("object"!==e(n))return n;throw new TypeError("Cannot convert object to primitive value")}var g=t.valueOf;if(g){var o=g.call(t);if("object"!==e(o))return o}var a=t.toString;if(a){var s=a.call(t);if("object"!==e(s))return s}throw new TypeError("Cannot convert object to primitive value")}},{key:"__toNumeric",value:function(e){return l.__isBigInt(e)?e:+e}},{key:"__isBigInt",value:function(t){return"object"===e(t)&&t.constructor===l}},{key:"__truncateToNBits",value:function(e,t){for(var _=e+31>>>5,n=new l(_,t.sign),g=_-1,o=0;o<g;o++)n.__setDigit(o,t.__digit(o));var a=t.__digit(g);if(0!=(31&e)){var s=32-(31&e);a=a<<s>>>s}return n.__setDigit(g,a),n.__trim()}},{key:"__truncateAndSubFromPowerOfTwo",value:function(e,t,_){for(var n=Math.min,g=e+31>>>5,o=new l(g,_),a=0,s=g-1,u=0,r=n(s,t.length);a<r;a++){var d=t.__digit(a),h=0-(65535&d)-u;u=1&h>>>16;var b=0-(d>>>16)-u;u=1&b>>>16,o.__setDigit(a,65535&h|b<<16)}for(;a<s;a++)o.__setDigit(a,0|-u);var m,c=s<t.length?t.__digit(s):0,v=31&e;if(0===v){var y=0-(65535&c)-u;u=1&y>>>16;var f=0-(c>>>16)-u;m=65535&y|f<<16}else{var k=32-v;c=c<<k>>>k;var D=1<<32-k,p=(65535&D)-(65535&c)-u;u=1&p>>>16;var B=(D>>>16)-(c>>>16)-u;m=65535&p|B<<16,m&=D-1}return o.__setDigit(s,m),o.__trim()}},{key:"__digitPow",value:function(e,t){for(var i=1;0<t;)1&t&&(i*=e),t>>>=1,e*=e;return i}}]),l}(u(Array));return h.__kMaxLength=33554432,h.__kMaxLengthBits=h.__kMaxLength<<5,h.__kMaxBitsPerChar=[0,0,32,51,64,75,83,90,96,102,107,111,115,119,122,126,128,131,134,136,139,141,143,145,147,149,151,153,154,156,158,159,160,162,163,165,166],h.__kBitsPerCharTableShift=5,h.__kBitsPerCharTableMultiplier=1<<h.__kBitsPerCharTableShift,h.__kConversionChars=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],h.__kBitConversionBuffer=new ArrayBuffer(8),h.__kBitConversionDouble=new Float64Array(h.__kBitConversionBuffer),h.__kBitConversionInts=new Int32Array(h.__kBitConversionBuffer),h});

},{}]},{},[3])(3)
});
