Object.defineProperty(exports, "__esModule", { value: true });
var foo = Symbol('foo');
var Test = /** @class */ (function () {
    function Test() {
    }
    Test.prototype[foo] = function () {
        return true;
    };
    return Test;
}());
exports.Test = Test;
//# sourceMappingURL=index.js.map