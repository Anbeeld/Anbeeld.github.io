var Tilted;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/bezier-easing/src/index.js":
/*!*************************************************!*\
  !*** ./node_modules/bezier-easing/src/index.js ***!
  \*************************************************/
/***/ ((module) => {

/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */

// These values are established by empiricism with tests (tradeoff: performance VS precision)
var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;

var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

var float32ArraySupported = typeof Float32Array === 'function';

function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
function C (aA1)      { return 3.0 * aA1; }

// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

function binarySubdivide (aX, aA, aB, mX1, mX2) {
  var currentX, currentT, i = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
}

function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
 for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
   var currentSlope = getSlope(aGuessT, mX1, mX2);
   if (currentSlope === 0.0) {
     return aGuessT;
   }
   var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
   aGuessT -= currentX / currentSlope;
 }
 return aGuessT;
}

function LinearEasing (x) {
  return x;
}

module.exports = function bezier (mX1, mY1, mX2, mY2) {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range');
  }

  if (mX1 === mY1 && mX2 === mY2) {
    return LinearEasing;
  }

  // Precompute samples table
  var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
  for (var i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
  }

  function getTForX (aX) {
    var intervalStart = 0.0;
    var currentSample = 1;
    var lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    // Interpolate to provide an initial guess for t
    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    var guessForT = intervalStart + dist * kSampleStepSize;

    var initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }

  return function BezierEasing (x) {
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0) {
      return 0;
    }
    if (x === 1) {
      return 1;
    }
    return calcBezier(getTForX(x), mY1, mY2);
  };
};


/***/ }),

/***/ "./lib/animation/animation.ts":
/*!************************************!*\
  !*** ./lib/animation/animation.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Animation)
/* harmony export */ });
class Animation {
    constructor(surface) {
        this.timestampStart = 0;
        this.timestampLast = 0;
        this.stepLog = [];
        this.destroyed = false;
        this.surface = surface;
        this.timestampStart = this.timestampLast = performance.now();
    }
    logStep(step) {
        this.stepLog.push(step);
    }
    destroy() {
        this.destroyed = true;
    }
}


/***/ }),

/***/ "./lib/animation/drag.ts":
/*!*******************************!*\
  !*** ./lib/animation/drag.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AnimationSurfaceDrag)
/* harmony export */ });
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v4.js");
/* harmony import */ var _animation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./animation.js */ "./lib/animation/animation.ts");


class AnimationSurfaceDrag extends _animation_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(surface, mouse) {
        super(surface);
        this.prev = { x: 0, y: 0 };
        this.cumulated = { x: 0, y: 0 };
        this.surface.cancelOngoingMoves();
        this.id = (0,uuid__WEBPACK_IMPORTED_MODULE_1__["default"])();
        this.prev = {
            x: mouse.x,
            y: mouse.y
        };
        console.log('Drag started');
    }
    step(mouse) {
        // this.timestampLast = performance.now();
        let wasMoved = this.surface.move((this.prev.x - mouse.x) / this.surface.scale, (this.prev.y - mouse.y) / this.surface.scale);
        this.cumulated = {
            x: this.cumulated.x + this.prev.x - mouse.x,
            y: this.cumulated.y + this.prev.y - mouse.y
        };
        this.prev = {
            x: mouse.x,
            y: mouse.y
        };
        return wasMoved;
    }
    destroy() {
        if (performance.now() - this.timestampStart < this.surface.CONFIG.DURATION_FOR_THROW.VALUE) {
            this.throw();
        }
        this.destroyed = true;
    }
    throw() {
        this.surface.glide(this.cumulated.x * this.surface.CONFIG.THROW_MULTIPLIER.VALUE, this.cumulated.y * this.surface.CONFIG.THROW_MULTIPLIER.VALUE, this.surface.CONFIG.ANIMATION_THROW_TIME.VALUE, [0, 0.55, 0.45, 1]);
    }
}


/***/ }),

/***/ "./lib/animation/edge.ts":
/*!*******************************!*\
  !*** ./lib/animation/edge.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AnimationSurfaceEdge)
/* harmony export */ });
/* harmony import */ var _animation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./animation.js */ "./lib/animation/animation.ts");

class AnimationSurfaceEdge extends _animation_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(surface, x, y) {
        super(surface);
        this.x = x;
        this.y = y;
    }
    update(x, y) {
        if (this.x !== x) {
            this.x = x;
        }
        if (this.y !== y) {
            this.y = y;
        }
    }
    step(timestampCurrent) {
        if (this.destroyed) {
            return false;
        }
        let timeFactor = Math.max(1, (timestampCurrent - this.timestampLast)) / 10;
        let x = this.surface.CONFIG.EDGE_MOVE_SPEED.VALUE * this.x / this.surface.scale * timeFactor;
        let y = this.surface.CONFIG.EDGE_MOVE_SPEED.VALUE * this.y / this.surface.scale * timeFactor;
        this.timestampLast = timestampCurrent;
        return this.surface.move(x, y);
    }
}


/***/ }),

/***/ "./lib/animation/executor.ts":
/*!***********************************!*\
  !*** ./lib/animation/executor.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AnimationExecutor)
/* harmony export */ });
class AnimationExecutor {
    constructor(surface, animationStorage) {
        this.executing = false;
        this.surface = surface;
        this.animationStorage = animationStorage;
    }
    initiate() {
        if (!this.executing) {
            this.executing = true;
            this.step();
        }
    }
    step() {
        let timestampCurrent = performance.now();
        requestAnimationFrame(() => {
            this.executing =  false || this.stepSurfaceGlide(timestampCurrent) || this.stepSurfaceEdge(timestampCurrent);
            if (this.executing) {
                this.step();
            }
        });
    }
    stepSurfaceGlide(timestampCurrent) {
        if (!this.animationStorage.surfaceGlideIsSet()) {
            return false;
        }
        let shouldContinue = this.animationStorage.surfaceGlide.step(timestampCurrent);
        if (!shouldContinue) {
            this.animationStorage.destroySurfaceGlide();
        }
        return shouldContinue;
    }
    stepSurfaceEdge(timestampCurrent) {
        if (!this.animationStorage.surfaceEdgeIsSet()) {
            return false;
        }
        let shouldContinue = this.animationStorage.surfaceEdge.step(timestampCurrent);
        if (!shouldContinue) {
            this.animationStorage.destroySurfaceEdge();
        }
        return shouldContinue;
    }
}


/***/ }),

/***/ "./lib/animation/glide.ts":
/*!********************************!*\
  !*** ./lib/animation/glide.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AnimationSurfaceGlide)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./lib/utils.ts");
/* harmony import */ var _animation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./animation.js */ "./lib/animation/animation.ts");
/* harmony import */ var bezier_easing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bezier-easing */ "./node_modules/bezier-easing/src/index.js");
/* harmony import */ var bezier_easing__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bezier_easing__WEBPACK_IMPORTED_MODULE_2__);



class AnimationSurfaceGlide extends _animation_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
    constructor(surface, x, y, animationTime, easingFormula) {
        super(surface);
        this.current = { x: 0, y: 0 };
        this.initial = {
            x: surface.x,
            y: surface.y
        };
        this.target = {
            x: this.initial.x + x,
            y: this.initial.y + y
        };
        this.x = {
            value: Math.abs(x),
            sign: x > 0 ? 1 : -1
        };
        this.y = {
            value: Math.abs(y),
            sign: y > 0 ? 1 : -1
        };
        this.animationTime = animationTime;
        this.bezierEasing = bezier_easing__WEBPACK_IMPORTED_MODULE_2___default()(easingFormula[0], easingFormula[1], easingFormula[2], easingFormula[3]);
        console.log('Glide created: x ' + this.x.value + ', y ' + this.y.value + ', initial.x ' + this.initial.x + ', initial.y ' + this.initial.y + ', target.x ' + this.target.x + ', target.y ' + this.target.y);
    }
    step(timestampCurrent) {
        if (this.destroyed) {
            return false;
        }
        let timeRatio = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.clampRatio)((timestampCurrent - this.timestampStart) / this.animationTime);
        let moveRatio = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.clampRatio)(this.bezierEasing(timeRatio));
        if (moveRatio >= 1) {
            this.logFinish(timestampCurrent);
            this.surface.moveTo(this.target.x, this.target.y);
            return false;
        }
        else {
            let moveX = 0;
            let moveY = 0;
            if (this.x.value > 0 && this.x.value > this.current.x) {
                moveX = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(Math.max(0, this.x.value * moveRatio - this.current.x), this.surface.CONFIG.COORD_ROUNDING_INTERIM.VALUE);
            }
            if (this.y.value > 0 && this.y.value > this.current.y) {
                moveY = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(Math.max(0, this.y.value * moveRatio - this.current.y), this.surface.CONFIG.COORD_ROUNDING_INTERIM.VALUE);
            }
            if (moveX > 0 || moveY > 0) {
                this.surface.move(moveX * this.x.sign, moveY * this.y.sign, this.surface.CONFIG.COORD_ROUNDING_INTERIM.VALUE, this.surface.CONFIG.COORD_ROUNDING_INTERIM.VALUE);
                this.current.x = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(this.current.x + moveX, this.surface.CONFIG.COORD_ROUNDING_INTERIM.VALUE);
                this.current.y = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(this.current.y + moveY, this.surface.CONFIG.COORD_ROUNDING_INTERIM.VALUE);
                this.timestampLast = timestampCurrent;
                this.logStep('time ' + (timestampCurrent - this.timestampStart) + 'ms, timeRatio ' + timeRatio + ', moveRatio ' + moveRatio + ', x ' + moveX + ', y ' + moveY);
            }
            // Signal that animation hasn't finished yet
            return true;
        }
    }
    logFinish(timestampCurrent) {
        console.log('Glide finished: ' + (timestampCurrent - this.timestampStart) + 'ms, surface.x ' + this.surface.x + ', surface.y ' + this.surface.y + ', target.x ' + this.target.x + ', target.y ' + this.target.y + '\n\nSteps:\n' + this.stepLog.join('\n'));
    }
}


/***/ }),

/***/ "./lib/animation/storage.ts":
/*!**********************************!*\
  !*** ./lib/animation/storage.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AnimationStorage)
/* harmony export */ });
/* harmony import */ var _glide_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./glide.js */ "./lib/animation/glide.ts");
/* harmony import */ var _edge_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edge.js */ "./lib/animation/edge.ts");
/* harmony import */ var _drag_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./drag.js */ "./lib/animation/drag.ts");



class AnimationStorage {
    constructor(surface) {
        this.surfaceGlide = null;
        this.surfaceEdge = null;
        this.surfaceDrag = null;
        this.surface = surface;
    }
    createSurfaceGlide(x, y, animationTime, easingFormula) {
        this.surfaceGlide = new _glide_js__WEBPACK_IMPORTED_MODULE_0__["default"](this.surface, x, y, animationTime, easingFormula);
    }
    destroySurfaceGlide() {
        if (this.surfaceGlideIsSet()) {
            this.surfaceGlide.destroy();
            this.surfaceGlide = null;
            console.log('AnimationSurfaceGlide destroyed');
        }
    }
    surfaceGlideIsSet() {
        return this.surfaceGlide !== null;
    }
    createSurfaceEdge(x, y) {
        this.surfaceEdge = new _edge_js__WEBPACK_IMPORTED_MODULE_1__["default"](this.surface, x, y);
    }
    destroySurfaceEdge() {
        if (this.surfaceEdgeIsSet()) {
            this.surfaceEdge.destroy();
            this.surfaceEdge = null;
            console.log('AnimationSurfaceEdge destroyed');
        }
    }
    surfaceEdgeIsSet() {
        return this.surfaceEdge !== null;
    }
    createSurfaceDrag(mouse) {
        this.surfaceDrag = new _drag_js__WEBPACK_IMPORTED_MODULE_2__["default"](this.surface, mouse);
    }
    destroySurfaceDrag() {
        if (this.surfaceDragIsSet()) {
            this.surfaceDrag.destroy();
            this.surfaceDrag = null;
            console.log('AnimationSurfaceDrag destroyed');
        }
    }
    surfaceDragIsSet() {
        return this.surfaceDrag !== null;
    }
}


/***/ }),

/***/ "./lib/config.ts":
/*!***********************!*\
  !*** ./lib/config.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setupConfig: () => (/* binding */ setupConfig)
/* harmony export */ });
var ConfigPropertyType;
(function (ConfigPropertyType) {
    ConfigPropertyType["Angle"] = "angle";
    ConfigPropertyType["Color"] = "color";
    ConfigPropertyType["Integer"] = "integer";
    ConfigPropertyType["Number"] = "number";
    ConfigPropertyType["Length"] = "length";
    ConfigPropertyType["Time"] = "time";
})(ConfigPropertyType || (ConfigPropertyType = {}));
function setupConfig(configCustom) {
    let config = {
        DEBUG_MODE: 0,
        SCALE_STEP: 0.20, // Percent of 1/2 total scale, e.g. 0.20 means 5 steps from 0.25 to 0.50 and 5 steps from 0.50 to 1
        SCALE_MIN: 0.25,
        SCALE_DEFAULT: 0.50,
        SCALE_MAX: 1.00,
        SCALE_ROUNDING: 3,
        PERSPECTIVE_DISTANCE: 1000,
        SKEW_X_MAX: 35,
        EDGE_MOVE_ENABLED: 0,
        EDGE_MOVE_AREA: 20,
        EDGE_MOVE_SPEED: 10,
        ANIMATION_SCALE_TIME: 500,
        ANIMATION_GLIDE_TIME: 500,
        DURATION_FOR_THROW: 150,
        THROW_MULTIPLIER: 4,
        ANIMATION_THROW_TIME: 1000,
        COORD_ROUNDING_INTERIM: 1,
        COORD_ROUNDING_FINAL: 0
    };
    for (const parameter in configCustom) {
        if (config.hasOwnProperty(parameter)) {
            let value = configCustom[parameter];
            if (value === true) {
                value = 1;
            }
            else if (value === false) {
                value = 0;
            }
            config[parameter] = value;
        }
    }
    const CONFIG = {
        DEBUG_MODE: {
            VALUE: config.DEBUG_MODE,
            TYPE: ConfigPropertyType.Integer
        },
        SCALE_STEP: {
            VALUE: config.SCALE_STEP,
            TYPE: ConfigPropertyType.Number
        },
        SCALE_MIN: {
            VALUE: config.SCALE_MIN,
            TYPE: ConfigPropertyType.Number
        },
        SCALE_DEFAULT: {
            VALUE: config.SCALE_DEFAULT,
            TYPE: ConfigPropertyType.Number
        },
        SCALE_MAX: {
            VALUE: config.SCALE_MAX,
            TYPE: ConfigPropertyType.Number
        },
        SCALE_ROUNDING: {
            VALUE: config.SCALE_ROUNDING,
            TYPE: ConfigPropertyType.Number
        },
        PERSPECTIVE_DISTANCE: {
            VALUE: Math.round(config.PERSPECTIVE_DISTANCE),
            TYPE: ConfigPropertyType.Length
        },
        SKEW_X_MAX: {
            VALUE: Math.round(config.SKEW_X_MAX),
            TYPE: ConfigPropertyType.Angle
        },
        EDGE_MOVE_ENABLED: {
            VALUE: config.EDGE_MOVE_ENABLED,
            TYPE: ConfigPropertyType.Integer
        },
        EDGE_MOVE_AREA: {
            VALUE: Math.round(config.EDGE_MOVE_AREA),
            TYPE: ConfigPropertyType.Length
        },
        EDGE_MOVE_SPEED: {
            VALUE: Math.round(config.EDGE_MOVE_SPEED),
            TYPE: ConfigPropertyType.Length
        },
        ANIMATION_SCALE_TIME: {
            VALUE: Math.round(config.ANIMATION_SCALE_TIME),
            TYPE: ConfigPropertyType.Time
        },
        ANIMATION_GLIDE_TIME: {
            VALUE: Math.round(config.ANIMATION_GLIDE_TIME),
            TYPE: ConfigPropertyType.Time
        },
        DURATION_FOR_THROW: {
            VALUE: Math.round(config.DURATION_FOR_THROW),
            TYPE: ConfigPropertyType.Time
        },
        THROW_MULTIPLIER: {
            VALUE: config.THROW_MULTIPLIER,
            TYPE: ConfigPropertyType.Number
        },
        ANIMATION_THROW_TIME: {
            VALUE: Math.round(config.ANIMATION_THROW_TIME),
            TYPE: ConfigPropertyType.Time
        },
        COORD_ROUNDING_INTERIM: {
            VALUE: config.COORD_ROUNDING_INTERIM,
            TYPE: ConfigPropertyType.Integer
        },
        COORD_ROUNDING_FINAL: {
            VALUE: config.COORD_ROUNDING_FINAL,
            TYPE: ConfigPropertyType.Integer
        }
    };
    return CONFIG;
}


/***/ }),

/***/ "./lib/controls/controls.ts":
/*!**********************************!*\
  !*** ./lib/controls/controls.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initControls: () => (/* binding */ initControls)
/* harmony export */ });
/* harmony import */ var _mouse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mouse.js */ "./lib/controls/mouse.ts");
/* harmony import */ var _keyboard_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keyboard.js */ "./lib/controls/keyboard.ts");
/* harmony import */ var _scale_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scale.js */ "./lib/controls/scale.ts");
/* harmony import */ var _drag_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./drag.js */ "./lib/controls/drag.ts");




function initControls(surface) {
    surface.elements.container.addEventListener("mousemove", (e) => { (0,_mouse_js__WEBPACK_IMPORTED_MODULE_0__.mouseMove)(e, surface); });
    surface.elements.container.addEventListener("wheel", (e) => { (0,_mouse_js__WEBPACK_IMPORTED_MODULE_0__.mouseWheel)(e, surface); });
    (0,_drag_js__WEBPACK_IMPORTED_MODULE_3__.initDrag)(surface);
    surface.elements.container.addEventListener("mousedown", (e) => { (0,_mouse_js__WEBPACK_IMPORTED_MODULE_0__.mouseDown)(e, surface); });
    surface.elements.container.addEventListener("touchstart", (e) => { (0,_mouse_js__WEBPACK_IMPORTED_MODULE_0__.mouseDown)(e, surface); });
    document.body.addEventListener("keydown", (e) => { (0,_keyboard_js__WEBPACK_IMPORTED_MODULE_1__.buttonPressed)(e, surface); });
    surface.elements.controlsZoomIn.addEventListener("click", () => { (0,_scale_js__WEBPACK_IMPORTED_MODULE_2__.scaleAndGlide)(surface, 1); });
    surface.elements.controlsZoomOut.addEventListener("click", () => { (0,_scale_js__WEBPACK_IMPORTED_MODULE_2__.scaleAndGlide)(surface, -1); });
    surface.elements.container.ondragstart = () => {
        return false;
    };
}


/***/ }),

/***/ "./lib/controls/drag.ts":
/*!******************************!*\
  !*** ./lib/controls/drag.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initDrag: () => (/* binding */ initDrag)
/* harmony export */ });
/* harmony import */ var _controls_mouse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../controls/mouse.js */ "./lib/controls/mouse.ts");

function initDrag(surface) {
    function moveToDrag(event) {
        if (surface.animationStorage.surfaceDragIsSet()) {
            surface.animationStorage.surfaceDrag.step((0,_controls_mouse_js__WEBPACK_IMPORTED_MODULE_0__.getMouseParams)(event, surface));
        }
    }
    surface.elements.container.addEventListener('mousemove', moveToDrag);
    surface.elements.container.addEventListener('touchmove', moveToDrag);
    function clearSurfaceDrag() {
        console.log('wololo');
        surface.animationStorage.destroySurfaceDrag();
    }
    document.body.addEventListener('mouseup', clearSurfaceDrag);
    document.body.addEventListener('touchend', clearSurfaceDrag);
}


/***/ }),

/***/ "./lib/controls/edge.ts":
/*!******************************!*\
  !*** ./lib/controls/edge.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   moveSurfaceByEdge: () => (/* binding */ moveSurfaceByEdge)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./lib/utils.ts");

function moveSurfaceByEdge(surface, mouse) {
    if (surface.animationStorage.surfaceDragIsSet()) {
        return false;
    }
    let direction = {
        x: _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.None,
        y: _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.None
    };
    if (mouse.y <= surface.CONFIG.EDGE_MOVE_AREA.VALUE) {
        if (mouse.x <= surface.CONFIG.EDGE_MOVE_AREA.VALUE) {
            direction.x = _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.Left;
            direction.y = _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.Top;
        }
        else if (mouse.x >= surface.containerWidth - surface.CONFIG.EDGE_MOVE_AREA.VALUE) {
            direction.x = _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.Right;
            direction.y = _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.Top;
        }
        else {
            direction.y = _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.Top;
        }
    }
    else if (mouse.y >= surface.containerHeight - surface.CONFIG.EDGE_MOVE_AREA.VALUE) {
        if (mouse.x <= surface.CONFIG.EDGE_MOVE_AREA.VALUE) {
            direction.x = _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.Left;
            direction.y = _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.Bottom;
        }
        else if (mouse.x >= surface.containerWidth - surface.CONFIG.EDGE_MOVE_AREA.VALUE) {
            direction.x = _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.Right;
            direction.y = _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.Bottom;
        }
        else {
            direction.y = _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.Bottom;
        }
    }
    else {
        if (mouse.x <= surface.CONFIG.EDGE_MOVE_AREA.VALUE) {
            direction.x = _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.Left;
        }
        else if (mouse.x >= surface.containerWidth - surface.CONFIG.EDGE_MOVE_AREA.VALUE) {
            direction.x = _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.Right;
        }
    }
    let x = 0;
    let y = 0;
    if (direction.y !== _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.None || direction.x !== _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.None) {
        if (direction.y === _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.Top) {
            y = (surface.CONFIG.EDGE_MOVE_AREA.VALUE + 1 - mouse.y) / (surface.CONFIG.EDGE_MOVE_AREA.VALUE + 1) * -1;
        }
        else if (direction.y === _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.Bottom) {
            y = (surface.CONFIG.EDGE_MOVE_AREA.VALUE + 1 - (surface.containerHeight - mouse.y)) / (surface.CONFIG.EDGE_MOVE_AREA.VALUE + 1);
        }
        if (direction.x === _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.Left) {
            x = (surface.CONFIG.EDGE_MOVE_AREA.VALUE + 1 - mouse.x) / (surface.CONFIG.EDGE_MOVE_AREA.VALUE + 1) * -1;
        }
        else if (direction.x === _utils_js__WEBPACK_IMPORTED_MODULE_0__.Direction.Right) {
            x = (surface.CONFIG.EDGE_MOVE_AREA.VALUE + 1 - (surface.containerWidth - mouse.x)) / (surface.CONFIG.EDGE_MOVE_AREA.VALUE + 1);
        }
    }
    let xMoveIsZero = false;
    if (x === 0 || (x > 0 && surface.x >= surface.max.x) || (x < 0 && surface.x <= surface.min.x)) {
        xMoveIsZero = true;
    }
    let yMoveIsZero = false;
    if (y === 0 || (y > 0 && surface.y >= surface.max.y) || (y < 0 && surface.y <= surface.min.y)) {
        yMoveIsZero = true;
    }
    if (xMoveIsZero && yMoveIsZero) {
        if (surface.animationStorage.surfaceEdgeIsSet()) {
            surface.animationStorage.destroySurfaceEdge();
        }
        return false;
    }
    if (!surface.animationStorage.surfaceEdgeIsSet()) {
        surface.animationStorage.createSurfaceEdge(x, y);
        surface.animationExecutor.initiate();
    }
    else {
        surface.animationStorage.surfaceEdge.update(x, y);
    }
    return true;
}


/***/ }),

/***/ "./lib/controls/keyboard.ts":
/*!**********************************!*\
  !*** ./lib/controls/keyboard.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buttonPressed: () => (/* binding */ buttonPressed)
/* harmony export */ });
/* harmony import */ var _scale_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scale.js */ "./lib/controls/scale.ts");

function buttonPressed(event, surface) {
    if (surface.elements.container.matches(':hover')) {
        if (event.key === "Add" || event.key === "+") {
            (0,_scale_js__WEBPACK_IMPORTED_MODULE_0__.scaleAndGlide)(surface, 1);
        }
        else if (event.key === "Subtract" || event.key === "-") {
            (0,_scale_js__WEBPACK_IMPORTED_MODULE_0__.scaleAndGlide)(surface, -1);
        }
    }
}


/***/ }),

/***/ "./lib/controls/mouse.ts":
/*!*******************************!*\
  !*** ./lib/controls/mouse.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getMouseParams: () => (/* binding */ getMouseParams),
/* harmony export */   getWheelParams: () => (/* binding */ getWheelParams),
/* harmony export */   mouseDown: () => (/* binding */ mouseDown),
/* harmony export */   mouseMove: () => (/* binding */ mouseMove),
/* harmony export */   mouseWheel: () => (/* binding */ mouseWheel)
/* harmony export */ });
/* harmony import */ var _scale_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scale.js */ "./lib/controls/scale.ts");
/* harmony import */ var _edge_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edge.js */ "./lib/controls/edge.ts");


function getMouseParams(event, surface) {
    let bounds = surface.elements.container.getBoundingClientRect();
    return {
        button: (event instanceof TouchEvent ? 0 : event.button),
        x: (event instanceof TouchEvent ? event.touches[0].clientX - bounds.left : event.clientX - bounds.left),
        y: (event instanceof TouchEvent ? event.touches[0].clientY - bounds.top : event.clientY - bounds.top)
    };
}
function getWheelParams(event) {
    return {
        x: event.deltaX,
        y: event.deltaY
    };
}
function mouseMove(event, surface) {
    if (surface.CONFIG.EDGE_MOVE_ENABLED.VALUE === 1) {
        (0,_edge_js__WEBPACK_IMPORTED_MODULE_1__.moveSurfaceByEdge)(surface, getMouseParams(event, surface));
    }
}
function mouseWheel(event, surface) {
    event.preventDefault();
    (0,_scale_js__WEBPACK_IMPORTED_MODULE_0__.scaleAndGlide)(surface, (getWheelParams(event).y < 0 ? 1 : -1), getMouseParams(event, surface));
}
function mouseDown(event, surface) {
    let mouse = getMouseParams(event, surface);
    if (mouse.button === 0) {
        surface.animationStorage.createSurfaceDrag(mouse);
        // createSurfaceDrag(surface, getMouseParams(event, surface));
    }
}


/***/ }),

/***/ "./lib/controls/scale.ts":
/*!*******************************!*\
  !*** ./lib/controls/scale.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   scaleAndGlide: () => (/* binding */ scaleAndGlide)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./lib/utils.ts");

function scaleAndGlide(surface, steps, mouse = null) {
    let change;
    if (surface.scale < surface.CONFIG.SCALE_DEFAULT.VALUE || (steps < 0 && surface.scale <= surface.CONFIG.SCALE_DEFAULT.VALUE)) {
        change = steps * (surface.CONFIG.SCALE_DEFAULT.VALUE - surface.CONFIG.SCALE_MIN.VALUE) * surface.CONFIG.SCALE_STEP.VALUE;
    }
    else {
        change = steps * (surface.CONFIG.SCALE_MAX.VALUE - surface.CONFIG.SCALE_DEFAULT.VALUE) * surface.CONFIG.SCALE_STEP.VALUE;
    }
    let scaleChanged = surface.changeScale(change);
    if (scaleChanged && mouse !== null) {
        let x = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)((mouse.x - surface.containerWidth / 2) * 0.20 / surface.scale, surface.CONFIG.COORD_ROUNDING_FINAL.VALUE);
        let y = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)((mouse.y - surface.containerHeight / 2) * 0.20 / surface.scale, surface.CONFIG.COORD_ROUNDING_FINAL.VALUE);
        if (change < 0) {
            x = x * -1;
            y = y * -1;
        }
        surface.glide(x, y);
    }
}


/***/ }),

/***/ "./lib/css/css.ts":
/*!************************!*\
  !*** ./lib/css/css.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   generateCssDynamic: () => (/* binding */ generateCssDynamic),
/* harmony export */   generateCssStatic: () => (/* binding */ generateCssStatic)
/* harmony export */ });
function generateCssDynamic(surface) {
    return `
  @property --tilted-container-width-` + surface.uuid + ` {
    syntax: "<length>";
    inherits: true;
    initial-value: ` + surface.containerWidth + `px;
  }
  @property --tilted-container-height-` + surface.uuid + ` {
    syntax: "<length>";
    inherits: true;
    initial-value: ` + surface.containerHeight + `px;
  }

  @property --tilted-surface-width-` + surface.uuid + ` {
    syntax: "<length>";
    inherits: true;
    initial-value: ` + surface.surfaceWidth + `px;
  }
  @property --tilted-surface-height-` + surface.uuid + ` {
    syntax: "<length>";
    inherits: true;
    initial-value: ` + surface.surfaceHeight + `px;
  }`;
}
function generateCssStatic(surface) {
    let string = '';
    for (const parameter in surface.CONFIG) {
        let measure = '';
        if (surface.CONFIG[parameter].TYPE === 'length') {
            measure = 'px';
        }
        else if (surface.CONFIG[parameter].TYPE === 'angle') {
            measure = 'deg';
        }
        else if (surface.CONFIG[parameter].TYPE === 'time') {
            measure = 'ms';
        }
        string += `@property --${parameter} { `;
        string += `syntax: "<${surface.CONFIG[parameter].TYPE}>"; `;
        string += `inherits: true; `;
        string += `initial-value: ${surface.CONFIG[parameter].VALUE}${measure}; } `;
    }
    string += `

  .tilted-container-` + surface.uuid + ` {
    position: relative !important;

    cursor: move;
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .tilted-container-` + surface.uuid + `:active {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
  }

  .tilted-controls-` + surface.uuid + ` {
    position: absolute;
    top: 100px;
    right: 30px;
    width: 30px;
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    box-sizing: content-box;
    overflow: hidden;
  }

  .tilted-controls-zoom-in-` + surface.uuid + `,
  .tilted-controls-zoom-out-` + surface.uuid + ` {
    position: relative;
    width: 30px;
    height: 30px;
    background: #ffffffcc;
    cursor: pointer;
    box-sizing: content-box;
  }
  .tilted-controls-zoom-in-` + surface.uuid + `{
    border-bottom: 1px solid #444444;
  }
  .tilted-controls-zoom-in-` + surface.uuid + `:active,
  .tilted-controls-zoom-out-` + surface.uuid + `:active {
    background: #ffffff;
  }
  
    

  
  .tilted-controls-zoom-in-` + surface.uuid + `:before,
  .tilted-controls-zoom-in-` + surface.uuid + `:after,
  .tilted-controls-zoom-out-` + surface.uuid + `:before {
    content: "";
    display: block;
    position: absolute;
    background: #444444;
  }

  .tilted-controls-zoom-in-` + surface.uuid + `:before,
  .tilted-controls-zoom-out-` + surface.uuid + `:before {
    height: 2px;
    width: 18px;
    top: 14px;
    left: 6px;
  }
  .tilted-controls-zoom-in-` + surface.uuid + `:after {
    height: 18px;
    width: 2px;
    top: 6px;
    left: 14px;
  }
  
  .tilted-viewport-` + surface.uuid + ` {
    width: var(--tilted-surface-width-` + surface.uuid + `) !important;
    height: var(--tilted-surface-height-` + surface.uuid + `) !important;
  
    position: relative !important;
  
    will-change: top, left;
  }
  
  .tilted-scale-` + surface.uuid + ` {   
    width: var(--tilted-surface-width-` + surface.uuid + `) !important;
    height: var(--tilted-surface-height-` + surface.uuid + `) !important;
  
    transition: transform var(--ANIMATION_SCALE_TIME) !important;
  
    will-change: transform;
  }
  
  .tilted-position-` + surface.uuid + ` {
    width: var(--tilted-surface-width-` + surface.uuid + `) !important;
    height: var(--tilted-surface-height-` + surface.uuid + `) !important;

    position: relative !important;
    top: 0;
    left: 0;
    
    will-change: transform;
  }
  
  .tilted-surface-` + surface.uuid + ` {
    position: relative !important;
    
    overflow: visible !important;
  
    z-index: 100 !important;
  }
    
  .tilted-notransition-` + surface.uuid + ` {
    -webkit-transition: none !important;
    -moz-transition: none !important;
    -o-transition: none !important;
    transition: none !important;
  }`;
    return string;
}


/***/ }),

/***/ "./lib/utils.ts":
/*!**********************!*\
  !*** ./lib/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Direction: () => (/* binding */ Direction),
/* harmony export */   clampRatio: () => (/* binding */ clampRatio),
/* harmony export */   cloneMoveChain: () => (/* binding */ cloneMoveChain),
/* harmony export */   coordsToDirections: () => (/* binding */ coordsToDirections),
/* harmony export */   isSameMoveChain: () => (/* binding */ isSameMoveChain),
/* harmony export */   newMoveChain: () => (/* binding */ newMoveChain),
/* harmony export */   roundFloat: () => (/* binding */ roundFloat),
/* harmony export */   singedSqrt: () => (/* binding */ singedSqrt)
/* harmony export */ });
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v4.js");

function roundFloat(value, precision) {
    return parseFloat(value.toFixed(precision));
}
function coordsToDirections(x, y) {
    return {
        x: x === 0 ? Direction.None : x < 0 ? Direction.Left : Direction.Right,
        y: y === 0 ? Direction.None : y < 0 ? Direction.Top : Direction.Bottom
    };
}
var Direction;
(function (Direction) {
    Direction["Top"] = "top";
    Direction["Bottom"] = "bottom";
    Direction["Left"] = "left";
    Direction["Right"] = "right";
    Direction["None"] = "none";
})(Direction || (Direction = {}));
function newMoveChain() {
    return {
        uuid: (0,uuid__WEBPACK_IMPORTED_MODULE_0__["default"])(),
        direction: {
            x: Direction.None,
            y: Direction.None
        },
        vector: {
            x: 0,
            y: 0
        }
    };
}
function cloneMoveChain(moveChain) {
    return {
        uuid: moveChain.uuid,
        direction: {
            x: moveChain.direction.x,
            y: moveChain.direction.y
        },
        vector: {
            x: moveChain.vector.x,
            y: moveChain.vector.y
        }
    };
}
function isSameMoveChain(moveChain1, moveChain2) {
    return moveChain1.uuid === moveChain2.uuid &&
        moveChain1.direction.x === moveChain2.direction.x &&
        moveChain1.direction.y === moveChain2.direction.y &&
        moveChain1.vector.x === moveChain2.vector.x &&
        moveChain1.vector.y === moveChain2.vector.y;
}
function singedSqrt(value) {
    return Math.sign(value) * Math.sqrt(Math.abs(value));
}
function clampRatio(value) {
    return Math.min(1, Math.max(0, value));
}


/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/native.js":
/*!******************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/native.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ randomUUID });


/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i);


/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
    if (!getRandomValues) {
        if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
            throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
        }
        getRandomValues = crypto.getRandomValues.bind(crypto);
    }
    return getRandomValues(rnds8);
}


/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   unsafeStringify: () => (/* binding */ unsafeStringify)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");

const byteToHex = [];
for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
    return (byteToHex[arr[offset + 0]] +
        byteToHex[arr[offset + 1]] +
        byteToHex[arr[offset + 2]] +
        byteToHex[arr[offset + 3]] +
        '-' +
        byteToHex[arr[offset + 4]] +
        byteToHex[arr[offset + 5]] +
        '-' +
        byteToHex[arr[offset + 6]] +
        byteToHex[arr[offset + 7]] +
        '-' +
        byteToHex[arr[offset + 8]] +
        byteToHex[arr[offset + 9]] +
        '-' +
        byteToHex[arr[offset + 10]] +
        byteToHex[arr[offset + 11]] +
        byteToHex[arr[offset + 12]] +
        byteToHex[arr[offset + 13]] +
        byteToHex[arr[offset + 14]] +
        byteToHex[arr[offset + 15]]).toLowerCase();
}
function stringify(arr, offset = 0) {
    const uuid = unsafeStringify(arr, offset);
    if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
        throw TypeError('Stringified UUID is invalid');
    }
    return uuid;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);


/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./native.js */ "./node_modules/uuid/dist/esm-browser/native.js");
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");



function v4(options, buf, offset) {
    if (_native_js__WEBPACK_IMPORTED_MODULE_0__["default"].randomUUID && !buf && !options) {
        return _native_js__WEBPACK_IMPORTED_MODULE_0__["default"].randomUUID();
    }
    options = options || {};
    const rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_1__["default"])();
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;
    if (buf) {
        offset = offset || 0;
        for (let i = 0; i < 16; ++i) {
            buf[offset + i] = rnds[i];
        }
        return buf;
    }
    return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_2__.unsafeStringify)(rnds);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);


/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/esm-browser/regex.js");

function validate(uuid) {
    return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./lib/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Surface)
/* harmony export */ });
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v4.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./lib/utils.ts");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config.js */ "./lib/config.ts");
/* harmony import */ var _controls_controls_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./controls/controls.js */ "./lib/controls/controls.ts");
/* harmony import */ var _animation_executor_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./animation/executor.js */ "./lib/animation/executor.ts");
/* harmony import */ var _animation_storage_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./animation/storage.js */ "./lib/animation/storage.ts");
/* harmony import */ var _css_css_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./css/css.js */ "./lib/css/css.ts");








class Surface {
    constructor(elementContainer, elementMap, config = {}) {
        this.uuid = (0,uuid__WEBPACK_IMPORTED_MODULE_6__["default"])();
        this.viewport = { x: 0, y: 0 };
        this.x = 0;
        this.y = 0;
        this.skew = { x: 0, y: 0 };
        this.moveChain = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.newMoveChain)();
        this.CONFIG = (0,_config_js__WEBPACK_IMPORTED_MODULE_1__.setupConfig)(config);
        this.elements = this.setupElements(elementContainer, elementMap);
        this.styles = this.setupStyles();
        this.animationStorage = new _animation_storage_js__WEBPACK_IMPORTED_MODULE_4__["default"](this);
        this.animationExecutor = new _animation_executor_js__WEBPACK_IMPORTED_MODULE_3__["default"](this, this.animationStorage);
        (0,_controls_controls_js__WEBPACK_IMPORTED_MODULE_2__.initControls)(this);
        this.updateViewport();
        new ResizeObserver(() => { this.updateCssDynamic(); this.updateViewport(); this.enforceLimits(); }).observe(this.elements.container);
        new ResizeObserver(() => { this.updateCssDynamic(); this.enforceLimits(); }).observe(this.elements.surface);
        this.scale = this.CONFIG.SCALE_DEFAULT.VALUE;
        this.initScale();
    }
    setupElements(elementContainer, elementMap) {
        elementContainer.classList.add('tilted-container-' + this.uuid);
        let elementViewport = document.createElement('div');
        elementViewport.classList.add('tilted-viewport-' + this.uuid);
        let elementScale = document.createElement('div');
        elementScale.classList.add('tilted-scale-' + this.uuid);
        let elementPosition = document.createElement('div');
        elementPosition.classList.add('tilted-position-' + this.uuid);
        elementMap.classList.add('tilted-surface-' + this.uuid);
        let elementControls = document.createElement('div');
        elementControls.classList.add('tilted-controls-' + this.uuid);
        let elementControlsZoomIn = document.createElement('div');
        elementControlsZoomIn.classList.add('tilted-controls-zoom-in-' + this.uuid);
        let elementControlsZoomOut = document.createElement('div');
        elementControlsZoomOut.classList.add('tilted-controls-zoom-out-' + this.uuid);
        elementControls.appendChild(elementControlsZoomIn);
        elementControls.appendChild(elementControlsZoomOut);
        elementPosition.appendChild(elementMap);
        elementScale.appendChild(elementPosition);
        elementViewport.appendChild(elementScale);
        elementContainer.appendChild(elementViewport);
        elementContainer.appendChild(elementControls);
        return {
            container: elementContainer,
            controls: elementControls,
            controlsZoomIn: elementControlsZoomIn,
            controlsZoomOut: elementControlsZoomOut,
            viewport: elementViewport,
            scale: elementScale,
            position: elementPosition,
            surface: elementMap
        };
    }
    setupStyles() {
        let elementStyleStatic = document.createElement('style');
        elementStyleStatic.classList.add('tilted-css-static-' + this.uuid);
        elementStyleStatic.innerHTML = (0,_css_css_js__WEBPACK_IMPORTED_MODULE_5__.generateCssStatic)(this);
        document.head.appendChild(elementStyleStatic);
        let elementStyleDynamic = document.createElement('style');
        elementStyleDynamic.classList.add('tilted-css-dynamic-' + this.uuid);
        elementStyleDynamic.innerHTML = (0,_css_css_js__WEBPACK_IMPORTED_MODULE_5__.generateCssDynamic)(this);
        document.head.appendChild(elementStyleDynamic);
        return {
            static: elementStyleStatic,
            dynamic: elementStyleDynamic
        };
    }
    updateCssDynamic() {
        this.styles.dynamic.innerHTML = (0,_css_css_js__WEBPACK_IMPORTED_MODULE_5__.generateCssDynamic)(this);
    }
    get containerWidth() {
        return this.elements.container.offsetWidth;
    }
    get containerHeight() {
        return this.elements.container.offsetHeight;
    }
    get surfaceWidth() {
        return this.elements.surface.offsetWidth;
    }
    get surfaceHeight() {
        return this.elements.surface.offsetHeight;
    }
    get limit() {
        return {
            x: Math.round(this.surfaceWidth / 2 - this.containerWidth * 0.25),
            y: Math.round(this.surfaceHeight / 2 - this.containerHeight * 0.25)
        };
    }
    get min() {
        return {
            x: this.limit.x * -1,
            y: this.limit.y * -1
        };
    }
    get max() {
        return {
            x: this.limit.x,
            y: this.limit.y
        };
    }
    move(x, y, interimRounding = this.CONFIG.COORD_ROUNDING_INTERIM.VALUE, finalRounding = this.CONFIG.COORD_ROUNDING_FINAL.VALUE) {
        if (interimRounding >= 0) {
            x = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(x, interimRounding);
            y = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(y, interimRounding);
        }
        if (x === 0 && y === 0) {
            return false;
        }
        let oldPositionX = this.x;
        let oldPositionY = this.y;
        this.x = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(this.x + x, finalRounding);
        this.y = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(this.y + y, finalRounding);
        if (this.x === oldPositionX && this.y === oldPositionY) {
            return false;
        }
        if (this.x < this.min.x) {
            this.x = this.min.x;
        }
        else if (this.x > this.max.x) {
            this.x = this.max.x;
        }
        if (this.y < this.min.y) {
            this.y = this.min.y;
        }
        else if (this.y > this.max.y) {
            this.y = this.max.y;
        }
        if (this.x === oldPositionX && this.y === oldPositionY) {
            return false;
        }
        this.updateMoveChain(x, y);
        this.elements.position.style.transform = 'translate3d(' + (this.x * -1) + 'px, ' + (this.y * -1) + 'px, 0)';
        this.log([
            { desc: 'x', from: oldPositionX, to: this.x },
            { desc: 'y', from: oldPositionY, to: this.y }
        ]);
        return true;
    }
    moveTo(x, y, finalRounding = this.CONFIG.COORD_ROUNDING_FINAL.VALUE) {
        x = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(x, finalRounding);
        y = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(y, finalRounding);
        if (this.x === x && this.y === y) {
            return false;
        }
        console.log('Move to: x ' + x + ', y ' + y);
        return this.move(x - this.x, y - this.y, -1, finalRounding);
    }
    glide(x, y, time = this.CONFIG.ANIMATION_GLIDE_TIME.VALUE, easingFormula = [0.25, 0.1, 0.25, 1], interimRounding = this.CONFIG.COORD_ROUNDING_INTERIM.VALUE, finalRounding = this.CONFIG.COORD_ROUNDING_FINAL.VALUE) {
        if (finalRounding >= 0) {
            x = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(this.x + x, finalRounding) - this.x;
            y = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(this.y + y, finalRounding) - this.y;
        }
        if (interimRounding >= 0) {
            x = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(x, interimRounding);
            y = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(y, interimRounding);
        }
        if (x === 0 && y === 0) {
            return false;
        }
        console.log('Animated move to: x ' + x + ', y ' + y);
        this.animationStorage.createSurfaceGlide(x, y, time, easingFormula);
        this.animationExecutor.initiate();
        return true;
    }
    updateViewport() {
        this.viewport = {
            x: 0 - this.surfaceWidth / 2 + this.containerWidth / 2,
            y: 0 - this.surfaceHeight / 2 + this.containerHeight / 2
        };
        this.elements.viewport.style.top = this.viewport.y + 'px';
        this.elements.viewport.style.left = this.viewport.x + 'px';
    }
    updateSkew() {
        let percentOfMaxScale = (this.scale - this.CONFIG.SCALE_MIN.VALUE) / (this.CONFIG.SCALE_MAX.VALUE - this.CONFIG.SCALE_MIN.VALUE);
        this.skew = {
            x: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(percentOfMaxScale * this.CONFIG.SKEW_X_MAX.VALUE, 2),
            y: 0
        };
    }
    initScale() {
        this.updateSkew();
        this.elements.scale.classList.add('tilted-notransition-' + this.uuid);
        this.elements.scale.style.transform = 'scale(' + this.scale + ') perspective(' + this.CONFIG.PERSPECTIVE_DISTANCE.VALUE + 'px) rotate3d(1, 0, 0, ' + this.skew.x + 'deg)';
        this.elements.scale.offsetHeight;
        this.elements.scale.classList.remove('tilted-notransition-' + this.uuid);
    }
    changeScale(change) {
        if (change === 0) {
            return false;
        }
        let oldScale = this.scale;
        this.scale = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(this.scale + change, this.CONFIG.SCALE_ROUNDING.VALUE);
        this.scale = Math.max(this.scale, this.CONFIG.SCALE_MIN.VALUE);
        this.scale = Math.min(this.scale, this.CONFIG.SCALE_MAX.VALUE);
        if (oldScale === this.scale) {
            return false;
        }
        this.updateSkew();
        this.elements.scale.style.transform = 'scale(' + this.scale + ') perspective(' + this.CONFIG.PERSPECTIVE_DISTANCE.VALUE + 'px) rotate3d(1, 0, 0, ' + this.skew.x + 'deg)';
        this.log([
            { desc: 'scale', from: oldScale, to: this.scale }
        ]);
        return true;
    }
    log(changes = false) {
        if (this.CONFIG.DEBUG_MODE.VALUE === 0) {
            return;
        }
        let changesString = '';
        if (changes) {
            for (let change of changes) {
                changesString += change.desc + (change.from !== undefined ? ' from ' + change.from : '') + (change.to !== undefined ? ' to ' + change.to : '') + '\n';
            }
        }
        console.log(changesString +
            `x: ${this.x}\n` +
            `y: ${this.y}\n` +
            `limit.x: ${this.limit.x}\n` +
            `limit.y: ${this.limit.y}\n` +
            `scale: ${this.scale}`);
    }
    updateMoveChain(x, y) {
        return;
        let direction = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.coordsToDirections)(x, y);
        // if ((direction.x !== this.moveChain.direction.x && direction.x !== Direction.None)
        //     || (direction.y !== this.moveChain.direction.y && direction.y !== Direction.None)) {
        //   this.moveChain = newMoveChain();
        //   this.moveChain.direction = direction;
        // }
        this.moveChain.vector.x += x;
        this.moveChain.vector.y += y;
        console.log(this.moveChain.direction.x + ', ' + this.moveChain.direction.y + ', ' + direction.x + ', ' + direction.y + ', ' + this.moveChain.vector.x + ', ' + this.moveChain.vector.y);
        let fdaskhgsfd = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.cloneMoveChain)(this.moveChain);
        setTimeout(() => this.endMoveChain(fdaskhgsfd), 25);
    }
    endMoveChain(moveChain) {
        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isSameMoveChain)(this.moveChain, moveChain)) {
            this.glide(Math.sqrt(Math.abs(this.moveChain.vector.x)) * 100, Math.sqrt(this.moveChain.vector.y) * 100);
            console.log('end move chain: ' + moveChain.vector.x + ', ' + moveChain.vector.y + ', ' + moveChain.uuid + ', ' + this.moveChain.uuid);
            this.moveChain = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.newMoveChain)();
        }
    }
    cancelOngoingMoves() {
        this.animationStorage.destroySurfaceGlide();
    }
    enforceLimits() {
        let x = this.x;
        let y = this.y;
        if (x < this.min.x) {
            x = this.min.x;
        }
        if (y < this.min.y) {
            y = this.min.y;
        }
        if (x > this.max.x) {
            x = this.max.x;
        }
        if (y > this.max.y) {
            y = this.max.y;
        }
        this.moveTo(x, y);
    }
}

})();

Tilted = __webpack_exports__["default"];
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsd0JBQXdCLGFBQWE7QUFDckMsd0JBQXdCLGFBQWE7QUFDckMsc0JBQXNCLFdBQVc7QUFDakM7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDZEQUFrQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLHlEQUFjO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBLFlBQVksMERBQWU7QUFDM0I7QUFDQTtBQUNBLDZCQUE2Qix1REFBWTtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vVGlsdGVkLy4vbm9kZV9tb2R1bGVzL2Jlemllci1lYXNpbmcvc3JjL2luZGV4LmpzIiwid2VicGFjazovL1RpbHRlZC8uL2xpYi9hbmltYXRpb24vYW5pbWF0aW9uLnRzIiwid2VicGFjazovL1RpbHRlZC8uL2xpYi9hbmltYXRpb24vZHJhZy50cyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9saWIvYW5pbWF0aW9uL2VkZ2UudHMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbGliL2FuaW1hdGlvbi9leGVjdXRvci50cyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9saWIvYW5pbWF0aW9uL2dsaWRlLnRzIiwid2VicGFjazovL1RpbHRlZC8uL2xpYi9hbmltYXRpb24vc3RvcmFnZS50cyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9saWIvY29uZmlnLnRzIiwid2VicGFjazovL1RpbHRlZC8uL2xpYi9jb250cm9scy9jb250cm9scy50cyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9saWIvY29udHJvbHMvZHJhZy50cyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9saWIvY29udHJvbHMvZWRnZS50cyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9saWIvY29udHJvbHMva2V5Ym9hcmQudHMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbGliL2NvbnRyb2xzL21vdXNlLnRzIiwid2VicGFjazovL1RpbHRlZC8uL2xpYi9jb250cm9scy9zY2FsZS50cyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9saWIvY3NzL2Nzcy50cyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9saWIvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9uYXRpdmUuanMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9yZWdleC5qcyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3JuZy5qcyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3N0cmluZ2lmeS5qcyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3Y0LmpzIiwid2VicGFjazovL1RpbHRlZC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvdmFsaWRhdGUuanMiLCJ3ZWJwYWNrOi8vVGlsdGVkL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1RpbHRlZC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9UaWx0ZWQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1RpbHRlZC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1RpbHRlZC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1RpbHRlZC8uL2xpYi9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9ncmUvYmV6aWVyLWVhc2luZ1xuICogQmV6aWVyRWFzaW5nIC0gdXNlIGJlemllciBjdXJ2ZSBmb3IgdHJhbnNpdGlvbiBlYXNpbmcgZnVuY3Rpb25cbiAqIGJ5IEdhw6t0YW4gUmVuYXVkZWF1IDIwMTQgLSAyMDE1IOKAkyBNSVQgTGljZW5zZVxuICovXG5cbi8vIFRoZXNlIHZhbHVlcyBhcmUgZXN0YWJsaXNoZWQgYnkgZW1waXJpY2lzbSB3aXRoIHRlc3RzICh0cmFkZW9mZjogcGVyZm9ybWFuY2UgVlMgcHJlY2lzaW9uKVxudmFyIE5FV1RPTl9JVEVSQVRJT05TID0gNDtcbnZhciBORVdUT05fTUlOX1NMT1BFID0gMC4wMDE7XG52YXIgU1VCRElWSVNJT05fUFJFQ0lTSU9OID0gMC4wMDAwMDAxO1xudmFyIFNVQkRJVklTSU9OX01BWF9JVEVSQVRJT05TID0gMTA7XG5cbnZhciBrU3BsaW5lVGFibGVTaXplID0gMTE7XG52YXIga1NhbXBsZVN0ZXBTaXplID0gMS4wIC8gKGtTcGxpbmVUYWJsZVNpemUgLSAxLjApO1xuXG52YXIgZmxvYXQzMkFycmF5U3VwcG9ydGVkID0gdHlwZW9mIEZsb2F0MzJBcnJheSA9PT0gJ2Z1bmN0aW9uJztcblxuZnVuY3Rpb24gQSAoYUExLCBhQTIpIHsgcmV0dXJuIDEuMCAtIDMuMCAqIGFBMiArIDMuMCAqIGFBMTsgfVxuZnVuY3Rpb24gQiAoYUExLCBhQTIpIHsgcmV0dXJuIDMuMCAqIGFBMiAtIDYuMCAqIGFBMTsgfVxuZnVuY3Rpb24gQyAoYUExKSAgICAgIHsgcmV0dXJuIDMuMCAqIGFBMTsgfVxuXG4vLyBSZXR1cm5zIHgodCkgZ2l2ZW4gdCwgeDEsIGFuZCB4Miwgb3IgeSh0KSBnaXZlbiB0LCB5MSwgYW5kIHkyLlxuZnVuY3Rpb24gY2FsY0JlemllciAoYVQsIGFBMSwgYUEyKSB7IHJldHVybiAoKEEoYUExLCBhQTIpICogYVQgKyBCKGFBMSwgYUEyKSkgKiBhVCArIEMoYUExKSkgKiBhVDsgfVxuXG4vLyBSZXR1cm5zIGR4L2R0IGdpdmVuIHQsIHgxLCBhbmQgeDIsIG9yIGR5L2R0IGdpdmVuIHQsIHkxLCBhbmQgeTIuXG5mdW5jdGlvbiBnZXRTbG9wZSAoYVQsIGFBMSwgYUEyKSB7IHJldHVybiAzLjAgKiBBKGFBMSwgYUEyKSAqIGFUICogYVQgKyAyLjAgKiBCKGFBMSwgYUEyKSAqIGFUICsgQyhhQTEpOyB9XG5cbmZ1bmN0aW9uIGJpbmFyeVN1YmRpdmlkZSAoYVgsIGFBLCBhQiwgbVgxLCBtWDIpIHtcbiAgdmFyIGN1cnJlbnRYLCBjdXJyZW50VCwgaSA9IDA7XG4gIGRvIHtcbiAgICBjdXJyZW50VCA9IGFBICsgKGFCIC0gYUEpIC8gMi4wO1xuICAgIGN1cnJlbnRYID0gY2FsY0JlemllcihjdXJyZW50VCwgbVgxLCBtWDIpIC0gYVg7XG4gICAgaWYgKGN1cnJlbnRYID4gMC4wKSB7XG4gICAgICBhQiA9IGN1cnJlbnRUO1xuICAgIH0gZWxzZSB7XG4gICAgICBhQSA9IGN1cnJlbnRUO1xuICAgIH1cbiAgfSB3aGlsZSAoTWF0aC5hYnMoY3VycmVudFgpID4gU1VCRElWSVNJT05fUFJFQ0lTSU9OICYmICsraSA8IFNVQkRJVklTSU9OX01BWF9JVEVSQVRJT05TKTtcbiAgcmV0dXJuIGN1cnJlbnRUO1xufVxuXG5mdW5jdGlvbiBuZXd0b25SYXBoc29uSXRlcmF0ZSAoYVgsIGFHdWVzc1QsIG1YMSwgbVgyKSB7XG4gZm9yICh2YXIgaSA9IDA7IGkgPCBORVdUT05fSVRFUkFUSU9OUzsgKytpKSB7XG4gICB2YXIgY3VycmVudFNsb3BlID0gZ2V0U2xvcGUoYUd1ZXNzVCwgbVgxLCBtWDIpO1xuICAgaWYgKGN1cnJlbnRTbG9wZSA9PT0gMC4wKSB7XG4gICAgIHJldHVybiBhR3Vlc3NUO1xuICAgfVxuICAgdmFyIGN1cnJlbnRYID0gY2FsY0JlemllcihhR3Vlc3NULCBtWDEsIG1YMikgLSBhWDtcbiAgIGFHdWVzc1QgLT0gY3VycmVudFggLyBjdXJyZW50U2xvcGU7XG4gfVxuIHJldHVybiBhR3Vlc3NUO1xufVxuXG5mdW5jdGlvbiBMaW5lYXJFYXNpbmcgKHgpIHtcbiAgcmV0dXJuIHg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmV6aWVyIChtWDEsIG1ZMSwgbVgyLCBtWTIpIHtcbiAgaWYgKCEoMCA8PSBtWDEgJiYgbVgxIDw9IDEgJiYgMCA8PSBtWDIgJiYgbVgyIDw9IDEpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdiZXppZXIgeCB2YWx1ZXMgbXVzdCBiZSBpbiBbMCwgMV0gcmFuZ2UnKTtcbiAgfVxuXG4gIGlmIChtWDEgPT09IG1ZMSAmJiBtWDIgPT09IG1ZMikge1xuICAgIHJldHVybiBMaW5lYXJFYXNpbmc7XG4gIH1cblxuICAvLyBQcmVjb21wdXRlIHNhbXBsZXMgdGFibGVcbiAgdmFyIHNhbXBsZVZhbHVlcyA9IGZsb2F0MzJBcnJheVN1cHBvcnRlZCA/IG5ldyBGbG9hdDMyQXJyYXkoa1NwbGluZVRhYmxlU2l6ZSkgOiBuZXcgQXJyYXkoa1NwbGluZVRhYmxlU2l6ZSk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwga1NwbGluZVRhYmxlU2l6ZTsgKytpKSB7XG4gICAgc2FtcGxlVmFsdWVzW2ldID0gY2FsY0JlemllcihpICoga1NhbXBsZVN0ZXBTaXplLCBtWDEsIG1YMik7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRURm9yWCAoYVgpIHtcbiAgICB2YXIgaW50ZXJ2YWxTdGFydCA9IDAuMDtcbiAgICB2YXIgY3VycmVudFNhbXBsZSA9IDE7XG4gICAgdmFyIGxhc3RTYW1wbGUgPSBrU3BsaW5lVGFibGVTaXplIC0gMTtcblxuICAgIGZvciAoOyBjdXJyZW50U2FtcGxlICE9PSBsYXN0U2FtcGxlICYmIHNhbXBsZVZhbHVlc1tjdXJyZW50U2FtcGxlXSA8PSBhWDsgKytjdXJyZW50U2FtcGxlKSB7XG4gICAgICBpbnRlcnZhbFN0YXJ0ICs9IGtTYW1wbGVTdGVwU2l6ZTtcbiAgICB9XG4gICAgLS1jdXJyZW50U2FtcGxlO1xuXG4gICAgLy8gSW50ZXJwb2xhdGUgdG8gcHJvdmlkZSBhbiBpbml0aWFsIGd1ZXNzIGZvciB0XG4gICAgdmFyIGRpc3QgPSAoYVggLSBzYW1wbGVWYWx1ZXNbY3VycmVudFNhbXBsZV0pIC8gKHNhbXBsZVZhbHVlc1tjdXJyZW50U2FtcGxlICsgMV0gLSBzYW1wbGVWYWx1ZXNbY3VycmVudFNhbXBsZV0pO1xuICAgIHZhciBndWVzc0ZvclQgPSBpbnRlcnZhbFN0YXJ0ICsgZGlzdCAqIGtTYW1wbGVTdGVwU2l6ZTtcblxuICAgIHZhciBpbml0aWFsU2xvcGUgPSBnZXRTbG9wZShndWVzc0ZvclQsIG1YMSwgbVgyKTtcbiAgICBpZiAoaW5pdGlhbFNsb3BlID49IE5FV1RPTl9NSU5fU0xPUEUpIHtcbiAgICAgIHJldHVybiBuZXd0b25SYXBoc29uSXRlcmF0ZShhWCwgZ3Vlc3NGb3JULCBtWDEsIG1YMik7XG4gICAgfSBlbHNlIGlmIChpbml0aWFsU2xvcGUgPT09IDAuMCkge1xuICAgICAgcmV0dXJuIGd1ZXNzRm9yVDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJpbmFyeVN1YmRpdmlkZShhWCwgaW50ZXJ2YWxTdGFydCwgaW50ZXJ2YWxTdGFydCArIGtTYW1wbGVTdGVwU2l6ZSwgbVgxLCBtWDIpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiBCZXppZXJFYXNpbmcgKHgpIHtcbiAgICAvLyBCZWNhdXNlIEphdmFTY3JpcHQgbnVtYmVyIGFyZSBpbXByZWNpc2UsIHdlIHNob3VsZCBndWFyYW50ZWUgdGhlIGV4dHJlbWVzIGFyZSByaWdodC5cbiAgICBpZiAoeCA9PT0gMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGlmICh4ID09PSAxKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbGNCZXppZXIoZ2V0VEZvclgoeCksIG1ZMSwgbVkyKTtcbiAgfTtcbn07XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBBbmltYXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKHN1cmZhY2UpIHtcbiAgICAgICAgdGhpcy50aW1lc3RhbXBTdGFydCA9IDA7XG4gICAgICAgIHRoaXMudGltZXN0YW1wTGFzdCA9IDA7XG4gICAgICAgIHRoaXMuc3RlcExvZyA9IFtdO1xuICAgICAgICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN1cmZhY2UgPSBzdXJmYWNlO1xuICAgICAgICB0aGlzLnRpbWVzdGFtcFN0YXJ0ID0gdGhpcy50aW1lc3RhbXBMYXN0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgfVxuICAgIGxvZ1N0ZXAoc3RlcCkge1xuICAgICAgICB0aGlzLnN0ZXBMb2cucHVzaChzdGVwKTtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IEFuaW1hdGlvbiBmcm9tICcuL2FuaW1hdGlvbi5qcyc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmltYXRpb25TdXJmYWNlRHJhZyBleHRlbmRzIEFuaW1hdGlvbiB7XG4gICAgY29uc3RydWN0b3Ioc3VyZmFjZSwgbW91c2UpIHtcbiAgICAgICAgc3VwZXIoc3VyZmFjZSk7XG4gICAgICAgIHRoaXMucHJldiA9IHsgeDogMCwgeTogMCB9O1xuICAgICAgICB0aGlzLmN1bXVsYXRlZCA9IHsgeDogMCwgeTogMCB9O1xuICAgICAgICB0aGlzLnN1cmZhY2UuY2FuY2VsT25nb2luZ01vdmVzKCk7XG4gICAgICAgIHRoaXMuaWQgPSB1dWlkdjQoKTtcbiAgICAgICAgdGhpcy5wcmV2ID0ge1xuICAgICAgICAgICAgeDogbW91c2UueCxcbiAgICAgICAgICAgIHk6IG1vdXNlLnlcbiAgICAgICAgfTtcbiAgICAgICAgY29uc29sZS5sb2coJ0RyYWcgc3RhcnRlZCcpO1xuICAgIH1cbiAgICBzdGVwKG1vdXNlKSB7XG4gICAgICAgIC8vIHRoaXMudGltZXN0YW1wTGFzdCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICBsZXQgd2FzTW92ZWQgPSB0aGlzLnN1cmZhY2UubW92ZSgodGhpcy5wcmV2LnggLSBtb3VzZS54KSAvIHRoaXMuc3VyZmFjZS5zY2FsZSwgKHRoaXMucHJldi55IC0gbW91c2UueSkgLyB0aGlzLnN1cmZhY2Uuc2NhbGUpO1xuICAgICAgICB0aGlzLmN1bXVsYXRlZCA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMuY3VtdWxhdGVkLnggKyB0aGlzLnByZXYueCAtIG1vdXNlLngsXG4gICAgICAgICAgICB5OiB0aGlzLmN1bXVsYXRlZC55ICsgdGhpcy5wcmV2LnkgLSBtb3VzZS55XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucHJldiA9IHtcbiAgICAgICAgICAgIHg6IG1vdXNlLngsXG4gICAgICAgICAgICB5OiBtb3VzZS55XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB3YXNNb3ZlZDtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHBlcmZvcm1hbmNlLm5vdygpIC0gdGhpcy50aW1lc3RhbXBTdGFydCA8IHRoaXMuc3VyZmFjZS5DT05GSUcuRFVSQVRJT05fRk9SX1RIUk9XLlZBTFVFKSB7XG4gICAgICAgICAgICB0aGlzLnRocm93KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlO1xuICAgIH1cbiAgICB0aHJvdygpIHtcbiAgICAgICAgdGhpcy5zdXJmYWNlLmdsaWRlKHRoaXMuY3VtdWxhdGVkLnggKiB0aGlzLnN1cmZhY2UuQ09ORklHLlRIUk9XX01VTFRJUExJRVIuVkFMVUUsIHRoaXMuY3VtdWxhdGVkLnkgKiB0aGlzLnN1cmZhY2UuQ09ORklHLlRIUk9XX01VTFRJUExJRVIuVkFMVUUsIHRoaXMuc3VyZmFjZS5DT05GSUcuQU5JTUFUSU9OX1RIUk9XX1RJTUUuVkFMVUUsIFswLCAwLjU1LCAwLjQ1LCAxXSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IEFuaW1hdGlvbiBmcm9tICcuL2FuaW1hdGlvbi5qcyc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmltYXRpb25TdXJmYWNlRWRnZSBleHRlbmRzIEFuaW1hdGlvbiB7XG4gICAgY29uc3RydWN0b3Ioc3VyZmFjZSwgeCwgeSkge1xuICAgICAgICBzdXBlcihzdXJmYWNlKTtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG4gICAgdXBkYXRlKHgsIHkpIHtcbiAgICAgICAgaWYgKHRoaXMueCAhPT0geCkge1xuICAgICAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy55ICE9PSB5KSB7XG4gICAgICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0ZXAodGltZXN0YW1wQ3VycmVudCkge1xuICAgICAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdGltZUZhY3RvciA9IE1hdGgubWF4KDEsICh0aW1lc3RhbXBDdXJyZW50IC0gdGhpcy50aW1lc3RhbXBMYXN0KSkgLyAxMDtcbiAgICAgICAgbGV0IHggPSB0aGlzLnN1cmZhY2UuQ09ORklHLkVER0VfTU9WRV9TUEVFRC5WQUxVRSAqIHRoaXMueCAvIHRoaXMuc3VyZmFjZS5zY2FsZSAqIHRpbWVGYWN0b3I7XG4gICAgICAgIGxldCB5ID0gdGhpcy5zdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfU1BFRUQuVkFMVUUgKiB0aGlzLnkgLyB0aGlzLnN1cmZhY2Uuc2NhbGUgKiB0aW1lRmFjdG9yO1xuICAgICAgICB0aGlzLnRpbWVzdGFtcExhc3QgPSB0aW1lc3RhbXBDdXJyZW50O1xuICAgICAgICByZXR1cm4gdGhpcy5zdXJmYWNlLm1vdmUoeCwgeSk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5pbWF0aW9uRXhlY3V0b3Ige1xuICAgIGNvbnN0cnVjdG9yKHN1cmZhY2UsIGFuaW1hdGlvblN0b3JhZ2UpIHtcbiAgICAgICAgdGhpcy5leGVjdXRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdXJmYWNlID0gc3VyZmFjZTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25TdG9yYWdlID0gYW5pbWF0aW9uU3RvcmFnZTtcbiAgICB9XG4gICAgaW5pdGlhdGUoKSB7XG4gICAgICAgIGlmICghdGhpcy5leGVjdXRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc3RlcCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0ZXAoKSB7XG4gICAgICAgIGxldCB0aW1lc3RhbXBDdXJyZW50ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGluZyA9IGZhbHNlIHx8IHRoaXMuc3RlcFN1cmZhY2VHbGlkZSh0aW1lc3RhbXBDdXJyZW50KSB8fCB0aGlzLnN0ZXBTdXJmYWNlRWRnZSh0aW1lc3RhbXBDdXJyZW50KTtcbiAgICAgICAgICAgIGlmICh0aGlzLmV4ZWN1dGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RlcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc3RlcFN1cmZhY2VHbGlkZSh0aW1lc3RhbXBDdXJyZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5hbmltYXRpb25TdG9yYWdlLnN1cmZhY2VHbGlkZUlzU2V0KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc2hvdWxkQ29udGludWUgPSB0aGlzLmFuaW1hdGlvblN0b3JhZ2Uuc3VyZmFjZUdsaWRlLnN0ZXAodGltZXN0YW1wQ3VycmVudCk7XG4gICAgICAgIGlmICghc2hvdWxkQ29udGludWUpIHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uU3RvcmFnZS5kZXN0cm95U3VyZmFjZUdsaWRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNob3VsZENvbnRpbnVlO1xuICAgIH1cbiAgICBzdGVwU3VyZmFjZUVkZ2UodGltZXN0YW1wQ3VycmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuYW5pbWF0aW9uU3RvcmFnZS5zdXJmYWNlRWRnZUlzU2V0KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc2hvdWxkQ29udGludWUgPSB0aGlzLmFuaW1hdGlvblN0b3JhZ2Uuc3VyZmFjZUVkZ2Uuc3RlcCh0aW1lc3RhbXBDdXJyZW50KTtcbiAgICAgICAgaWYgKCFzaG91bGRDb250aW51ZSkge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25TdG9yYWdlLmRlc3Ryb3lTdXJmYWNlRWRnZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaG91bGRDb250aW51ZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyByb3VuZEZsb2F0LCBjbGFtcFJhdGlvIH0gZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IEFuaW1hdGlvbiBmcm9tICcuL2FuaW1hdGlvbi5qcyc7XG5pbXBvcnQgYmV6aWVyRWFzaW5nIGZyb20gJ2Jlemllci1lYXNpbmcnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5pbWF0aW9uU3VyZmFjZUdsaWRlIGV4dGVuZHMgQW5pbWF0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihzdXJmYWNlLCB4LCB5LCBhbmltYXRpb25UaW1lLCBlYXNpbmdGb3JtdWxhKSB7XG4gICAgICAgIHN1cGVyKHN1cmZhY2UpO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSB7IHg6IDAsIHk6IDAgfTtcbiAgICAgICAgdGhpcy5pbml0aWFsID0ge1xuICAgICAgICAgICAgeDogc3VyZmFjZS54LFxuICAgICAgICAgICAgeTogc3VyZmFjZS55XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudGFyZ2V0ID0ge1xuICAgICAgICAgICAgeDogdGhpcy5pbml0aWFsLnggKyB4LFxuICAgICAgICAgICAgeTogdGhpcy5pbml0aWFsLnkgKyB5XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMueCA9IHtcbiAgICAgICAgICAgIHZhbHVlOiBNYXRoLmFicyh4KSxcbiAgICAgICAgICAgIHNpZ246IHggPiAwID8gMSA6IC0xXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMueSA9IHtcbiAgICAgICAgICAgIHZhbHVlOiBNYXRoLmFicyh5KSxcbiAgICAgICAgICAgIHNpZ246IHkgPiAwID8gMSA6IC0xXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uVGltZSA9IGFuaW1hdGlvblRpbWU7XG4gICAgICAgIHRoaXMuYmV6aWVyRWFzaW5nID0gYmV6aWVyRWFzaW5nKGVhc2luZ0Zvcm11bGFbMF0sIGVhc2luZ0Zvcm11bGFbMV0sIGVhc2luZ0Zvcm11bGFbMl0sIGVhc2luZ0Zvcm11bGFbM10pO1xuICAgICAgICBjb25zb2xlLmxvZygnR2xpZGUgY3JlYXRlZDogeCAnICsgdGhpcy54LnZhbHVlICsgJywgeSAnICsgdGhpcy55LnZhbHVlICsgJywgaW5pdGlhbC54ICcgKyB0aGlzLmluaXRpYWwueCArICcsIGluaXRpYWwueSAnICsgdGhpcy5pbml0aWFsLnkgKyAnLCB0YXJnZXQueCAnICsgdGhpcy50YXJnZXQueCArICcsIHRhcmdldC55ICcgKyB0aGlzLnRhcmdldC55KTtcbiAgICB9XG4gICAgc3RlcCh0aW1lc3RhbXBDdXJyZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0aW1lUmF0aW8gPSBjbGFtcFJhdGlvKCh0aW1lc3RhbXBDdXJyZW50IC0gdGhpcy50aW1lc3RhbXBTdGFydCkgLyB0aGlzLmFuaW1hdGlvblRpbWUpO1xuICAgICAgICBsZXQgbW92ZVJhdGlvID0gY2xhbXBSYXRpbyh0aGlzLmJlemllckVhc2luZyh0aW1lUmF0aW8pKTtcbiAgICAgICAgaWYgKG1vdmVSYXRpbyA+PSAxKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ0ZpbmlzaCh0aW1lc3RhbXBDdXJyZW50KTtcbiAgICAgICAgICAgIHRoaXMuc3VyZmFjZS5tb3ZlVG8odGhpcy50YXJnZXQueCwgdGhpcy50YXJnZXQueSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgbW92ZVggPSAwO1xuICAgICAgICAgICAgbGV0IG1vdmVZID0gMDtcbiAgICAgICAgICAgIGlmICh0aGlzLngudmFsdWUgPiAwICYmIHRoaXMueC52YWx1ZSA+IHRoaXMuY3VycmVudC54KSB7XG4gICAgICAgICAgICAgICAgbW92ZVggPSByb3VuZEZsb2F0KE1hdGgubWF4KDAsIHRoaXMueC52YWx1ZSAqIG1vdmVSYXRpbyAtIHRoaXMuY3VycmVudC54KSwgdGhpcy5zdXJmYWNlLkNPTkZJRy5DT09SRF9ST1VORElOR19JTlRFUklNLlZBTFVFKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnkudmFsdWUgPiAwICYmIHRoaXMueS52YWx1ZSA+IHRoaXMuY3VycmVudC55KSB7XG4gICAgICAgICAgICAgICAgbW92ZVkgPSByb3VuZEZsb2F0KE1hdGgubWF4KDAsIHRoaXMueS52YWx1ZSAqIG1vdmVSYXRpbyAtIHRoaXMuY3VycmVudC55KSwgdGhpcy5zdXJmYWNlLkNPTkZJRy5DT09SRF9ST1VORElOR19JTlRFUklNLlZBTFVFKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtb3ZlWCA+IDAgfHwgbW92ZVkgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdXJmYWNlLm1vdmUobW92ZVggKiB0aGlzLnguc2lnbiwgbW92ZVkgKiB0aGlzLnkuc2lnbiwgdGhpcy5zdXJmYWNlLkNPTkZJRy5DT09SRF9ST1VORElOR19JTlRFUklNLlZBTFVFLCB0aGlzLnN1cmZhY2UuQ09ORklHLkNPT1JEX1JPVU5ESU5HX0lOVEVSSU0uVkFMVUUpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudC54ID0gcm91bmRGbG9hdCh0aGlzLmN1cnJlbnQueCArIG1vdmVYLCB0aGlzLnN1cmZhY2UuQ09ORklHLkNPT1JEX1JPVU5ESU5HX0lOVEVSSU0uVkFMVUUpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudC55ID0gcm91bmRGbG9hdCh0aGlzLmN1cnJlbnQueSArIG1vdmVZLCB0aGlzLnN1cmZhY2UuQ09ORklHLkNPT1JEX1JPVU5ESU5HX0lOVEVSSU0uVkFMVUUpO1xuICAgICAgICAgICAgICAgIHRoaXMudGltZXN0YW1wTGFzdCA9IHRpbWVzdGFtcEN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dTdGVwKCd0aW1lICcgKyAodGltZXN0YW1wQ3VycmVudCAtIHRoaXMudGltZXN0YW1wU3RhcnQpICsgJ21zLCB0aW1lUmF0aW8gJyArIHRpbWVSYXRpbyArICcsIG1vdmVSYXRpbyAnICsgbW92ZVJhdGlvICsgJywgeCAnICsgbW92ZVggKyAnLCB5ICcgKyBtb3ZlWSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTaWduYWwgdGhhdCBhbmltYXRpb24gaGFzbid0IGZpbmlzaGVkIHlldFxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbG9nRmluaXNoKHRpbWVzdGFtcEN1cnJlbnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0dsaWRlIGZpbmlzaGVkOiAnICsgKHRpbWVzdGFtcEN1cnJlbnQgLSB0aGlzLnRpbWVzdGFtcFN0YXJ0KSArICdtcywgc3VyZmFjZS54ICcgKyB0aGlzLnN1cmZhY2UueCArICcsIHN1cmZhY2UueSAnICsgdGhpcy5zdXJmYWNlLnkgKyAnLCB0YXJnZXQueCAnICsgdGhpcy50YXJnZXQueCArICcsIHRhcmdldC55ICcgKyB0aGlzLnRhcmdldC55ICsgJ1xcblxcblN0ZXBzOlxcbicgKyB0aGlzLnN0ZXBMb2cuam9pbignXFxuJykpO1xuICAgIH1cbn1cbiIsImltcG9ydCBBbmltYXRpb25TdXJmYWNlR2xpZGUgZnJvbSAnLi9nbGlkZS5qcyc7XG5pbXBvcnQgQW5pbWF0aW9uU3VyZmFjZUVkZ2UgZnJvbSAnLi9lZGdlLmpzJztcbmltcG9ydCBBbmltYXRpb25TdXJmYWNlRHJhZyBmcm9tICcuL2RyYWcuanMnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5pbWF0aW9uU3RvcmFnZSB7XG4gICAgY29uc3RydWN0b3Ioc3VyZmFjZSkge1xuICAgICAgICB0aGlzLnN1cmZhY2VHbGlkZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc3VyZmFjZUVkZ2UgPSBudWxsO1xuICAgICAgICB0aGlzLnN1cmZhY2VEcmFnID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdXJmYWNlID0gc3VyZmFjZTtcbiAgICB9XG4gICAgY3JlYXRlU3VyZmFjZUdsaWRlKHgsIHksIGFuaW1hdGlvblRpbWUsIGVhc2luZ0Zvcm11bGEpIHtcbiAgICAgICAgdGhpcy5zdXJmYWNlR2xpZGUgPSBuZXcgQW5pbWF0aW9uU3VyZmFjZUdsaWRlKHRoaXMuc3VyZmFjZSwgeCwgeSwgYW5pbWF0aW9uVGltZSwgZWFzaW5nRm9ybXVsYSk7XG4gICAgfVxuICAgIGRlc3Ryb3lTdXJmYWNlR2xpZGUoKSB7XG4gICAgICAgIGlmICh0aGlzLnN1cmZhY2VHbGlkZUlzU2V0KCkpIHtcbiAgICAgICAgICAgIHRoaXMuc3VyZmFjZUdsaWRlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuc3VyZmFjZUdsaWRlID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBbmltYXRpb25TdXJmYWNlR2xpZGUgZGVzdHJveWVkJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3VyZmFjZUdsaWRlSXNTZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN1cmZhY2VHbGlkZSAhPT0gbnVsbDtcbiAgICB9XG4gICAgY3JlYXRlU3VyZmFjZUVkZ2UoeCwgeSkge1xuICAgICAgICB0aGlzLnN1cmZhY2VFZGdlID0gbmV3IEFuaW1hdGlvblN1cmZhY2VFZGdlKHRoaXMuc3VyZmFjZSwgeCwgeSk7XG4gICAgfVxuICAgIGRlc3Ryb3lTdXJmYWNlRWRnZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3VyZmFjZUVkZ2VJc1NldCgpKSB7XG4gICAgICAgICAgICB0aGlzLnN1cmZhY2VFZGdlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuc3VyZmFjZUVkZ2UgPSBudWxsO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0FuaW1hdGlvblN1cmZhY2VFZGdlIGRlc3Ryb3llZCcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN1cmZhY2VFZGdlSXNTZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN1cmZhY2VFZGdlICE9PSBudWxsO1xuICAgIH1cbiAgICBjcmVhdGVTdXJmYWNlRHJhZyhtb3VzZSkge1xuICAgICAgICB0aGlzLnN1cmZhY2VEcmFnID0gbmV3IEFuaW1hdGlvblN1cmZhY2VEcmFnKHRoaXMuc3VyZmFjZSwgbW91c2UpO1xuICAgIH1cbiAgICBkZXN0cm95U3VyZmFjZURyYWcoKSB7XG4gICAgICAgIGlmICh0aGlzLnN1cmZhY2VEcmFnSXNTZXQoKSkge1xuICAgICAgICAgICAgdGhpcy5zdXJmYWNlRHJhZy5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLnN1cmZhY2VEcmFnID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBbmltYXRpb25TdXJmYWNlRHJhZyBkZXN0cm95ZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdXJmYWNlRHJhZ0lzU2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdXJmYWNlRHJhZyAhPT0gbnVsbDtcbiAgICB9XG59XG4iLCJ2YXIgQ29uZmlnUHJvcGVydHlUeXBlO1xuKGZ1bmN0aW9uIChDb25maWdQcm9wZXJ0eVR5cGUpIHtcbiAgICBDb25maWdQcm9wZXJ0eVR5cGVbXCJBbmdsZVwiXSA9IFwiYW5nbGVcIjtcbiAgICBDb25maWdQcm9wZXJ0eVR5cGVbXCJDb2xvclwiXSA9IFwiY29sb3JcIjtcbiAgICBDb25maWdQcm9wZXJ0eVR5cGVbXCJJbnRlZ2VyXCJdID0gXCJpbnRlZ2VyXCI7XG4gICAgQ29uZmlnUHJvcGVydHlUeXBlW1wiTnVtYmVyXCJdID0gXCJudW1iZXJcIjtcbiAgICBDb25maWdQcm9wZXJ0eVR5cGVbXCJMZW5ndGhcIl0gPSBcImxlbmd0aFwiO1xuICAgIENvbmZpZ1Byb3BlcnR5VHlwZVtcIlRpbWVcIl0gPSBcInRpbWVcIjtcbn0pKENvbmZpZ1Byb3BlcnR5VHlwZSB8fCAoQ29uZmlnUHJvcGVydHlUeXBlID0ge30pKTtcbmV4cG9ydCBmdW5jdGlvbiBzZXR1cENvbmZpZyhjb25maWdDdXN0b20pIHtcbiAgICBsZXQgY29uZmlnID0ge1xuICAgICAgICBERUJVR19NT0RFOiAwLFxuICAgICAgICBTQ0FMRV9TVEVQOiAwLjIwLCAvLyBQZXJjZW50IG9mIDEvMiB0b3RhbCBzY2FsZSwgZS5nLiAwLjIwIG1lYW5zIDUgc3RlcHMgZnJvbSAwLjI1IHRvIDAuNTAgYW5kIDUgc3RlcHMgZnJvbSAwLjUwIHRvIDFcbiAgICAgICAgU0NBTEVfTUlOOiAwLjI1LFxuICAgICAgICBTQ0FMRV9ERUZBVUxUOiAwLjUwLFxuICAgICAgICBTQ0FMRV9NQVg6IDEuMDAsXG4gICAgICAgIFNDQUxFX1JPVU5ESU5HOiAzLFxuICAgICAgICBQRVJTUEVDVElWRV9ESVNUQU5DRTogMTAwMCxcbiAgICAgICAgU0tFV19YX01BWDogMzUsXG4gICAgICAgIEVER0VfTU9WRV9FTkFCTEVEOiAwLFxuICAgICAgICBFREdFX01PVkVfQVJFQTogMjAsXG4gICAgICAgIEVER0VfTU9WRV9TUEVFRDogMTAsXG4gICAgICAgIEFOSU1BVElPTl9TQ0FMRV9USU1FOiA1MDAsXG4gICAgICAgIEFOSU1BVElPTl9HTElERV9USU1FOiA1MDAsXG4gICAgICAgIERVUkFUSU9OX0ZPUl9USFJPVzogMTUwLFxuICAgICAgICBUSFJPV19NVUxUSVBMSUVSOiA0LFxuICAgICAgICBBTklNQVRJT05fVEhST1dfVElNRTogMTAwMCxcbiAgICAgICAgQ09PUkRfUk9VTkRJTkdfSU5URVJJTTogMSxcbiAgICAgICAgQ09PUkRfUk9VTkRJTkdfRklOQUw6IDBcbiAgICB9O1xuICAgIGZvciAoY29uc3QgcGFyYW1ldGVyIGluIGNvbmZpZ0N1c3RvbSkge1xuICAgICAgICBpZiAoY29uZmlnLmhhc093blByb3BlcnR5KHBhcmFtZXRlcikpIHtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IGNvbmZpZ0N1c3RvbVtwYXJhbWV0ZXJdO1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uZmlnW3BhcmFtZXRlcl0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBDT05GSUcgPSB7XG4gICAgICAgIERFQlVHX01PREU6IHtcbiAgICAgICAgICAgIFZBTFVFOiBjb25maWcuREVCVUdfTU9ERSxcbiAgICAgICAgICAgIFRZUEU6IENvbmZpZ1Byb3BlcnR5VHlwZS5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIFNDQUxFX1NURVA6IHtcbiAgICAgICAgICAgIFZBTFVFOiBjb25maWcuU0NBTEVfU1RFUCxcbiAgICAgICAgICAgIFRZUEU6IENvbmZpZ1Byb3BlcnR5VHlwZS5OdW1iZXJcbiAgICAgICAgfSxcbiAgICAgICAgU0NBTEVfTUlOOiB7XG4gICAgICAgICAgICBWQUxVRTogY29uZmlnLlNDQUxFX01JTixcbiAgICAgICAgICAgIFRZUEU6IENvbmZpZ1Byb3BlcnR5VHlwZS5OdW1iZXJcbiAgICAgICAgfSxcbiAgICAgICAgU0NBTEVfREVGQVVMVDoge1xuICAgICAgICAgICAgVkFMVUU6IGNvbmZpZy5TQ0FMRV9ERUZBVUxULFxuICAgICAgICAgICAgVFlQRTogQ29uZmlnUHJvcGVydHlUeXBlLk51bWJlclxuICAgICAgICB9LFxuICAgICAgICBTQ0FMRV9NQVg6IHtcbiAgICAgICAgICAgIFZBTFVFOiBjb25maWcuU0NBTEVfTUFYLFxuICAgICAgICAgICAgVFlQRTogQ29uZmlnUHJvcGVydHlUeXBlLk51bWJlclxuICAgICAgICB9LFxuICAgICAgICBTQ0FMRV9ST1VORElORzoge1xuICAgICAgICAgICAgVkFMVUU6IGNvbmZpZy5TQ0FMRV9ST1VORElORyxcbiAgICAgICAgICAgIFRZUEU6IENvbmZpZ1Byb3BlcnR5VHlwZS5OdW1iZXJcbiAgICAgICAgfSxcbiAgICAgICAgUEVSU1BFQ1RJVkVfRElTVEFOQ0U6IHtcbiAgICAgICAgICAgIFZBTFVFOiBNYXRoLnJvdW5kKGNvbmZpZy5QRVJTUEVDVElWRV9ESVNUQU5DRSksXG4gICAgICAgICAgICBUWVBFOiBDb25maWdQcm9wZXJ0eVR5cGUuTGVuZ3RoXG4gICAgICAgIH0sXG4gICAgICAgIFNLRVdfWF9NQVg6IHtcbiAgICAgICAgICAgIFZBTFVFOiBNYXRoLnJvdW5kKGNvbmZpZy5TS0VXX1hfTUFYKSxcbiAgICAgICAgICAgIFRZUEU6IENvbmZpZ1Byb3BlcnR5VHlwZS5BbmdsZVxuICAgICAgICB9LFxuICAgICAgICBFREdFX01PVkVfRU5BQkxFRDoge1xuICAgICAgICAgICAgVkFMVUU6IGNvbmZpZy5FREdFX01PVkVfRU5BQkxFRCxcbiAgICAgICAgICAgIFRZUEU6IENvbmZpZ1Byb3BlcnR5VHlwZS5JbnRlZ2VyXG4gICAgICAgIH0sXG4gICAgICAgIEVER0VfTU9WRV9BUkVBOiB7XG4gICAgICAgICAgICBWQUxVRTogTWF0aC5yb3VuZChjb25maWcuRURHRV9NT1ZFX0FSRUEpLFxuICAgICAgICAgICAgVFlQRTogQ29uZmlnUHJvcGVydHlUeXBlLkxlbmd0aFxuICAgICAgICB9LFxuICAgICAgICBFREdFX01PVkVfU1BFRUQ6IHtcbiAgICAgICAgICAgIFZBTFVFOiBNYXRoLnJvdW5kKGNvbmZpZy5FREdFX01PVkVfU1BFRUQpLFxuICAgICAgICAgICAgVFlQRTogQ29uZmlnUHJvcGVydHlUeXBlLkxlbmd0aFxuICAgICAgICB9LFxuICAgICAgICBBTklNQVRJT05fU0NBTEVfVElNRToge1xuICAgICAgICAgICAgVkFMVUU6IE1hdGgucm91bmQoY29uZmlnLkFOSU1BVElPTl9TQ0FMRV9USU1FKSxcbiAgICAgICAgICAgIFRZUEU6IENvbmZpZ1Byb3BlcnR5VHlwZS5UaW1lXG4gICAgICAgIH0sXG4gICAgICAgIEFOSU1BVElPTl9HTElERV9USU1FOiB7XG4gICAgICAgICAgICBWQUxVRTogTWF0aC5yb3VuZChjb25maWcuQU5JTUFUSU9OX0dMSURFX1RJTUUpLFxuICAgICAgICAgICAgVFlQRTogQ29uZmlnUHJvcGVydHlUeXBlLlRpbWVcbiAgICAgICAgfSxcbiAgICAgICAgRFVSQVRJT05fRk9SX1RIUk9XOiB7XG4gICAgICAgICAgICBWQUxVRTogTWF0aC5yb3VuZChjb25maWcuRFVSQVRJT05fRk9SX1RIUk9XKSxcbiAgICAgICAgICAgIFRZUEU6IENvbmZpZ1Byb3BlcnR5VHlwZS5UaW1lXG4gICAgICAgIH0sXG4gICAgICAgIFRIUk9XX01VTFRJUExJRVI6IHtcbiAgICAgICAgICAgIFZBTFVFOiBjb25maWcuVEhST1dfTVVMVElQTElFUixcbiAgICAgICAgICAgIFRZUEU6IENvbmZpZ1Byb3BlcnR5VHlwZS5OdW1iZXJcbiAgICAgICAgfSxcbiAgICAgICAgQU5JTUFUSU9OX1RIUk9XX1RJTUU6IHtcbiAgICAgICAgICAgIFZBTFVFOiBNYXRoLnJvdW5kKGNvbmZpZy5BTklNQVRJT05fVEhST1dfVElNRSksXG4gICAgICAgICAgICBUWVBFOiBDb25maWdQcm9wZXJ0eVR5cGUuVGltZVxuICAgICAgICB9LFxuICAgICAgICBDT09SRF9ST1VORElOR19JTlRFUklNOiB7XG4gICAgICAgICAgICBWQUxVRTogY29uZmlnLkNPT1JEX1JPVU5ESU5HX0lOVEVSSU0sXG4gICAgICAgICAgICBUWVBFOiBDb25maWdQcm9wZXJ0eVR5cGUuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICBDT09SRF9ST1VORElOR19GSU5BTDoge1xuICAgICAgICAgICAgVkFMVUU6IGNvbmZpZy5DT09SRF9ST1VORElOR19GSU5BTCxcbiAgICAgICAgICAgIFRZUEU6IENvbmZpZ1Byb3BlcnR5VHlwZS5JbnRlZ2VyXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBDT05GSUc7XG59XG4iLCJpbXBvcnQgeyBtb3VzZU1vdmUsIG1vdXNlV2hlZWwsIG1vdXNlRG93biB9IGZyb20gJy4vbW91c2UuanMnO1xuaW1wb3J0IHsgYnV0dG9uUHJlc3NlZCB9IGZyb20gJy4va2V5Ym9hcmQuanMnO1xuaW1wb3J0IHsgc2NhbGVBbmRHbGlkZSB9IGZyb20gJy4vc2NhbGUuanMnO1xuaW1wb3J0IHsgaW5pdERyYWcgfSBmcm9tICcuL2RyYWcuanMnO1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRDb250cm9scyhzdXJmYWNlKSB7XG4gICAgc3VyZmFjZS5lbGVtZW50cy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZSkgPT4geyBtb3VzZU1vdmUoZSwgc3VyZmFjZSk7IH0pO1xuICAgIHN1cmZhY2UuZWxlbWVudHMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ3aGVlbFwiLCAoZSkgPT4geyBtb3VzZVdoZWVsKGUsIHN1cmZhY2UpOyB9KTtcbiAgICBpbml0RHJhZyhzdXJmYWNlKTtcbiAgICBzdXJmYWNlLmVsZW1lbnRzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlKSA9PiB7IG1vdXNlRG93bihlLCBzdXJmYWNlKTsgfSk7XG4gICAgc3VyZmFjZS5lbGVtZW50cy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgKGUpID0+IHsgbW91c2VEb3duKGUsIHN1cmZhY2UpOyB9KTtcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7IGJ1dHRvblByZXNzZWQoZSwgc3VyZmFjZSk7IH0pO1xuICAgIHN1cmZhY2UuZWxlbWVudHMuY29udHJvbHNab29tSW4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHsgc2NhbGVBbmRHbGlkZShzdXJmYWNlLCAxKTsgfSk7XG4gICAgc3VyZmFjZS5lbGVtZW50cy5jb250cm9sc1pvb21PdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHsgc2NhbGVBbmRHbGlkZShzdXJmYWNlLCAtMSk7IH0pO1xuICAgIHN1cmZhY2UuZWxlbWVudHMuY29udGFpbmVyLm9uZHJhZ3N0YXJ0ID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IGdldE1vdXNlUGFyYW1zIH0gZnJvbSAnLi4vY29udHJvbHMvbW91c2UuanMnO1xuZXhwb3J0IGZ1bmN0aW9uIGluaXREcmFnKHN1cmZhY2UpIHtcbiAgICBmdW5jdGlvbiBtb3ZlVG9EcmFnKGV2ZW50KSB7XG4gICAgICAgIGlmIChzdXJmYWNlLmFuaW1hdGlvblN0b3JhZ2Uuc3VyZmFjZURyYWdJc1NldCgpKSB7XG4gICAgICAgICAgICBzdXJmYWNlLmFuaW1hdGlvblN0b3JhZ2Uuc3VyZmFjZURyYWcuc3RlcChnZXRNb3VzZVBhcmFtcyhldmVudCwgc3VyZmFjZSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN1cmZhY2UuZWxlbWVudHMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVUb0RyYWcpO1xuICAgIHN1cmZhY2UuZWxlbWVudHMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG1vdmVUb0RyYWcpO1xuICAgIGZ1bmN0aW9uIGNsZWFyU3VyZmFjZURyYWcoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd3b2xvbG8nKTtcbiAgICAgICAgc3VyZmFjZS5hbmltYXRpb25TdG9yYWdlLmRlc3Ryb3lTdXJmYWNlRHJhZygpO1xuICAgIH1cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBjbGVhclN1cmZhY2VEcmFnKTtcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgY2xlYXJTdXJmYWNlRHJhZyk7XG59XG4iLCJpbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tICcuLi91dGlscy5qcyc7XG5leHBvcnQgZnVuY3Rpb24gbW92ZVN1cmZhY2VCeUVkZ2Uoc3VyZmFjZSwgbW91c2UpIHtcbiAgICBpZiAoc3VyZmFjZS5hbmltYXRpb25TdG9yYWdlLnN1cmZhY2VEcmFnSXNTZXQoKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGxldCBkaXJlY3Rpb24gPSB7XG4gICAgICAgIHg6IERpcmVjdGlvbi5Ob25lLFxuICAgICAgICB5OiBEaXJlY3Rpb24uTm9uZVxuICAgIH07XG4gICAgaWYgKG1vdXNlLnkgPD0gc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX0FSRUEuVkFMVUUpIHtcbiAgICAgICAgaWYgKG1vdXNlLnggPD0gc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX0FSRUEuVkFMVUUpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbi54ID0gRGlyZWN0aW9uLkxlZnQ7XG4gICAgICAgICAgICBkaXJlY3Rpb24ueSA9IERpcmVjdGlvbi5Ub3A7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobW91c2UueCA+PSBzdXJmYWNlLmNvbnRhaW5lcldpZHRoIC0gc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX0FSRUEuVkFMVUUpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbi54ID0gRGlyZWN0aW9uLlJpZ2h0O1xuICAgICAgICAgICAgZGlyZWN0aW9uLnkgPSBEaXJlY3Rpb24uVG9wO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGlyZWN0aW9uLnkgPSBEaXJlY3Rpb24uVG9wO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKG1vdXNlLnkgPj0gc3VyZmFjZS5jb250YWluZXJIZWlnaHQgLSBzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSkge1xuICAgICAgICBpZiAobW91c2UueCA8PSBzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSkge1xuICAgICAgICAgICAgZGlyZWN0aW9uLnggPSBEaXJlY3Rpb24uTGVmdDtcbiAgICAgICAgICAgIGRpcmVjdGlvbi55ID0gRGlyZWN0aW9uLkJvdHRvbTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChtb3VzZS54ID49IHN1cmZhY2UuY29udGFpbmVyV2lkdGggLSBzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSkge1xuICAgICAgICAgICAgZGlyZWN0aW9uLnggPSBEaXJlY3Rpb24uUmlnaHQ7XG4gICAgICAgICAgICBkaXJlY3Rpb24ueSA9IERpcmVjdGlvbi5Cb3R0b207XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkaXJlY3Rpb24ueSA9IERpcmVjdGlvbi5Cb3R0b207XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChtb3VzZS54IDw9IHN1cmZhY2UuQ09ORklHLkVER0VfTU9WRV9BUkVBLlZBTFVFKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb24ueCA9IERpcmVjdGlvbi5MZWZ0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG1vdXNlLnggPj0gc3VyZmFjZS5jb250YWluZXJXaWR0aCAtIHN1cmZhY2UuQ09ORklHLkVER0VfTU9WRV9BUkVBLlZBTFVFKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb24ueCA9IERpcmVjdGlvbi5SaWdodDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgeCA9IDA7XG4gICAgbGV0IHkgPSAwO1xuICAgIGlmIChkaXJlY3Rpb24ueSAhPT0gRGlyZWN0aW9uLk5vbmUgfHwgZGlyZWN0aW9uLnggIT09IERpcmVjdGlvbi5Ob25lKSB7XG4gICAgICAgIGlmIChkaXJlY3Rpb24ueSA9PT0gRGlyZWN0aW9uLlRvcCkge1xuICAgICAgICAgICAgeSA9IChzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSArIDEgLSBtb3VzZS55KSAvIChzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSArIDEpICogLTE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGlyZWN0aW9uLnkgPT09IERpcmVjdGlvbi5Cb3R0b20pIHtcbiAgICAgICAgICAgIHkgPSAoc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX0FSRUEuVkFMVUUgKyAxIC0gKHN1cmZhY2UuY29udGFpbmVySGVpZ2h0IC0gbW91c2UueSkpIC8gKHN1cmZhY2UuQ09ORklHLkVER0VfTU9WRV9BUkVBLlZBTFVFICsgMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpcmVjdGlvbi54ID09PSBEaXJlY3Rpb24uTGVmdCkge1xuICAgICAgICAgICAgeCA9IChzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSArIDEgLSBtb3VzZS54KSAvIChzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSArIDEpICogLTE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGlyZWN0aW9uLnggPT09IERpcmVjdGlvbi5SaWdodCkge1xuICAgICAgICAgICAgeCA9IChzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSArIDEgLSAoc3VyZmFjZS5jb250YWluZXJXaWR0aCAtIG1vdXNlLngpKSAvIChzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSArIDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxldCB4TW92ZUlzWmVybyA9IGZhbHNlO1xuICAgIGlmICh4ID09PSAwIHx8ICh4ID4gMCAmJiBzdXJmYWNlLnggPj0gc3VyZmFjZS5tYXgueCkgfHwgKHggPCAwICYmIHN1cmZhY2UueCA8PSBzdXJmYWNlLm1pbi54KSkge1xuICAgICAgICB4TW92ZUlzWmVybyA9IHRydWU7XG4gICAgfVxuICAgIGxldCB5TW92ZUlzWmVybyA9IGZhbHNlO1xuICAgIGlmICh5ID09PSAwIHx8ICh5ID4gMCAmJiBzdXJmYWNlLnkgPj0gc3VyZmFjZS5tYXgueSkgfHwgKHkgPCAwICYmIHN1cmZhY2UueSA8PSBzdXJmYWNlLm1pbi55KSkge1xuICAgICAgICB5TW92ZUlzWmVybyA9IHRydWU7XG4gICAgfVxuICAgIGlmICh4TW92ZUlzWmVybyAmJiB5TW92ZUlzWmVybykge1xuICAgICAgICBpZiAoc3VyZmFjZS5hbmltYXRpb25TdG9yYWdlLnN1cmZhY2VFZGdlSXNTZXQoKSkge1xuICAgICAgICAgICAgc3VyZmFjZS5hbmltYXRpb25TdG9yYWdlLmRlc3Ryb3lTdXJmYWNlRWRnZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFzdXJmYWNlLmFuaW1hdGlvblN0b3JhZ2Uuc3VyZmFjZUVkZ2VJc1NldCgpKSB7XG4gICAgICAgIHN1cmZhY2UuYW5pbWF0aW9uU3RvcmFnZS5jcmVhdGVTdXJmYWNlRWRnZSh4LCB5KTtcbiAgICAgICAgc3VyZmFjZS5hbmltYXRpb25FeGVjdXRvci5pbml0aWF0ZSgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3VyZmFjZS5hbmltYXRpb25TdG9yYWdlLnN1cmZhY2VFZGdlLnVwZGF0ZSh4LCB5KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG4iLCJpbXBvcnQgeyBzY2FsZUFuZEdsaWRlIH0gZnJvbSAnLi9zY2FsZS5qcyc7XG5leHBvcnQgZnVuY3Rpb24gYnV0dG9uUHJlc3NlZChldmVudCwgc3VyZmFjZSkge1xuICAgIGlmIChzdXJmYWNlLmVsZW1lbnRzLmNvbnRhaW5lci5tYXRjaGVzKCc6aG92ZXInKSkge1xuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSBcIkFkZFwiIHx8IGV2ZW50LmtleSA9PT0gXCIrXCIpIHtcbiAgICAgICAgICAgIHNjYWxlQW5kR2xpZGUoc3VyZmFjZSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZXZlbnQua2V5ID09PSBcIlN1YnRyYWN0XCIgfHwgZXZlbnQua2V5ID09PSBcIi1cIikge1xuICAgICAgICAgICAgc2NhbGVBbmRHbGlkZShzdXJmYWNlLCAtMSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBzY2FsZUFuZEdsaWRlIH0gZnJvbSAnLi9zY2FsZS5qcyc7XG5pbXBvcnQgeyBtb3ZlU3VyZmFjZUJ5RWRnZSB9IGZyb20gJy4vZWRnZS5qcyc7XG5leHBvcnQgZnVuY3Rpb24gZ2V0TW91c2VQYXJhbXMoZXZlbnQsIHN1cmZhY2UpIHtcbiAgICBsZXQgYm91bmRzID0gc3VyZmFjZS5lbGVtZW50cy5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYnV0dG9uOiAoZXZlbnQgaW5zdGFuY2VvZiBUb3VjaEV2ZW50ID8gMCA6IGV2ZW50LmJ1dHRvbiksXG4gICAgICAgIHg6IChldmVudCBpbnN0YW5jZW9mIFRvdWNoRXZlbnQgPyBldmVudC50b3VjaGVzWzBdLmNsaWVudFggLSBib3VuZHMubGVmdCA6IGV2ZW50LmNsaWVudFggLSBib3VuZHMubGVmdCksXG4gICAgICAgIHk6IChldmVudCBpbnN0YW5jZW9mIFRvdWNoRXZlbnQgPyBldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSBib3VuZHMudG9wIDogZXZlbnQuY2xpZW50WSAtIGJvdW5kcy50b3ApXG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRXaGVlbFBhcmFtcyhldmVudCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHg6IGV2ZW50LmRlbHRhWCxcbiAgICAgICAgeTogZXZlbnQuZGVsdGFZXG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZU1vdmUoZXZlbnQsIHN1cmZhY2UpIHtcbiAgICBpZiAoc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX0VOQUJMRUQuVkFMVUUgPT09IDEpIHtcbiAgICAgICAgbW92ZVN1cmZhY2VCeUVkZ2Uoc3VyZmFjZSwgZ2V0TW91c2VQYXJhbXMoZXZlbnQsIHN1cmZhY2UpKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gbW91c2VXaGVlbChldmVudCwgc3VyZmFjZSkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgc2NhbGVBbmRHbGlkZShzdXJmYWNlLCAoZ2V0V2hlZWxQYXJhbXMoZXZlbnQpLnkgPCAwID8gMSA6IC0xKSwgZ2V0TW91c2VQYXJhbXMoZXZlbnQsIHN1cmZhY2UpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZURvd24oZXZlbnQsIHN1cmZhY2UpIHtcbiAgICBsZXQgbW91c2UgPSBnZXRNb3VzZVBhcmFtcyhldmVudCwgc3VyZmFjZSk7XG4gICAgaWYgKG1vdXNlLmJ1dHRvbiA9PT0gMCkge1xuICAgICAgICBzdXJmYWNlLmFuaW1hdGlvblN0b3JhZ2UuY3JlYXRlU3VyZmFjZURyYWcobW91c2UpO1xuICAgICAgICAvLyBjcmVhdGVTdXJmYWNlRHJhZyhzdXJmYWNlLCBnZXRNb3VzZVBhcmFtcyhldmVudCwgc3VyZmFjZSkpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IHJvdW5kRmxvYXQgfSBmcm9tICcuLi91dGlscy5qcyc7XG5leHBvcnQgZnVuY3Rpb24gc2NhbGVBbmRHbGlkZShzdXJmYWNlLCBzdGVwcywgbW91c2UgPSBudWxsKSB7XG4gICAgbGV0IGNoYW5nZTtcbiAgICBpZiAoc3VyZmFjZS5zY2FsZSA8IHN1cmZhY2UuQ09ORklHLlNDQUxFX0RFRkFVTFQuVkFMVUUgfHwgKHN0ZXBzIDwgMCAmJiBzdXJmYWNlLnNjYWxlIDw9IHN1cmZhY2UuQ09ORklHLlNDQUxFX0RFRkFVTFQuVkFMVUUpKSB7XG4gICAgICAgIGNoYW5nZSA9IHN0ZXBzICogKHN1cmZhY2UuQ09ORklHLlNDQUxFX0RFRkFVTFQuVkFMVUUgLSBzdXJmYWNlLkNPTkZJRy5TQ0FMRV9NSU4uVkFMVUUpICogc3VyZmFjZS5DT05GSUcuU0NBTEVfU1RFUC5WQUxVRTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNoYW5nZSA9IHN0ZXBzICogKHN1cmZhY2UuQ09ORklHLlNDQUxFX01BWC5WQUxVRSAtIHN1cmZhY2UuQ09ORklHLlNDQUxFX0RFRkFVTFQuVkFMVUUpICogc3VyZmFjZS5DT05GSUcuU0NBTEVfU1RFUC5WQUxVRTtcbiAgICB9XG4gICAgbGV0IHNjYWxlQ2hhbmdlZCA9IHN1cmZhY2UuY2hhbmdlU2NhbGUoY2hhbmdlKTtcbiAgICBpZiAoc2NhbGVDaGFuZ2VkICYmIG1vdXNlICE9PSBudWxsKSB7XG4gICAgICAgIGxldCB4ID0gcm91bmRGbG9hdCgobW91c2UueCAtIHN1cmZhY2UuY29udGFpbmVyV2lkdGggLyAyKSAqIDAuMjAgLyBzdXJmYWNlLnNjYWxlLCBzdXJmYWNlLkNPTkZJRy5DT09SRF9ST1VORElOR19GSU5BTC5WQUxVRSk7XG4gICAgICAgIGxldCB5ID0gcm91bmRGbG9hdCgobW91c2UueSAtIHN1cmZhY2UuY29udGFpbmVySGVpZ2h0IC8gMikgKiAwLjIwIC8gc3VyZmFjZS5zY2FsZSwgc3VyZmFjZS5DT05GSUcuQ09PUkRfUk9VTkRJTkdfRklOQUwuVkFMVUUpO1xuICAgICAgICBpZiAoY2hhbmdlIDwgMCkge1xuICAgICAgICAgICAgeCA9IHggKiAtMTtcbiAgICAgICAgICAgIHkgPSB5ICogLTE7XG4gICAgICAgIH1cbiAgICAgICAgc3VyZmFjZS5nbGlkZSh4LCB5KTtcbiAgICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVDc3NEeW5hbWljKHN1cmZhY2UpIHtcbiAgICByZXR1cm4gYFxyXG4gIEBwcm9wZXJ0eSAtLXRpbHRlZC1jb250YWluZXItd2lkdGgtYCArIHN1cmZhY2UudXVpZCArIGAge1xyXG4gICAgc3ludGF4OiBcIjxsZW5ndGg+XCI7XHJcbiAgICBpbmhlcml0czogdHJ1ZTtcclxuICAgIGluaXRpYWwtdmFsdWU6IGAgKyBzdXJmYWNlLmNvbnRhaW5lcldpZHRoICsgYHB4O1xyXG4gIH1cclxuICBAcHJvcGVydHkgLS10aWx0ZWQtY29udGFpbmVyLWhlaWdodC1gICsgc3VyZmFjZS51dWlkICsgYCB7XHJcbiAgICBzeW50YXg6IFwiPGxlbmd0aD5cIjtcclxuICAgIGluaGVyaXRzOiB0cnVlO1xyXG4gICAgaW5pdGlhbC12YWx1ZTogYCArIHN1cmZhY2UuY29udGFpbmVySGVpZ2h0ICsgYHB4O1xyXG4gIH1cclxuXHJcbiAgQHByb3BlcnR5IC0tdGlsdGVkLXN1cmZhY2Utd2lkdGgtYCArIHN1cmZhY2UudXVpZCArIGAge1xyXG4gICAgc3ludGF4OiBcIjxsZW5ndGg+XCI7XHJcbiAgICBpbmhlcml0czogdHJ1ZTtcclxuICAgIGluaXRpYWwtdmFsdWU6IGAgKyBzdXJmYWNlLnN1cmZhY2VXaWR0aCArIGBweDtcclxuICB9XHJcbiAgQHByb3BlcnR5IC0tdGlsdGVkLXN1cmZhY2UtaGVpZ2h0LWAgKyBzdXJmYWNlLnV1aWQgKyBgIHtcclxuICAgIHN5bnRheDogXCI8bGVuZ3RoPlwiO1xyXG4gICAgaW5oZXJpdHM6IHRydWU7XHJcbiAgICBpbml0aWFsLXZhbHVlOiBgICsgc3VyZmFjZS5zdXJmYWNlSGVpZ2h0ICsgYHB4O1xyXG4gIH1gO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlQ3NzU3RhdGljKHN1cmZhY2UpIHtcbiAgICBsZXQgc3RyaW5nID0gJyc7XG4gICAgZm9yIChjb25zdCBwYXJhbWV0ZXIgaW4gc3VyZmFjZS5DT05GSUcpIHtcbiAgICAgICAgbGV0IG1lYXN1cmUgPSAnJztcbiAgICAgICAgaWYgKHN1cmZhY2UuQ09ORklHW3BhcmFtZXRlcl0uVFlQRSA9PT0gJ2xlbmd0aCcpIHtcbiAgICAgICAgICAgIG1lYXN1cmUgPSAncHgnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHN1cmZhY2UuQ09ORklHW3BhcmFtZXRlcl0uVFlQRSA9PT0gJ2FuZ2xlJykge1xuICAgICAgICAgICAgbWVhc3VyZSA9ICdkZWcnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHN1cmZhY2UuQ09ORklHW3BhcmFtZXRlcl0uVFlQRSA9PT0gJ3RpbWUnKSB7XG4gICAgICAgICAgICBtZWFzdXJlID0gJ21zJztcbiAgICAgICAgfVxuICAgICAgICBzdHJpbmcgKz0gYEBwcm9wZXJ0eSAtLSR7cGFyYW1ldGVyfSB7IGA7XG4gICAgICAgIHN0cmluZyArPSBgc3ludGF4OiBcIjwke3N1cmZhY2UuQ09ORklHW3BhcmFtZXRlcl0uVFlQRX0+XCI7IGA7XG4gICAgICAgIHN0cmluZyArPSBgaW5oZXJpdHM6IHRydWU7IGA7XG4gICAgICAgIHN0cmluZyArPSBgaW5pdGlhbC12YWx1ZTogJHtzdXJmYWNlLkNPTkZJR1twYXJhbWV0ZXJdLlZBTFVFfSR7bWVhc3VyZX07IH0gYDtcbiAgICB9XG4gICAgc3RyaW5nICs9IGBcclxuXHJcbiAgLnRpbHRlZC1jb250YWluZXItYCArIHN1cmZhY2UudXVpZCArIGAge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlICFpbXBvcnRhbnQ7XHJcblxyXG4gICAgY3Vyc29yOiBtb3ZlO1xyXG4gICAgY3Vyc29yOiBncmFiO1xyXG4gICAgY3Vyc29yOiAtbW96LWdyYWI7XHJcbiAgICBjdXJzb3I6IC13ZWJraXQtZ3JhYjtcclxuXHJcbiAgICAtd2Via2l0LXRvdWNoLWNhbGxvdXQ6IG5vbmU7XHJcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xyXG4gICAgLWtodG1sLXVzZXItc2VsZWN0OiBub25lO1xyXG4gICAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcclxuICAgIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcclxuICAgIHVzZXItc2VsZWN0OiBub25lO1xyXG4gIH1cclxuXHJcbiAgLnRpbHRlZC1jb250YWluZXItYCArIHN1cmZhY2UudXVpZCArIGA6YWN0aXZlIHtcclxuICAgIGN1cnNvcjogZ3JhYmJpbmc7XHJcbiAgICBjdXJzb3I6IC1tb3otZ3JhYmJpbmc7XHJcbiAgICBjdXJzb3I6IC13ZWJraXQtZ3JhYmJpbmc7XHJcbiAgfVxyXG5cclxuICAudGlsdGVkLWNvbnRyb2xzLWAgKyBzdXJmYWNlLnV1aWQgKyBgIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDogMTAwcHg7XHJcbiAgICByaWdodDogMzBweDtcclxuICAgIHdpZHRoOiAzMHB4O1xyXG4gICAgYm9yZGVyLXJhZGl1czogOHB4O1xyXG4gICAgYm94LXNoYWRvdzogcmdiYSgwLCAwLCAwLCAwLjE2KSAwcHggMXB4IDRweDtcclxuICAgIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICB9XHJcblxyXG4gIC50aWx0ZWQtY29udHJvbHMtem9vbS1pbi1gICsgc3VyZmFjZS51dWlkICsgYCxcclxuICAudGlsdGVkLWNvbnRyb2xzLXpvb20tb3V0LWAgKyBzdXJmYWNlLnV1aWQgKyBgIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIHdpZHRoOiAzMHB4O1xyXG4gICAgaGVpZ2h0OiAzMHB4O1xyXG4gICAgYmFja2dyb3VuZDogI2ZmZmZmZmNjO1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgYm94LXNpemluZzogY29udGVudC1ib3g7XHJcbiAgfVxyXG4gIC50aWx0ZWQtY29udHJvbHMtem9vbS1pbi1gICsgc3VyZmFjZS51dWlkICsgYHtcclxuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjNDQ0NDQ0O1xyXG4gIH1cclxuICAudGlsdGVkLWNvbnRyb2xzLXpvb20taW4tYCArIHN1cmZhY2UudXVpZCArIGA6YWN0aXZlLFxyXG4gIC50aWx0ZWQtY29udHJvbHMtem9vbS1vdXQtYCArIHN1cmZhY2UudXVpZCArIGA6YWN0aXZlIHtcclxuICAgIGJhY2tncm91bmQ6ICNmZmZmZmY7XHJcbiAgfVxyXG4gIFxyXG4gICAgXHJcblxyXG4gIFxyXG4gIC50aWx0ZWQtY29udHJvbHMtem9vbS1pbi1gICsgc3VyZmFjZS51dWlkICsgYDpiZWZvcmUsXHJcbiAgLnRpbHRlZC1jb250cm9scy16b29tLWluLWAgKyBzdXJmYWNlLnV1aWQgKyBgOmFmdGVyLFxyXG4gIC50aWx0ZWQtY29udHJvbHMtem9vbS1vdXQtYCArIHN1cmZhY2UudXVpZCArIGA6YmVmb3JlIHtcclxuICAgIGNvbnRlbnQ6IFwiXCI7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIGJhY2tncm91bmQ6ICM0NDQ0NDQ7XHJcbiAgfVxyXG5cclxuICAudGlsdGVkLWNvbnRyb2xzLXpvb20taW4tYCArIHN1cmZhY2UudXVpZCArIGA6YmVmb3JlLFxyXG4gIC50aWx0ZWQtY29udHJvbHMtem9vbS1vdXQtYCArIHN1cmZhY2UudXVpZCArIGA6YmVmb3JlIHtcclxuICAgIGhlaWdodDogMnB4O1xyXG4gICAgd2lkdGg6IDE4cHg7XHJcbiAgICB0b3A6IDE0cHg7XHJcbiAgICBsZWZ0OiA2cHg7XHJcbiAgfVxyXG4gIC50aWx0ZWQtY29udHJvbHMtem9vbS1pbi1gICsgc3VyZmFjZS51dWlkICsgYDphZnRlciB7XHJcbiAgICBoZWlnaHQ6IDE4cHg7XHJcbiAgICB3aWR0aDogMnB4O1xyXG4gICAgdG9wOiA2cHg7XHJcbiAgICBsZWZ0OiAxNHB4O1xyXG4gIH1cclxuICBcclxuICAudGlsdGVkLXZpZXdwb3J0LWAgKyBzdXJmYWNlLnV1aWQgKyBgIHtcclxuICAgIHdpZHRoOiB2YXIoLS10aWx0ZWQtc3VyZmFjZS13aWR0aC1gICsgc3VyZmFjZS51dWlkICsgYCkgIWltcG9ydGFudDtcclxuICAgIGhlaWdodDogdmFyKC0tdGlsdGVkLXN1cmZhY2UtaGVpZ2h0LWAgKyBzdXJmYWNlLnV1aWQgKyBgKSAhaW1wb3J0YW50O1xyXG4gIFxyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlICFpbXBvcnRhbnQ7XHJcbiAgXHJcbiAgICB3aWxsLWNoYW5nZTogdG9wLCBsZWZ0O1xyXG4gIH1cclxuICBcclxuICAudGlsdGVkLXNjYWxlLWAgKyBzdXJmYWNlLnV1aWQgKyBgIHsgICBcclxuICAgIHdpZHRoOiB2YXIoLS10aWx0ZWQtc3VyZmFjZS13aWR0aC1gICsgc3VyZmFjZS51dWlkICsgYCkgIWltcG9ydGFudDtcclxuICAgIGhlaWdodDogdmFyKC0tdGlsdGVkLXN1cmZhY2UtaGVpZ2h0LWAgKyBzdXJmYWNlLnV1aWQgKyBgKSAhaW1wb3J0YW50O1xyXG4gIFxyXG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIHZhcigtLUFOSU1BVElPTl9TQ0FMRV9USU1FKSAhaW1wb3J0YW50O1xyXG4gIFxyXG4gICAgd2lsbC1jaGFuZ2U6IHRyYW5zZm9ybTtcclxuICB9XHJcbiAgXHJcbiAgLnRpbHRlZC1wb3NpdGlvbi1gICsgc3VyZmFjZS51dWlkICsgYCB7XHJcbiAgICB3aWR0aDogdmFyKC0tdGlsdGVkLXN1cmZhY2Utd2lkdGgtYCArIHN1cmZhY2UudXVpZCArIGApICFpbXBvcnRhbnQ7XHJcbiAgICBoZWlnaHQ6IHZhcigtLXRpbHRlZC1zdXJmYWNlLWhlaWdodC1gICsgc3VyZmFjZS51dWlkICsgYCkgIWltcG9ydGFudDtcclxuXHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmUgIWltcG9ydGFudDtcclxuICAgIHRvcDogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBcclxuICAgIHdpbGwtY2hhbmdlOiB0cmFuc2Zvcm07XHJcbiAgfVxyXG4gIFxyXG4gIC50aWx0ZWQtc3VyZmFjZS1gICsgc3VyZmFjZS51dWlkICsgYCB7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmUgIWltcG9ydGFudDtcclxuICAgIFxyXG4gICAgb3ZlcmZsb3c6IHZpc2libGUgIWltcG9ydGFudDtcclxuICBcclxuICAgIHotaW5kZXg6IDEwMCAhaW1wb3J0YW50O1xyXG4gIH1cclxuICAgIFxyXG4gIC50aWx0ZWQtbm90cmFuc2l0aW9uLWAgKyBzdXJmYWNlLnV1aWQgKyBgIHtcclxuICAgIC13ZWJraXQtdHJhbnNpdGlvbjogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgLW1vei10cmFuc2l0aW9uOiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAtby10cmFuc2l0aW9uOiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICB0cmFuc2l0aW9uOiBub25lICFpbXBvcnRhbnQ7XHJcbiAgfWA7XG4gICAgcmV0dXJuIHN0cmluZztcbn1cbiIsImltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gJ3V1aWQnO1xuZXhwb3J0IGZ1bmN0aW9uIHJvdW5kRmxvYXQodmFsdWUsIHByZWNpc2lvbikge1xuICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlLnRvRml4ZWQocHJlY2lzaW9uKSk7XG59XG5leHBvcnQgZnVuY3Rpb24gY29vcmRzVG9EaXJlY3Rpb25zKHgsIHkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB4OiB4ID09PSAwID8gRGlyZWN0aW9uLk5vbmUgOiB4IDwgMCA/IERpcmVjdGlvbi5MZWZ0IDogRGlyZWN0aW9uLlJpZ2h0LFxuICAgICAgICB5OiB5ID09PSAwID8gRGlyZWN0aW9uLk5vbmUgOiB5IDwgMCA/IERpcmVjdGlvbi5Ub3AgOiBEaXJlY3Rpb24uQm90dG9tXG4gICAgfTtcbn1cbmV4cG9ydCB2YXIgRGlyZWN0aW9uO1xuKGZ1bmN0aW9uIChEaXJlY3Rpb24pIHtcbiAgICBEaXJlY3Rpb25bXCJUb3BcIl0gPSBcInRvcFwiO1xuICAgIERpcmVjdGlvbltcIkJvdHRvbVwiXSA9IFwiYm90dG9tXCI7XG4gICAgRGlyZWN0aW9uW1wiTGVmdFwiXSA9IFwibGVmdFwiO1xuICAgIERpcmVjdGlvbltcIlJpZ2h0XCJdID0gXCJyaWdodFwiO1xuICAgIERpcmVjdGlvbltcIk5vbmVcIl0gPSBcIm5vbmVcIjtcbn0pKERpcmVjdGlvbiB8fCAoRGlyZWN0aW9uID0ge30pKTtcbmV4cG9ydCBmdW5jdGlvbiBuZXdNb3ZlQ2hhaW4oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdXVpZDogdXVpZHY0KCksXG4gICAgICAgIGRpcmVjdGlvbjoge1xuICAgICAgICAgICAgeDogRGlyZWN0aW9uLk5vbmUsXG4gICAgICAgICAgICB5OiBEaXJlY3Rpb24uTm9uZVxuICAgICAgICB9LFxuICAgICAgICB2ZWN0b3I6IHtcbiAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICB5OiAwXG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNsb25lTW92ZUNoYWluKG1vdmVDaGFpbikge1xuICAgIHJldHVybiB7XG4gICAgICAgIHV1aWQ6IG1vdmVDaGFpbi51dWlkLFxuICAgICAgICBkaXJlY3Rpb246IHtcbiAgICAgICAgICAgIHg6IG1vdmVDaGFpbi5kaXJlY3Rpb24ueCxcbiAgICAgICAgICAgIHk6IG1vdmVDaGFpbi5kaXJlY3Rpb24ueVxuICAgICAgICB9LFxuICAgICAgICB2ZWN0b3I6IHtcbiAgICAgICAgICAgIHg6IG1vdmVDaGFpbi52ZWN0b3IueCxcbiAgICAgICAgICAgIHk6IG1vdmVDaGFpbi52ZWN0b3IueVxuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1NhbWVNb3ZlQ2hhaW4obW92ZUNoYWluMSwgbW92ZUNoYWluMikge1xuICAgIHJldHVybiBtb3ZlQ2hhaW4xLnV1aWQgPT09IG1vdmVDaGFpbjIudXVpZCAmJlxuICAgICAgICBtb3ZlQ2hhaW4xLmRpcmVjdGlvbi54ID09PSBtb3ZlQ2hhaW4yLmRpcmVjdGlvbi54ICYmXG4gICAgICAgIG1vdmVDaGFpbjEuZGlyZWN0aW9uLnkgPT09IG1vdmVDaGFpbjIuZGlyZWN0aW9uLnkgJiZcbiAgICAgICAgbW92ZUNoYWluMS52ZWN0b3IueCA9PT0gbW92ZUNoYWluMi52ZWN0b3IueCAmJlxuICAgICAgICBtb3ZlQ2hhaW4xLnZlY3Rvci55ID09PSBtb3ZlQ2hhaW4yLnZlY3Rvci55O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNpbmdlZFNxcnQodmFsdWUpIHtcbiAgICByZXR1cm4gTWF0aC5zaWduKHZhbHVlKSAqIE1hdGguc3FydChNYXRoLmFicyh2YWx1ZSkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNsYW1wUmF0aW8odmFsdWUpIHtcbiAgICByZXR1cm4gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgdmFsdWUpKTtcbn1cbiIsImNvbnN0IHJhbmRvbVVVSUQgPSB0eXBlb2YgY3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiBjcnlwdG8ucmFuZG9tVVVJRCAmJiBjcnlwdG8ucmFuZG9tVVVJRC5iaW5kKGNyeXB0byk7XG5leHBvcnQgZGVmYXVsdCB7IHJhbmRvbVVVSUQgfTtcbiIsImV4cG9ydCBkZWZhdWx0IC9eKD86WzAtOWEtZl17OH0tWzAtOWEtZl17NH0tWzEtOF1bMC05YS1mXXszfS1bODlhYl1bMC05YS1mXXszfS1bMC05YS1mXXsxMn18MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwfGZmZmZmZmZmLWZmZmYtZmZmZi1mZmZmLWZmZmZmZmZmZmZmZikkL2k7XG4iLCJsZXQgZ2V0UmFuZG9tVmFsdWVzO1xuY29uc3Qgcm5kczggPSBuZXcgVWludDhBcnJheSgxNik7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBybmcoKSB7XG4gICAgaWYgKCFnZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjcnlwdG8gPT09ICd1bmRlZmluZWQnIHx8ICFjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NyeXB0by5nZXRSYW5kb21WYWx1ZXMoKSBub3Qgc3VwcG9ydGVkLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkI2dldHJhbmRvbXZhbHVlcy1ub3Qtc3VwcG9ydGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0UmFuZG9tVmFsdWVzID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKGNyeXB0byk7XG4gICAgfVxuICAgIHJldHVybiBnZXRSYW5kb21WYWx1ZXMocm5kczgpO1xufVxuIiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuY29uc3QgYnl0ZVRvSGV4ID0gW107XG5mb3IgKGxldCBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gICAgYnl0ZVRvSGV4LnB1c2goKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnNsaWNlKDEpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB1bnNhZmVTdHJpbmdpZnkoYXJyLCBvZmZzZXQgPSAwKSB7XG4gICAgcmV0dXJuIChieXRlVG9IZXhbYXJyW29mZnNldCArIDBdXSArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMV1dICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAyXV0gK1xuICAgICAgICBieXRlVG9IZXhbYXJyW29mZnNldCArIDNdXSArXG4gICAgICAgICctJyArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNF1dICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA1XV0gK1xuICAgICAgICAnLScgK1xuICAgICAgICBieXRlVG9IZXhbYXJyW29mZnNldCArIDZdXSArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgN11dICtcbiAgICAgICAgJy0nICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA4XV0gK1xuICAgICAgICBieXRlVG9IZXhbYXJyW29mZnNldCArIDldXSArXG4gICAgICAgICctJyArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTBdXSArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTFdXSArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTJdXSArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTNdXSArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTRdXSArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTVdXSkudG9Mb3dlckNhc2UoKTtcbn1cbmZ1bmN0aW9uIHN0cmluZ2lmeShhcnIsIG9mZnNldCA9IDApIHtcbiAgICBjb25zdCB1dWlkID0gdW5zYWZlU3RyaW5naWZ5KGFyciwgb2Zmc2V0KTtcbiAgICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgICAgIHRocm93IFR5cGVFcnJvcignU3RyaW5naWZpZWQgVVVJRCBpcyBpbnZhbGlkJyk7XG4gICAgfVxuICAgIHJldHVybiB1dWlkO1xufVxuZXhwb3J0IGRlZmF1bHQgc3RyaW5naWZ5O1xuIiwiaW1wb3J0IG5hdGl2ZSBmcm9tICcuL25hdGl2ZS5qcyc7XG5pbXBvcnQgcm5nIGZyb20gJy4vcm5nLmpzJztcbmltcG9ydCB7IHVuc2FmZVN0cmluZ2lmeSB9IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcbmZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gICAgaWYgKG5hdGl2ZS5yYW5kb21VVUlEICYmICFidWYgJiYgIW9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIG5hdGl2ZS5yYW5kb21VVUlEKCk7XG4gICAgfVxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGNvbnN0IHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpO1xuICAgIHJuZHNbNl0gPSAocm5kc1s2XSAmIDB4MGYpIHwgMHg0MDtcbiAgICBybmRzWzhdID0gKHJuZHNbOF0gJiAweDNmKSB8IDB4ODA7XG4gICAgaWYgKGJ1Zikge1xuICAgICAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgKytpKSB7XG4gICAgICAgICAgICBidWZbb2Zmc2V0ICsgaV0gPSBybmRzW2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBidWY7XG4gICAgfVxuICAgIHJldHVybiB1bnNhZmVTdHJpbmdpZnkocm5kcyk7XG59XG5leHBvcnQgZGVmYXVsdCB2NDtcbiIsImltcG9ydCBSRUdFWCBmcm9tICcuL3JlZ2V4LmpzJztcbmZ1bmN0aW9uIHZhbGlkYXRlKHV1aWQpIHtcbiAgICByZXR1cm4gdHlwZW9mIHV1aWQgPT09ICdzdHJpbmcnICYmIFJFR0VYLnRlc3QodXVpZCk7XG59XG5leHBvcnQgZGVmYXVsdCB2YWxpZGF0ZTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyB2NCBhcyB1dWlkdjQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IHJvdW5kRmxvYXQgfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IHNldHVwQ29uZmlnIH0gZnJvbSAnLi9jb25maWcuanMnO1xuaW1wb3J0IHsgaW5pdENvbnRyb2xzIH0gZnJvbSAnLi9jb250cm9scy9jb250cm9scy5qcyc7XG5pbXBvcnQgQW5pbWF0aW9uRXhlY3V0b3IgZnJvbSAnLi9hbmltYXRpb24vZXhlY3V0b3IuanMnO1xuaW1wb3J0IEFuaW1hdGlvblN0b3JhZ2UgZnJvbSAnLi9hbmltYXRpb24vc3RvcmFnZS5qcyc7XG5pbXBvcnQgeyBnZW5lcmF0ZUNzc0R5bmFtaWMsIGdlbmVyYXRlQ3NzU3RhdGljIH0gZnJvbSAnLi9jc3MvY3NzLmpzJztcbmltcG9ydCB7IGNvb3Jkc1RvRGlyZWN0aW9ucywgbmV3TW92ZUNoYWluLCBjbG9uZU1vdmVDaGFpbiwgaXNTYW1lTW92ZUNoYWluIH0gZnJvbSAnLi91dGlscy5qcyc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdXJmYWNlIHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50Q29udGFpbmVyLCBlbGVtZW50TWFwLCBjb25maWcgPSB7fSkge1xuICAgICAgICB0aGlzLnV1aWQgPSB1dWlkdjQoKTtcbiAgICAgICAgdGhpcy52aWV3cG9ydCA9IHsgeDogMCwgeTogMCB9O1xuICAgICAgICB0aGlzLnggPSAwO1xuICAgICAgICB0aGlzLnkgPSAwO1xuICAgICAgICB0aGlzLnNrZXcgPSB7IHg6IDAsIHk6IDAgfTtcbiAgICAgICAgdGhpcy5tb3ZlQ2hhaW4gPSBuZXdNb3ZlQ2hhaW4oKTtcbiAgICAgICAgdGhpcy5DT05GSUcgPSBzZXR1cENvbmZpZyhjb25maWcpO1xuICAgICAgICB0aGlzLmVsZW1lbnRzID0gdGhpcy5zZXR1cEVsZW1lbnRzKGVsZW1lbnRDb250YWluZXIsIGVsZW1lbnRNYXApO1xuICAgICAgICB0aGlzLnN0eWxlcyA9IHRoaXMuc2V0dXBTdHlsZXMoKTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25TdG9yYWdlID0gbmV3IEFuaW1hdGlvblN0b3JhZ2UodGhpcyk7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRXhlY3V0b3IgPSBuZXcgQW5pbWF0aW9uRXhlY3V0b3IodGhpcywgdGhpcy5hbmltYXRpb25TdG9yYWdlKTtcbiAgICAgICAgaW5pdENvbnRyb2xzKHRoaXMpO1xuICAgICAgICB0aGlzLnVwZGF0ZVZpZXdwb3J0KCk7XG4gICAgICAgIG5ldyBSZXNpemVPYnNlcnZlcigoKSA9PiB7IHRoaXMudXBkYXRlQ3NzRHluYW1pYygpOyB0aGlzLnVwZGF0ZVZpZXdwb3J0KCk7IHRoaXMuZW5mb3JjZUxpbWl0cygpOyB9KS5vYnNlcnZlKHRoaXMuZWxlbWVudHMuY29udGFpbmVyKTtcbiAgICAgICAgbmV3IFJlc2l6ZU9ic2VydmVyKCgpID0+IHsgdGhpcy51cGRhdGVDc3NEeW5hbWljKCk7IHRoaXMuZW5mb3JjZUxpbWl0cygpOyB9KS5vYnNlcnZlKHRoaXMuZWxlbWVudHMuc3VyZmFjZSk7XG4gICAgICAgIHRoaXMuc2NhbGUgPSB0aGlzLkNPTkZJRy5TQ0FMRV9ERUZBVUxULlZBTFVFO1xuICAgICAgICB0aGlzLmluaXRTY2FsZSgpO1xuICAgIH1cbiAgICBzZXR1cEVsZW1lbnRzKGVsZW1lbnRDb250YWluZXIsIGVsZW1lbnRNYXApIHtcbiAgICAgICAgZWxlbWVudENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0aWx0ZWQtY29udGFpbmVyLScgKyB0aGlzLnV1aWQpO1xuICAgICAgICBsZXQgZWxlbWVudFZpZXdwb3J0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsZW1lbnRWaWV3cG9ydC5jbGFzc0xpc3QuYWRkKCd0aWx0ZWQtdmlld3BvcnQtJyArIHRoaXMudXVpZCk7XG4gICAgICAgIGxldCBlbGVtZW50U2NhbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWxlbWVudFNjYWxlLmNsYXNzTGlzdC5hZGQoJ3RpbHRlZC1zY2FsZS0nICsgdGhpcy51dWlkKTtcbiAgICAgICAgbGV0IGVsZW1lbnRQb3NpdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbGVtZW50UG9zaXRpb24uY2xhc3NMaXN0LmFkZCgndGlsdGVkLXBvc2l0aW9uLScgKyB0aGlzLnV1aWQpO1xuICAgICAgICBlbGVtZW50TWFwLmNsYXNzTGlzdC5hZGQoJ3RpbHRlZC1zdXJmYWNlLScgKyB0aGlzLnV1aWQpO1xuICAgICAgICBsZXQgZWxlbWVudENvbnRyb2xzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsZW1lbnRDb250cm9scy5jbGFzc0xpc3QuYWRkKCd0aWx0ZWQtY29udHJvbHMtJyArIHRoaXMudXVpZCk7XG4gICAgICAgIGxldCBlbGVtZW50Q29udHJvbHNab29tSW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWxlbWVudENvbnRyb2xzWm9vbUluLmNsYXNzTGlzdC5hZGQoJ3RpbHRlZC1jb250cm9scy16b29tLWluLScgKyB0aGlzLnV1aWQpO1xuICAgICAgICBsZXQgZWxlbWVudENvbnRyb2xzWm9vbU91dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbGVtZW50Q29udHJvbHNab29tT3V0LmNsYXNzTGlzdC5hZGQoJ3RpbHRlZC1jb250cm9scy16b29tLW91dC0nICsgdGhpcy51dWlkKTtcbiAgICAgICAgZWxlbWVudENvbnRyb2xzLmFwcGVuZENoaWxkKGVsZW1lbnRDb250cm9sc1pvb21Jbik7XG4gICAgICAgIGVsZW1lbnRDb250cm9scy5hcHBlbmRDaGlsZChlbGVtZW50Q29udHJvbHNab29tT3V0KTtcbiAgICAgICAgZWxlbWVudFBvc2l0aW9uLmFwcGVuZENoaWxkKGVsZW1lbnRNYXApO1xuICAgICAgICBlbGVtZW50U2NhbGUuYXBwZW5kQ2hpbGQoZWxlbWVudFBvc2l0aW9uKTtcbiAgICAgICAgZWxlbWVudFZpZXdwb3J0LmFwcGVuZENoaWxkKGVsZW1lbnRTY2FsZSk7XG4gICAgICAgIGVsZW1lbnRDb250YWluZXIuYXBwZW5kQ2hpbGQoZWxlbWVudFZpZXdwb3J0KTtcbiAgICAgICAgZWxlbWVudENvbnRhaW5lci5hcHBlbmRDaGlsZChlbGVtZW50Q29udHJvbHMpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29udGFpbmVyOiBlbGVtZW50Q29udGFpbmVyLFxuICAgICAgICAgICAgY29udHJvbHM6IGVsZW1lbnRDb250cm9scyxcbiAgICAgICAgICAgIGNvbnRyb2xzWm9vbUluOiBlbGVtZW50Q29udHJvbHNab29tSW4sXG4gICAgICAgICAgICBjb250cm9sc1pvb21PdXQ6IGVsZW1lbnRDb250cm9sc1pvb21PdXQsXG4gICAgICAgICAgICB2aWV3cG9ydDogZWxlbWVudFZpZXdwb3J0LFxuICAgICAgICAgICAgc2NhbGU6IGVsZW1lbnRTY2FsZSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBlbGVtZW50UG9zaXRpb24sXG4gICAgICAgICAgICBzdXJmYWNlOiBlbGVtZW50TWFwXG4gICAgICAgIH07XG4gICAgfVxuICAgIHNldHVwU3R5bGVzKCkge1xuICAgICAgICBsZXQgZWxlbWVudFN0eWxlU3RhdGljID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgZWxlbWVudFN0eWxlU3RhdGljLmNsYXNzTGlzdC5hZGQoJ3RpbHRlZC1jc3Mtc3RhdGljLScgKyB0aGlzLnV1aWQpO1xuICAgICAgICBlbGVtZW50U3R5bGVTdGF0aWMuaW5uZXJIVE1MID0gZ2VuZXJhdGVDc3NTdGF0aWModGhpcyk7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZWxlbWVudFN0eWxlU3RhdGljKTtcbiAgICAgICAgbGV0IGVsZW1lbnRTdHlsZUR5bmFtaWMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBlbGVtZW50U3R5bGVEeW5hbWljLmNsYXNzTGlzdC5hZGQoJ3RpbHRlZC1jc3MtZHluYW1pYy0nICsgdGhpcy51dWlkKTtcbiAgICAgICAgZWxlbWVudFN0eWxlRHluYW1pYy5pbm5lckhUTUwgPSBnZW5lcmF0ZUNzc0R5bmFtaWModGhpcyk7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZWxlbWVudFN0eWxlRHluYW1pYyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0aWM6IGVsZW1lbnRTdHlsZVN0YXRpYyxcbiAgICAgICAgICAgIGR5bmFtaWM6IGVsZW1lbnRTdHlsZUR5bmFtaWNcbiAgICAgICAgfTtcbiAgICB9XG4gICAgdXBkYXRlQ3NzRHluYW1pYygpIHtcbiAgICAgICAgdGhpcy5zdHlsZXMuZHluYW1pYy5pbm5lckhUTUwgPSBnZW5lcmF0ZUNzc0R5bmFtaWModGhpcyk7XG4gICAgfVxuICAgIGdldCBjb250YWluZXJXaWR0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudHMuY29udGFpbmVyLm9mZnNldFdpZHRoO1xuICAgIH1cbiAgICBnZXQgY29udGFpbmVySGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50cy5jb250YWluZXIub2Zmc2V0SGVpZ2h0O1xuICAgIH1cbiAgICBnZXQgc3VyZmFjZVdpZHRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50cy5zdXJmYWNlLm9mZnNldFdpZHRoO1xuICAgIH1cbiAgICBnZXQgc3VyZmFjZUhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudHMuc3VyZmFjZS5vZmZzZXRIZWlnaHQ7XG4gICAgfVxuICAgIGdldCBsaW1pdCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IE1hdGgucm91bmQodGhpcy5zdXJmYWNlV2lkdGggLyAyIC0gdGhpcy5jb250YWluZXJXaWR0aCAqIDAuMjUpLFxuICAgICAgICAgICAgeTogTWF0aC5yb3VuZCh0aGlzLnN1cmZhY2VIZWlnaHQgLyAyIC0gdGhpcy5jb250YWluZXJIZWlnaHQgKiAwLjI1KVxuICAgICAgICB9O1xuICAgIH1cbiAgICBnZXQgbWluKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogdGhpcy5saW1pdC54ICogLTEsXG4gICAgICAgICAgICB5OiB0aGlzLmxpbWl0LnkgKiAtMVxuICAgICAgICB9O1xuICAgIH1cbiAgICBnZXQgbWF4KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogdGhpcy5saW1pdC54LFxuICAgICAgICAgICAgeTogdGhpcy5saW1pdC55XG4gICAgICAgIH07XG4gICAgfVxuICAgIG1vdmUoeCwgeSwgaW50ZXJpbVJvdW5kaW5nID0gdGhpcy5DT05GSUcuQ09PUkRfUk9VTkRJTkdfSU5URVJJTS5WQUxVRSwgZmluYWxSb3VuZGluZyA9IHRoaXMuQ09ORklHLkNPT1JEX1JPVU5ESU5HX0ZJTkFMLlZBTFVFKSB7XG4gICAgICAgIGlmIChpbnRlcmltUm91bmRpbmcgPj0gMCkge1xuICAgICAgICAgICAgeCA9IHJvdW5kRmxvYXQoeCwgaW50ZXJpbVJvdW5kaW5nKTtcbiAgICAgICAgICAgIHkgPSByb3VuZEZsb2F0KHksIGludGVyaW1Sb3VuZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHggPT09IDAgJiYgeSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBvbGRQb3NpdGlvblggPSB0aGlzLng7XG4gICAgICAgIGxldCBvbGRQb3NpdGlvblkgPSB0aGlzLnk7XG4gICAgICAgIHRoaXMueCA9IHJvdW5kRmxvYXQodGhpcy54ICsgeCwgZmluYWxSb3VuZGluZyk7XG4gICAgICAgIHRoaXMueSA9IHJvdW5kRmxvYXQodGhpcy55ICsgeSwgZmluYWxSb3VuZGluZyk7XG4gICAgICAgIGlmICh0aGlzLnggPT09IG9sZFBvc2l0aW9uWCAmJiB0aGlzLnkgPT09IG9sZFBvc2l0aW9uWSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnggPCB0aGlzLm1pbi54KSB7XG4gICAgICAgICAgICB0aGlzLnggPSB0aGlzLm1pbi54O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMueCA+IHRoaXMubWF4LngpIHtcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMubWF4Lng7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMueSA8IHRoaXMubWluLnkpIHtcbiAgICAgICAgICAgIHRoaXMueSA9IHRoaXMubWluLnk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy55ID4gdGhpcy5tYXgueSkge1xuICAgICAgICAgICAgdGhpcy55ID0gdGhpcy5tYXgueTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy54ID09PSBvbGRQb3NpdGlvblggJiYgdGhpcy55ID09PSBvbGRQb3NpdGlvblkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZU1vdmVDaGFpbih4LCB5KTtcbiAgICAgICAgdGhpcy5lbGVtZW50cy5wb3NpdGlvbi5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlM2QoJyArICh0aGlzLnggKiAtMSkgKyAncHgsICcgKyAodGhpcy55ICogLTEpICsgJ3B4LCAwKSc7XG4gICAgICAgIHRoaXMubG9nKFtcbiAgICAgICAgICAgIHsgZGVzYzogJ3gnLCBmcm9tOiBvbGRQb3NpdGlvblgsIHRvOiB0aGlzLnggfSxcbiAgICAgICAgICAgIHsgZGVzYzogJ3knLCBmcm9tOiBvbGRQb3NpdGlvblksIHRvOiB0aGlzLnkgfVxuICAgICAgICBdKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIG1vdmVUbyh4LCB5LCBmaW5hbFJvdW5kaW5nID0gdGhpcy5DT05GSUcuQ09PUkRfUk9VTkRJTkdfRklOQUwuVkFMVUUpIHtcbiAgICAgICAgeCA9IHJvdW5kRmxvYXQoeCwgZmluYWxSb3VuZGluZyk7XG4gICAgICAgIHkgPSByb3VuZEZsb2F0KHksIGZpbmFsUm91bmRpbmcpO1xuICAgICAgICBpZiAodGhpcy54ID09PSB4ICYmIHRoaXMueSA9PT0geSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKCdNb3ZlIHRvOiB4ICcgKyB4ICsgJywgeSAnICsgeSk7XG4gICAgICAgIHJldHVybiB0aGlzLm1vdmUoeCAtIHRoaXMueCwgeSAtIHRoaXMueSwgLTEsIGZpbmFsUm91bmRpbmcpO1xuICAgIH1cbiAgICBnbGlkZSh4LCB5LCB0aW1lID0gdGhpcy5DT05GSUcuQU5JTUFUSU9OX0dMSURFX1RJTUUuVkFMVUUsIGVhc2luZ0Zvcm11bGEgPSBbMC4yNSwgMC4xLCAwLjI1LCAxXSwgaW50ZXJpbVJvdW5kaW5nID0gdGhpcy5DT05GSUcuQ09PUkRfUk9VTkRJTkdfSU5URVJJTS5WQUxVRSwgZmluYWxSb3VuZGluZyA9IHRoaXMuQ09ORklHLkNPT1JEX1JPVU5ESU5HX0ZJTkFMLlZBTFVFKSB7XG4gICAgICAgIGlmIChmaW5hbFJvdW5kaW5nID49IDApIHtcbiAgICAgICAgICAgIHggPSByb3VuZEZsb2F0KHRoaXMueCArIHgsIGZpbmFsUm91bmRpbmcpIC0gdGhpcy54O1xuICAgICAgICAgICAgeSA9IHJvdW5kRmxvYXQodGhpcy55ICsgeSwgZmluYWxSb3VuZGluZykgLSB0aGlzLnk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGludGVyaW1Sb3VuZGluZyA+PSAwKSB7XG4gICAgICAgICAgICB4ID0gcm91bmRGbG9hdCh4LCBpbnRlcmltUm91bmRpbmcpO1xuICAgICAgICAgICAgeSA9IHJvdW5kRmxvYXQoeSwgaW50ZXJpbVJvdW5kaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoeCA9PT0gMCAmJiB5ID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coJ0FuaW1hdGVkIG1vdmUgdG86IHggJyArIHggKyAnLCB5ICcgKyB5KTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25TdG9yYWdlLmNyZWF0ZVN1cmZhY2VHbGlkZSh4LCB5LCB0aW1lLCBlYXNpbmdGb3JtdWxhKTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25FeGVjdXRvci5pbml0aWF0ZSgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgdXBkYXRlVmlld3BvcnQoKSB7XG4gICAgICAgIHRoaXMudmlld3BvcnQgPSB7XG4gICAgICAgICAgICB4OiAwIC0gdGhpcy5zdXJmYWNlV2lkdGggLyAyICsgdGhpcy5jb250YWluZXJXaWR0aCAvIDIsXG4gICAgICAgICAgICB5OiAwIC0gdGhpcy5zdXJmYWNlSGVpZ2h0IC8gMiArIHRoaXMuY29udGFpbmVySGVpZ2h0IC8gMlxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmVsZW1lbnRzLnZpZXdwb3J0LnN0eWxlLnRvcCA9IHRoaXMudmlld3BvcnQueSArICdweCc7XG4gICAgICAgIHRoaXMuZWxlbWVudHMudmlld3BvcnQuc3R5bGUubGVmdCA9IHRoaXMudmlld3BvcnQueCArICdweCc7XG4gICAgfVxuICAgIHVwZGF0ZVNrZXcoKSB7XG4gICAgICAgIGxldCBwZXJjZW50T2ZNYXhTY2FsZSA9ICh0aGlzLnNjYWxlIC0gdGhpcy5DT05GSUcuU0NBTEVfTUlOLlZBTFVFKSAvICh0aGlzLkNPTkZJRy5TQ0FMRV9NQVguVkFMVUUgLSB0aGlzLkNPTkZJRy5TQ0FMRV9NSU4uVkFMVUUpO1xuICAgICAgICB0aGlzLnNrZXcgPSB7XG4gICAgICAgICAgICB4OiByb3VuZEZsb2F0KHBlcmNlbnRPZk1heFNjYWxlICogdGhpcy5DT05GSUcuU0tFV19YX01BWC5WQUxVRSwgMiksXG4gICAgICAgICAgICB5OiAwXG4gICAgICAgIH07XG4gICAgfVxuICAgIGluaXRTY2FsZSgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVTa2V3KCk7XG4gICAgICAgIHRoaXMuZWxlbWVudHMuc2NhbGUuY2xhc3NMaXN0LmFkZCgndGlsdGVkLW5vdHJhbnNpdGlvbi0nICsgdGhpcy51dWlkKTtcbiAgICAgICAgdGhpcy5lbGVtZW50cy5zY2FsZS5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoJyArIHRoaXMuc2NhbGUgKyAnKSBwZXJzcGVjdGl2ZSgnICsgdGhpcy5DT05GSUcuUEVSU1BFQ1RJVkVfRElTVEFOQ0UuVkFMVUUgKyAncHgpIHJvdGF0ZTNkKDEsIDAsIDAsICcgKyB0aGlzLnNrZXcueCArICdkZWcpJztcbiAgICAgICAgdGhpcy5lbGVtZW50cy5zY2FsZS5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIHRoaXMuZWxlbWVudHMuc2NhbGUuY2xhc3NMaXN0LnJlbW92ZSgndGlsdGVkLW5vdHJhbnNpdGlvbi0nICsgdGhpcy51dWlkKTtcbiAgICB9XG4gICAgY2hhbmdlU2NhbGUoY2hhbmdlKSB7XG4gICAgICAgIGlmIChjaGFuZ2UgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgb2xkU2NhbGUgPSB0aGlzLnNjYWxlO1xuICAgICAgICB0aGlzLnNjYWxlID0gcm91bmRGbG9hdCh0aGlzLnNjYWxlICsgY2hhbmdlLCB0aGlzLkNPTkZJRy5TQ0FMRV9ST1VORElORy5WQUxVRSk7XG4gICAgICAgIHRoaXMuc2NhbGUgPSBNYXRoLm1heCh0aGlzLnNjYWxlLCB0aGlzLkNPTkZJRy5TQ0FMRV9NSU4uVkFMVUUpO1xuICAgICAgICB0aGlzLnNjYWxlID0gTWF0aC5taW4odGhpcy5zY2FsZSwgdGhpcy5DT05GSUcuU0NBTEVfTUFYLlZBTFVFKTtcbiAgICAgICAgaWYgKG9sZFNjYWxlID09PSB0aGlzLnNjYWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVTa2V3KCk7XG4gICAgICAgIHRoaXMuZWxlbWVudHMuc2NhbGUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKCcgKyB0aGlzLnNjYWxlICsgJykgcGVyc3BlY3RpdmUoJyArIHRoaXMuQ09ORklHLlBFUlNQRUNUSVZFX0RJU1RBTkNFLlZBTFVFICsgJ3B4KSByb3RhdGUzZCgxLCAwLCAwLCAnICsgdGhpcy5za2V3LnggKyAnZGVnKSc7XG4gICAgICAgIHRoaXMubG9nKFtcbiAgICAgICAgICAgIHsgZGVzYzogJ3NjYWxlJywgZnJvbTogb2xkU2NhbGUsIHRvOiB0aGlzLnNjYWxlIH1cbiAgICAgICAgXSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBsb2coY2hhbmdlcyA9IGZhbHNlKSB7XG4gICAgICAgIGlmICh0aGlzLkNPTkZJRy5ERUJVR19NT0RFLlZBTFVFID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNoYW5nZXNTdHJpbmcgPSAnJztcbiAgICAgICAgaWYgKGNoYW5nZXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGNoYW5nZSBvZiBjaGFuZ2VzKSB7XG4gICAgICAgICAgICAgICAgY2hhbmdlc1N0cmluZyArPSBjaGFuZ2UuZGVzYyArIChjaGFuZ2UuZnJvbSAhPT0gdW5kZWZpbmVkID8gJyBmcm9tICcgKyBjaGFuZ2UuZnJvbSA6ICcnKSArIChjaGFuZ2UudG8gIT09IHVuZGVmaW5lZCA/ICcgdG8gJyArIGNoYW5nZS50byA6ICcnKSArICdcXG4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGNoYW5nZXNTdHJpbmcgK1xuICAgICAgICAgICAgYHg6ICR7dGhpcy54fVxcbmAgK1xuICAgICAgICAgICAgYHk6ICR7dGhpcy55fVxcbmAgK1xuICAgICAgICAgICAgYGxpbWl0Lng6ICR7dGhpcy5saW1pdC54fVxcbmAgK1xuICAgICAgICAgICAgYGxpbWl0Lnk6ICR7dGhpcy5saW1pdC55fVxcbmAgK1xuICAgICAgICAgICAgYHNjYWxlOiAke3RoaXMuc2NhbGV9YCk7XG4gICAgfVxuICAgIHVwZGF0ZU1vdmVDaGFpbih4LCB5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgICAgbGV0IGRpcmVjdGlvbiA9IGNvb3Jkc1RvRGlyZWN0aW9ucyh4LCB5KTtcbiAgICAgICAgLy8gaWYgKChkaXJlY3Rpb24ueCAhPT0gdGhpcy5tb3ZlQ2hhaW4uZGlyZWN0aW9uLnggJiYgZGlyZWN0aW9uLnggIT09IERpcmVjdGlvbi5Ob25lKVxuICAgICAgICAvLyAgICAgfHwgKGRpcmVjdGlvbi55ICE9PSB0aGlzLm1vdmVDaGFpbi5kaXJlY3Rpb24ueSAmJiBkaXJlY3Rpb24ueSAhPT0gRGlyZWN0aW9uLk5vbmUpKSB7XG4gICAgICAgIC8vICAgdGhpcy5tb3ZlQ2hhaW4gPSBuZXdNb3ZlQ2hhaW4oKTtcbiAgICAgICAgLy8gICB0aGlzLm1vdmVDaGFpbi5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgICAgIC8vIH1cbiAgICAgICAgdGhpcy5tb3ZlQ2hhaW4udmVjdG9yLnggKz0geDtcbiAgICAgICAgdGhpcy5tb3ZlQ2hhaW4udmVjdG9yLnkgKz0geTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5tb3ZlQ2hhaW4uZGlyZWN0aW9uLnggKyAnLCAnICsgdGhpcy5tb3ZlQ2hhaW4uZGlyZWN0aW9uLnkgKyAnLCAnICsgZGlyZWN0aW9uLnggKyAnLCAnICsgZGlyZWN0aW9uLnkgKyAnLCAnICsgdGhpcy5tb3ZlQ2hhaW4udmVjdG9yLnggKyAnLCAnICsgdGhpcy5tb3ZlQ2hhaW4udmVjdG9yLnkpO1xuICAgICAgICBsZXQgZmRhc2toZ3NmZCA9IGNsb25lTW92ZUNoYWluKHRoaXMubW92ZUNoYWluKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmVuZE1vdmVDaGFpbihmZGFza2hnc2ZkKSwgMjUpO1xuICAgIH1cbiAgICBlbmRNb3ZlQ2hhaW4obW92ZUNoYWluKSB7XG4gICAgICAgIGlmIChpc1NhbWVNb3ZlQ2hhaW4odGhpcy5tb3ZlQ2hhaW4sIG1vdmVDaGFpbikpIHtcbiAgICAgICAgICAgIHRoaXMuZ2xpZGUoTWF0aC5zcXJ0KE1hdGguYWJzKHRoaXMubW92ZUNoYWluLnZlY3Rvci54KSkgKiAxMDAsIE1hdGguc3FydCh0aGlzLm1vdmVDaGFpbi52ZWN0b3IueSkgKiAxMDApO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2VuZCBtb3ZlIGNoYWluOiAnICsgbW92ZUNoYWluLnZlY3Rvci54ICsgJywgJyArIG1vdmVDaGFpbi52ZWN0b3IueSArICcsICcgKyBtb3ZlQ2hhaW4udXVpZCArICcsICcgKyB0aGlzLm1vdmVDaGFpbi51dWlkKTtcbiAgICAgICAgICAgIHRoaXMubW92ZUNoYWluID0gbmV3TW92ZUNoYWluKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2FuY2VsT25nb2luZ01vdmVzKCkge1xuICAgICAgICB0aGlzLmFuaW1hdGlvblN0b3JhZ2UuZGVzdHJveVN1cmZhY2VHbGlkZSgpO1xuICAgIH1cbiAgICBlbmZvcmNlTGltaXRzKCkge1xuICAgICAgICBsZXQgeCA9IHRoaXMueDtcbiAgICAgICAgbGV0IHkgPSB0aGlzLnk7XG4gICAgICAgIGlmICh4IDwgdGhpcy5taW4ueCkge1xuICAgICAgICAgICAgeCA9IHRoaXMubWluLng7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHkgPCB0aGlzLm1pbi55KSB7XG4gICAgICAgICAgICB5ID0gdGhpcy5taW4ueTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoeCA+IHRoaXMubWF4LngpIHtcbiAgICAgICAgICAgIHggPSB0aGlzLm1heC54O1xuICAgICAgICB9XG4gICAgICAgIGlmICh5ID4gdGhpcy5tYXgueSkge1xuICAgICAgICAgICAgeSA9IHRoaXMubWF4Lnk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tb3ZlVG8oeCwgeSk7XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9