'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
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
};

var NOTHING = typeof Symbol !== "undefined" ? Symbol("immer-nothing") : defineProperty({}, "immer-nothing", true);

var DRAFTABLE = typeof Symbol !== "undefined" ? Symbol.for("immer-draftable") : "__$immer_draftable";

var DRAFT_STATE = typeof Symbol !== "undefined" ? Symbol.for("immer-state") : "__$immer_state";

function isDraft(value) {
    return !!value && !!value[DRAFT_STATE];
}

function isDraftable(value) {
    if (!value || (typeof value === "undefined" ? "undefined" : _typeof(value)) !== "object") return false;
    if (Array.isArray(value)) return true;
    var proto = Object.getPrototypeOf(value);
    if (!proto || proto === Object.prototype) return true;
    return !!value[DRAFTABLE] || !!value.constructor[DRAFTABLE];
}

function original(value) {
    if (value && value[DRAFT_STATE]) {
        return value[DRAFT_STATE].base;
    }
    // otherwise return undefined
}

var assign = Object.assign || function assign(target, value) {
    for (var key in value) {
        if (has(value, key)) {
            target[key] = value[key];
        }
    }
    return target;
};

var ownKeys = typeof Reflect !== "undefined" && Reflect.ownKeys ? Reflect.ownKeys : typeof Object.getOwnPropertySymbols !== "undefined" ? function (obj) {
    return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
} : Object.getOwnPropertyNames;

function shallowCopy(base) {
    var invokeGetters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (Array.isArray(base)) return base.slice();
    var clone = Object.create(Object.getPrototypeOf(base));
    ownKeys(base).forEach(function (key) {
        if (key === DRAFT_STATE) {
            return; // Never copy over draft state.
        }
        var desc = Object.getOwnPropertyDescriptor(base, key);
        if (desc.get) {
            if (!invokeGetters) {
                throw new Error("Immer drafts cannot have computed properties");
            }
            desc.value = desc.get.call(base);
        }
        if (desc.enumerable) {
            clone[key] = desc.value;
        } else {
            Object.defineProperty(clone, key, {
                value: desc.value,
                writable: true,
                configurable: true
            });
        }
    });
    return clone;
}

function each(value, cb) {
    if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++) {
            cb(i, value[i], value);
        }
    } else {
        ownKeys(value).forEach(function (key) {
            return cb(key, value[key], value);
        });
    }
}

function isEnumerable(base, prop) {
    return Object.getOwnPropertyDescriptor(base, prop).enumerable;
}

function has(thing, prop) {
    return Object.prototype.hasOwnProperty.call(thing, prop);
}

function is(x, y) {
    // From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    } else {
        return x !== x && y !== y;
    }
}

/** Each scope represents a `produce` call. */
var ImmerScope = function () {
    function ImmerScope(parent) {
        classCallCheck(this, ImmerScope);

        this.drafts = [];
        this.parent = parent;

        // Whenever the modified draft contains a draft from another scope, we
        // need to prevent auto-freezing so the unowned draft can be finalized.
        this.canAutoFreeze = true;

        // To avoid prototype lookups:
        this.patches = null;
    }

    createClass(ImmerScope, [{
        key: "usePatches",
        value: function usePatches(patchListener) {
            if (patchListener) {
                this.patches = [];
                this.inversePatches = [];
                this.patchListener = patchListener;
            }
        }
    }, {
        key: "revoke",
        value: function revoke() {
            this.leave();
            this.drafts.forEach(_revoke);
            this.drafts = null; // Make draft-related methods throw.
        }
    }, {
        key: "leave",
        value: function leave() {
            if (this === ImmerScope.current) {
                ImmerScope.current = this.parent;
            }
        }
    }]);
    return ImmerScope;
}();

ImmerScope.current = null;
ImmerScope.enter = function () {
    return this.current = new ImmerScope(this.current);
};

function _revoke(draft) {
    draft[DRAFT_STATE].revoke();
}

// property descriptors are recycled to make sure we don't create a get and set closure per property,
// but share them all instead
var descriptors = {};

function willFinalize(scope, result, isReplaced) {
    scope.drafts.forEach(function (draft) {
        draft[DRAFT_STATE].finalizing = true;
    });
    if (!isReplaced) {
        if (scope.patches) {
            markChangesRecursively(scope.drafts[0]);
        }
        // This is faster when we don't care about which attributes changed.
        markChangesSweep(scope.drafts);
    }
    // When a child draft is returned, look for changes.
    else if (isDraft(result) && result[DRAFT_STATE].scope === scope) {
            markChangesSweep(scope.drafts);
        }
}

function createProxy(base, parent) {
    var isArray = Array.isArray(base);
    var draft = clonePotentialDraft(base);
    each(draft, function (prop) {
        proxyProperty(draft, prop, isArray || isEnumerable(base, prop));
    });

    // See "proxy.js" for property documentation.
    var scope = parent ? parent.scope : ImmerScope.current;
    var state = {
        scope: scope,
        modified: false,
        finalizing: false, // es5 only
        finalized: false,
        assigned: {},
        parent: parent,
        base: base,
        draft: draft,
        copy: null,
        revoke: revoke,
        revoked: false // es5 only
    };

    createHiddenProperty(draft, DRAFT_STATE, state);
    scope.drafts.push(draft);
    return draft;
}

function revoke() {
    this.revoked = true;
}

function source(state) {
    return state.copy || state.base;
}

function _get(state, prop) {
    assertUnrevoked(state);
    var value = source(state)[prop];
    // Drafts are only created for proxyable values that exist in the base state.
    if (!state.finalizing && value === state.base[prop] && isDraftable(value)) {
        prepareCopy(state);
        return state.copy[prop] = createProxy(value, state);
    }
    return value;
}

function _set(state, prop, value) {
    assertUnrevoked(state);
    state.assigned[prop] = true;
    if (!state.modified) {
        if (is(source(state)[prop], value)) return;
        markChanged(state);
        prepareCopy(state);
    }
    state.copy[prop] = value;
}

function markChanged(state) {
    if (!state.modified) {
        state.modified = true;
        if (state.parent) markChanged(state.parent);
    }
}

function prepareCopy(state) {
    if (!state.copy) state.copy = clonePotentialDraft(state.base);
}

function clonePotentialDraft(base) {
    var state = base && base[DRAFT_STATE];
    if (state) {
        state.finalizing = true;
        var draft = shallowCopy(state.draft, true);
        state.finalizing = false;
        return draft;
    }
    return shallowCopy(base);
}

function proxyProperty(draft, prop, enumerable) {
    var desc = descriptors[prop];
    if (desc) {
        desc.enumerable = enumerable;
    } else {
        descriptors[prop] = desc = {
            configurable: true,
            enumerable: enumerable,
            get: function get$$1() {
                return _get(this[DRAFT_STATE], prop);
            },
            set: function set$$1(value) {
                _set(this[DRAFT_STATE], prop, value);
            }
        };
    }
    Object.defineProperty(draft, prop, desc);
}

function assertUnrevoked(state) {
    if (state.revoked === true) throw new Error("Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + JSON.stringify(source(state)));
}

// This looks expensive, but only proxies are visited, and only objects without known changes are scanned.
function markChangesSweep(drafts) {
    // The natural order of drafts in the `scope` array is based on when they
    // were accessed. By processing drafts in reverse natural order, we have a
    // better chance of processing leaf nodes first. When a leaf node is known to
    // have changed, we can avoid any traversal of its ancestor nodes.
    for (var i = drafts.length - 1; i >= 0; i--) {
        var state = drafts[i][DRAFT_STATE];
        if (!state.modified) {
            if (Array.isArray(state.base)) {
                if (hasArrayChanges(state)) markChanged(state);
            } else if (hasObjectChanges(state)) markChanged(state);
        }
    }
}

function markChangesRecursively(object) {
    if (!object || (typeof object === "undefined" ? "undefined" : _typeof(object)) !== "object") return;
    var state = object[DRAFT_STATE];
    if (!state) return;
    var base = state.base,
        draft = state.draft,
        assigned = state.assigned;

    if (!Array.isArray(object)) {
        // Look for added keys.
        Object.keys(draft).forEach(function (key) {
            // The `undefined` check is a fast path for pre-existing keys.
            if (base[key] === undefined && !has(base, key)) {
                assigned[key] = true;
                markChanged(state);
            } else if (!assigned[key]) {
                // Only untouched properties trigger recursion.
                markChangesRecursively(draft[key]);
            }
        });
        // Look for removed keys.
        Object.keys(base).forEach(function (key) {
            // The `undefined` check is a fast path for pre-existing keys.
            if (draft[key] === undefined && !has(draft, key)) {
                assigned[key] = false;
                markChanged(state);
            }
        });
    } else if (hasArrayChanges(state)) {
        markChanged(state);
        assigned.length = true;
        if (draft.length < base.length) {
            for (var i = draft.length; i < base.length; i++) {
                assigned[i] = false;
            }
        } else {
            for (var _i = base.length; _i < draft.length; _i++) {
                assigned[_i] = true;
            }
        }
        for (var _i2 = 0; _i2 < draft.length; _i2++) {
            // Only untouched indices trigger recursion.
            if (assigned[_i2] === undefined) markChangesRecursively(draft[_i2]);
        }
    }
}

function hasObjectChanges(state) {
    var base = state.base,
        draft = state.draft;

    // Search for added keys. Start at the back, because non-numeric keys
    // are ordered by time of definition on the object.

    var keys = Object.keys(draft);
    for (var i = keys.length - 1; i >= 0; i--) {
        // The `undefined` check is a fast path for pre-existing keys.
        if (base[keys[i]] === undefined && !has(base, keys[i])) {
            return true;
        }
    }

    // Since no keys have been added, we can compare lengths to know if an
    // object has been deleted.
    return keys.length !== Object.keys(base).length;
}

function hasArrayChanges(state) {
    var draft = state.draft;

    if (draft.length !== state.base.length) return true;
    // See #116
    // If we first shorten the length, our array interceptors will be removed.
    // If after that new items are added, result in the same original length,
    // those last items will have no intercepting property.
    // So if there is no own descriptor on the last position, we know that items were removed and added
    // N.B.: splice, unshift, etc only shift values around, but not prop descriptors, so we only have to check
    // the last one
    var descriptor = Object.getOwnPropertyDescriptor(draft, draft.length - 1);
    // descriptor can be null, but only for newly created sparse arrays, eg. new Array(10)
    if (descriptor && !descriptor.get) return true;
    // For all other cases, we don't have to compare, as they would have been picked up by the index setters
    return false;
}

function createHiddenProperty(target, prop, value) {
    Object.defineProperty(target, prop, {
        value: value,
        enumerable: false,
        writable: true
    });
}



var legacyProxy = Object.freeze({
	willFinalize: willFinalize,
	createProxy: createProxy
});

// Do nothing before being finalized.
function willFinalize$1() {}

function createProxy$1(base, parent) {
    var scope = parent ? parent.scope : ImmerScope.current;
    var state = {
        // Track which produce call this is associated with.
        scope: scope,
        // True for both shallow and deep changes.
        modified: false,
        // Used during finalization.
        finalized: false,
        // Track which properties have been assigned (true) or deleted (false).
        assigned: {},
        // The parent draft state.
        parent: parent,
        // The base state.
        base: base,
        // The base proxy.
        draft: null,
        // Any property proxies.
        drafts: {},
        // The base copy with any updated values.
        copy: null,
        // Called by the `produce` function.
        revoke: null
    };

    var _ref = Array.isArray(base) ? // [state] is used for arrays, to make sure the proxy is array-ish and not violate invariants,
    // although state itself is an object
    Proxy.revocable([state], arrayTraps) : Proxy.revocable(state, objectTraps),
        revoke = _ref.revoke,
        proxy = _ref.proxy;

    state.draft = proxy;
    state.revoke = revoke;

    scope.drafts.push(proxy);
    return proxy;
}

var objectTraps = {
    get: get$1,
    has: function has$$1(target, prop) {
        return prop in source$1(target);
    },
    ownKeys: function ownKeys$$1(target) {
        return Reflect.ownKeys(source$1(target));
    },

    set: set$1,
    deleteProperty: deleteProperty,
    getOwnPropertyDescriptor: getOwnPropertyDescriptor,
    defineProperty: function defineProperty() {
        throw new Error("Object.defineProperty() cannot be used on an Immer draft"); // prettier-ignore
    },
    getPrototypeOf: function getPrototypeOf(target) {
        return Object.getPrototypeOf(target.base);
    },
    setPrototypeOf: function setPrototypeOf() {
        throw new Error("Object.setPrototypeOf() cannot be used on an Immer draft"); // prettier-ignore
    }
};

var arrayTraps = {};
each(objectTraps, function (key, fn) {
    arrayTraps[key] = function () {
        arguments[0] = arguments[0][0];
        return fn.apply(this, arguments);
    };
});
arrayTraps.deleteProperty = function (state, prop) {
    if (isNaN(parseInt(prop))) {
        throw new Error("Immer only supports deleting array indices"); // prettier-ignore
    }
    return objectTraps.deleteProperty.call(this, state[0], prop);
};
arrayTraps.set = function (state, prop, value) {
    if (prop !== "length" && isNaN(parseInt(prop))) {
        throw new Error("Immer only supports setting array indices and the 'length' property"); // prettier-ignore
    }
    return objectTraps.set.call(this, state[0], prop, value);
};

// returns the object we should be reading the current value from, which is base, until some change has been made
function source$1(state) {
    return state.copy || state.base;
}

function get$1(state, prop) {
    if (prop === DRAFT_STATE) return state;
    var drafts = state.drafts;

    // Check for existing draft in unmodified state.

    if (!state.modified && has(drafts, prop)) {
        return drafts[prop];
    }

    var value = source$1(state)[prop];
    if (state.finalized || !isDraftable(value)) return value;

    // Check for existing draft in modified state.
    if (state.modified) {
        // Assigned values are never drafted. This catches any drafts we created, too.
        if (value !== state.base[prop]) return value;
        // Store drafts on the copy (when one exists).
        drafts = state.copy;
    }

    return drafts[prop] = createProxy$1(value, state);
}

function set$1(state, prop, value) {
    if (!state.modified) {
        // Optimize based on value's truthiness. Truthy values are guaranteed to
        // never be undefined, so we can avoid the `in` operator. Lastly, truthy
        // values may be drafts, but falsy values are never drafts.
        var isUnchanged = value ? is(state.base[prop], value) || value === state.drafts[prop] : is(state.base[prop], value) && prop in state.base;
        if (isUnchanged) return true;
        markChanged$1(state);
    }
    state.assigned[prop] = true;
    state.copy[prop] = value;
    return true;
}

function deleteProperty(state, prop) {
    // The `undefined` check is a fast path for pre-existing keys.
    if (state.base[prop] !== undefined || prop in state.base) {
        state.assigned[prop] = false;
        markChanged$1(state);
    }
    if (state.copy) delete state.copy[prop];
    return true;
}

function getOwnPropertyDescriptor(state, prop) {
    var owner = source$1(state);
    var desc = Reflect.getOwnPropertyDescriptor(owner, prop);
    if (desc) {
        desc.writable = true;
        desc.configurable = !Array.isArray(owner) || prop !== "length";
    }
    return desc;
}

function markChanged$1(state) {
    if (!state.modified) {
        state.modified = true;
        state.copy = assign(shallowCopy(state.base), state.drafts);
        state.drafts = null;
        if (state.parent) markChanged$1(state.parent);
    }
}

var modernProxy = Object.freeze({
	willFinalize: willFinalize$1,
	createProxy: createProxy$1
});

function generatePatches(state, basePath, patches, inversePatches) {
    Array.isArray(state.base) ? generateArrayPatches(state, basePath, patches, inversePatches) : generateObjectPatches(state, basePath, patches, inversePatches);
}

function generateArrayPatches(state, basePath, patches, inversePatches) {
    var base = state.base,
        copy = state.copy,
        assigned = state.assigned;

    // Reduce complexity by ensuring `base` is never longer.

    if (copy.length < base.length) {
        var _ref = [copy, base];
        base = _ref[0];
        copy = _ref[1];
        var _ref2 = [inversePatches, patches];
        patches = _ref2[0];
        inversePatches = _ref2[1];
    }

    var delta = copy.length - base.length;

    // Find the first replaced index.
    var start = 0;
    while (base[start] === copy[start] && start < base.length) {
        ++start;
    }

    // Find the last replaced index. Search from the end to optimize splice patches.
    var end = base.length;
    while (end > start && base[end - 1] === copy[end + delta - 1]) {
        --end;
    }

    // Process replaced indices.
    for (var i = start; i < end; ++i) {
        if (assigned[i] && copy[i] !== base[i]) {
            var path = basePath.concat([i]);
            patches.push({
                op: "replace",
                path: path,
                value: copy[i]
            });
            inversePatches.push({
                op: "replace",
                path: path,
                value: base[i]
            });
        }
    }

    var useRemove = end != base.length;
    var replaceCount = patches.length;

    // Process added indices.
    for (var _i = end + delta - 1; _i >= end; --_i) {
        var _path = basePath.concat([_i]);
        patches[replaceCount + _i - end] = {
            op: "add",
            path: _path,
            value: copy[_i]
        };
        if (useRemove) {
            inversePatches.push({
                op: "remove",
                path: _path
            });
        }
    }

    // One "replace" patch reverses all non-splicing "add" patches.
    if (!useRemove) {
        inversePatches.push({
            op: "replace",
            path: basePath.concat(["length"]),
            value: base.length
        });
    }
}

function generateObjectPatches(state, basePath, patches, inversePatches) {
    var base = state.base,
        copy = state.copy;

    each(state.assigned, function (key, assignedValue) {
        var origValue = base[key];
        var value = copy[key];
        var op = !assignedValue ? "remove" : key in base ? "replace" : "add";
        if (origValue === value && op === "replace") return;
        var path = basePath.concat(key);
        patches.push(op === "remove" ? { op: op, path: path } : { op: op, path: path, value: value });
        inversePatches.push(op === "add" ? { op: "remove", path: path } : op === "remove" ? { op: "add", path: path, value: origValue } : { op: "replace", path: path, value: origValue });
    });
}

function applyPatches(draft, patches) {
    for (var i = 0; i < patches.length; i++) {
        var patch = patches[i];
        var path = patch.path;

        if (path.length === 0 && patch.op === "replace") {
            draft = patch.value;
        } else {
            var base = draft;
            for (var _i2 = 0; _i2 < path.length - 1; _i2++) {
                base = base[path[_i2]];
                if (!base || (typeof base === "undefined" ? "undefined" : _typeof(base)) !== "object") throw new Error("Cannot apply patch, path doesn't resolve: " + path.join("/")); // prettier-ignore
            }
            var key = path[path.length - 1];
            switch (patch.op) {
                case "replace":
                    base[key] = patch.value;
                    break;
                case "add":
                    if (Array.isArray(base)) {
                        // TODO: support "foo/-" paths for appending to an array
                        base.splice(key, 0, patch.value);
                    } else {
                        base[key] = patch.value;
                    }
                    break;
                case "remove":
                    if (Array.isArray(base)) {
                        base.splice(key, 1);
                    } else {
                        delete base[key];
                    }
                    break;
                default:
                    throw new Error("Unsupported patch operation: " + patch.op);
            }
        }
    }
    return draft;
}

function verifyMinified() {}

var configDefaults = {
    useProxies: typeof Proxy !== "undefined" && typeof Reflect !== "undefined",
    autoFreeze: typeof process !== "undefined" ? process.env.NODE_ENV !== "production" : verifyMinified.name === "verifyMinified",
    onAssign: null,
    onDelete: null,
    onCopy: null
};

var Immer = function () {
    function Immer(config) {
        classCallCheck(this, Immer);

        assign(this, configDefaults, config);
        this.setUseProxies(this.useProxies);
        this.produce = this.produce.bind(this);
    }

    createClass(Immer, [{
        key: "produce",
        value: function produce(base, recipe, patchListener) {
            var _this = this;

            // curried invocation
            if (typeof base === "function" && typeof recipe !== "function") {
                var defaultBase = recipe;
                recipe = base;

                // prettier-ignore
                return function () {
                    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                        args[_key - 1] = arguments[_key];
                    }

                    var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultBase;
                    return _this.produce(base, function (draft) {
                        var _recipe;

                        return (_recipe = recipe).call.apply(_recipe, [draft, draft].concat(args));
                    });
                };
            }

            // prettier-ignore
            {
                if (typeof recipe !== "function") throw new Error("if first argument is not a function, the second argument to produce should be a function");
                if (patchListener !== undefined && typeof patchListener !== "function") throw new Error("the third argument of a producer should not be set or a function");
            }

            var result = void 0;

            // Only plain objects, arrays, and "immerable classes" are drafted.
            if (isDraftable(base)) {
                var scope = ImmerScope.enter();
                var proxy = this.createProxy(base);
                var hasError = true;
                try {
                    result = recipe.call(proxy, proxy);
                    hasError = false;
                } finally {
                    // finally instead of catch + rethrow better preserves original stack
                    if (hasError) scope.revoke();else scope.leave();
                }
                if (result instanceof Promise) {
                    return result.then(function (result) {
                        scope.usePatches(patchListener);
                        return _this.processResult(result, scope);
                    }, function (error) {
                        scope.revoke();
                        throw error;
                    });
                }
                scope.usePatches(patchListener);
                return this.processResult(result, scope);
            } else {
                result = recipe(base);
                if (result === undefined) return base;
                return result !== NOTHING ? result : undefined;
            }
        }
    }, {
        key: "createDraft",
        value: function createDraft(base) {
            if (!isDraftable(base)) throw new Error("First argument to createDraft should be a plain object, an array, or an immerable object."); // prettier-ignore
            var scope = ImmerScope.enter();
            var proxy = this.createProxy(base);
            scope.leave();
            proxy[DRAFT_STATE].customDraft = true;
            return proxy;
        }
    }, {
        key: "finishDraft",
        value: function finishDraft(draft, patchListener) {
            if (!isDraft(draft)) throw new Error("First argument to finishDraft should be an object from createDraft."); // prettier-ignore
            var state = draft[DRAFT_STATE];
            if (!state.customDraft) throw new Error("The draft provided was not created using `createDraft`"); // prettier-ignore
            if (state.finalized) throw new Error("The draft provided was has already been finished"); // prettier-ignore
            // TODO: check if created with createDraft
            // TODO: check if not finsihed twice
            var scope = state.scope;

            scope.usePatches(patchListener);
            return this.processResult(undefined, scope);
        }
    }, {
        key: "setAutoFreeze",
        value: function setAutoFreeze(value) {
            this.autoFreeze = value;
        }
    }, {
        key: "setUseProxies",
        value: function setUseProxies(value) {
            this.useProxies = value;
            assign(this, value ? modernProxy : legacyProxy);
        }
    }, {
        key: "applyPatches",
        value: function applyPatches$$1(base, patches) {
            // Mutate the base state when a draft is passed.
            if (isDraft(base)) {
                return applyPatches(base, patches);
            }
            // Otherwise, produce a copy of the base state.
            return this.produce(base, function (draft) {
                return applyPatches(draft, patches);
            });
        }
        /** @internal */

    }, {
        key: "processResult",
        value: function processResult(result, scope) {
            var baseDraft = scope.drafts[0];
            var isReplaced = result !== undefined && result !== baseDraft;
            this.willFinalize(scope, result, isReplaced);
            if (isReplaced) {
                if (baseDraft[DRAFT_STATE].modified) {
                    scope.revoke();
                    throw new Error("An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft."); // prettier-ignore
                }
                if (isDraftable(result)) {
                    // Finalize the result in case it contains (or is) a subset of the draft.
                    result = this.finalize(result, null, scope);
                }
                if (scope.patches) {
                    scope.patches.push({
                        op: "replace",
                        path: [],
                        value: result
                    });
                    scope.inversePatches.push({
                        op: "replace",
                        path: [],
                        value: baseDraft[DRAFT_STATE].base
                    });
                }
            } else {
                // Finalize the base draft.
                result = this.finalize(baseDraft, [], scope);
            }
            scope.revoke();
            if (scope.patches) {
                scope.patchListener(scope.patches, scope.inversePatches);
            }
            return result !== NOTHING ? result : undefined;
        }
        /**
         * @internal
         * Finalize a draft, returning either the unmodified base state or a modified
         * copy of the base state.
         */

    }, {
        key: "finalize",
        value: function finalize(draft, path, scope) {
            var _this2 = this;

            var state = draft[DRAFT_STATE];
            if (!state) {
                if (Object.isFrozen(draft)) return draft;
                return this.finalizeTree(draft, null, scope);
            }
            // Never finalize drafts owned by another scope.
            if (state.scope !== scope) {
                return draft;
            }
            if (!state.modified) {
                return state.base;
            }
            if (!state.finalized) {
                state.finalized = true;
                this.finalizeTree(state.draft, path, scope);

                if (this.onDelete) {
                    // The `assigned` object is unreliable with ES5 drafts.
                    if (this.useProxies) {
                        var assigned = state.assigned;

                        for (var prop in assigned) {
                            if (!assigned[prop]) this.onDelete(state, prop);
                        }
                    } else {
                        var base = state.base,
                            copy = state.copy;

                        each(base, function (prop) {
                            if (!has(copy, prop)) _this2.onDelete(state, prop);
                        });
                    }
                }
                if (this.onCopy) {
                    this.onCopy(state);
                }

                // At this point, all descendants of `state.copy` have been finalized,
                // so we can be sure that `scope.canAutoFreeze` is accurate.
                if (this.autoFreeze && scope.canAutoFreeze) {
                    Object.freeze(state.copy);
                }

                if (path && scope.patches) {
                    generatePatches(state, path, scope.patches, scope.inversePatches);
                }
            }
            return state.copy;
        }
        /**
         * @internal
         * Finalize all drafts in the given state tree.
         */

    }, {
        key: "finalizeTree",
        value: function finalizeTree(root, rootPath, scope) {
            var _this3 = this;

            var state = root[DRAFT_STATE];
            if (state) {
                if (!this.useProxies) {
                    state.finalizing = true;
                    state.copy = shallowCopy(state.draft, true);
                    state.finalizing = false;
                }
                root = state.copy;
            }

            var needPatches = !!rootPath && !!scope.patches;
            var finalizeProperty = function finalizeProperty(prop, value, parent) {
                if (value === parent) {
                    throw Error("Immer forbids circular references");
                }

                // In the `finalizeTree` method, only the `root` object may be a draft.
                var isDraftProp = !!state && parent === root;

                if (isDraft(value)) {
                    var path = isDraftProp && needPatches && !state.assigned[prop] ? rootPath.concat(prop) : null;

                    // Drafts owned by `scope` are finalized here.
                    value = _this3.finalize(value, path, scope);

                    // Drafts from another scope must prevent auto-freezing.
                    if (isDraft(value)) {
                        scope.canAutoFreeze = false;
                    }

                    // Preserve non-enumerable properties.
                    if (Array.isArray(parent) || isEnumerable(parent, prop)) {
                        parent[prop] = value;
                    } else {
                        Object.defineProperty(parent, prop, { value: value });
                    }

                    // Unchanged drafts are never passed to the `onAssign` hook.
                    if (isDraftProp && value === state.base[prop]) return;
                }
                // Unchanged draft properties are ignored.
                else if (isDraftProp && is(value, state.base[prop])) {
                        return;
                    }
                    // Search new objects for unfinalized drafts. Frozen objects should never contain drafts.
                    else if (isDraftable(value) && !Object.isFrozen(value)) {
                            each(value, finalizeProperty);
                        }

                if (isDraftProp && _this3.onAssign) {
                    _this3.onAssign(state, prop, value);
                }
            };

            each(root, finalizeProperty);
            return root;
        }
    }]);
    return Immer;
}();

var immer = new Immer();

/**
 * The `produce` function takes a value and a "recipe function" (whose
 * return value often depends on the base state). The recipe function is
 * free to mutate its first argument however it wants. All mutations are
 * only ever applied to a __copy__ of the base state.
 *
 * Pass only a function to create a "curried producer" which relieves you
 * from passing the recipe function every time.
 *
 * Only plain objects and arrays are made mutable. All other objects are
 * considered uncopyable.
 *
 * Note: This function is __bound__ to its `Immer` instance.
 *
 * @param {any} base - the initial state
 * @param {Function} producer - function that receives a proxy of the base state as first argument and which can be freely modified
 * @param {Function} patchListener - optional function that will be called with all the patches produced here
 * @returns {any} a new state, or the initial state if nothing was modified
 */
var produce = immer.produce;
/**
 * Pass true to automatically freeze all copies created by Immer.
 *
 * By default, auto-freezing is disabled in production.
 */
var setAutoFreeze = immer.setAutoFreeze.bind(immer);

/**
 * Pass true to use the ES2015 `Proxy` class when creating drafts, which is
 * always faster than using ES5 proxies.
 *
 * By default, feature detection is used, so calling this is rarely necessary.
 */
var setUseProxies = immer.setUseProxies.bind(immer);

/**
 * Apply an array of Immer patches to the first argument.
 *
 * This function is a producer, which means copy-on-write is in effect.
 */
var applyPatches$1 = immer.applyPatches.bind(immer);

/**
 * Create an Immer draft from the given base state, which may be a draft itself.
 * The draft can be modified until you finalize it with the `finishDraft` function.
 */
var createDraft = immer.createDraft.bind(immer);

/**
 * Finalize an Immer draft from a `createDraft` call, returning the base state
 * (if no changes were made) or a modified copy. The draft must *not* be
 * mutated afterwards.
 *
 * Pass a function as the 2nd argument to generate Immer patches based on the
 * changes that were made.
 */
var finishDraft = immer.finishDraft.bind(immer);

exports.produce = produce;
exports['default'] = produce;
exports.setAutoFreeze = setAutoFreeze;
exports.setUseProxies = setUseProxies;
exports.applyPatches = applyPatches$1;
exports.createDraft = createDraft;
exports.finishDraft = finishDraft;
exports.Immer = Immer;
exports.original = original;
exports.isDraft = isDraft;
exports.isDraftable = isDraftable;
exports.nothing = NOTHING;
exports.immerable = DRAFTABLE;
//# sourceMappingURL=immer.js.map
