var Module = (() => {
  var _scriptName = import.meta.url;
  
  return (
async function(moduleArg = {}) {
  var moduleRtn;

// include: shell.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = moduleArg;

// Set up the promise that indicates the Module is initialized
var readyPromiseResolve, readyPromiseReject;
var readyPromise = new Promise((resolve, reject) => {
  readyPromiseResolve = resolve;
  readyPromiseReject = reject;
});

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

var ENVIRONMENT_IS_WEB = true;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)


// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = Object.assign({}, Module);

var arguments_ = [];
var thisProgram = './this.program';
var quit_ = (status, toThrow) => {
  throw toThrow;
};

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var readAsync, readBinary;

if (ENVIRONMENT_IS_SHELL) {

  if ((typeof process == 'object' && typeof require === 'function') || typeof window == 'object' || typeof WorkerGlobalScope != 'undefined') throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) { // Check worker, not web, since window could be polyfilled
    scriptDirectory = self.location.href;
  } else if (typeof document != 'undefined' && document.currentScript) { // web
    scriptDirectory = document.currentScript.src;
  }
  // When MODULARIZE, this JS may be executed later, after document.currentScript
  // is gone, so we saved it, and we use it here instead of any other info.
  if (_scriptName) {
    scriptDirectory = _scriptName;
  }
  // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
  // otherwise, slice off the final part of the url to find the script directory.
  // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
  // and scriptDirectory will correctly be replaced with an empty string.
  // If scriptDirectory contains a query (starting with ?) or a fragment (starting with #),
  // they are removed because they could contain a slash.
  if (scriptDirectory.startsWith('blob:')) {
    scriptDirectory = '';
  } else {
    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, '').lastIndexOf('/')+1);
  }

  if (!(typeof window == 'object' || typeof WorkerGlobalScope != 'undefined')) throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  {
// include: web_or_worker_shell_read.js
readAsync = async (url) => {
    assert(!isFileURI(url), "readAsync does not work with file:// URLs");
    var response = await fetch(url, { credentials: 'same-origin' });
    if (response.ok) {
      return response.arrayBuffer();
    }
    throw new Error(response.status + ' : ' + response.url);
  };
// end include: web_or_worker_shell_read.js
  }
} else
{
  throw new Error('environment detection error');
}

var out = Module['print'] || console.log.bind(console);
var err = Module['printErr'] || console.error.bind(console);

// Merge back in the overrides
Object.assign(Module, moduleOverrides);
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used.
moduleOverrides = null;
checkIncomingModuleAPI();

// Emit code to handle expected values on the Module object. This applies Module.x
// to the proper local x. This has two benefits: first, we only emit it if it is
// expected to arrive, and second, by using a local everywhere else that can be
// minified.

if (Module['arguments']) arguments_ = Module['arguments'];legacyModuleProp('arguments', 'arguments_');

if (Module['thisProgram']) thisProgram = Module['thisProgram'];legacyModuleProp('thisProgram', 'thisProgram');

// perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
// Assertions on removed incoming Module JS APIs.
assert(typeof Module['memoryInitializerPrefixURL'] == 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['pthreadMainPrefixURL'] == 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['cdInitializerPrefixURL'] == 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['filePackagePrefixURL'] == 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['read'] == 'undefined', 'Module.read option was removed');
assert(typeof Module['readAsync'] == 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
assert(typeof Module['readBinary'] == 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
assert(typeof Module['setWindowTitle'] == 'undefined', 'Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)');
assert(typeof Module['TOTAL_MEMORY'] == 'undefined', 'Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY');
legacyModuleProp('asm', 'wasmExports');
legacyModuleProp('readAsync', 'readAsync');
legacyModuleProp('readBinary', 'readBinary');
legacyModuleProp('setWindowTitle', 'setWindowTitle');
var IDBFS = 'IDBFS is no longer included by default; build with -lidbfs.js';
var PROXYFS = 'PROXYFS is no longer included by default; build with -lproxyfs.js';
var WORKERFS = 'WORKERFS is no longer included by default; build with -lworkerfs.js';
var FETCHFS = 'FETCHFS is no longer included by default; build with -lfetchfs.js';
var ICASEFS = 'ICASEFS is no longer included by default; build with -licasefs.js';
var JSFILEFS = 'JSFILEFS is no longer included by default; build with -ljsfilefs.js';
var OPFS = 'OPFS is no longer included by default; build with -lopfs.js';

var NODEFS = 'NODEFS is no longer included by default; build with -lnodefs.js';

assert(!ENVIRONMENT_IS_WORKER, 'worker environment detected but not enabled at build time.  Add `worker` to `-sENVIRONMENT` to enable.');

assert(!ENVIRONMENT_IS_NODE, 'node environment detected but not enabled at build time.  Add `node` to `-sENVIRONMENT` to enable.');

assert(!ENVIRONMENT_IS_SHELL, 'shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.');

// end include: shell.js

// include: preamble.js
// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

var wasmBinary = Module['wasmBinary'];legacyModuleProp('wasmBinary', 'wasmBinary');

if (typeof WebAssembly != 'object') {
  err('no native wasm support detected');
}

// Wasm globals

var wasmMemory;

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

// In STRICT mode, we only define assert() when ASSERTIONS is set.  i.e. we
// don't define it at all in release modes.  This matches the behaviour of
// MINIMAL_RUNTIME.
// TODO(sbc): Make this the default even without STRICT enabled.
/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed' + (text ? ': ' + text : ''));
  }
}

// We used to include malloc/free by default in the past. Show a helpful error in
// builds with assertions.
function _malloc() {
  abort('malloc() called but not included in the build - add `_malloc` to EXPORTED_FUNCTIONS');
}
function _free() {
  // Show a helpful error since we used to include free by default in the past.
  abort('free() called but not included in the build - add `_free` to EXPORTED_FUNCTIONS');
}

// Memory management

var HEAP,
/** @type {!Int8Array} */
  HEAP8,
/** @type {!Uint8Array} */
  HEAPU8,
/** @type {!Int16Array} */
  HEAP16,
/** @type {!Uint16Array} */
  HEAPU16,
/** @type {!Int32Array} */
  HEAP32,
/** @type {!Uint32Array} */
  HEAPU32,
/** @type {!Float32Array} */
  HEAPF32,
/* BigInt64Array type is not correctly defined in closure
/** not-@type {!BigInt64Array} */
  HEAP64,
/* BigUint64Array type is not correctly defined in closure
/** not-t@type {!BigUint64Array} */
  HEAPU64,
/** @type {!Float64Array} */
  HEAPF64;

var runtimeInitialized = false;

// include: URIUtils.js
// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = 'data:application/octet-stream;base64,';

/**
 * Indicates whether filename is a base64 data URI.
 * @noinline
 */
var isDataURI = (filename) => filename.startsWith(dataURIPrefix);

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */
var isFileURI = (filename) => filename.startsWith('file://');
// end include: URIUtils.js
// include: runtime_shared.js
// include: runtime_stack_check.js
// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  var max = _emscripten_stack_get_end();
  assert((max & 3) == 0);
  // If the stack ends at address zero we write our cookies 4 bytes into the
  // stack.  This prevents interference with SAFE_HEAP and ASAN which also
  // monitor writes to address zero.
  if (max == 0) {
    max += 4;
  }
  // The stack grow downwards towards _emscripten_stack_get_end.
  // We write cookies to the final two words in the stack and detect if they are
  // ever overwritten.
  HEAPU32[((max)>>2)] = 0x02135467;
  HEAPU32[(((max)+(4))>>2)] = 0x89BACDFE;
  // Also test the global address 0 for integrity.
  HEAPU32[((0)>>2)] = 1668509029;
}

function checkStackCookie() {
  if (ABORT) return;
  var max = _emscripten_stack_get_end();
  // See writeStackCookie().
  if (max == 0) {
    max += 4;
  }
  var cookie1 = HEAPU32[((max)>>2)];
  var cookie2 = HEAPU32[(((max)+(4))>>2)];
  if (cookie1 != 0x02135467 || cookie2 != 0x89BACDFE) {
    abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`);
  }
  // Also test the global address 0 for integrity.
  if (HEAPU32[((0)>>2)] != 0x63736d65 /* 'emsc' */) {
    abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
  }
}
// end include: runtime_stack_check.js
// include: runtime_exceptions.js
// end include: runtime_exceptions.js
// include: runtime_debug.js
// Endianness check
(() => {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 0x6373;
  if (h8[0] !== 0x73 || h8[1] !== 0x63) throw 'Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)';
})();

if (Module['ENVIRONMENT']) {
  throw new Error('Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)');
}

function legacyModuleProp(prop, newName, incoming=true) {
  if (!Object.getOwnPropertyDescriptor(Module, prop)) {
    Object.defineProperty(Module, prop, {
      configurable: true,
      get() {
        let extra = incoming ? ' (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)' : '';
        abort(`\`Module.${prop}\` has been replaced by \`${newName}\`` + extra);

      }
    });
  }
}

function ignoredModuleProp(prop) {
  if (Object.getOwnPropertyDescriptor(Module, prop)) {
    abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
  }
}

// forcing the filesystem exports a few things by default
function isExportedByForceFilesystem(name) {
  return name === 'FS_createPath' ||
         name === 'FS_createDataFile' ||
         name === 'FS_createPreloadedFile' ||
         name === 'FS_unlink' ||
         name === 'addRunDependency' ||
         // The old FS has some functionality that WasmFS lacks.
         name === 'FS_createLazyFile' ||
         name === 'FS_createDevice' ||
         name === 'removeRunDependency';
}

/**
 * Intercept access to a global symbol.  This enables us to give informative
 * warnings/errors when folks attempt to use symbols they did not include in
 * their build, or no symbols that no longer exist.
 */
function hookGlobalSymbolAccess(sym, func) {
  if (typeof globalThis != 'undefined' && !Object.getOwnPropertyDescriptor(globalThis, sym)) {
    Object.defineProperty(globalThis, sym, {
      configurable: true,
      get() {
        func();
        return undefined;
      }
    });
  }
}

function missingGlobal(sym, msg) {
  hookGlobalSymbolAccess(sym, () => {
    warnOnce(`\`${sym}\` is not longer defined by emscripten. ${msg}`);
  });
}

missingGlobal('buffer', 'Please use HEAP8.buffer or wasmMemory.buffer');
missingGlobal('asm', 'Please use wasmExports instead');

function missingLibrarySymbol(sym) {
  hookGlobalSymbolAccess(sym, () => {
    // Can't `abort()` here because it would break code that does runtime
    // checks.  e.g. `if (typeof SDL === 'undefined')`.
    var msg = `\`${sym}\` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line`;
    // DEFAULT_LIBRARY_FUNCS_TO_INCLUDE requires the name as it appears in
    // library.js, which means $name for a JS name with no prefix, or name
    // for a JS name like _name.
    var librarySymbol = sym;
    if (!librarySymbol.startsWith('_')) {
      librarySymbol = '$' + sym;
    }
    msg += ` (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='${librarySymbol}')`;
    if (isExportedByForceFilesystem(sym)) {
      msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
    }
    warnOnce(msg);
  });

  // Any symbol that is not included from the JS library is also (by definition)
  // not exported on the Module object.
  unexportedRuntimeSymbol(sym);
}

function unexportedRuntimeSymbol(sym) {
  if (!Object.getOwnPropertyDescriptor(Module, sym)) {
    Object.defineProperty(Module, sym, {
      configurable: true,
      get() {
        var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
        if (isExportedByForceFilesystem(sym)) {
          msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
        }
        abort(msg);
      }
    });
  }
}

// Used by XXXXX_DEBUG settings to output debug messages.
function dbg(...args) {
  // TODO(sbc): Make this configurable somehow.  Its not always convenient for
  // logging to show up as warnings.
  console.warn(...args);
}
// end include: runtime_debug.js
// include: memoryprofiler.js
// end include: memoryprofiler.js
// include: base64Decode.js
// Precreate a reverse lookup table from chars "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" back to bytes to make decoding fast.
for (var base64ReverseLookup = new Uint8Array(123/*'z'+1*/), i = 25; i >= 0; --i) {
  base64ReverseLookup[48+i] = 52+i; // '0-9'
  base64ReverseLookup[65+i] = i; // 'A-Z'
  base64ReverseLookup[97+i] = 26+i; // 'a-z'
}
base64ReverseLookup[43] = 62; // '+'
base64ReverseLookup[47] = 63; // '/'

// Decodes a _known valid_ base64 string (without validation) and returns it as a new Uint8Array.
// Benchmarked to be around 5x faster compared to a simple
// "Uint8Array.from(atob(b64), c => c.charCodeAt(0))" (TODO: perhaps use this form in -Oz builds?)
/** @noinline */
function base64Decode(b64) {

  assert(b64.length % 4 == 0);
  var b1, b2, i = 0, j = 0, bLength = b64.length, output = new Uint8Array((bLength*3>>2) - (b64[bLength-2] == '=') - (b64[bLength-1] == '='));
  for (; i < bLength; i += 4, j += 3) {
    b1 = base64ReverseLookup[b64.charCodeAt(i+1)];
    b2 = base64ReverseLookup[b64.charCodeAt(i+2)];
    output[j] = base64ReverseLookup[b64.charCodeAt(i)] << 2 | b1 >> 4;
    output[j+1] = b1 << 4 | b2 >> 2;
    output[j+2] = b2 << 6 | base64ReverseLookup[b64.charCodeAt(i+3)];
  }
  return output;
}

// If filename is a base64 data URI, parses and returns data (Buffer on node,
// Uint8Array otherwise). If filename is not a base64 data URI, returns undefined.
function tryParseAsDataURI(filename) {
  if (!isDataURI(filename)) {
    return;
  }

  return base64Decode(filename.slice(dataURIPrefix.length));
}
// end include: base64Decode.js


function updateMemoryViews() {
  var b = wasmMemory.buffer;
  Module['HEAP8'] = HEAP8 = new Int8Array(b);
  Module['HEAP16'] = HEAP16 = new Int16Array(b);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(b);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(b);
  Module['HEAP32'] = HEAP32 = new Int32Array(b);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(b);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(b);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(b);
  Module['HEAP64'] = HEAP64 = new BigInt64Array(b);
  Module['HEAPU64'] = HEAPU64 = new BigUint64Array(b);
}

// end include: runtime_shared.js
assert(!Module['STACK_SIZE'], 'STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time')

assert(typeof Int32Array != 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray != undefined && Int32Array.prototype.set != undefined,
       'JS engine does not provide full typed array support');

// If memory is defined in wasm, the user can't provide it, or set INITIAL_MEMORY
assert(!Module['wasmMemory'], 'Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally');
assert(!Module['INITIAL_MEMORY'], 'Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically');

var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the main() is called

function preRun() {
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  assert(!runtimeInitialized);
  runtimeInitialized = true;

  checkStackCookie();

  
  callRuntimeCallbacks(__ATINIT__);
}

function postRun() {
  checkStackCookie();

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnExit(cb) {
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking = {};
var runDependencyWatcher = null;

function getUniqueRunDependency(id) {
  var orig = id;
  while (1) {
    if (!runDependencyTracking[id]) return id;
    id = orig + Math.random();
  }
}

function addRunDependency(id) {
  runDependencies++;

  Module['monitorRunDependencies']?.(runDependencies);

  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval != 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(() => {
        if (ABORT) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
          return;
        }
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            err('still waiting on run dependencies:');
          }
          err(`dependency: ${dep}`);
        }
        if (shown) {
          err('(end of list)');
        }
      }, 10000);
    }
  } else {
    err('warning: run dependency added without ID');
  }
}

function removeRunDependency(id) {
  runDependencies--;

  Module['monitorRunDependencies']?.(runDependencies);

  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    err('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}

/** @param {string|number=} what */
function abort(what) {
  Module['onAbort']?.(what);

  what = 'Aborted(' + what + ')';
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);

  ABORT = true;

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.

  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // definition for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */
  var e = new WebAssembly.RuntimeError(what);

  readyPromiseReject(e);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

// show errors on likely calls to FS when it was not included
var FS = {
  error() {
    abort('Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with -sFORCE_FILESYSTEM');
  },
  init() { FS.error() },
  createDataFile() { FS.error() },
  createPreloadedFile() { FS.error() },
  createLazyFile() { FS.error() },
  open() { FS.error() },
  mkdev() { FS.error() },
  registerDevice() { FS.error() },
  analyzePath() { FS.error() },

  ErrnoError() { FS.error() },
};
Module['FS_createDataFile'] = FS.createDataFile;
Module['FS_createPreloadedFile'] = FS.createPreloadedFile;

function createExportWrapper(name, nargs) {
  return (...args) => {
    assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
    var f = wasmExports[name];
    assert(f, `exported native function \`${name}\` not found`);
    // Only assert for too many arguments. Too few can be valid since the missing arguments will be zero filled.
    assert(args.length <= nargs, `native function \`${name}\` called with ${args.length} args but expects ${nargs}`);
    return f(...args);
  };
}

// In SINGLE_FILE mode the wasm binary is encoded inline here as a data: URL.
var wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABpQEYYAF/AGACf38AYAJ/fwF/YAF/AX9gA39/fwF/YAZ/fH9/f38Bf2AAAGAEf39/fwBgBn9/f39/fwBgBX9/f39/AGADf35/AX5gBH9/f38Bf2AEf35/fwF/YAN/f38AYAABf2ACfH8BfGAEf35+fwBgAn5+AXxgBX9/f39/AX9gB39/f39/f38Bf2ADfn9/AX9gAn5/AX9gAXwBfmAGf39/f39/AX8CsgEGA2VudhhlbXNjcmlwdGVuX2FzbV9jb25zdF9pbnQABANlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAADA2VudglfYWJvcnRfanMABhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAMWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF93cml0ZQALFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawAMA5YBlAEGAAAAAAEAAQMNDQ0NAQEDBgYDAAMBAAABAgMDAAMBAAACAgMGBA4OAwYEBAMDAwQKCgMAAgAADgYDBAIODg4GBAIPEBARBAsEEhMNAwcUFRUJBAUBFgMEAAMDBgABBgICAgIDAwABAw4CAwAAAAAAAAAEBAMEBAsBFxIXBwcHBAQCAgkHCQkICAMAAw4GDg4OAwIDBAQBcAAsBQYBAYICggIGIAV/AUGAgAQLfwFBAAt/AUEAC38AQayiBAt/AEGNowQLB5UDFgZtZW1vcnkCABFfX3dhc21fY2FsbF9jdG9ycwAGGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAAlzZXRWb2x1bWUACQ5zZXRJcnFDYWxsYmFjawAKDnNldERtY0NhbGxiYWNrAAwEc3RlcAAOCHdyaXRlTWVtABMHcmVhZE1lbQAVBXJlc2V0ABYIcG93ZXJPZmYAFwZmZmx1c2gAlwEIc3RyZXJyb3IAmQEVZW1zY3JpcHRlbl9zdGFja19pbml0AJMBGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2ZyZWUAlAEZZW1zY3JpcHRlbl9zdGFja19nZXRfYmFzZQCVARhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQAlgEZX2Vtc2NyaXB0ZW5fc3RhY2tfcmVzdG9yZQCQARdfZW1zY3JpcHRlbl9zdGFja19hbGxvYwCRARxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50AJIBDl9fc3RhcnRfZW1fYXNtAwMNX19zdG9wX2VtX2FzbQMECTgBAEEBCysHCBgZGhscHR4fICEiIyQlJicoKTQ1N1lacHNxcnh0e3V8jgGMAYMBdo0BiwGEAXeGAQqlggKUAQkAEJMBECoQRQtIAQJ/AkACQAJAQQAoAqCjhIAAIgFBkKOEgABHDQBBECECDAELIAFFDQFBFCECCyABIAEoAgAgAmooAgARgICAgACAgICAAAsLSAECfwJAAkACQEEAKAK4o4SAACIBQaijhIAARw0AQRAhAgwBCyABRQ0BQRQhAgsgASABKAIAIAJqKAIAEYCAgIAAgICAgAALC7sCAwF/AnwBfyOAgICAAEEQayIBJICAgIAAIAEgADYCAEGsooSAAEGAgISAACABEICAgIAAGiAAtyICRLgehetR+FdAoiEDQQEhAANAIABBwKOEgABqIANEzczMzMzAv0AgALijRAAAAAAAAFlAoKP8AzoAACAAQcGjhIAAaiADRM3MzMzMwL9AIABBAWq4o0QAAAAAAABZQKCj/AM6AAAgAEECaiIAQR9HDQALIAJEPQrXo3B1ZECiIQNBASEAAkADQCAAQQF0QeCjhIAAaiADRDMzMzNzwtdAIAC4o0QAAAAAAABZQKCj/AM7AQAgAEEBaiIEQZYDRg0BIARBAXRB4KOEgABqIANEMzMzM3PC10AgBLijRAAAAAAAAFlAoKP8AzsBACAAQQJqIQAMAAsLIAFBEGokgICAgAALngEBAn8jgICAgABBIGsiASSAgICAACABQQA2AhgCQCAARQ0AIAEgADYCDCABQfCBhIAAQQhqNgIIIAEgAUEIajYCGAsgAUEIakGQo4SAABCLgICAAAJAAkACQCABKAIYIgAgAUEIakcNAEEQIQIMAQsgAEUNAUEUIQILIAAgACgCACACaigCABGAgICAAICAgIAACyABQSBqJICAgIAAC5sDAQN/I4CAgIAAQRBrIgIkgICAgAACQCABIABGDQAgASgCECEDAkAgACgCECIEIABHDQACQCADIAFHDQAgBCACIAQoAgAoAgwRgYCAgACAgICAACAAKAIQIgMgAygCACgCEBGAgICAAICAgIAAIABBADYCECABKAIQIgMgACADKAIAKAIMEYGAgIAAgICAgAAgASgCECIDIAMoAgAoAhARgICAgACAgICAACABQQA2AhAgACAANgIQIAIgASACKAIAKAIMEYGAgIAAgICAgAAgAiACKAIAKAIQEYCAgIAAgICAgAAgASABNgIQDAILIAQgASAEKAIAKAIMEYGAgIAAgICAgAAgACgCECIDIAMoAgAoAhARgICAgACAgICAACAAIAEoAhA2AhAgASABNgIQDAELAkAgAyABRw0AIAMgACADKAIAKAIMEYGAgIAAgICAgAAgASgCECIDIAMoAgAoAhARgICAgACAgICAACABIAAoAhA2AhAgACAANgIQDAELIAAgAzYCECABIAQ2AhALIAJBEGokgICAgAALngEBAn8jgICAgABBIGsiASSAgICAACABQQA2AhgCQCAARQ0AIAEgADYCDCABQbiDhIAAQQhqNgIIIAEgAUEIajYCGAsgAUEIakGoo4SAABCNgICAAAJAAkACQCABKAIYIgAgAUEIakcNAEEQIQIMAQsgAEUNAUEUIQILIAAgACgCACACaigCABGAgICAAICAgIAACyABQSBqJICAgIAAC5sDAQN/I4CAgIAAQRBrIgIkgICAgAACQCABIABGDQAgASgCECEDAkAgACgCECIEIABHDQACQCADIAFHDQAgBCACIAQoAgAoAgwRgYCAgACAgICAACAAKAIQIgMgAygCACgCEBGAgICAAICAgIAAIABBADYCECABKAIQIgMgACADKAIAKAIMEYGAgIAAgICAgAAgASgCECIDIAMoAgAoAhARgICAgACAgICAACABQQA2AhAgACAANgIQIAIgASACKAIAKAIMEYGAgIAAgICAgAAgAiACKAIAKAIQEYCAgIAAgICAgAAgASABNgIQDAILIAQgASAEKAIAKAIMEYGAgIAAgICAgAAgACgCECIDIAMoAgAoAhARgICAgACAgICAACAAIAEoAhA2AhAgASABNgIQDAELAkAgAyABRw0AIAMgACADKAIAKAIMEYGAgIAAgICAgAAgASgCECIDIAMoAgAoAhARgICAgACAgICAACABIAAoAhA2AhAgACAANgIQDAELIAAgAzYCECABIAQ2AhALIAJBEGokgICAgAAL0xIBBX8jgICAgABBEGsiASSAgICAAEEAQRNBACgC1KCEgAAiAkF/aiACQQFIGyICNgLU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IAK4o0QAAAAAAABZQKCj/AM7AQAgAUECaiEBDAALC0EAQgA3A4CohIAAQQBCADcD+KeEgABBAEEBOwGQqISAACAAQRBqJICAgIAACwQAQQALBwA/AEEQdAsIAEGws4SAAAthAQJ/QQAoApChhIAAIgEgAEEHakF4cSICaiEAAkACQAJAIAJFDQAgACABTQ0BCyAAEKyAgIAATQ0BIAAQgYCAgAANAQsQrYCAgABBMDYCAEF/DwtBACAANgKQoYSAACABCwkAEIKAgIAAAAsTACACBEAgACABIAL8CgAACyAAC5EEAQN/AkAgAkGABEkNACAAIAEgAhCwgICAAA8LIAAgAmohAwJAAkAgASAAc0EDcQ0AAkACQCAAQQNxDQAgACECDAELAkAgAg0AIAAhAgwBCyAAIQIDQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAkEDcUUNASACIANJDQALCyADQXxxIQQCQCADQcAASQ0AIAIgBEFAaiIFSw0AA0AgAiABKAIANgIAIAIgASgCBDYCBCACIAEoAgg2AgggAiABKAIMNgIMIAIgASgCEDYCECACIAEoAhQ2AhQgAiABKAIYNgIYIAIgASgCHDYCHCACIAEoAiA2AiAgAiABKAIkNgIkIAIgASgCKDYCKCACIAEoAiw2AiwgAiABKAIwNgIwIAIgASgCNDYCNCACIAEoAjg2AjggAiABKAI8NgI8IAFBwABqIQEgAkHAAGoiAiAFTQ0ACwsgAiAETw0BA0AgAiABKAIANgIAIAFBBGohASACQQRqIgIgBEkNAAwCCwsCQCADQQRPDQAgACECDAELAkAgACADQXxqIgRNDQAgACECDAELIAAhAgNAIAIgAS0AADoAACACIAEtAAE6AAEgAiABLQACOgACIAIgAS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCwJAIAIgA08NAANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANHDQALCyAACxkAAkAgAA0AQQAPCxCtgICAACAANgIAQX8LBAAgAAsZACAAKAI8ELOAgIAAEIOAgIAAELKAgIAAC/8CAQd/I4CAgIAAQSBrIgMkgICAgAAgAyAAKAIcIgQ2AhAgACgCFCEFIAMgAjYCHCADIAE2AhggAyAFIARrIgE2AhQgASACaiEGIANBEGohBEECIQcCQAJAAkACQAJAIAAoAjwgA0EQakECIANBDGoQhICAgAAQsoCAgABFDQAgBCEFDAELA0AgBiADKAIMIgFGDQICQCABQX9KDQAgBCEFDAQLIAQgASAEKAIEIghLIglBA3RqIgUgBSgCACABIAhBACAJG2siCGo2AgAgBEEMQQQgCRtqIgQgBCgCACAIazYCACAGIAFrIQYgBSEEIAAoAjwgBSAHIAlrIgcgA0EMahCEgICAABCygICAAEUNAAsLIAZBf0cNAQsgACAAKAIsIgE2AhwgACABNgIUIAAgASAAKAIwajYCECACIQEMAQtBACEBIABBADYCHCAAQgA3AxAgACAAKAIAQSByNgIAIAdBAkYNACACIAUoAgRrIQELIANBIGokgICAgAAgAQtLAQF/I4CAgIAAQRBrIgMkgICAgAAgACABIAJB/wFxIANBCGoQhYCAgAAQsoCAgAAhAiADKQMIIQEgA0EQaiSAgICAAEJ/IAEgAhsLEQAgACgCPCABIAIQtoCAgAALBABBAQsCAAsEAEEACwIACwIACxQAQbyzhIAAELuAgIAAQcCzhIAACw4AQbyzhIAAELyAgIAAC1wBAX8gACAAKAJIIgFBf2ogAXI2AkgCQCAAKAIAIgFBCHFFDQAgACABQSByNgIAQX8PCyAAQgA3AgQgACAAKAIsIgE2AhwgACABNgIUIAAgASAAKAIwajYCEEEAC+kBAQJ/IAJBAEchAwJAAkACQCAAQQNxRQ0AIAJFDQAgAUH/AXEhBANAIAAtAAAgBEYNAiACQX9qIgJBAEchAyAAQQFqIgBBA3FFDQEgAg0ACwsgA0UNAQJAIAAtAAAgAUH/AXFGDQAgAkEESQ0AIAFB/wFxQYGChAhsIQQDQEGAgoQIIAAoAgAgBHMiA2sgA3JBgIGChHhxQYCBgoR4Rw0CIABBBGohACACQXxqIgJBA0sNAAsLIAJFDQELIAFB/wFxIQMDQAJAIAAtAAAgA0cNACAADwsgAEEBaiEAIAJBf2oiAg0ACwtBAAsaAQF/IABBACABEMCAgIAAIgIgAGsgASACGwsEAEEqCwgAEMKAgIAACwgAQYC0hIAACyAAQQBB6LOEgAA2AuC0hIAAQQAQw4CAgAA2Api0hIAAC6wCAQF/QQEhAwJAAkAgAEUNACABQf8ATQ0BAkACQBDEgICAACgCYCgCAA0AIAFBgH9xQYC/A0YNAxCtgICAAEEZNgIADAELAkAgAUH/D0sNACAAIAFBP3FBgAFyOgABIAAgAUEGdkHAAXI6AABBAg8LAkACQCABQYCwA0kNACABQYBAcUGAwANHDQELIAAgAUE/cUGAAXI6AAIgACABQQx2QeABcjoAACAAIAFBBnZBP3FBgAFyOgABQQMPCwJAIAFBgIB8akH//z9LDQAgACABQT9xQYABcjoAAyAAIAFBEnZB8AFyOgAAIAAgAUEGdkE/cUGAAXI6AAIgACABQQx2QT9xQYABcjoAAUEEDwsQrYCAgABBGTYCAAtBfyEDCyADDwsgACABOgAAQQELGAACQCAADQBBAA8LIAAgAUEAEMaAgIAAC5IBAgF+AX8CQCAAvSICQjSIp0H/D3EiA0H/D0YNAAJAIAMNAAJAAkAgAEQAAAAAAAAAAGINAEEAIQMMAQsgAEQAAAAAAADwQ6IgARDIgICAACEAIAEoAgBBQGohAwsgASADNgIAIAAPCyABIANBgnhqNgIAIAJC/////////4eAf4NCgICAgICAgPA/hL8hAAsgAAtTAQF+AkACQCADQcAAcUUNACABIANBQGqthiECQgAhAQwBCyADRQ0AIAFBwAAgA2utiCACIAOtIgSGhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAtTAQF+AkACQCADQcAAcUUNACACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAukBAMBfwJ+BH8jgICAgABBIGsiAiSAgICAACABQv///////z+DIQMCQAJAIAFCMIhC//8BgyIEpyIFQf+Hf2pB/Q9LDQAgAEI8iCADQgSGhCEDIAVBgIh/aq0hBAJAAkAgAEL//////////w+DIgBCgYCAgICAgIAIVA0AIANCAXwhAwwBCyAAQoCAgICAgICACFINACADQgGDIAN8IQMLQgAgAyADQv////////8HViIFGyEAIAWtIAR8IQMMAQsCQCAAIAOEUA0AIARC//8BUg0AIABCPIggA0IEhoRCgICAgICAgASEIQBC/w8hAwwBCwJAIAVB/ocBTQ0AQv8PIQNCACEADAELAkBBgPgAQYH4ACAEUCIGGyIHIAVrIghB8ABMDQBCACEAQgAhAwwBCyACQRBqIAAgAyADQoCAgICAgMAAhCAGGyIDQYABIAhrEMmAgIAAIAIgACADIAgQyoCAgAAgAikDACIDQjyIIAJBCGopAwBCBIaEIQACQAJAIANC//////////8PgyAHIAVHIAIpAxAgAkEQakEIaikDAIRCAFJxrYQiA0KBgICAgICAgAhUDQAgAEIBfCEADAELIANCgICAgICAgIAIUg0AIABCAYMgAHwhAAsgAEKAgICAgICACIUgACAAQv////////8HViIFGyEAIAWtIQMLIAJBIGokgICAgAAgA0I0hiABQoCAgICAgICAgH+DhCAAhL8L5gEBA38CQAJAIAIoAhAiAw0AQQAhBCACEL+AgIAADQEgAigCECEDCwJAIAEgAyACKAIUIgRrTQ0AIAIgACABIAIoAiQRhICAgACAgICAAA8LAkACQCACKAJQQQBIDQAgAUUNACABIQMCQANAIAAgA2oiBUF/ai0AAEEKRg0BIANBf2oiA0UNAgwACwsgAiAAIAMgAigCJBGEgICAAICAgIAAIgQgA0kNAiABIANrIQEgAigCFCEEDAELIAAhBUEAIQMLIAQgBSABELGAgIAAGiACIAIoAhQgAWo2AhQgAyABaiEECyAEC2cBAn8gAiABbCEEAkACQCADKAJMQX9KDQAgACAEIAMQzICAgAAhAAwBCyADELiAgIAAIQUgACAEIAMQzICAgAAhACAFRQ0AIAMQuYCAgAALAkAgACAERw0AIAJBACABGw8LIAAgAW4L8gICA38BfgJAIAJFDQAgACABOgAAIAAgAmoiA0F/aiABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBfWogAToAACADQX5qIAE6AAAgAkEHSQ0AIAAgAToAAyADQXxqIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIFayICQSBJDQAgAa1CgYCAgBB+IQYg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IAQgDEECdGooAgAiDkUNASADIAxBA3RqIA4gAiAGENOAgIAAQQEhCyAMQQFqIgxBCkcNAAwMCwsCQCAMQQpJDQBBASELDAsLA0AgBCAMQQJ0aigCAA0BQQEhCyAMQQFqIgxBCkYNCwwACwtBHCEWDAcLIAcgDDoAJ0EBIRQgCCENIAkhFiAXIREMAQsgCSEWCyAUIBYgDWsiASAUIAFKGyISIBBB/////wdzSg0DQT0hFiATIBAgEmoiDyATIA9KGyIMIA5KDQQgAEEgIAwgDyARENeAgIAAIAAgGCAQENGAgIAAIABBMCAMIA8gEUGAgARzENeAgIAAIABBMCASIAFBABDXgICAACAAIA0gARDRgICAACAAQSAgDCAPIBFBgMAAcxDXgICAACAHKAI8IQEMAQsLC0EAIQsMAwtBPSEWCxCtgICAACAWNgIAC0F/IQsLIAdBwABqJICAgIAAIAsLHAACQCAALQAAQSBxDQAgASACIAAQzICAgAAaCwt7AQV/QQAhAQJAIAAoAgAiAiwAAEFQaiIDQQlNDQBBAA8LA0BBfyEEAkAgAUHMmbPmAEsNAEF/IAMgAUEKbCIBaiADIAFB/////wdzSxshBAsgACACQQFqIgM2AgAgAiwAASEFIAQhASADIQIgBUFQaiIDQQpJDQALIAQLvgQAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAUF3ag4SAAECBQMEBgcICQoLDA0ODxAREgsgAiACKAIAIgFBBGo2AgAgACABKAIANgIADwsgAiACKAIAIgFBBGo2AgAgACABNAIANwMADwsgAiACKAIAIgFBBGo2AgAgACABNQIANwMADwsgAiACKAIAIgFBBGo2AgAgACABNAIANwMADwsgAiACKAIAIgFBBGo2AgAgACABNQIANwMADwsgAiACKAIAQQdqQXhxIgFBCGo2AgAgACABKQMANwMADwsgAiACKAIAIgFBBGo2AgAgACABMgEANwMADwsgAiACKAIAIgFBBGo2AgAgACABMwEANwMADwsgAiACKAIAIgFBBGo2AgAgACABMAAANwMADwsgAiACKAIAIgFBBGo2AgAgACABMQAANwMADwsgAiACKAIAQQdqQXhxIgFBCGo2AgAgACABKQMANwMADwsgAiACKAIAIgFBBGo2AgAgACABNQIANwMADwsgAiACKAIAQQdqQXhxIgFBCGo2AgAgACABKQMANwMADwsgAiACKAIAQQdqQXhxIgFBCGo2AgAgACABKQMANwMADwsgAiACKAIAIgFBBGo2AgAgACABNAIANwMADwsgAiACKAIAIgFBBGo2AgAgACABNQIANwMADwsgAiACKAIAQQdqQXhxIgFBCGo2AgAgACABKwMAOQMADwsgACACIAMRgYCAgACAgICAAAsLQAEBfwJAIABQDQADQCABQX9qIgEgAKdBD3FBkIqEgABqLQAAIAJyOgAAIABCD1YhAyAAQgSIIQAgAw0ACwsgAQs2AQF/AkAgAFANAANAIAFBf2oiASAAp0EHcUEwcjoAACAAQgdWIQIgAEIDiCEAIAINAAsLIAELigECAX4DfwJAAkAgAEKAgICAEFoNACAAIQIMAQsDQCABQX9qIgEgACAAQgqAIgJCCn59p0EwcjoAACAAQv////+fAVYhAyACIQAgAw0ACwsCQCACUA0AIAKnIQMDQCABQX9qIgEgAyADQQpuIgRBCmxrQTByOgAAIANBCUshBSAEIQMgBQ0ACwsgAQuEAQEBfyOAgICAAEGAAmsiBSSAgICAAAJAIAIgA0wNACAEQYDABHENACAFIAEgAiADayIDQYACIANBgAJJIgIbEM6AgIAAGgJAIAINAANAIAAgBUGAAhDRgICAACADQYB+aiIDQf8BSw0ACwsgACAFIAMQ0YCAgAALIAVBgAJqJICAgIAACxoAIAAgASACQZiAgIAAQZmAgIAAEM+AgIAAC8gZBgJ/AX4MfwJ+BH8BfCOAgICAAEGwBGsiBiSAgICAAEEAIQcgBkEANgIsAkACQCABENuAgIAAIghCf1UNAEEBIQlBjoWEgAAhCiABmiIBENuAgIAAIQgMAQsCQCAEQYAQcUUNAEEBIQlBkYWEgAAhCgwBC0GUhYSAAEGPhYSAACAEQQFxIgkbIQogCUUhBwsCQAJAIAhCgICAgICAgPj/AINCgICAgICAgPj/AFINACAAQSAgAiAJQQNqIgsgBEH//3txENeAgIAAIAAgCiAJENGAgIAAIABB64WEgABB84WEgAAgBUEgcSIMG0HvhYSAAEH3hYSAACAMGyABIAFiG0EDENGAgIAAIABBICACIAsgBEGAwABzENeAgIAAIAIgCyACIAtK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IgIgASgCUEYNACABKAIUIgMgASgCEEYNACABIANBAWo2AhQgAyAAOgAAIAIPCyABIAIQ5YCAgAAPCyAAIAEQ6ICAgAALhAEBA38CQCABQcwAaiICEOmAgIAARQ0AIAEQuICAgAAaCwJAAkAgAEH/AXEiAyABKAJQRg0AIAEoAhQiBCABKAIQRg0AIAEgBEEBajYCFCAEIAA6AAAMAQsgASADEOWAgIAAIQMLAkAgAhDqgICAAEGAgICABHFFDQAgAhDrgICAAAsgAwsbAQF/IAAgACgCACIBQf////8DIAEbNgIAIAELFAEBfyAAKAIAIQEgAEEANgIAIAELDQAgAEEBELqAgIAAGgtXAQJ/I4CAgIAAQRBrIgIkgICAgABBqIaEgABBC0EBQQAoAoCFhIAAIgMQzYCAgAAaIAIgATYCDCADIAAgARDYgICAABpBCiADEOaAgIAAGhCvgICAAAALBwAgACgCAAsOAEH0uISAABDtgICAAAtZAQJ/IAEtAAAhAgJAIAAtAAAiA0UNACADIAJB/wFxRw0AA0AgAS0AASECIAAtAAEiA0UNASABQQFqIQEgAEEBaiEAIAMgAkH/AXFGDQALCyADIAJB/wFxawsKACAAEI+BgIAACwIACwIACxIAIAAQ8ICAgABBCBDjgICAAAsSACAAEPCAgIAAQQgQ44CAgAALEgAgABDwgICAAEEIEOOAgIAACxIAIAAQ8ICAgABBDBDjgICAAAsSACAAEPCAgIAAQRAQ44CAgAALDgAgACABQQAQ+YCAgAALOQACQCACDQAgACgCBCABKAIERg8LAkAgACABRw0AQQEPCyAAEPqAgIAAIAEQ+oCAgAAQ74CAgABFCwcAIAAoAgQLBABBAAuRAgECfyOAgICAAEHQAGsiAySAgICAAEEBIQQCQAJAIAAgAUEAEPmAgIAADQBBACEEIAFFDQBBACEEIAFBoIqEgABB0IqEgABBABD9gICAACIBRQ0AIAIoAgAiBEUNAQJAQThFDQAgA0EYakEAQTj8CwALIANBAToASyADQX82AiAgAyAANgIcIAMgATYCFCADQQE2AkQgASADQRRqIARBASABKAIAKAIcEYeAgIAAgICAgAACQCADKAIsIgRBAUcNACACIAMoAiQ2AgALIARBAUYhBAsgA0HQAGokgICAgAAgBA8LIANB+4WE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gACAgICAAAJAIAMoAhwiAUEBRw0AIAIgAygCFEEAIAQbNgIACyABQQFGIQQMAQtBACEECyADQcAAaiSAgICAACAEC8oBAQJ/AkADQAJAIAENAEEADwtBACECIAFBoIqEgABBsIuEgABBABD9gICAACIBRQ0BIAEoAgggACgCCEF/c3ENAQJAIAAoAgwgASgCDEEAEPmAgIAARQ0AQQEPCyAALQAIQQFxRQ0BIAAoAgwiA0UNAQJAIANBoIqEgABBsIuEgABBABD9gICAACIARQ0AIAEoAgwhAQwBCwtBACECIANBoIqEgABBlIyEgABBABD9gICAACIARQ0AIAAgASgCDBCIgYCAACECCyACC2oBAX9BACECAkAgAUUNACABQaCKhIAAQZSMhIAAQQAQ/YCAgAAiAUUNACABKAIIIAAoAghBf3NxDQBBACECIAAoAgwgASgCDEEAEPmAgIAARQ0AIAAoAhAgASgCEEEAEPmAgIAAIQILIAILnwEAIAFBAToANQJAIAMgASgCBEcNACABQQE6ADQCQAJAIAEoAhAiAw0AIAFBATYCJCABIAQ2AhggASACNgIQIARBAUcNAiABKAIwQQFGDQEMAgsCQCADIAJHDQACQCABKAIYIgNBAkcNACABIAQ2AhggBCEDCyABKAIwQQFHDQIgA0EBRg0BDAILIAEgASgCJEEBajYCJAsgAUEBOgA2CwsgAAJAIAIgASgCBEcNACABKAIcQQFGDQAgASADNgIcCwudAgACQCAAIAEoAgggBBD5gICAAEUNACABIAEgAiADEIqBgIAADwsCQAJAIAAgASgCACAEEPmAgIAARQ0AAkACQCACIAEoAhBGDQAgAiABKAIURw0BCyADQQFHDQIgAUEBNgIgDwsgASADNgIgAkAgASgCLEEERg0AIAFBADsBNCAAKAIIIgAgASACIAJBASAEIAAoAgAoAhQRiICAgACAgICAAAJAIAEtADVBAUcNACABQQM2AiwgAS0ANEUNAQwDCyABQQQ2AiwLIAEgAjYCFCABIAEoAihBAWo2AiggASgCJEEBRw0BIAEoAhhBAkcNASABQQE6ADYPCyAAKAIIIgAgASACIAMgBCAAKAIAKAIYEYmAgIAAgICAgAALC6QBAAJAIAAgASgCCCAEEPmAgIAARQ0AIAEgASACIAMQioGAgAAPCwJA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AB0AAAArAAAA3AYBAHwHAQBTdDl0eXBlX2luZm8ATm8gZXJyb3IgaW5mb3JtYXRpb24ASWxsZWdhbCBieXRlIHNlcXVlbmNlAERvbWFpbiBlcnJvcgBSZXN1bHQgbm90IHJlcHJlc2VudGFibGUATm90IGEgdHR5AFBlcm1pc3Npb24gZGVuaWVkAE9wZXJhdGlvbiBub3QgcGVybWl0dGVkAE5vIHN1Y2ggZmlsZSBvciBkaXJlY3RvcnkATm8gc3VjaCBwcm9jZXNzAEZpbGUgZXhpc3RzAFZhbHVlIHRvbyBsYXJnZSBmb3IgZGF0YSB0eXBlAE5vIHNwYWNlIGxlZnQgb24gZGV2aWNlAE91dCBvZiBtZW1vcnkAUmVzb3VyY2UgYnVzeQBJbnRlcnJ1cHRlZCBzeXN0ZW0gY2FsbABSZXNvdXJjZSB0ZW1wb3JhcmlseSB1bmF2YWlsYWJsZQBJbnZhbGlkIHNlZWsAQ3Jvc3MtZGV2aWNlIGxpbmsAUmVhZC1vbmx5IGZpbGUgc3lzdGVtAERpcmVjdG9yeSBub3QgZW1wdHkAQ29ubmVjdGlvbiByZXNldCBieSBwZWVyAE9wZXJhdGlvbiB0aW1lZCBvdXQAQ29ubmVjdGlvbiByZWZ1c2VkAEhvc3QgaXMgZG93bgBIb3N0IGlzIHVucmVhY2hhYmxlAEFkZHJlc3MgaW4gdXNlAEJyb2tlbiBwaXBlAEkvTyBlcnJvcgBObyBzdWNoIGRldmljZSBvciBhZGRyZXNzAEJsb2NrIGRldmljZSByZXF1aXJlZABObyBzdWNoIGRldmljZQBOb3QgYSBkaXJlY3RvcnkASXMgYSBkaXJlY3RvcnkAVGV4dCBmaWxlIGJ1c3kARXhlYyBmb3JtYXQgZXJyb3IASW52YWxpZCBhcmd1bWVudABBcmd1bWVudCBsaXN0IHRvbyBsb25nAFN5bWJvbGljIGxpbmsgbG9vcABGaWxlbmFtZSB0b28gbG9uZwBUb28gbWFueSBvcGVuIGZpbGVzIGluIHN5c3RlbQBObyBmaWxlIGRlc2NyaXB0b3JzIGF2YWlsYWJsZQBCYWQgZmlsZSBkZXNjcmlwdG9yAE5vIGNoaWxkIHByb2Nlc3MAQmFkIGFkZHJlc3MARmlsZSB0b28gbGFyZ2UAVG9vIG1hbnkgbGlua3MATm8gbG9ja3MgYXZhaWxhYmxlAFJlc291cmNlIGRlYWRsb2NrIHdvdWxkIG9jY3VyAFN0YXRlIG5vdCByZWNvdmVyYWJsZQBQcmV2aW91cyBvd25lciBkaWVkAE9wZXJhdGlvbiBjYW5jZWxlZABGdW5jdGlvbiBub3QgaW1wbGVtZW50ZWQATm8gbWVzc2FnZSBvZiBkZXNpcmVkIHR5cGUASWRlbnRpZmllciByZW1vdmVkAERldmljZSBub3QgYSBzdHJlYW0ATm8gZGF0YSBhdmFpbGFibGUARGV2aWNlIHRpbWVvdXQAT3V0IG9mIHN0cmVhbXMgcmVzb3VyY2VzAExpbmsgaGFzIGJlZW4gc2V2ZXJlZABQcm90b2NvbCBlcnJvcgBCYWQgbWVzc2FnZQBGaWxlIGRlc2NyaXB0b3IgaW4gYmFkIHN0YXRlAE5vdCBhIHNvY2tldABEZXN0aW5hdGlvbiBhZGRyZXNzIHJlcXVpcmVkAE1lc3NhZ2UgdG9vIGxhcmdlAFByb3RvY29sIHdyb25nIHR5cGUgZm9yIHNvY2tldABQcm90b2NvbCBub3QgYXZhaWxhYmxlAFByb3RvY29sIG5vdCBzdXBwb3J0ZWQAU29ja2V0IHR5cGUgbm90IHN1cHBvcnRlZABOb3Qgc3VwcG9ydGVkAFByb3RvY29sIGZhbWlseSBub3Qgc3VwcG9ydGVkAEFkZHJlc3MgZmFtaWx5IG5vdCBzdXBwb3J0ZWQgYnkgcHJvdG9jb2wAQWRkcmVzcyBub3QgYXZhaWxhYmxlAE5ldHdvcmsgaXMgZG93bgBOZXR3b3JrIHVucmVhY2hhYmxlAENvbm5lY3Rpb24gcmVzZXQgYnkgbmV0d29yawBDb25uZWN0aW9uIGFib3J0ZWQATm8gYnVmZmVyIHNwYWNlIGF2YWlsYWJsZQBTb2NrZXQgaXMgY29ubmVjdGVkAFNvY2tldCBub3QgY29ubmVjdGVkAENhbm5vdCBzZW5kIGFmdGVyIHNvY2tldCBzaHV0ZG93bgBPcGVyYXRpb24gYWxyZWFkeSBpbiBwcm9ncmVzcwBPcGVyYXRpb24gaW4gcHJvZ3Jlc3MAU3RhbGUgZmlsZSBoYW5kbGUAUmVtb3RlIEkvTyBlcnJvcgBRdW90YSBleGNlZWRlZABObyBtZWRpdW0gZm91bmQAV3JvbmcgbWVkaXVtIHR5cGUATXVsdGlob3AgYXR0ZW1wdGVkAFJlcXVpcmVkIGtleSBub3QgYXZhaWxhYmxlAEtleSBoYXMgZXhwaXJlZABLZXkgaGFzIGJlZW4gcmV2b2tlZABLZXkgd2FzIHJlamVjdGVkIGJ5IHNlcnZpY2UAAAAAAAAAAAAAAAAAAAAApQJbAPABtQWMBSUBgwYdA5QE/wDHAzEDCwa8AY8BfwPKBCsA2gavAEIDTgPcAQ4EFQChBg0BlAILAjgGZAK8Av8CXQPnBAsHzwLLBe8F2wXhAh4GRQKFAIICbANvBPEA8wMYBdkA2gNMBlQCewGdA70EAABRABUCuwCzA20A/wGFBC8F+QQ4AGUBRgGfALcGqAFzAlMBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIQQAAAAAAAAAAC8CAAAAAAAAAAAAAAAAAAAAAAAAAAA1BEcEVgQAAAAAAAAAAAAAAAAAAAAAoAQAAAAAAAAAAAAAAAAAAAAAAABGBWAFbgVhBgAAzwEAAAAAAAAAAMkG6Qb5Bh4HOQdJB14HAEHQoAQL3AEEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAEBAAAAAAAAAQEBAQAAAAEAAAEBAQEBgBwBAAAAAAAFAAAAAAAAAAAAAAAVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWAAAAFwAAALwZAQAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAA//////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACYEAEAAEGsogQLYXsgY29uc29sZS5sb2coIkFQVSBTZXQgVm9sdW1lOiAiICsgJDApOyB9AHsgY29uc29sZS5sb2coInJlc2V0Iik7IH0AeyBjb25zb2xlLmxvZygicG93ZXJPZmYiKTsgfQAAlAEPdGFyZ2V0X2ZlYXR1cmVzCCsLYnVsay1tZW1vcnkrD2J1bGstbWVtb3J5LW9wdCsWY2FsbC1pbmRpcmVjdC1vdmVybG9uZysKbXVsdGl2YWx1ZSsPbXV0YWJsZS1nbG9iYWxzKxNub250cmFwcGluZy1mcHRvaW50Kw9yZWZlcmVuY2UtdHlwZXMrCHNpZ24tZXh0';

function getBinarySync(file) {
  if (file == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary);
  }
  var binary = tryParseAsDataURI(file);
  if (binary) {
    return binary;
  }
  if (readBinary) {
    return readBinary(file);
  }
  throw 'both async and sync fetching of the wasm failed';
}

async function getWasmBinary(binaryFile) {

  // Otherwise, getBinarySync should be able to get it synchronously
  return getBinarySync(binaryFile);
}

async function instantiateArrayBuffer(binaryFile, imports) {
  try {
    var binary = await getWasmBinary(binaryFile);
    var instance = await WebAssembly.instantiate(binary, imports);
    return instance;
  } catch (reason) {
    err(`failed to asynchronously prepare wasm: ${reason}`);

    // Warn on some common problems.
    if (isFileURI(wasmBinaryFile)) {
      err(`warning: Loading from a file URI (${wasmBinaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`);
    }
    abort(reason);
  }
}

async function instantiateAsync(binary, binaryFile, imports) {
  return instantiateArrayBuffer(binaryFile, imports);
}

function getWasmImports() {
  // prepare imports
  return {
    'env': wasmImports,
    'wasi_snapshot_preview1': wasmImports,
  }
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
async function createWasm() {
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/
  function receiveInstance(instance, module) {
    wasmExports = instance.exports;

    

    wasmMemory = wasmExports['memory'];
    
    assert(wasmMemory, 'memory not found in wasm exports');
    updateMemoryViews();

    wasmTable = wasmExports['__indirect_function_table'];
    
    assert(wasmTable, 'table not found in wasm exports');

    addOnInit(wasmExports['__wasm_call_ctors']);

    removeRunDependency('wasm-instantiate');
    return wasmExports;
  }
  // wait for the pthread pool (if any)
  addRunDependency('wasm-instantiate');

  // Prefer streaming instantiation if available.
  // Async compilation can be confusing when an error on the page overwrites Module
  // (for example, if the order of elements is wrong, and the one defining Module is
  // later), so we save Module and check it later.
  var trueModule = Module;
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
    trueModule = null;
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above PTHREADS-enabled path.
    return receiveInstance(result['instance']);
  }

  var info = getWasmImports();

  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  if (Module['instantiateWasm']) {
    try {
      return Module['instantiateWasm'](info, receiveInstance);
    } catch(e) {
      err(`Module.instantiateWasm callback failed with error: ${e}`);
        // If instantiation fails, reject the module ready promise.
        readyPromiseReject(e);
    }
  }

  try {
    var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
    var exports = receiveInstantiationResult(result);
    return exports;
  } catch (e) {
    // If instantiation fails, reject the module ready promise.
    readyPromiseReject(e);
    return Promise.reject(e);
  }
}

// === Body ===

var ASM_CONSTS = {
  69932: ($0) => { console.log("APU Set Volume: " + $0); },  
 69974: () => { console.log("reset"); },  
 70000: () => { console.log("powerOff"); }
};

// end include: preamble.js


  class ExitStatus {
      name = 'ExitStatus';
      constructor(status) {
        this.message = `Program terminated with exit(${status})`;
        this.status = status;
      }
    }

  var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        // Pass the module as the first argument.
        callbacks.shift()(Module);
      }
    };

  
    /**
     * @param {number} ptr
     * @param {string} type
     */
  function getValue(ptr, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': return HEAP8[ptr];
      case 'i8': return HEAP8[ptr];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP64[((ptr)>>3)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      case '*': return HEAPU32[((ptr)>>2)];
      default: abort(`invalid type for getValue: ${type}`);
    }
  }

  var noExitRuntime = Module['noExitRuntime'] || true;

  var ptrToString = (ptr) => {
      assert(typeof ptr === 'number');
      // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
      ptr >>>= 0;
      return '0x' + ptr.toString(16).padStart(8, '0');
    };

  
    /**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */
  function setValue(ptr, value, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': HEAP8[ptr] = value; break;
      case 'i8': HEAP8[ptr] = value; break;
      case 'i16': HEAP16[((ptr)>>1)] = value; break;
      case 'i32': HEAP32[((ptr)>>2)] = value; break;
      case 'i64': HEAP64[((ptr)>>3)] = BigInt(value); break;
      case 'float': HEAPF32[((ptr)>>2)] = value; break;
      case 'double': HEAPF64[((ptr)>>3)] = value; break;
      case '*': HEAPU32[((ptr)>>2)] = value; break;
      default: abort(`invalid type for setValue: ${type}`);
    }
  }

  var stackRestore = (val) => __emscripten_stack_restore(val);

  var stackSave = () => _emscripten_stack_get_current();

  var warnOnce = (text) => {
      warnOnce.shown ||= {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        err(text);
      }
    };

  var __abort_js = () =>
      abort('native code called abort()');

  var readEmAsmArgsArray = [];
  var readEmAsmArgs = (sigPtr, buf) => {
      // Nobody should have mutated _readEmAsmArgsArray underneath us to be something else than an array.
      assert(Array.isArray(readEmAsmArgsArray));
      // The input buffer is allocated on the stack, so it must be stack-aligned.
      assert(buf % 16 == 0);
      readEmAsmArgsArray.length = 0;
      var ch;
      // Most arguments are i32s, so shift the buffer pointer so it is a plain
      // index into HEAP32.
      while (ch = HEAPU8[sigPtr++]) {
        var chr = String.fromCharCode(ch);
        var validChars = ['d', 'f', 'i', 'p'];
        // In WASM_BIGINT mode we support passing i64 values as bigint.
        validChars.push('j');
        assert(validChars.includes(chr), `Invalid character ${ch}("${chr}") in readEmAsmArgs! Use only [${validChars}], and do not specify "v" for void return argument.`);
        // Floats are always passed as doubles, so all types except for 'i'
        // are 8 bytes and require alignment.
        var wide = (ch != 105);
        wide &= (ch != 112);
        buf += wide && (buf % 8) ? 4 : 0;
        readEmAsmArgsArray.push(
          // Special case for pointers under wasm64 or CAN_ADDRESS_2GB mode.
          ch == 112 ? HEAPU32[((buf)>>2)] :
          ch == 106 ? HEAP64[((buf)>>3)] :
          ch == 105 ?
            HEAP32[((buf)>>2)] :
            HEAPF64[((buf)>>3)]
        );
        buf += wide ? 8 : 4;
      }
      return readEmAsmArgsArray;
    };
  var runEmAsmFunction = (code, sigPtr, argbuf) => {
      var args = readEmAsmArgs(sigPtr, argbuf);
      assert(ASM_CONSTS.hasOwnProperty(code), `No EM_ASM constant found at address ${code}.  The loaded WebAssembly file is likely out of sync with the generated JavaScript.`);
      return ASM_CONSTS[code](...args);
    };
  var _emscripten_asm_const_int = (code, sigPtr, argbuf) => {
      return runEmAsmFunction(code, sigPtr, argbuf);
    };

  var getHeapMax = () =>
      HEAPU8.length;
  
  var alignMemory = (size, alignment) => {
      assert(alignment, "alignment argument is required");
      return Math.ceil(size / alignment) * alignment;
    };
  
  var abortOnCannotGrowMemory = (requestedSize) => {
      abort(`Cannot enlarge memory arrays to size ${requestedSize} bytes (OOM). Either (1) compile with -sINITIAL_MEMORY=X with X higher than the current value ${HEAP8.length}, (2) compile with -sALLOW_MEMORY_GROWTH which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with -sABORTING_MALLOC=0`);
    };
  var _emscripten_resize_heap = (requestedSize) => {
      var oldSize = HEAPU8.length;
      // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
      requestedSize >>>= 0;
      abortOnCannotGrowMemory(requestedSize);
    };

  var UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder() : undefined;
  
    /**
     * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
     * array that contains uint8 values, returns a copy of that string as a
     * Javascript String object.
     * heapOrArray is either a regular array, or a JavaScript typed array view.
     * @param {number=} idx
     * @param {number=} maxBytesToRead
     * @return {string}
     */
  var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead = NaN) => {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      // TextDecoder needs to know the byte length in advance, it doesn't stop on
      // null terminator by itself.  Also, use the length info to avoid running tiny
      // strings through TextDecoder, since .subarray() allocates garbage.
      // (As a tiny code save trick, compare endPtr against endIdx using a negation,
      // so that undefined/NaN means Infinity)
      while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
  
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = '';
      // If building with TextDecoder, we have already computed the string length
      // above, so test loop end condition against that
      while (idx < endPtr) {
        // For UTF8 byte structure, see:
        // http://en.wikipedia.org/wiki/UTF-8#Description
        // https://www.ietf.org/rfc/rfc2279.txt
        // https://tools.ietf.org/html/rfc3629
        var u0 = heapOrArray[idx++];
        if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 0xF0) == 0xE0) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          if ((u0 & 0xF8) != 0xF0) warnOnce('Invalid UTF-8 leading byte ' + ptrToString(u0) + ' encountered when deserializing a UTF-8 string in wasm memory to a JS string!');
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
        }
  
        if (u0 < 0x10000) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        }
      }
      return str;
    };
  
    /**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index (i.e. maxBytesToRead will not
     *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
     *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
     *   JS JIT optimizations off, so it is worth to consider consistently using one
     * @return {string}
     */
  var UTF8ToString = (ptr, maxBytesToRead) => {
      assert(typeof ptr == 'number', `UTF8ToString expects a number (got ${typeof ptr})`);
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
    };
  var SYSCALLS = {
  varargs:undefined,
  getStr(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },
  };
  var _fd_close = (fd) => {
      abort('fd_close called without SYSCALLS_REQUIRE_FILESYSTEM');
    };

  var INT53_MAX = 9007199254740992;
  
  var INT53_MIN = -9007199254740992;
  var bigintToI53Checked = (num) => (num < INT53_MIN || num > INT53_MAX) ? NaN : Number(num);
  function _fd_seek(fd, offset, whence, newOffset) {
    offset = bigintToI53Checked(offset);
  
    
      return 70;
    ;
  }

  var printCharBuffers = [null,[],[]];
  
  var printChar = (stream, curr) => {
      var buffer = printCharBuffers[stream];
      assert(buffer);
      if (curr === 0 || curr === 10) {
        (stream === 1 ? out : err)(UTF8ArrayToString(buffer));
        buffer.length = 0;
      } else {
        buffer.push(curr);
      }
    };
  
  var flush_NO_FILESYSTEM = () => {
      // flush anything remaining in the buffers during shutdown
      _fflush(0);
      if (printCharBuffers[1].length) printChar(1, 10);
      if (printCharBuffers[2].length) printChar(2, 10);
    };
  
  
  var _fd_write = (fd, iov, iovcnt, pnum) => {
      // hack to support printf in SYSCALLS_REQUIRE_FILESYSTEM=0
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        for (var j = 0; j < len; j++) {
          printChar(fd, HEAPU8[ptr+j]);
        }
        num += len;
      }
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    };

  var uleb128Encode = (n, target) => {
      assert(n < 16384);
      if (n < 128) {
        target.push(n);
      } else {
        target.push((n % 128) | 128, n >> 7);
      }
    };
  
  var sigToWasmTypes = (sig) => {
      var typeNames = {
        'i': 'i32',
        'j': 'i64',
        'f': 'f32',
        'd': 'f64',
        'e': 'externref',
        'p': 'i32',
      };
      var type = {
        parameters: [],
        results: sig[0] == 'v' ? [] : [typeNames[sig[0]]]
      };
      for (var i = 1; i < sig.length; ++i) {
        assert(sig[i] in typeNames, 'invalid signature char: ' + sig[i]);
        type.parameters.push(typeNames[sig[i]]);
      }
      return type;
    };
  
  var generateFuncType = (sig, target) => {
      var sigRet = sig.slice(0, 1);
      var sigParam = sig.slice(1);
      var typeCodes = {
        'i': 0x7f, // i32
        'p': 0x7f, // i32
        'j': 0x7e, // i64
        'f': 0x7d, // f32
        'd': 0x7c, // f64
        'e': 0x6f, // externref
      };
  
      // Parameters, length + signatures
      target.push(0x60 /* form: func */);
      uleb128Encode(sigParam.length, target);
      for (var i = 0; i < sigParam.length; ++i) {
        assert(sigParam[i] in typeCodes, 'invalid signature char: ' + sigParam[i]);
        target.push(typeCodes[sigParam[i]]);
      }
  
      // Return values, length + signatures
      // With no multi-return in MVP, either 0 (void) or 1 (anything else)
      if (sigRet == 'v') {
        target.push(0x00);
      } else {
        target.push(0x01, typeCodes[sigRet]);
      }
    };
  var convertJsFunctionToWasm = (func, sig) => {
  
      // If the type reflection proposal is available, use the new
      // "WebAssembly.Function" constructor.
      // Otherwise, construct a minimal wasm module importing the JS function and
      // re-exporting it.
      if (typeof WebAssembly.Function == "function") {
        return new WebAssembly.Function(sigToWasmTypes(sig), func);
      }
  
      // The module is static, with the exception of the type section, which is
      // generated based on the signature passed in.
      var typeSectionBody = [
        0x01, // count: 1
      ];
      generateFuncType(sig, typeSectionBody);
  
      // Rest of the module is static
      var bytes = [
        0x00, 0x61, 0x73, 0x6d, // magic ("\0asm")
        0x01, 0x00, 0x00, 0x00, // version: 1
        0x01, // Type section code
      ];
      // Write the overall length of the type section followed by the body
      uleb128Encode(typeSectionBody.length, bytes);
      bytes.push(...typeSectionBody);
  
      // The rest of the module is static
      bytes.push(
        0x02, 0x07, // import section
          // (import "e" "f" (func 0 (type 0)))
          0x01, 0x01, 0x65, 0x01, 0x66, 0x00, 0x00,
        0x07, 0x05, // export section
          // (export "f" (func 0 (type 0)))
          0x01, 0x01, 0x66, 0x00, 0x00,
      );
  
      // We can compile this wasm module synchronously because it is very small.
      // This accepts an import (at "e.f"), that it reroutes to an export (at "f")
      var module = new WebAssembly.Module(new Uint8Array(bytes));
      var instance = new WebAssembly.Instance(module, { 'e': { 'f': func } });
      var wrappedFunc = instance.exports['f'];
      return wrappedFunc;
    };
  
  var wasmTableMirror = [];
  
  /** @type {WebAssembly.Table} */
  var wasmTable;
  var getWasmTableEntry = (funcPtr) => {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
        /** @suppress {checkTypes} */
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      /** @suppress {checkTypes} */
      assert(wasmTable.get(funcPtr) == func, 'JavaScript-side Wasm function table mirror is out of date!');
      return func;
    };
  
  var updateTableMap = (offset, count) => {
      if (functionsInTableMap) {
        for (var i = offset; i < offset + count; i++) {
          var item = getWasmTableEntry(i);
          // Ignore null values.
          if (item) {
            functionsInTableMap.set(item, i);
          }
        }
      }
    };
  
  var functionsInTableMap;
  
  var getFunctionAddress = (func) => {
      // First, create the map if this is the first use.
      if (!functionsInTableMap) {
        functionsInTableMap = new WeakMap();
        updateTableMap(0, wasmTable.length);
      }
      return functionsInTableMap.get(func) || 0;
    };
  
  
  var freeTableIndexes = [];
  
  var getEmptyTableSlot = () => {
      // Reuse a free index if there is one, otherwise grow.
      if (freeTableIndexes.length) {
        return freeTableIndexes.pop();
      }
      // Grow the table
      try {
        /** @suppress {checkTypes} */
        wasmTable.grow(1);
      } catch (err) {
        if (!(err instanceof RangeError)) {
          throw err;
        }
        throw 'Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.';
      }
      return wasmTable.length - 1;
    };
  
  
  
  var setWasmTableEntry = (idx, func) => {
      /** @suppress {checkTypes} */
      wasmTable.set(idx, func);
      // With ABORT_ON_WASM_EXCEPTIONS wasmTable.get is overridden to return wrapped
      // functions so we need to call it here to retrieve the potential wrapper correctly
      // instead of just storing 'func' directly into wasmTableMirror
      /** @suppress {checkTypes} */
      wasmTableMirror[idx] = wasmTable.get(idx);
    };
  
  /** @param {string=} sig */
  var addFunction = (func, sig) => {
      assert(typeof func != 'undefined');
      // Check if the function is already in the table, to ensure each function
      // gets a unique index.
      var rtn = getFunctionAddress(func);
      if (rtn) {
        return rtn;
      }
  
      // It's not in the table, add it now.
  
      var ret = getEmptyTableSlot();
  
      // Set the new value.
      try {
        // Attempting to call this with JS function will cause of table.set() to fail
        setWasmTableEntry(ret, func);
      } catch (err) {
        if (!(err instanceof TypeError)) {
          throw err;
        }
        assert(typeof sig != 'undefined', 'Missing signature argument to addFunction: ' + func);
        var wrapped = convertJsFunctionToWasm(func, sig);
        setWasmTableEntry(ret, wrapped);
      }
  
      functionsInTableMap.set(func, ret);
  
      return ret;
    };

  
  
  
  
  var removeFunction = (index) => {
      functionsInTableMap.delete(getWasmTableEntry(index));
      setWasmTableEntry(index, null);
      freeTableIndexes.push(index);
    };
function checkIncomingModuleAPI() {
  ignoredModuleProp('fetchSettings');
}
var wasmImports = {
  /** @export */
  _abort_js: __abort_js,
  /** @export */
  emscripten_asm_const_int: _emscripten_asm_const_int,
  /** @export */
  emscripten_resize_heap: _emscripten_resize_heap,
  /** @export */
  fd_close: _fd_close,
  /** @export */
  fd_seek: _fd_seek,
  /** @export */
  fd_write: _fd_write
};
var wasmExports = await createWasm();
var ___wasm_call_ctors = createExportWrapper('__wasm_call_ctors', 0);
var _setVolume = Module['_setVolume'] = createExportWrapper('setVolume', 1);
var _setIrqCallback = Module['_setIrqCallback'] = createExportWrapper('setIrqCallback', 1);
var _setDmcCallback = Module['_setDmcCallback'] = createExportWrapper('setDmcCallback', 1);
var _step = Module['_step'] = createExportWrapper('step', 1);
var _writeMem = Module['_writeMem'] = createExportWrapper('writeMem', 2);
var _readMem = Module['_readMem'] = createExportWrapper('readMem', 1);
var _reset = Module['_reset'] = createExportWrapper('reset', 0);
var _powerOff = Module['_powerOff'] = createExportWrapper('powerOff', 0);
var _fflush = createExportWrapper('fflush', 1);
var _strerror = createExportWrapper('strerror', 1);
var _emscripten_stack_init = wasmExports['emscripten_stack_init']
var _emscripten_stack_get_free = wasmExports['emscripten_stack_get_free']
var _emscripten_stack_get_base = wasmExports['emscripten_stack_get_base']
var _emscripten_stack_get_end = wasmExports['emscripten_stack_get_end']
var __emscripten_stack_restore = wasmExports['_emscripten_stack_restore']
var __emscripten_stack_alloc = wasmExports['_emscripten_stack_alloc']
var _emscripten_stack_get_current = wasmExports['emscripten_stack_get_current']


// include: postamble.js
// === Auto-generated postamble setup entry stuff ===

Module['addFunction'] = addFunction;
Module['removeFunction'] = removeFunction;
var missingLibrarySymbols = [
  'writeI53ToI64',
  'writeI53ToI64Clamped',
  'writeI53ToI64Signaling',
  'writeI53ToU64Clamped',
  'writeI53ToU64Signaling',
  'readI53FromI64',
  'readI53FromU64',
  'convertI32PairToI53',
  'convertI32PairToI53Checked',
  'convertU32PairToI53',
  'stackAlloc',
  'getTempRet0',
  'setTempRet0',
  'zeroMemory',
  'exitJS',
  'growMemory',
  'strError',
  'inetPton4',
  'inetNtop4',
  'inetPton6',
  'inetNtop6',
  'readSockaddr',
  'writeSockaddr',
  'emscriptenLog',
  'runMainThreadEmAsm',
  'jstoi_q',
  'getExecutableName',
  'listenOnce',
  'autoResumeAudioContext',
  'getDynCaller',
  'dynCall',
  'handleException',
  'keepRuntimeAlive',
  'runtimeKeepalivePush',
  'runtimeKeepalivePop',
  'callUserCallback',
  'maybeExit',
  'asmjsMangle',
  'asyncLoad',
  'mmapAlloc',
  'HandleAllocator',
  'getNativeTypeSize',
  'STACK_SIZE',
  'STACK_ALIGN',
  'POINTER_SIZE',
  'ASSERTIONS',
  'getCFunc',
  'ccall',
  'cwrap',
  'reallyNegative',
  'unSign',
  'strLen',
  'reSign',
  'formatString',
  'stringToUTF8Array',
  'stringToUTF8',
  'lengthBytesUTF8',
  'intArrayFromString',
  'intArrayToString',
  'AsciiToString',
  'stringToAscii',
  'UTF16ToString',
  'stringToUTF16',
  'lengthBytesUTF16',
  'UTF32ToString',
  'stringToUTF32',
  'lengthBytesUTF32',
  'stringToNewUTF8',
  'stringToUTF8OnStack',
  'writeArrayToMemory',
  'registerKeyEventCallback',
  'maybeCStringToJsString',
  'findEventTarget',
  'getBoundingClientRect',
  'fillMouseEventData',
  'registerMouseEventCallback',
  'registerWheelEventCallback',
  'registerUiEventCallback',
  'registerFocusEventCallback',
  'fillDeviceOrientationEventData',
  'registerDeviceOrientationEventCallback',
  'fillDeviceMotionEventData',
  'registerDeviceMotionEventCallback',
  'screenOrientation',
  'fillOrientationChangeEventData',
  'registerOrientationChangeEventCallback',
  'fillFullscreenChangeEventData',
  'registerFullscreenChangeEventCallback',
  'JSEvents_requestFullscreen',
  'JSEvents_resizeCanvasForFullscreen',
  'registerRestoreOldStyle',
  'hideEverythingExceptGivenElement',
  'restoreHiddenElements',
  'setLetterbox',
  'softFullscreenResizeWebGLRenderTarget',
  'doRequestFullscreen',
  'fillPointerlockChangeEventData',
  'registerPointerlockChangeEventCallback',
  'registerPointerlockErrorEventCallback',
  'requestPointerLock',
  'fillVisibilityChangeEventData',
  'registerVisibilityChangeEventCallback',
  'registerTouchEventCallback',
  'fillGamepadEventData',
  'registerGamepadEventCallback',
  'registerBeforeUnloadEventCallback',
  'fillBatteryEventData',
  'battery',
  'registerBatteryEventCallback',
  'setCanvasElementSize',
  'getCanvasElementSize',
  'jsStackTrace',
  'getCallstack',
  'convertPCtoSourceLocation',
  'getEnvStrings',
  'checkWasiClock',
  'wasiRightsToMuslOFlags',
  'wasiOFlagsToMuslOFlags',
  'initRandomFill',
  'randomFill',
  'safeSetTimeout',
  'setImmediateWrapped',
  'safeRequestAnimationFrame',
  'clearImmediateWrapped',
  'registerPostMainLoop',
  'registerPreMainLoop',
  'getPromise',
  'makePromise',
  'idsToPromises',
  'makePromiseCallback',
  'ExceptionInfo',
  'findMatchingCatch',
  'Browser_asyncPrepareDataCounter',
  'isLeapYear',
  'ydayFromDate',
  'arraySum',
  'addDays',
  'getSocketFromFD',
  'getSocketAddress',
  'FS_createPreloadedFile',
  'FS_modeStringToFlags',
  'FS_getMode',
  'FS_stdin_getChar',
  'FS_unlink',
  'FS_createDataFile',
  'FS_mkdirTree',
  '_setNetworkCallback',
  'heapObjectForWebGLType',
  'toTypedArrayIndex',
  'webgl_enable_ANGLE_instanced_arrays',
  'webgl_enable_OES_vertex_array_object',
  'webgl_enable_WEBGL_draw_buffers',
  'webgl_enable_WEBGL_multi_draw',
  'webgl_enable_EXT_polygon_offset_clamp',
  'webgl_enable_EXT_clip_control',
  'webgl_enable_WEBGL_polygon_mode',
  'emscriptenWebGLGet',
  'computeUnpackAlignedImageSize',
  'colorChannelsInGlTextureFormat',
  'emscriptenWebGLGetTexPixelData',
  'emscriptenWebGLGetUniform',
  'webglGetUniformLocation',
  'webglPrepareUniformLocationsBeforeFirstUse',
  'webglGetLeftBracePos',
  'emscriptenWebGLGetVertexAttrib',
  '__glGetActiveAttribOrUniform',
  'writeGLArray',
  'registerWebGlEventCallback',
  'runAndAbortIfError',
  'ALLOC_NORMAL',
  'ALLOC_STACK',
  'allocate',
  'writeStringToMemory',
  'writeAsciiToMemory',
  'setErrNo',
  'demangle',
  'stackTrace',
];
missingLibrarySymbols.forEach(missingLibrarySymbol)

var unexportedSymbols = [
  'run',
  'addOnPreRun',
  'addOnInit',
  'addOnPreMain',
  'addOnExit',
  'addOnPostRun',
  'addRunDependency',
  'removeRunDependency',
  'out',
  'err',
  'callMain',
  'abort',
  'wasmMemory',
  'wasmExports',
  'writeStackCookie',
  'checkStackCookie',
  'INT53_MAX',
  'INT53_MIN',
  'bigintToI53Checked',
  'stackSave',
  'stackRestore',
  'ptrToString',
  'getHeapMax',
  'abortOnCannotGrowMemory',
  'ENV',
  'ERRNO_CODES',
  'DNS',
  'Protocols',
  'Sockets',
  'timers',
  'warnOnce',
  'readEmAsmArgsArray',
  'readEmAsmArgs',
  'runEmAsmFunction',
  'jstoi_s',
  'alignMemory',
  'wasmTable',
  'noExitRuntime',
  'uleb128Encode',
  'sigToWasmTypes',
  'generateFuncType',
  'convertJsFunctionToWasm',
  'freeTableIndexes',
  'functionsInTableMap',
  'getEmptyTableSlot',
  'updateTableMap',
  'getFunctionAddress',
  'setValue',
  'getValue',
  'PATH',
  'PATH_FS',
  'UTF8Decoder',
  'UTF8ArrayToString',
  'UTF8ToString',
  'UTF16Decoder',
  'JSEvents',
  'specialHTMLTargets',
  'findCanvasEventTarget',
  'currentFullscreenStrategy',
  'restoreOldWindowedStyle',
  'UNWIND_CACHE',
  'ExitStatus',
  'flush_NO_FILESYSTEM',
  'emSetImmediate',
  'emClearImmediate_deps',
  'emClearImmediate',
  'promiseMap',
  'uncaughtExceptionCount',
  'exceptionLast',
  'exceptionCaught',
  'Browser',
  'getPreloadedImageData__data',
  'wget',
  'MONTH_DAYS_REGULAR',
  'MONTH_DAYS_LEAP',
  'MONTH_DAYS_REGULAR_CUMULATIVE',
  'MONTH_DAYS_LEAP_CUMULATIVE',
  'SYSCALLS',
  'preloadPlugins',
  'FS_stdin_getChar_buffer',
  'FS_createPath',
  'FS_createDevice',
  'FS_readFile',
  'FS',
  'FS_createLazyFile',
  'MEMFS',
  'TTY',
  'PIPEFS',
  'SOCKFS',
  'tempFixedLengthArray',
  'miniTempWebGLFloatBuffers',
  'miniTempWebGLIntBuffers',
  'GL',
  'AL',
  'GLUT',
  'EGL',
  'GLEW',
  'IDBStore',
  'SDL',
  'SDL_gfx',
  'allocateUTF8',
  'allocateUTF8OnStack',
  'print',
  'printErr',
];
unexportedSymbols.forEach(unexportedRuntimeSymbol);



var calledRun;

function stackCheckInit() {
  // This is normally called automatically during __wasm_call_ctors but need to
  // get these values before even running any of the ctors so we call it redundantly
  // here.
  _emscripten_stack_init();
  // TODO(sbc): Move writeStackCookie to native to to avoid this.
  writeStackCookie();
}

function run() {

  if (runDependencies > 0) {
    dependenciesFulfilled = run;
    return;
  }

  stackCheckInit();

  preRun();

  // a preRun added a dependency, run will be called later
  if (runDependencies > 0) {
    dependenciesFulfilled = run;
    return;
  }

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    assert(!calledRun);
    calledRun = true;
    Module['calledRun'] = true;

    if (ABORT) return;

    initRuntime();

    readyPromiseResolve(Module);
    Module['onRuntimeInitialized']?.();

    assert(!Module['_main'], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(() => {
      setTimeout(() => Module['setStatus'](''), 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
  checkStackCookie();
}

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var oldOut = out;
  var oldErr = err;
  var has = false;
  out = err = (x) => {
    has = true;
  }
  try { // it doesn't matter if it fails
    flush_NO_FILESYSTEM();
  } catch(e) {}
  out = oldOut;
  err = oldErr;
  if (has) {
    warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.');
    warnOnce('(this may also be due to not including full filesystem support - try building with -sFORCE_FILESYSTEM)');
  }
}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

run();

// end include: postamble.js

// include: postamble_modularize.js
// In MODULARIZE mode we wrap the generated code in a factory function
// and return either the Module itself, or a promise of the module.
//
// We assign to the `moduleRtn` global here and configure closure to see
// this as and extern so it won't get minified.

moduleRtn = readyPromise;

// Assertion for attempting to access module properties on the incoming
// moduleArg.  In the past we used this object as the prototype of the module
// and assigned properties to it, but now we return a distinct object.  This
// keeps the instance private until it is ready (i.e the promise has been
// resolved).
for (const prop of Object.keys(Module)) {
  if (!(prop in moduleArg)) {
    Object.defineProperty(moduleArg, prop, {
      configurable: true,
      get() {
        abort(`Access to module property ('${prop}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`)
      }
    });
  }
}
// end include: postamble_modularize.js



  return moduleRtn;
}
);
})();
(() => {
  // Create a small, never-async wrapper around Module which
  // checks for callers incorrectly using it with `new`.
  var real_Module = Module;
  Module = function(arg) {
    if (new.target) throw new Error("Module() should not be called with `new Module()`");
    return real_Module(arg);
  }
})();
export default Module;
