var Tilted;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/animation/animation.ts":
/*!************************************!*\
  !*** ./lib/animation/animation.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Animation)
/* harmony export */ });
class Animation {
    constructor(surface) {
        this.timestampStart = 0;
        this.timestampLast = 0;
        this.surface = surface;
    }
}


/***/ }),

/***/ "./lib/animation/edge.ts":
/*!*******************************!*\
  !*** ./lib/animation/edge.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AnimationSurfaceEdge: () => (/* binding */ AnimationSurfaceEdge)
/* harmony export */ });
/* harmony import */ var _animation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./animation.js */ "./lib/animation/animation.ts");

class AnimationSurfaceEdge extends _animation_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(surface, x, y) {
        super(surface);
        this.x = x;
        this.y = y;
        let timestampStart = Date.now();
        this.timestampStart = timestampStart;
        this.timestampLast = timestampStart;
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
        let timestampCurrent = Date.now();
        requestAnimationFrame(() => {
            this.executing =  false || this.stepSurfaceEdge(timestampCurrent);
            if (this.executing) {
                this.step();
            }
        });
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

/***/ "./lib/animation/storage.ts":
/*!**********************************!*\
  !*** ./lib/animation/storage.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AnimationStorage)
/* harmony export */ });
/* harmony import */ var _edge_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./edge.js */ "./lib/animation/edge.ts");

class AnimationStorage {
    constructor(surface) {
        this.surfaceEdge = null;
        this.surface = surface;
    }
    createSurfaceEdge(x, y) {
        this.surfaceEdge = new _edge_js__WEBPACK_IMPORTED_MODULE_0__.AnimationSurfaceEdge(this.surface, x, y);
    }
    destroySurfaceEdge() {
        this.surfaceEdge = null;
    }
    surfaceEdgeIsSet() {
        return this.surfaceEdge !== null;
    }
}


/***/ }),

/***/ "./lib/config.ts":
/*!***********************!*\
  !*** ./lib/config.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
        SCALE_ROUND: 3,
        PERSPECTIVE_DISTANCE: 1000,
        SKEW_X_MAX: 35,
        EDGE_MOVE_ENABLED: 0,
        EDGE_MOVE_AREA: 20,
        EDGE_MOVE_SPEED: 10,
        ANIMATION_SCALE_TIME: 500,
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
        SCALE_ROUND: {
            VALUE: config.SCALE_ROUND,
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
    };
    return CONFIG;
}


/***/ }),

/***/ "./lib/controls/controls.ts":
/*!**********************************!*\
  !*** ./lib/controls/controls.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initControls: () => (/* binding */ initControls)
/* harmony export */ });
/* harmony import */ var _mouse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mouse.js */ "./lib/controls/mouse.ts");
/* harmony import */ var _keyboard_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keyboard.js */ "./lib/controls/keyboard.ts");
/* harmony import */ var _scale_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scale.js */ "./lib/controls/scale.ts");



function initControls(surface) {
    surface.elements.container.addEventListener("mousemove", (e) => { (0,_mouse_js__WEBPACK_IMPORTED_MODULE_0__.mouseMove)(e, surface); });
    surface.elements.container.addEventListener("wheel", (e) => { (0,_mouse_js__WEBPACK_IMPORTED_MODULE_0__.mouseWheel)(e, surface); });
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

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dragSurface: () => (/* binding */ dragSurface)
/* harmony export */ });
/* harmony import */ var _controls_mouse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../controls/mouse.js */ "./lib/controls/mouse.ts");

function dragSurface(surface, mouse) {
    if (mouse.button !== 0) {
        return;
    }
    let x = mouse.x;
    let y = mouse.y;
    surface.isDragging = true;
    function moveSurfaceByDragging(event) {
        mouse = (0,_controls_mouse_js__WEBPACK_IMPORTED_MODULE_0__.getMouseParams)(event, surface);
        surface.move((x - mouse.x) / surface.scale, (y - mouse.y) / surface.scale);
        x = mouse.x;
        y = mouse.y;
    }
    surface.elements.container.addEventListener('mousemove', moveSurfaceByDragging);
    surface.elements.container.addEventListener('touchmove', moveSurfaceByDragging);
    function clearSurfaceDrag() {
        surface.elements.container.removeEventListener('mousemove', moveSurfaceByDragging);
        surface.elements.container.removeEventListener('touchmove', moveSurfaceByDragging);
        document.body.onmouseup = null;
        document.body.ontouchend = null;
        surface.isDragging = false;
    }
    document.body.onmouseup = clearSurfaceDrag;
    document.body.ontouchend = clearSurfaceDrag;
}
;


/***/ }),

/***/ "./lib/controls/edge.ts":
/*!******************************!*\
  !*** ./lib/controls/edge.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   moveSurfaceByEdge: () => (/* binding */ moveSurfaceByEdge)
/* harmony export */ });
var Direction;
(function (Direction) {
    Direction["Top"] = "top";
    Direction["Bottom"] = "bottom";
    Direction["Left"] = "left";
    Direction["Right"] = "right";
    Direction["None"] = "none";
})(Direction || (Direction = {}));
function moveSurfaceByEdge(surface, mouse) {
    if (surface.isDragging) {
        return false;
    }
    let direction = {
        x: Direction.None,
        y: Direction.None
    };
    if (mouse.y <= surface.CONFIG.EDGE_MOVE_AREA.VALUE) {
        if (mouse.x <= surface.CONFIG.EDGE_MOVE_AREA.VALUE) {
            direction.x = Direction.Left;
            direction.y = Direction.Top;
        }
        else if (mouse.x >= surface.containerWidth - surface.CONFIG.EDGE_MOVE_AREA.VALUE) {
            direction.x = Direction.Right;
            direction.y = Direction.Top;
        }
        else {
            direction.y = Direction.Top;
        }
    }
    else if (mouse.y >= surface.containerHeight - surface.CONFIG.EDGE_MOVE_AREA.VALUE) {
        if (mouse.x <= surface.CONFIG.EDGE_MOVE_AREA.VALUE) {
            direction.x = Direction.Left;
            direction.y = Direction.Bottom;
        }
        else if (mouse.x >= surface.containerWidth - surface.CONFIG.EDGE_MOVE_AREA.VALUE) {
            direction.x = Direction.Right;
            direction.y = Direction.Bottom;
        }
        else {
            direction.y = Direction.Bottom;
        }
    }
    else {
        if (mouse.x <= surface.CONFIG.EDGE_MOVE_AREA.VALUE) {
            direction.x = Direction.Left;
        }
        else if (mouse.x >= surface.containerWidth - surface.CONFIG.EDGE_MOVE_AREA.VALUE) {
            direction.x = Direction.Right;
        }
    }
    let x = 0;
    let y = 0;
    if (direction.y !== Direction.None || direction.x !== Direction.None) {
        if (direction.y === Direction.Top) {
            y = (surface.CONFIG.EDGE_MOVE_AREA.VALUE + 1 - mouse.y) / (surface.CONFIG.EDGE_MOVE_AREA.VALUE + 1) * -1;
        }
        else if (direction.y === Direction.Bottom) {
            y = (surface.CONFIG.EDGE_MOVE_AREA.VALUE + 1 - (surface.containerHeight - mouse.y)) / (surface.CONFIG.EDGE_MOVE_AREA.VALUE + 1);
        }
        if (direction.x === Direction.Left) {
            x = (surface.CONFIG.EDGE_MOVE_AREA.VALUE + 1 - mouse.x) / (surface.CONFIG.EDGE_MOVE_AREA.VALUE + 1) * -1;
        }
        else if (direction.x === Direction.Right) {
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
/* harmony import */ var _drag_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./drag.js */ "./lib/controls/drag.ts");



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
    (0,_drag_js__WEBPACK_IMPORTED_MODULE_2__.dragSurface)(surface, getMouseParams(event, surface));
}


/***/ }),

/***/ "./lib/controls/scale.ts":
/*!*******************************!*\
  !*** ./lib/controls/scale.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   scaleAndGlide: () => (/* binding */ scaleAndGlide)
/* harmony export */ });
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
        let moveX = Math.round((mouse.x - surface.containerWidth / 2) * 0.20 / surface.scale);
        let moveY = Math.round((mouse.y - surface.containerHeight / 2) * 0.20 / surface.scale);
        if (change < 0) {
            moveX = moveX * -1;
            moveY = moveY * -1;
        }
        surface.glide(moveX, moveY);
    }
}


/***/ }),

/***/ "./lib/css/css.ts":
/*!************************!*\
  !*** ./lib/css/css.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
    
    transition: transform var(--ANIMATION_SCALE_TIME) !important;
    will-change: transform, top, left;
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

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   roundFloat: () => (/* binding */ roundFloat)
/* harmony export */ });
function roundFloat(value, precision) {
    return parseFloat(value.toFixed(precision));
}


/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/native.js":
/*!******************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/native.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
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
        this.position = { x: 0, y: 0 };
        this.offset = { x: 0, y: 0 };
        this.skew = { x: 0, y: 0 };
        this.isDragging = false;
        this.CONFIG = (0,_config_js__WEBPACK_IMPORTED_MODULE_1__.setupConfig)(config);
        this.elements = this.setupElements(elementContainer, elementMap);
        this.styles = this.setupStyles();
        this.animationStorage = new _animation_storage_js__WEBPACK_IMPORTED_MODULE_4__["default"](this);
        this.animationExecutor = new _animation_executor_js__WEBPACK_IMPORTED_MODULE_3__["default"](this, this.animationStorage);
        (0,_controls_controls_js__WEBPACK_IMPORTED_MODULE_2__.initControls)(this);
        this.updateViewport();
        new ResizeObserver(() => { this.updateViewport(); this.updateCssDynamic(); }).observe(this.elements.container);
        new ResizeObserver(() => { this.updateCssDynamic(); }).observe(this.elements.surface);
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
    get x() {
        return this.position.x + this.offset.x;
    }
    get y() {
        return this.position.y + this.offset.y;
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
    move(x, y, round = 0, endRound = 0) {
        x = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(x, round);
        y = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(y, round);
        if (x === 0 && y === 0) {
            return false;
        }
        let oldPositionX = this.position.x;
        let oldPositionY = this.position.y;
        this.position.x = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(this.position.x + x, endRound);
        this.position.y = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(this.position.y + y, endRound);
        if (this.position.x === oldPositionX && this.position.y === oldPositionY) {
            return false;
        }
        if (this.x < this.min.x) {
            this.position.x = this.min.x - this.offset.x;
        }
        else if (this.x > this.max.x) {
            this.position.x = this.max.x - this.offset.x;
        }
        if (this.y < this.min.y) {
            this.position.y = this.min.y - this.offset.y;
        }
        else if (this.y > this.max.y) {
            this.position.y = this.max.y - this.offset.y;
        }
        if (this.position.x === oldPositionX && this.position.y === oldPositionY) {
            return false;
        }
        this.elements.position.style.top = (this.position.y * -1) + 'px';
        this.elements.position.style.left = (this.position.x * -1) + 'px';
        this.log([
            { desc: 'position.x', from: oldPositionX, to: this.position.x },
            { desc: 'position.y', from: oldPositionY, to: this.position.y }
        ]);
        return true;
    }
    moveTo(x, y, endRound = 0) {
        x = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(x, endRound);
        y = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(y, endRound);
        if (this.position.x === x && this.position.y === y) {
            return false;
        }
        return this.move(x - this.position.x, y - this.position.y, 0, endRound);
    }
    glide(x, y, round = 0, endRound = 0) {
        x = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(x, round);
        y = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(y, round);
        if (x === 0 && y === 0) {
            return false;
        }
        let oldOffsetX = this.offset.x;
        let oldOffsetY = this.offset.y;
        this.offset.x = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(this.offset.x + x, endRound);
        this.offset.y = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(this.offset.y + y, endRound);
        if (this.offset.x === oldOffsetX && this.offset.y === oldOffsetY) {
            return false;
        }
        if (this.x < this.min.x) {
            this.offset.x = this.min.x - this.position.x;
        }
        else if (this.x > this.max.x) {
            this.offset.x = this.max.x - this.position.x;
        }
        if (this.y < this.min.y) {
            this.offset.y = this.min.y - this.position.y;
        }
        else if (this.y > this.max.y) {
            this.offset.y = this.max.y - this.position.y;
        }
        if (this.offset.x === oldOffsetX && this.offset.y === oldOffsetY) {
            return false;
        }
        this.elements.position.style.transform = 'translate3d(' + (this.offset.x * -1) + 'px, ' + (this.offset.y * -1) + 'px, 0)';
        this.log([
            { desc: 'offset.x', from: oldOffsetX, to: this.offset.x },
            { desc: 'offset.y', from: oldOffsetY, to: this.offset.y }
        ]);
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
        this.scale = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.roundFloat)(this.scale + change, this.CONFIG.SCALE_ROUND.VALUE);
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
            `position X: ${this.position.x}\n` +
            `position Y: ${this.position.y}\n` +
            `offset X: ${this.offset.x}\n` +
            `offset Y: ${this.offset.y}\n` +
            `limit.x: ${this.limit.x}\n` +
            `limit.y: ${this.limit.y}\n` +
            `scale: ${this.scale}`);
    }
}

})();

Tilted = __webpack_exports__["default"];
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QVkscURBQVU7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixxREFBVTtBQUNsQyx3QkFBd0IscURBQVU7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsdURBQXVEO0FBQ3JFLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxREFBVTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIscURBQVU7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGdCQUFnQjtBQUMzQywyQkFBMkIsZ0JBQWdCO0FBQzNDLHlCQUF5QixjQUFjO0FBQ3ZDLHlCQUF5QixjQUFjO0FBQ3ZDLHdCQUF3QixhQUFhO0FBQ3JDLHdCQUF3QixhQUFhO0FBQ3JDLHNCQUFzQixXQUFXO0FBQ2pDO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9UaWx0ZWQvLi9saWIvYW5pbWF0aW9uL2FuaW1hdGlvbi50cyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9saWIvYW5pbWF0aW9uL2VkZ2UudHMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbGliL2FuaW1hdGlvbi9leGVjdXRvci50cyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9saWIvYW5pbWF0aW9uL3N0b3JhZ2UudHMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbGliL2NvbmZpZy50cyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9saWIvY29udHJvbHMvY29udHJvbHMudHMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbGliL2NvbnRyb2xzL2RyYWcudHMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbGliL2NvbnRyb2xzL2VkZ2UudHMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbGliL2NvbnRyb2xzL2tleWJvYXJkLnRzIiwid2VicGFjazovL1RpbHRlZC8uL2xpYi9jb250cm9scy9tb3VzZS50cyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9saWIvY29udHJvbHMvc2NhbGUudHMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbGliL2Nzcy9jc3MudHMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbGliL3V0aWxzLnRzIiwid2VicGFjazovL1RpbHRlZC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvbmF0aXZlLmpzIiwid2VicGFjazovL1RpbHRlZC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvcmVnZXguanMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9ybmcuanMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9zdHJpbmdpZnkuanMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92NC5qcyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3ZhbGlkYXRlLmpzIiwid2VicGFjazovL1RpbHRlZC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9UaWx0ZWQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1RpbHRlZC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1RpbHRlZC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1RpbHRlZC8uL2xpYi9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBBbmltYXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKHN1cmZhY2UpIHtcbiAgICAgICAgdGhpcy50aW1lc3RhbXBTdGFydCA9IDA7XG4gICAgICAgIHRoaXMudGltZXN0YW1wTGFzdCA9IDA7XG4gICAgICAgIHRoaXMuc3VyZmFjZSA9IHN1cmZhY2U7XG4gICAgfVxufVxuIiwiaW1wb3J0IEFuaW1hdGlvbiBmcm9tICcuL2FuaW1hdGlvbi5qcyc7XG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uU3VyZmFjZUVkZ2UgZXh0ZW5kcyBBbmltYXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKHN1cmZhY2UsIHgsIHkpIHtcbiAgICAgICAgc3VwZXIoc3VyZmFjZSk7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgIGxldCB0aW1lc3RhbXBTdGFydCA9IERhdGUubm93KCk7XG4gICAgICAgIHRoaXMudGltZXN0YW1wU3RhcnQgPSB0aW1lc3RhbXBTdGFydDtcbiAgICAgICAgdGhpcy50aW1lc3RhbXBMYXN0ID0gdGltZXN0YW1wU3RhcnQ7XG4gICAgfVxuICAgIHVwZGF0ZSh4LCB5KSB7XG4gICAgICAgIGlmICh0aGlzLnggIT09IHgpIHtcbiAgICAgICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMueSAhPT0geSkge1xuICAgICAgICAgICAgdGhpcy55ID0geTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGVwKHRpbWVzdGFtcEN1cnJlbnQpIHtcbiAgICAgICAgbGV0IHRpbWVGYWN0b3IgPSBNYXRoLm1heCgxLCAodGltZXN0YW1wQ3VycmVudCAtIHRoaXMudGltZXN0YW1wTGFzdCkpIC8gMTA7XG4gICAgICAgIGxldCB4ID0gdGhpcy5zdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfU1BFRUQuVkFMVUUgKiB0aGlzLnggLyB0aGlzLnN1cmZhY2Uuc2NhbGUgKiB0aW1lRmFjdG9yO1xuICAgICAgICBsZXQgeSA9IHRoaXMuc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX1NQRUVELlZBTFVFICogdGhpcy55IC8gdGhpcy5zdXJmYWNlLnNjYWxlICogdGltZUZhY3RvcjtcbiAgICAgICAgdGhpcy50aW1lc3RhbXBMYXN0ID0gdGltZXN0YW1wQ3VycmVudDtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3VyZmFjZS5tb3ZlKHgsIHkpO1xuICAgIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuaW1hdGlvbkV4ZWN1dG9yIHtcbiAgICBjb25zdHJ1Y3RvcihzdXJmYWNlLCBhbmltYXRpb25TdG9yYWdlKSB7XG4gICAgICAgIHRoaXMuZXhlY3V0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3VyZmFjZSA9IHN1cmZhY2U7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uU3RvcmFnZSA9IGFuaW1hdGlvblN0b3JhZ2U7XG4gICAgfVxuICAgIGluaXRpYXRlKCkge1xuICAgICAgICBpZiAoIXRoaXMuZXhlY3V0aW5nKSB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnN0ZXAoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGVwKCkge1xuICAgICAgICBsZXQgdGltZXN0YW1wQ3VycmVudCA9IERhdGUubm93KCk7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGluZyA9IGZhbHNlIHx8IHRoaXMuc3RlcFN1cmZhY2VFZGdlKHRpbWVzdGFtcEN1cnJlbnQpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZXhlY3V0aW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGVwKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzdGVwU3VyZmFjZUVkZ2UodGltZXN0YW1wQ3VycmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuYW5pbWF0aW9uU3RvcmFnZS5zdXJmYWNlRWRnZUlzU2V0KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc2hvdWxkQ29udGludWUgPSB0aGlzLmFuaW1hdGlvblN0b3JhZ2Uuc3VyZmFjZUVkZ2Uuc3RlcCh0aW1lc3RhbXBDdXJyZW50KTtcbiAgICAgICAgaWYgKCFzaG91bGRDb250aW51ZSkge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25TdG9yYWdlLmRlc3Ryb3lTdXJmYWNlRWRnZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaG91bGRDb250aW51ZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBbmltYXRpb25TdXJmYWNlRWRnZSB9IGZyb20gJy4vZWRnZS5qcyc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmltYXRpb25TdG9yYWdlIHtcbiAgICBjb25zdHJ1Y3RvcihzdXJmYWNlKSB7XG4gICAgICAgIHRoaXMuc3VyZmFjZUVkZ2UgPSBudWxsO1xuICAgICAgICB0aGlzLnN1cmZhY2UgPSBzdXJmYWNlO1xuICAgIH1cbiAgICBjcmVhdGVTdXJmYWNlRWRnZSh4LCB5KSB7XG4gICAgICAgIHRoaXMuc3VyZmFjZUVkZ2UgPSBuZXcgQW5pbWF0aW9uU3VyZmFjZUVkZ2UodGhpcy5zdXJmYWNlLCB4LCB5KTtcbiAgICB9XG4gICAgZGVzdHJveVN1cmZhY2VFZGdlKCkge1xuICAgICAgICB0aGlzLnN1cmZhY2VFZGdlID0gbnVsbDtcbiAgICB9XG4gICAgc3VyZmFjZUVkZ2VJc1NldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3VyZmFjZUVkZ2UgIT09IG51bGw7XG4gICAgfVxufVxuIiwidmFyIENvbmZpZ1Byb3BlcnR5VHlwZTtcbihmdW5jdGlvbiAoQ29uZmlnUHJvcGVydHlUeXBlKSB7XG4gICAgQ29uZmlnUHJvcGVydHlUeXBlW1wiQW5nbGVcIl0gPSBcImFuZ2xlXCI7XG4gICAgQ29uZmlnUHJvcGVydHlUeXBlW1wiQ29sb3JcIl0gPSBcImNvbG9yXCI7XG4gICAgQ29uZmlnUHJvcGVydHlUeXBlW1wiSW50ZWdlclwiXSA9IFwiaW50ZWdlclwiO1xuICAgIENvbmZpZ1Byb3BlcnR5VHlwZVtcIk51bWJlclwiXSA9IFwibnVtYmVyXCI7XG4gICAgQ29uZmlnUHJvcGVydHlUeXBlW1wiTGVuZ3RoXCJdID0gXCJsZW5ndGhcIjtcbiAgICBDb25maWdQcm9wZXJ0eVR5cGVbXCJUaW1lXCJdID0gXCJ0aW1lXCI7XG59KShDb25maWdQcm9wZXJ0eVR5cGUgfHwgKENvbmZpZ1Byb3BlcnR5VHlwZSA9IHt9KSk7XG5leHBvcnQgZnVuY3Rpb24gc2V0dXBDb25maWcoY29uZmlnQ3VzdG9tKSB7XG4gICAgbGV0IGNvbmZpZyA9IHtcbiAgICAgICAgREVCVUdfTU9ERTogMCxcbiAgICAgICAgU0NBTEVfU1RFUDogMC4yMCwgLy8gUGVyY2VudCBvZiAxLzIgdG90YWwgc2NhbGUsIGUuZy4gMC4yMCBtZWFucyA1IHN0ZXBzIGZyb20gMC4yNSB0byAwLjUwIGFuZCA1IHN0ZXBzIGZyb20gMC41MCB0byAxXG4gICAgICAgIFNDQUxFX01JTjogMC4yNSxcbiAgICAgICAgU0NBTEVfREVGQVVMVDogMC41MCxcbiAgICAgICAgU0NBTEVfTUFYOiAxLjAwLFxuICAgICAgICBTQ0FMRV9ST1VORDogMyxcbiAgICAgICAgUEVSU1BFQ1RJVkVfRElTVEFOQ0U6IDEwMDAsXG4gICAgICAgIFNLRVdfWF9NQVg6IDM1LFxuICAgICAgICBFREdFX01PVkVfRU5BQkxFRDogMCxcbiAgICAgICAgRURHRV9NT1ZFX0FSRUE6IDIwLFxuICAgICAgICBFREdFX01PVkVfU1BFRUQ6IDEwLFxuICAgICAgICBBTklNQVRJT05fU0NBTEVfVElNRTogNTAwLFxuICAgIH07XG4gICAgZm9yIChjb25zdCBwYXJhbWV0ZXIgaW4gY29uZmlnQ3VzdG9tKSB7XG4gICAgICAgIGlmIChjb25maWcuaGFzT3duUHJvcGVydHkocGFyYW1ldGVyKSkge1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gY29uZmlnQ3VzdG9tW3BhcmFtZXRlcl07XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25maWdbcGFyYW1ldGVyXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IENPTkZJRyA9IHtcbiAgICAgICAgREVCVUdfTU9ERToge1xuICAgICAgICAgICAgVkFMVUU6IGNvbmZpZy5ERUJVR19NT0RFLFxuICAgICAgICAgICAgVFlQRTogQ29uZmlnUHJvcGVydHlUeXBlLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgU0NBTEVfU1RFUDoge1xuICAgICAgICAgICAgVkFMVUU6IGNvbmZpZy5TQ0FMRV9TVEVQLFxuICAgICAgICAgICAgVFlQRTogQ29uZmlnUHJvcGVydHlUeXBlLk51bWJlclxuICAgICAgICB9LFxuICAgICAgICBTQ0FMRV9NSU46IHtcbiAgICAgICAgICAgIFZBTFVFOiBjb25maWcuU0NBTEVfTUlOLFxuICAgICAgICAgICAgVFlQRTogQ29uZmlnUHJvcGVydHlUeXBlLk51bWJlclxuICAgICAgICB9LFxuICAgICAgICBTQ0FMRV9ERUZBVUxUOiB7XG4gICAgICAgICAgICBWQUxVRTogY29uZmlnLlNDQUxFX0RFRkFVTFQsXG4gICAgICAgICAgICBUWVBFOiBDb25maWdQcm9wZXJ0eVR5cGUuTnVtYmVyXG4gICAgICAgIH0sXG4gICAgICAgIFNDQUxFX01BWDoge1xuICAgICAgICAgICAgVkFMVUU6IGNvbmZpZy5TQ0FMRV9NQVgsXG4gICAgICAgICAgICBUWVBFOiBDb25maWdQcm9wZXJ0eVR5cGUuTnVtYmVyXG4gICAgICAgIH0sXG4gICAgICAgIFNDQUxFX1JPVU5EOiB7XG4gICAgICAgICAgICBWQUxVRTogY29uZmlnLlNDQUxFX1JPVU5ELFxuICAgICAgICAgICAgVFlQRTogQ29uZmlnUHJvcGVydHlUeXBlLk51bWJlclxuICAgICAgICB9LFxuICAgICAgICBQRVJTUEVDVElWRV9ESVNUQU5DRToge1xuICAgICAgICAgICAgVkFMVUU6IE1hdGgucm91bmQoY29uZmlnLlBFUlNQRUNUSVZFX0RJU1RBTkNFKSxcbiAgICAgICAgICAgIFRZUEU6IENvbmZpZ1Byb3BlcnR5VHlwZS5MZW5ndGhcbiAgICAgICAgfSxcbiAgICAgICAgU0tFV19YX01BWDoge1xuICAgICAgICAgICAgVkFMVUU6IE1hdGgucm91bmQoY29uZmlnLlNLRVdfWF9NQVgpLFxuICAgICAgICAgICAgVFlQRTogQ29uZmlnUHJvcGVydHlUeXBlLkFuZ2xlXG4gICAgICAgIH0sXG4gICAgICAgIEVER0VfTU9WRV9FTkFCTEVEOiB7XG4gICAgICAgICAgICBWQUxVRTogY29uZmlnLkVER0VfTU9WRV9FTkFCTEVELFxuICAgICAgICAgICAgVFlQRTogQ29uZmlnUHJvcGVydHlUeXBlLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgRURHRV9NT1ZFX0FSRUE6IHtcbiAgICAgICAgICAgIFZBTFVFOiBNYXRoLnJvdW5kKGNvbmZpZy5FREdFX01PVkVfQVJFQSksXG4gICAgICAgICAgICBUWVBFOiBDb25maWdQcm9wZXJ0eVR5cGUuTGVuZ3RoXG4gICAgICAgIH0sXG4gICAgICAgIEVER0VfTU9WRV9TUEVFRDoge1xuICAgICAgICAgICAgVkFMVUU6IE1hdGgucm91bmQoY29uZmlnLkVER0VfTU9WRV9TUEVFRCksXG4gICAgICAgICAgICBUWVBFOiBDb25maWdQcm9wZXJ0eVR5cGUuTGVuZ3RoXG4gICAgICAgIH0sXG4gICAgICAgIEFOSU1BVElPTl9TQ0FMRV9USU1FOiB7XG4gICAgICAgICAgICBWQUxVRTogTWF0aC5yb3VuZChjb25maWcuQU5JTUFUSU9OX1NDQUxFX1RJTUUpLFxuICAgICAgICAgICAgVFlQRTogQ29uZmlnUHJvcGVydHlUeXBlLlRpbWVcbiAgICAgICAgfSxcbiAgICB9O1xuICAgIHJldHVybiBDT05GSUc7XG59XG4iLCJpbXBvcnQgeyBtb3VzZU1vdmUsIG1vdXNlV2hlZWwsIG1vdXNlRG93biB9IGZyb20gJy4vbW91c2UuanMnO1xuaW1wb3J0IHsgYnV0dG9uUHJlc3NlZCB9IGZyb20gJy4va2V5Ym9hcmQuanMnO1xuaW1wb3J0IHsgc2NhbGVBbmRHbGlkZSB9IGZyb20gJy4vc2NhbGUuanMnO1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRDb250cm9scyhzdXJmYWNlKSB7XG4gICAgc3VyZmFjZS5lbGVtZW50cy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZSkgPT4geyBtb3VzZU1vdmUoZSwgc3VyZmFjZSk7IH0pO1xuICAgIHN1cmZhY2UuZWxlbWVudHMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ3aGVlbFwiLCAoZSkgPT4geyBtb3VzZVdoZWVsKGUsIHN1cmZhY2UpOyB9KTtcbiAgICBzdXJmYWNlLmVsZW1lbnRzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlKSA9PiB7IG1vdXNlRG93bihlLCBzdXJmYWNlKTsgfSk7XG4gICAgc3VyZmFjZS5lbGVtZW50cy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgKGUpID0+IHsgbW91c2VEb3duKGUsIHN1cmZhY2UpOyB9KTtcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7IGJ1dHRvblByZXNzZWQoZSwgc3VyZmFjZSk7IH0pO1xuICAgIHN1cmZhY2UuZWxlbWVudHMuY29udHJvbHNab29tSW4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHsgc2NhbGVBbmRHbGlkZShzdXJmYWNlLCAxKTsgfSk7XG4gICAgc3VyZmFjZS5lbGVtZW50cy5jb250cm9sc1pvb21PdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHsgc2NhbGVBbmRHbGlkZShzdXJmYWNlLCAtMSk7IH0pO1xuICAgIHN1cmZhY2UuZWxlbWVudHMuY29udGFpbmVyLm9uZHJhZ3N0YXJ0ID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IGdldE1vdXNlUGFyYW1zIH0gZnJvbSAnLi4vY29udHJvbHMvbW91c2UuanMnO1xuZXhwb3J0IGZ1bmN0aW9uIGRyYWdTdXJmYWNlKHN1cmZhY2UsIG1vdXNlKSB7XG4gICAgaWYgKG1vdXNlLmJ1dHRvbiAhPT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCB4ID0gbW91c2UueDtcbiAgICBsZXQgeSA9IG1vdXNlLnk7XG4gICAgc3VyZmFjZS5pc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICBmdW5jdGlvbiBtb3ZlU3VyZmFjZUJ5RHJhZ2dpbmcoZXZlbnQpIHtcbiAgICAgICAgbW91c2UgPSBnZXRNb3VzZVBhcmFtcyhldmVudCwgc3VyZmFjZSk7XG4gICAgICAgIHN1cmZhY2UubW92ZSgoeCAtIG1vdXNlLngpIC8gc3VyZmFjZS5zY2FsZSwgKHkgLSBtb3VzZS55KSAvIHN1cmZhY2Uuc2NhbGUpO1xuICAgICAgICB4ID0gbW91c2UueDtcbiAgICAgICAgeSA9IG1vdXNlLnk7XG4gICAgfVxuICAgIHN1cmZhY2UuZWxlbWVudHMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdmVTdXJmYWNlQnlEcmFnZ2luZyk7XG4gICAgc3VyZmFjZS5lbGVtZW50cy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgbW92ZVN1cmZhY2VCeURyYWdnaW5nKTtcbiAgICBmdW5jdGlvbiBjbGVhclN1cmZhY2VEcmFnKCkge1xuICAgICAgICBzdXJmYWNlLmVsZW1lbnRzLmNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlU3VyZmFjZUJ5RHJhZ2dpbmcpO1xuICAgICAgICBzdXJmYWNlLmVsZW1lbnRzLmNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBtb3ZlU3VyZmFjZUJ5RHJhZ2dpbmcpO1xuICAgICAgICBkb2N1bWVudC5ib2R5Lm9ubW91c2V1cCA9IG51bGw7XG4gICAgICAgIGRvY3VtZW50LmJvZHkub250b3VjaGVuZCA9IG51bGw7XG4gICAgICAgIHN1cmZhY2UuaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgIH1cbiAgICBkb2N1bWVudC5ib2R5Lm9ubW91c2V1cCA9IGNsZWFyU3VyZmFjZURyYWc7XG4gICAgZG9jdW1lbnQuYm9keS5vbnRvdWNoZW5kID0gY2xlYXJTdXJmYWNlRHJhZztcbn1cbjtcbiIsInZhciBEaXJlY3Rpb247XG4oZnVuY3Rpb24gKERpcmVjdGlvbikge1xuICAgIERpcmVjdGlvbltcIlRvcFwiXSA9IFwidG9wXCI7XG4gICAgRGlyZWN0aW9uW1wiQm90dG9tXCJdID0gXCJib3R0b21cIjtcbiAgICBEaXJlY3Rpb25bXCJMZWZ0XCJdID0gXCJsZWZ0XCI7XG4gICAgRGlyZWN0aW9uW1wiUmlnaHRcIl0gPSBcInJpZ2h0XCI7XG4gICAgRGlyZWN0aW9uW1wiTm9uZVwiXSA9IFwibm9uZVwiO1xufSkoRGlyZWN0aW9uIHx8IChEaXJlY3Rpb24gPSB7fSkpO1xuZXhwb3J0IGZ1bmN0aW9uIG1vdmVTdXJmYWNlQnlFZGdlKHN1cmZhY2UsIG1vdXNlKSB7XG4gICAgaWYgKHN1cmZhY2UuaXNEcmFnZ2luZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGxldCBkaXJlY3Rpb24gPSB7XG4gICAgICAgIHg6IERpcmVjdGlvbi5Ob25lLFxuICAgICAgICB5OiBEaXJlY3Rpb24uTm9uZVxuICAgIH07XG4gICAgaWYgKG1vdXNlLnkgPD0gc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX0FSRUEuVkFMVUUpIHtcbiAgICAgICAgaWYgKG1vdXNlLnggPD0gc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX0FSRUEuVkFMVUUpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbi54ID0gRGlyZWN0aW9uLkxlZnQ7XG4gICAgICAgICAgICBkaXJlY3Rpb24ueSA9IERpcmVjdGlvbi5Ub3A7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobW91c2UueCA+PSBzdXJmYWNlLmNvbnRhaW5lcldpZHRoIC0gc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX0FSRUEuVkFMVUUpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbi54ID0gRGlyZWN0aW9uLlJpZ2h0O1xuICAgICAgICAgICAgZGlyZWN0aW9uLnkgPSBEaXJlY3Rpb24uVG9wO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGlyZWN0aW9uLnkgPSBEaXJlY3Rpb24uVG9wO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKG1vdXNlLnkgPj0gc3VyZmFjZS5jb250YWluZXJIZWlnaHQgLSBzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSkge1xuICAgICAgICBpZiAobW91c2UueCA8PSBzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSkge1xuICAgICAgICAgICAgZGlyZWN0aW9uLnggPSBEaXJlY3Rpb24uTGVmdDtcbiAgICAgICAgICAgIGRpcmVjdGlvbi55ID0gRGlyZWN0aW9uLkJvdHRvbTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChtb3VzZS54ID49IHN1cmZhY2UuY29udGFpbmVyV2lkdGggLSBzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSkge1xuICAgICAgICAgICAgZGlyZWN0aW9uLnggPSBEaXJlY3Rpb24uUmlnaHQ7XG4gICAgICAgICAgICBkaXJlY3Rpb24ueSA9IERpcmVjdGlvbi5Cb3R0b207XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkaXJlY3Rpb24ueSA9IERpcmVjdGlvbi5Cb3R0b207XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChtb3VzZS54IDw9IHN1cmZhY2UuQ09ORklHLkVER0VfTU9WRV9BUkVBLlZBTFVFKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb24ueCA9IERpcmVjdGlvbi5MZWZ0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG1vdXNlLnggPj0gc3VyZmFjZS5jb250YWluZXJXaWR0aCAtIHN1cmZhY2UuQ09ORklHLkVER0VfTU9WRV9BUkVBLlZBTFVFKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb24ueCA9IERpcmVjdGlvbi5SaWdodDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgeCA9IDA7XG4gICAgbGV0IHkgPSAwO1xuICAgIGlmIChkaXJlY3Rpb24ueSAhPT0gRGlyZWN0aW9uLk5vbmUgfHwgZGlyZWN0aW9uLnggIT09IERpcmVjdGlvbi5Ob25lKSB7XG4gICAgICAgIGlmIChkaXJlY3Rpb24ueSA9PT0gRGlyZWN0aW9uLlRvcCkge1xuICAgICAgICAgICAgeSA9IChzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSArIDEgLSBtb3VzZS55KSAvIChzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSArIDEpICogLTE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGlyZWN0aW9uLnkgPT09IERpcmVjdGlvbi5Cb3R0b20pIHtcbiAgICAgICAgICAgIHkgPSAoc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX0FSRUEuVkFMVUUgKyAxIC0gKHN1cmZhY2UuY29udGFpbmVySGVpZ2h0IC0gbW91c2UueSkpIC8gKHN1cmZhY2UuQ09ORklHLkVER0VfTU9WRV9BUkVBLlZBTFVFICsgMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpcmVjdGlvbi54ID09PSBEaXJlY3Rpb24uTGVmdCkge1xuICAgICAgICAgICAgeCA9IChzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSArIDEgLSBtb3VzZS54KSAvIChzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSArIDEpICogLTE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGlyZWN0aW9uLnggPT09IERpcmVjdGlvbi5SaWdodCkge1xuICAgICAgICAgICAgeCA9IChzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSArIDEgLSAoc3VyZmFjZS5jb250YWluZXJXaWR0aCAtIG1vdXNlLngpKSAvIChzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSArIDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxldCB4TW92ZUlzWmVybyA9IGZhbHNlO1xuICAgIGlmICh4ID09PSAwIHx8ICh4ID4gMCAmJiBzdXJmYWNlLnggPj0gc3VyZmFjZS5tYXgueCkgfHwgKHggPCAwICYmIHN1cmZhY2UueCA8PSBzdXJmYWNlLm1pbi54KSkge1xuICAgICAgICB4TW92ZUlzWmVybyA9IHRydWU7XG4gICAgfVxuICAgIGxldCB5TW92ZUlzWmVybyA9IGZhbHNlO1xuICAgIGlmICh5ID09PSAwIHx8ICh5ID4gMCAmJiBzdXJmYWNlLnkgPj0gc3VyZmFjZS5tYXgueSkgfHwgKHkgPCAwICYmIHN1cmZhY2UueSA8PSBzdXJmYWNlLm1pbi55KSkge1xuICAgICAgICB5TW92ZUlzWmVybyA9IHRydWU7XG4gICAgfVxuICAgIGlmICh4TW92ZUlzWmVybyAmJiB5TW92ZUlzWmVybykge1xuICAgICAgICBpZiAoc3VyZmFjZS5hbmltYXRpb25TdG9yYWdlLnN1cmZhY2VFZGdlSXNTZXQoKSkge1xuICAgICAgICAgICAgc3VyZmFjZS5hbmltYXRpb25TdG9yYWdlLmRlc3Ryb3lTdXJmYWNlRWRnZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFzdXJmYWNlLmFuaW1hdGlvblN0b3JhZ2Uuc3VyZmFjZUVkZ2VJc1NldCgpKSB7XG4gICAgICAgIHN1cmZhY2UuYW5pbWF0aW9uU3RvcmFnZS5jcmVhdGVTdXJmYWNlRWRnZSh4LCB5KTtcbiAgICAgICAgc3VyZmFjZS5hbmltYXRpb25FeGVjdXRvci5pbml0aWF0ZSgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3VyZmFjZS5hbmltYXRpb25TdG9yYWdlLnN1cmZhY2VFZGdlLnVwZGF0ZSh4LCB5KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG4iLCJpbXBvcnQgeyBzY2FsZUFuZEdsaWRlIH0gZnJvbSAnLi9zY2FsZS5qcyc7XG5leHBvcnQgZnVuY3Rpb24gYnV0dG9uUHJlc3NlZChldmVudCwgc3VyZmFjZSkge1xuICAgIGlmIChzdXJmYWNlLmVsZW1lbnRzLmNvbnRhaW5lci5tYXRjaGVzKCc6aG92ZXInKSkge1xuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSBcIkFkZFwiIHx8IGV2ZW50LmtleSA9PT0gXCIrXCIpIHtcbiAgICAgICAgICAgIHNjYWxlQW5kR2xpZGUoc3VyZmFjZSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZXZlbnQua2V5ID09PSBcIlN1YnRyYWN0XCIgfHwgZXZlbnQua2V5ID09PSBcIi1cIikge1xuICAgICAgICAgICAgc2NhbGVBbmRHbGlkZShzdXJmYWNlLCAtMSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBzY2FsZUFuZEdsaWRlIH0gZnJvbSAnLi9zY2FsZS5qcyc7XG5pbXBvcnQgeyBtb3ZlU3VyZmFjZUJ5RWRnZSB9IGZyb20gJy4vZWRnZS5qcyc7XG5pbXBvcnQgeyBkcmFnU3VyZmFjZSB9IGZyb20gJy4vZHJhZy5qcyc7XG5leHBvcnQgZnVuY3Rpb24gZ2V0TW91c2VQYXJhbXMoZXZlbnQsIHN1cmZhY2UpIHtcbiAgICBsZXQgYm91bmRzID0gc3VyZmFjZS5lbGVtZW50cy5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYnV0dG9uOiAoZXZlbnQgaW5zdGFuY2VvZiBUb3VjaEV2ZW50ID8gMCA6IGV2ZW50LmJ1dHRvbiksXG4gICAgICAgIHg6IChldmVudCBpbnN0YW5jZW9mIFRvdWNoRXZlbnQgPyBldmVudC50b3VjaGVzWzBdLmNsaWVudFggLSBib3VuZHMubGVmdCA6IGV2ZW50LmNsaWVudFggLSBib3VuZHMubGVmdCksXG4gICAgICAgIHk6IChldmVudCBpbnN0YW5jZW9mIFRvdWNoRXZlbnQgPyBldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSBib3VuZHMudG9wIDogZXZlbnQuY2xpZW50WSAtIGJvdW5kcy50b3ApXG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRXaGVlbFBhcmFtcyhldmVudCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHg6IGV2ZW50LmRlbHRhWCxcbiAgICAgICAgeTogZXZlbnQuZGVsdGFZXG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZU1vdmUoZXZlbnQsIHN1cmZhY2UpIHtcbiAgICBpZiAoc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX0VOQUJMRUQuVkFMVUUgPT09IDEpIHtcbiAgICAgICAgbW92ZVN1cmZhY2VCeUVkZ2Uoc3VyZmFjZSwgZ2V0TW91c2VQYXJhbXMoZXZlbnQsIHN1cmZhY2UpKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gbW91c2VXaGVlbChldmVudCwgc3VyZmFjZSkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgc2NhbGVBbmRHbGlkZShzdXJmYWNlLCAoZ2V0V2hlZWxQYXJhbXMoZXZlbnQpLnkgPCAwID8gMSA6IC0xKSwgZ2V0TW91c2VQYXJhbXMoZXZlbnQsIHN1cmZhY2UpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZURvd24oZXZlbnQsIHN1cmZhY2UpIHtcbiAgICBkcmFnU3VyZmFjZShzdXJmYWNlLCBnZXRNb3VzZVBhcmFtcyhldmVudCwgc3VyZmFjZSkpO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHNjYWxlQW5kR2xpZGUoc3VyZmFjZSwgc3RlcHMsIG1vdXNlID0gbnVsbCkge1xuICAgIGxldCBjaGFuZ2U7XG4gICAgaWYgKHN1cmZhY2Uuc2NhbGUgPCBzdXJmYWNlLkNPTkZJRy5TQ0FMRV9ERUZBVUxULlZBTFVFIHx8IChzdGVwcyA8IDAgJiYgc3VyZmFjZS5zY2FsZSA8PSBzdXJmYWNlLkNPTkZJRy5TQ0FMRV9ERUZBVUxULlZBTFVFKSkge1xuICAgICAgICBjaGFuZ2UgPSBzdGVwcyAqIChzdXJmYWNlLkNPTkZJRy5TQ0FMRV9ERUZBVUxULlZBTFVFIC0gc3VyZmFjZS5DT05GSUcuU0NBTEVfTUlOLlZBTFVFKSAqIHN1cmZhY2UuQ09ORklHLlNDQUxFX1NURVAuVkFMVUU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjaGFuZ2UgPSBzdGVwcyAqIChzdXJmYWNlLkNPTkZJRy5TQ0FMRV9NQVguVkFMVUUgLSBzdXJmYWNlLkNPTkZJRy5TQ0FMRV9ERUZBVUxULlZBTFVFKSAqIHN1cmZhY2UuQ09ORklHLlNDQUxFX1NURVAuVkFMVUU7XG4gICAgfVxuICAgIGxldCBzY2FsZUNoYW5nZWQgPSBzdXJmYWNlLmNoYW5nZVNjYWxlKGNoYW5nZSk7XG4gICAgaWYgKHNjYWxlQ2hhbmdlZCAmJiBtb3VzZSAhPT0gbnVsbCkge1xuICAgICAgICBsZXQgbW92ZVggPSBNYXRoLnJvdW5kKChtb3VzZS54IC0gc3VyZmFjZS5jb250YWluZXJXaWR0aCAvIDIpICogMC4yMCAvIHN1cmZhY2Uuc2NhbGUpO1xuICAgICAgICBsZXQgbW92ZVkgPSBNYXRoLnJvdW5kKChtb3VzZS55IC0gc3VyZmFjZS5jb250YWluZXJIZWlnaHQgLyAyKSAqIDAuMjAgLyBzdXJmYWNlLnNjYWxlKTtcbiAgICAgICAgaWYgKGNoYW5nZSA8IDApIHtcbiAgICAgICAgICAgIG1vdmVYID0gbW92ZVggKiAtMTtcbiAgICAgICAgICAgIG1vdmVZID0gbW92ZVkgKiAtMTtcbiAgICAgICAgfVxuICAgICAgICBzdXJmYWNlLmdsaWRlKG1vdmVYLCBtb3ZlWSk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlQ3NzRHluYW1pYyhzdXJmYWNlKSB7XG4gICAgcmV0dXJuIGBcclxuICBAcHJvcGVydHkgLS10aWx0ZWQtY29udGFpbmVyLXdpZHRoLWAgKyBzdXJmYWNlLnV1aWQgKyBgIHtcclxuICAgIHN5bnRheDogXCI8bGVuZ3RoPlwiO1xyXG4gICAgaW5oZXJpdHM6IHRydWU7XHJcbiAgICBpbml0aWFsLXZhbHVlOiBgICsgc3VyZmFjZS5jb250YWluZXJXaWR0aCArIGBweDtcclxuICB9XHJcbiAgQHByb3BlcnR5IC0tdGlsdGVkLWNvbnRhaW5lci1oZWlnaHQtYCArIHN1cmZhY2UudXVpZCArIGAge1xyXG4gICAgc3ludGF4OiBcIjxsZW5ndGg+XCI7XHJcbiAgICBpbmhlcml0czogdHJ1ZTtcclxuICAgIGluaXRpYWwtdmFsdWU6IGAgKyBzdXJmYWNlLmNvbnRhaW5lckhlaWdodCArIGBweDtcclxuICB9XHJcblxyXG4gIEBwcm9wZXJ0eSAtLXRpbHRlZC1zdXJmYWNlLXdpZHRoLWAgKyBzdXJmYWNlLnV1aWQgKyBgIHtcclxuICAgIHN5bnRheDogXCI8bGVuZ3RoPlwiO1xyXG4gICAgaW5oZXJpdHM6IHRydWU7XHJcbiAgICBpbml0aWFsLXZhbHVlOiBgICsgc3VyZmFjZS5zdXJmYWNlV2lkdGggKyBgcHg7XHJcbiAgfVxyXG4gIEBwcm9wZXJ0eSAtLXRpbHRlZC1zdXJmYWNlLWhlaWdodC1gICsgc3VyZmFjZS51dWlkICsgYCB7XHJcbiAgICBzeW50YXg6IFwiPGxlbmd0aD5cIjtcclxuICAgIGluaGVyaXRzOiB0cnVlO1xyXG4gICAgaW5pdGlhbC12YWx1ZTogYCArIHN1cmZhY2Uuc3VyZmFjZUhlaWdodCArIGBweDtcclxuICB9YDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUNzc1N0YXRpYyhzdXJmYWNlKSB7XG4gICAgbGV0IHN0cmluZyA9ICcnO1xuICAgIGZvciAoY29uc3QgcGFyYW1ldGVyIGluIHN1cmZhY2UuQ09ORklHKSB7XG4gICAgICAgIGxldCBtZWFzdXJlID0gJyc7XG4gICAgICAgIGlmIChzdXJmYWNlLkNPTkZJR1twYXJhbWV0ZXJdLlRZUEUgPT09ICdsZW5ndGgnKSB7XG4gICAgICAgICAgICBtZWFzdXJlID0gJ3B4JztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzdXJmYWNlLkNPTkZJR1twYXJhbWV0ZXJdLlRZUEUgPT09ICdhbmdsZScpIHtcbiAgICAgICAgICAgIG1lYXN1cmUgPSAnZGVnJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzdXJmYWNlLkNPTkZJR1twYXJhbWV0ZXJdLlRZUEUgPT09ICd0aW1lJykge1xuICAgICAgICAgICAgbWVhc3VyZSA9ICdtcyc7XG4gICAgICAgIH1cbiAgICAgICAgc3RyaW5nICs9IGBAcHJvcGVydHkgLS0ke3BhcmFtZXRlcn0geyBgO1xuICAgICAgICBzdHJpbmcgKz0gYHN5bnRheDogXCI8JHtzdXJmYWNlLkNPTkZJR1twYXJhbWV0ZXJdLlRZUEV9PlwiOyBgO1xuICAgICAgICBzdHJpbmcgKz0gYGluaGVyaXRzOiB0cnVlOyBgO1xuICAgICAgICBzdHJpbmcgKz0gYGluaXRpYWwtdmFsdWU6ICR7c3VyZmFjZS5DT05GSUdbcGFyYW1ldGVyXS5WQUxVRX0ke21lYXN1cmV9OyB9IGA7XG4gICAgfVxuICAgIHN0cmluZyArPSBgXHJcblxyXG4gIC50aWx0ZWQtY29udGFpbmVyLWAgKyBzdXJmYWNlLnV1aWQgKyBgIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZSAhaW1wb3J0YW50O1xyXG5cclxuICAgIGN1cnNvcjogbW92ZTtcclxuICAgIGN1cnNvcjogZ3JhYjtcclxuICAgIGN1cnNvcjogLW1vei1ncmFiO1xyXG4gICAgY3Vyc29yOiAtd2Via2l0LWdyYWI7XHJcblxyXG4gICAgLXdlYmtpdC10b3VjaC1jYWxsb3V0OiBub25lO1xyXG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcclxuICAgIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcclxuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XHJcbiAgICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XHJcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcclxuICB9XHJcblxyXG4gIC50aWx0ZWQtY29udGFpbmVyLWAgKyBzdXJmYWNlLnV1aWQgKyBgOmFjdGl2ZSB7XHJcbiAgICBjdXJzb3I6IGdyYWJiaW5nO1xyXG4gICAgY3Vyc29yOiAtbW96LWdyYWJiaW5nO1xyXG4gICAgY3Vyc29yOiAtd2Via2l0LWdyYWJiaW5nO1xyXG4gIH1cclxuXHJcbiAgLnRpbHRlZC1jb250cm9scy1gICsgc3VyZmFjZS51dWlkICsgYCB7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDEwMHB4O1xyXG4gICAgcmlnaHQ6IDMwcHg7XHJcbiAgICB3aWR0aDogMzBweDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICAgIGJveC1zaGFkb3c6IHJnYmEoMCwgMCwgMCwgMC4xNikgMHB4IDFweCA0cHg7XHJcbiAgICBib3gtc2l6aW5nOiBjb250ZW50LWJveDtcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgfVxyXG5cclxuICAudGlsdGVkLWNvbnRyb2xzLXpvb20taW4tYCArIHN1cmZhY2UudXVpZCArIGAsXHJcbiAgLnRpbHRlZC1jb250cm9scy16b29tLW91dC1gICsgc3VyZmFjZS51dWlkICsgYCB7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB3aWR0aDogMzBweDtcclxuICAgIGhlaWdodDogMzBweDtcclxuICAgIGJhY2tncm91bmQ6ICNmZmZmZmZjYztcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xyXG4gIH1cclxuICAudGlsdGVkLWNvbnRyb2xzLXpvb20taW4tYCArIHN1cmZhY2UudXVpZCArIGB7XHJcbiAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgIzQ0NDQ0NDtcclxuICB9XHJcbiAgLnRpbHRlZC1jb250cm9scy16b29tLWluLWAgKyBzdXJmYWNlLnV1aWQgKyBgOmFjdGl2ZSxcclxuICAudGlsdGVkLWNvbnRyb2xzLXpvb20tb3V0LWAgKyBzdXJmYWNlLnV1aWQgKyBgOmFjdGl2ZSB7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xyXG4gIH1cclxuICBcclxuICAgIFxyXG5cclxuICBcclxuICAudGlsdGVkLWNvbnRyb2xzLXpvb20taW4tYCArIHN1cmZhY2UudXVpZCArIGA6YmVmb3JlLFxyXG4gIC50aWx0ZWQtY29udHJvbHMtem9vbS1pbi1gICsgc3VyZmFjZS51dWlkICsgYDphZnRlcixcclxuICAudGlsdGVkLWNvbnRyb2xzLXpvb20tb3V0LWAgKyBzdXJmYWNlLnV1aWQgKyBgOmJlZm9yZSB7XHJcbiAgICBjb250ZW50OiBcIlwiO1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICBiYWNrZ3JvdW5kOiAjNDQ0NDQ0O1xyXG4gIH1cclxuXHJcbiAgLnRpbHRlZC1jb250cm9scy16b29tLWluLWAgKyBzdXJmYWNlLnV1aWQgKyBgOmJlZm9yZSxcclxuICAudGlsdGVkLWNvbnRyb2xzLXpvb20tb3V0LWAgKyBzdXJmYWNlLnV1aWQgKyBgOmJlZm9yZSB7XHJcbiAgICBoZWlnaHQ6IDJweDtcclxuICAgIHdpZHRoOiAxOHB4O1xyXG4gICAgdG9wOiAxNHB4O1xyXG4gICAgbGVmdDogNnB4O1xyXG4gIH1cclxuICAudGlsdGVkLWNvbnRyb2xzLXpvb20taW4tYCArIHN1cmZhY2UudXVpZCArIGA6YWZ0ZXIge1xyXG4gICAgaGVpZ2h0OiAxOHB4O1xyXG4gICAgd2lkdGg6IDJweDtcclxuICAgIHRvcDogNnB4O1xyXG4gICAgbGVmdDogMTRweDtcclxuICB9XHJcbiAgXHJcbiAgLnRpbHRlZC12aWV3cG9ydC1gICsgc3VyZmFjZS51dWlkICsgYCB7XHJcbiAgICB3aWR0aDogdmFyKC0tdGlsdGVkLXN1cmZhY2Utd2lkdGgtYCArIHN1cmZhY2UudXVpZCArIGApICFpbXBvcnRhbnQ7XHJcbiAgICBoZWlnaHQ6IHZhcigtLXRpbHRlZC1zdXJmYWNlLWhlaWdodC1gICsgc3VyZmFjZS51dWlkICsgYCkgIWltcG9ydGFudDtcclxuICBcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZSAhaW1wb3J0YW50O1xyXG4gIFxyXG4gICAgd2lsbC1jaGFuZ2U6IHRvcCwgbGVmdDtcclxuICB9XHJcbiAgXHJcbiAgLnRpbHRlZC1zY2FsZS1gICsgc3VyZmFjZS51dWlkICsgYCB7ICAgXHJcbiAgICB3aWR0aDogdmFyKC0tdGlsdGVkLXN1cmZhY2Utd2lkdGgtYCArIHN1cmZhY2UudXVpZCArIGApICFpbXBvcnRhbnQ7XHJcbiAgICBoZWlnaHQ6IHZhcigtLXRpbHRlZC1zdXJmYWNlLWhlaWdodC1gICsgc3VyZmFjZS51dWlkICsgYCkgIWltcG9ydGFudDtcclxuICBcclxuICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSB2YXIoLS1BTklNQVRJT05fU0NBTEVfVElNRSkgIWltcG9ydGFudDtcclxuICBcclxuICAgIHdpbGwtY2hhbmdlOiB0cmFuc2Zvcm07XHJcbiAgfVxyXG4gIFxyXG4gIC50aWx0ZWQtcG9zaXRpb24tYCArIHN1cmZhY2UudXVpZCArIGAge1xyXG4gICAgd2lkdGg6IHZhcigtLXRpbHRlZC1zdXJmYWNlLXdpZHRoLWAgKyBzdXJmYWNlLnV1aWQgKyBgKSAhaW1wb3J0YW50O1xyXG4gICAgaGVpZ2h0OiB2YXIoLS10aWx0ZWQtc3VyZmFjZS1oZWlnaHQtYCArIHN1cmZhY2UudXVpZCArIGApICFpbXBvcnRhbnQ7XHJcblxyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlICFpbXBvcnRhbnQ7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgXHJcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gdmFyKC0tQU5JTUFUSU9OX1NDQUxFX1RJTUUpICFpbXBvcnRhbnQ7XHJcbiAgICB3aWxsLWNoYW5nZTogdHJhbnNmb3JtLCB0b3AsIGxlZnQ7XHJcbiAgfVxyXG4gIFxyXG4gIC50aWx0ZWQtc3VyZmFjZS1gICsgc3VyZmFjZS51dWlkICsgYCB7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmUgIWltcG9ydGFudDtcclxuICAgIFxyXG4gICAgb3ZlcmZsb3c6IHZpc2libGUgIWltcG9ydGFudDtcclxuICBcclxuICAgIHotaW5kZXg6IDEwMCAhaW1wb3J0YW50O1xyXG4gIH1cclxuICAgIFxyXG4gIC50aWx0ZWQtbm90cmFuc2l0aW9uLWAgKyBzdXJmYWNlLnV1aWQgKyBgIHtcclxuICAgIC13ZWJraXQtdHJhbnNpdGlvbjogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgLW1vei10cmFuc2l0aW9uOiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAtby10cmFuc2l0aW9uOiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICB0cmFuc2l0aW9uOiBub25lICFpbXBvcnRhbnQ7XHJcbiAgfWA7XG4gICAgcmV0dXJuIHN0cmluZztcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiByb3VuZEZsb2F0KHZhbHVlLCBwcmVjaXNpb24pIHtcbiAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZS50b0ZpeGVkKHByZWNpc2lvbikpO1xufVxuIiwiY29uc3QgcmFuZG9tVVVJRCA9IHR5cGVvZiBjcnlwdG8gIT09ICd1bmRlZmluZWQnICYmIGNyeXB0by5yYW5kb21VVUlEICYmIGNyeXB0by5yYW5kb21VVUlELmJpbmQoY3J5cHRvKTtcbmV4cG9ydCBkZWZhdWx0IHsgcmFuZG9tVVVJRCB9O1xuIiwiZXhwb3J0IGRlZmF1bHQgL14oPzpbMC05YS1mXXs4fS1bMC05YS1mXXs0fS1bMS04XVswLTlhLWZdezN9LVs4OWFiXVswLTlhLWZdezN9LVswLTlhLWZdezEyfXwwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDB8ZmZmZmZmZmYtZmZmZi1mZmZmLWZmZmYtZmZmZmZmZmZmZmZmKSQvaTtcbiIsImxldCBnZXRSYW5kb21WYWx1ZXM7XG5jb25zdCBybmRzOCA9IG5ldyBVaW50OEFycmF5KDE2KTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJuZygpIHtcbiAgICBpZiAoIWdldFJhbmRvbVZhbHVlcykge1xuICAgICAgICBpZiAodHlwZW9mIGNyeXB0byA9PT0gJ3VuZGVmaW5lZCcgfHwgIWNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY3J5cHRvLmdldFJhbmRvbVZhbHVlcygpIG5vdCBzdXBwb3J0ZWQuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdXVpZGpzL3V1aWQjZ2V0cmFuZG9tdmFsdWVzLW5vdC1zdXBwb3J0ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBnZXRSYW5kb21WYWx1ZXMgPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKTtcbiAgICB9XG4gICAgcmV0dXJuIGdldFJhbmRvbVZhbHVlcyhybmRzOCk7XG59XG4iLCJpbXBvcnQgdmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZS5qcyc7XG5jb25zdCBieXRlVG9IZXggPSBbXTtcbmZvciAobGV0IGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgICBieXRlVG9IZXgucHVzaCgoaSArIDB4MTAwKS50b1N0cmluZygxNikuc2xpY2UoMSkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHVuc2FmZVN0cmluZ2lmeShhcnIsIG9mZnNldCA9IDApIHtcbiAgICByZXR1cm4gKGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMF1dICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxXV0gK1xuICAgICAgICBieXRlVG9IZXhbYXJyW29mZnNldCArIDJdXSArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgM11dICtcbiAgICAgICAgJy0nICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA0XV0gK1xuICAgICAgICBieXRlVG9IZXhbYXJyW29mZnNldCArIDVdXSArXG4gICAgICAgICctJyArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNl1dICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA3XV0gK1xuICAgICAgICAnLScgK1xuICAgICAgICBieXRlVG9IZXhbYXJyW29mZnNldCArIDhdXSArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOV1dICtcbiAgICAgICAgJy0nICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMF1dICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMV1dICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMl1dICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxM11dICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxNF1dICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxNV1dKS50b0xvd2VyQ2FzZSgpO1xufVxuZnVuY3Rpb24gc3RyaW5naWZ5KGFyciwgb2Zmc2V0ID0gMCkge1xuICAgIGNvbnN0IHV1aWQgPSB1bnNhZmVTdHJpbmdpZnkoYXJyLCBvZmZzZXQpO1xuICAgIGlmICghdmFsaWRhdGUodXVpZCkpIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKCdTdHJpbmdpZmllZCBVVUlEIGlzIGludmFsaWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHV1aWQ7XG59XG5leHBvcnQgZGVmYXVsdCBzdHJpbmdpZnk7XG4iLCJpbXBvcnQgbmF0aXZlIGZyb20gJy4vbmF0aXZlLmpzJztcbmltcG9ydCBybmcgZnJvbSAnLi9ybmcuanMnO1xuaW1wb3J0IHsgdW5zYWZlU3RyaW5naWZ5IH0gZnJvbSAnLi9zdHJpbmdpZnkuanMnO1xuZnVuY3Rpb24gdjQob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgICBpZiAobmF0aXZlLnJhbmRvbVVVSUQgJiYgIWJ1ZiAmJiAhb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gbmF0aXZlLnJhbmRvbVVVSUQoKTtcbiAgICB9XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgY29uc3Qgcm5kcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBybmcpKCk7XG4gICAgcm5kc1s2XSA9IChybmRzWzZdICYgMHgwZikgfCAweDQwO1xuICAgIHJuZHNbOF0gPSAocm5kc1s4XSAmIDB4M2YpIHwgMHg4MDtcbiAgICBpZiAoYnVmKSB7XG4gICAgICAgIG9mZnNldCA9IG9mZnNldCB8fCAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyArK2kpIHtcbiAgICAgICAgICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHJuZHNbaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJ1ZjtcbiAgICB9XG4gICAgcmV0dXJuIHVuc2FmZVN0cmluZ2lmeShybmRzKTtcbn1cbmV4cG9ydCBkZWZhdWx0IHY0O1xuIiwiaW1wb3J0IFJFR0VYIGZyb20gJy4vcmVnZXguanMnO1xuZnVuY3Rpb24gdmFsaWRhdGUodXVpZCkge1xuICAgIHJldHVybiB0eXBlb2YgdXVpZCA9PT0gJ3N0cmluZycgJiYgUkVHRVgudGVzdCh1dWlkKTtcbn1cbmV4cG9ydCBkZWZhdWx0IHZhbGlkYXRlO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyB2NCBhcyB1dWlkdjQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IHJvdW5kRmxvYXQgfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IHNldHVwQ29uZmlnIH0gZnJvbSAnLi9jb25maWcuanMnO1xuaW1wb3J0IHsgaW5pdENvbnRyb2xzIH0gZnJvbSAnLi9jb250cm9scy9jb250cm9scy5qcyc7XG5pbXBvcnQgQW5pbWF0aW9uRXhlY3V0b3IgZnJvbSAnLi9hbmltYXRpb24vZXhlY3V0b3IuanMnO1xuaW1wb3J0IEFuaW1hdGlvblN0b3JhZ2UgZnJvbSAnLi9hbmltYXRpb24vc3RvcmFnZS5qcyc7XG5pbXBvcnQgeyBnZW5lcmF0ZUNzc0R5bmFtaWMsIGdlbmVyYXRlQ3NzU3RhdGljIH0gZnJvbSAnLi9jc3MvY3NzLmpzJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN1cmZhY2Uge1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnRDb250YWluZXIsIGVsZW1lbnRNYXAsIGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIHRoaXMudXVpZCA9IHV1aWR2NCgpO1xuICAgICAgICB0aGlzLnZpZXdwb3J0ID0geyB4OiAwLCB5OiAwIH07XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSB7IHg6IDAsIHk6IDAgfTtcbiAgICAgICAgdGhpcy5vZmZzZXQgPSB7IHg6IDAsIHk6IDAgfTtcbiAgICAgICAgdGhpcy5za2V3ID0geyB4OiAwLCB5OiAwIH07XG4gICAgICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLkNPTkZJRyA9IHNldHVwQ29uZmlnKGNvbmZpZyk7XG4gICAgICAgIHRoaXMuZWxlbWVudHMgPSB0aGlzLnNldHVwRWxlbWVudHMoZWxlbWVudENvbnRhaW5lciwgZWxlbWVudE1hcCk7XG4gICAgICAgIHRoaXMuc3R5bGVzID0gdGhpcy5zZXR1cFN0eWxlcygpO1xuICAgICAgICB0aGlzLmFuaW1hdGlvblN0b3JhZ2UgPSBuZXcgQW5pbWF0aW9uU3RvcmFnZSh0aGlzKTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25FeGVjdXRvciA9IG5ldyBBbmltYXRpb25FeGVjdXRvcih0aGlzLCB0aGlzLmFuaW1hdGlvblN0b3JhZ2UpO1xuICAgICAgICBpbml0Q29udHJvbHModGhpcyk7XG4gICAgICAgIHRoaXMudXBkYXRlVmlld3BvcnQoKTtcbiAgICAgICAgbmV3IFJlc2l6ZU9ic2VydmVyKCgpID0+IHsgdGhpcy51cGRhdGVWaWV3cG9ydCgpOyB0aGlzLnVwZGF0ZUNzc0R5bmFtaWMoKTsgfSkub2JzZXJ2ZSh0aGlzLmVsZW1lbnRzLmNvbnRhaW5lcik7XG4gICAgICAgIG5ldyBSZXNpemVPYnNlcnZlcigoKSA9PiB7IHRoaXMudXBkYXRlQ3NzRHluYW1pYygpOyB9KS5vYnNlcnZlKHRoaXMuZWxlbWVudHMuc3VyZmFjZSk7XG4gICAgICAgIHRoaXMuc2NhbGUgPSB0aGlzLkNPTkZJRy5TQ0FMRV9ERUZBVUxULlZBTFVFO1xuICAgICAgICB0aGlzLmluaXRTY2FsZSgpO1xuICAgIH1cbiAgICBzZXR1cEVsZW1lbnRzKGVsZW1lbnRDb250YWluZXIsIGVsZW1lbnRNYXApIHtcbiAgICAgICAgZWxlbWVudENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0aWx0ZWQtY29udGFpbmVyLScgKyB0aGlzLnV1aWQpO1xuICAgICAgICBsZXQgZWxlbWVudFZpZXdwb3J0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsZW1lbnRWaWV3cG9ydC5jbGFzc0xpc3QuYWRkKCd0aWx0ZWQtdmlld3BvcnQtJyArIHRoaXMudXVpZCk7XG4gICAgICAgIGxldCBlbGVtZW50U2NhbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWxlbWVudFNjYWxlLmNsYXNzTGlzdC5hZGQoJ3RpbHRlZC1zY2FsZS0nICsgdGhpcy51dWlkKTtcbiAgICAgICAgbGV0IGVsZW1lbnRQb3NpdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbGVtZW50UG9zaXRpb24uY2xhc3NMaXN0LmFkZCgndGlsdGVkLXBvc2l0aW9uLScgKyB0aGlzLnV1aWQpO1xuICAgICAgICBlbGVtZW50TWFwLmNsYXNzTGlzdC5hZGQoJ3RpbHRlZC1zdXJmYWNlLScgKyB0aGlzLnV1aWQpO1xuICAgICAgICBsZXQgZWxlbWVudENvbnRyb2xzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsZW1lbnRDb250cm9scy5jbGFzc0xpc3QuYWRkKCd0aWx0ZWQtY29udHJvbHMtJyArIHRoaXMudXVpZCk7XG4gICAgICAgIGxldCBlbGVtZW50Q29udHJvbHNab29tSW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWxlbWVudENvbnRyb2xzWm9vbUluLmNsYXNzTGlzdC5hZGQoJ3RpbHRlZC1jb250cm9scy16b29tLWluLScgKyB0aGlzLnV1aWQpO1xuICAgICAgICBsZXQgZWxlbWVudENvbnRyb2xzWm9vbU91dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbGVtZW50Q29udHJvbHNab29tT3V0LmNsYXNzTGlzdC5hZGQoJ3RpbHRlZC1jb250cm9scy16b29tLW91dC0nICsgdGhpcy51dWlkKTtcbiAgICAgICAgZWxlbWVudENvbnRyb2xzLmFwcGVuZENoaWxkKGVsZW1lbnRDb250cm9sc1pvb21Jbik7XG4gICAgICAgIGVsZW1lbnRDb250cm9scy5hcHBlbmRDaGlsZChlbGVtZW50Q29udHJvbHNab29tT3V0KTtcbiAgICAgICAgZWxlbWVudFBvc2l0aW9uLmFwcGVuZENoaWxkKGVsZW1lbnRNYXApO1xuICAgICAgICBlbGVtZW50U2NhbGUuYXBwZW5kQ2hpbGQoZWxlbWVudFBvc2l0aW9uKTtcbiAgICAgICAgZWxlbWVudFZpZXdwb3J0LmFwcGVuZENoaWxkKGVsZW1lbnRTY2FsZSk7XG4gICAgICAgIGVsZW1lbnRDb250YWluZXIuYXBwZW5kQ2hpbGQoZWxlbWVudFZpZXdwb3J0KTtcbiAgICAgICAgZWxlbWVudENvbnRhaW5lci5hcHBlbmRDaGlsZChlbGVtZW50Q29udHJvbHMpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29udGFpbmVyOiBlbGVtZW50Q29udGFpbmVyLFxuICAgICAgICAgICAgY29udHJvbHM6IGVsZW1lbnRDb250cm9scyxcbiAgICAgICAgICAgIGNvbnRyb2xzWm9vbUluOiBlbGVtZW50Q29udHJvbHNab29tSW4sXG4gICAgICAgICAgICBjb250cm9sc1pvb21PdXQ6IGVsZW1lbnRDb250cm9sc1pvb21PdXQsXG4gICAgICAgICAgICB2aWV3cG9ydDogZWxlbWVudFZpZXdwb3J0LFxuICAgICAgICAgICAgc2NhbGU6IGVsZW1lbnRTY2FsZSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBlbGVtZW50UG9zaXRpb24sXG4gICAgICAgICAgICBzdXJmYWNlOiBlbGVtZW50TWFwXG4gICAgICAgIH07XG4gICAgfVxuICAgIHNldHVwU3R5bGVzKCkge1xuICAgICAgICBsZXQgZWxlbWVudFN0eWxlU3RhdGljID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgZWxlbWVudFN0eWxlU3RhdGljLmNsYXNzTGlzdC5hZGQoJ3RpbHRlZC1jc3Mtc3RhdGljLScgKyB0aGlzLnV1aWQpO1xuICAgICAgICBlbGVtZW50U3R5bGVTdGF0aWMuaW5uZXJIVE1MID0gZ2VuZXJhdGVDc3NTdGF0aWModGhpcyk7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZWxlbWVudFN0eWxlU3RhdGljKTtcbiAgICAgICAgbGV0IGVsZW1lbnRTdHlsZUR5bmFtaWMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBlbGVtZW50U3R5bGVEeW5hbWljLmNsYXNzTGlzdC5hZGQoJ3RpbHRlZC1jc3MtZHluYW1pYy0nICsgdGhpcy51dWlkKTtcbiAgICAgICAgZWxlbWVudFN0eWxlRHluYW1pYy5pbm5lckhUTUwgPSBnZW5lcmF0ZUNzc0R5bmFtaWModGhpcyk7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZWxlbWVudFN0eWxlRHluYW1pYyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0aWM6IGVsZW1lbnRTdHlsZVN0YXRpYyxcbiAgICAgICAgICAgIGR5bmFtaWM6IGVsZW1lbnRTdHlsZUR5bmFtaWNcbiAgICAgICAgfTtcbiAgICB9XG4gICAgdXBkYXRlQ3NzRHluYW1pYygpIHtcbiAgICAgICAgdGhpcy5zdHlsZXMuZHluYW1pYy5pbm5lckhUTUwgPSBnZW5lcmF0ZUNzc0R5bmFtaWModGhpcyk7XG4gICAgfVxuICAgIGdldCBjb250YWluZXJXaWR0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudHMuY29udGFpbmVyLm9mZnNldFdpZHRoO1xuICAgIH1cbiAgICBnZXQgY29udGFpbmVySGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50cy5jb250YWluZXIub2Zmc2V0SGVpZ2h0O1xuICAgIH1cbiAgICBnZXQgc3VyZmFjZVdpZHRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50cy5zdXJmYWNlLm9mZnNldFdpZHRoO1xuICAgIH1cbiAgICBnZXQgc3VyZmFjZUhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudHMuc3VyZmFjZS5vZmZzZXRIZWlnaHQ7XG4gICAgfVxuICAgIGdldCB4KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi54ICsgdGhpcy5vZmZzZXQueDtcbiAgICB9XG4gICAgZ2V0IHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLnkgKyB0aGlzLm9mZnNldC55O1xuICAgIH1cbiAgICBnZXQgbGltaXQoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBNYXRoLnJvdW5kKHRoaXMuc3VyZmFjZVdpZHRoIC8gMiAtIHRoaXMuY29udGFpbmVyV2lkdGggKiAwLjI1KSxcbiAgICAgICAgICAgIHk6IE1hdGgucm91bmQodGhpcy5zdXJmYWNlSGVpZ2h0IC8gMiAtIHRoaXMuY29udGFpbmVySGVpZ2h0ICogMC4yNSlcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZ2V0IG1pbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHRoaXMubGltaXQueCAqIC0xLFxuICAgICAgICAgICAgeTogdGhpcy5saW1pdC55ICogLTFcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZ2V0IG1heCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHRoaXMubGltaXQueCxcbiAgICAgICAgICAgIHk6IHRoaXMubGltaXQueVxuICAgICAgICB9O1xuICAgIH1cbiAgICBtb3ZlKHgsIHksIHJvdW5kID0gMCwgZW5kUm91bmQgPSAwKSB7XG4gICAgICAgIHggPSByb3VuZEZsb2F0KHgsIHJvdW5kKTtcbiAgICAgICAgeSA9IHJvdW5kRmxvYXQoeSwgcm91bmQpO1xuICAgICAgICBpZiAoeCA9PT0gMCAmJiB5ID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG9sZFBvc2l0aW9uWCA9IHRoaXMucG9zaXRpb24ueDtcbiAgICAgICAgbGV0IG9sZFBvc2l0aW9uWSA9IHRoaXMucG9zaXRpb24ueTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gcm91bmRGbG9hdCh0aGlzLnBvc2l0aW9uLnggKyB4LCBlbmRSb3VuZCk7XG4gICAgICAgIHRoaXMucG9zaXRpb24ueSA9IHJvdW5kRmxvYXQodGhpcy5wb3NpdGlvbi55ICsgeSwgZW5kUm91bmQpO1xuICAgICAgICBpZiAodGhpcy5wb3NpdGlvbi54ID09PSBvbGRQb3NpdGlvblggJiYgdGhpcy5wb3NpdGlvbi55ID09PSBvbGRQb3NpdGlvblkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy54IDwgdGhpcy5taW4ueCkge1xuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gdGhpcy5taW4ueCAtIHRoaXMub2Zmc2V0Lng7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy54ID4gdGhpcy5tYXgueCkge1xuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi54ID0gdGhpcy5tYXgueCAtIHRoaXMub2Zmc2V0Lng7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMueSA8IHRoaXMubWluLnkpIHtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueSA9IHRoaXMubWluLnkgLSB0aGlzLm9mZnNldC55O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMueSA+IHRoaXMubWF4LnkpIHtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueSA9IHRoaXMubWF4LnkgLSB0aGlzLm9mZnNldC55O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBvc2l0aW9uLnggPT09IG9sZFBvc2l0aW9uWCAmJiB0aGlzLnBvc2l0aW9uLnkgPT09IG9sZFBvc2l0aW9uWSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudHMucG9zaXRpb24uc3R5bGUudG9wID0gKHRoaXMucG9zaXRpb24ueSAqIC0xKSArICdweCc7XG4gICAgICAgIHRoaXMuZWxlbWVudHMucG9zaXRpb24uc3R5bGUubGVmdCA9ICh0aGlzLnBvc2l0aW9uLnggKiAtMSkgKyAncHgnO1xuICAgICAgICB0aGlzLmxvZyhbXG4gICAgICAgICAgICB7IGRlc2M6ICdwb3NpdGlvbi54JywgZnJvbTogb2xkUG9zaXRpb25YLCB0bzogdGhpcy5wb3NpdGlvbi54IH0sXG4gICAgICAgICAgICB7IGRlc2M6ICdwb3NpdGlvbi55JywgZnJvbTogb2xkUG9zaXRpb25ZLCB0bzogdGhpcy5wb3NpdGlvbi55IH1cbiAgICAgICAgXSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBtb3ZlVG8oeCwgeSwgZW5kUm91bmQgPSAwKSB7XG4gICAgICAgIHggPSByb3VuZEZsb2F0KHgsIGVuZFJvdW5kKTtcbiAgICAgICAgeSA9IHJvdW5kRmxvYXQoeSwgZW5kUm91bmQpO1xuICAgICAgICBpZiAodGhpcy5wb3NpdGlvbi54ID09PSB4ICYmIHRoaXMucG9zaXRpb24ueSA9PT0geSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm1vdmUoeCAtIHRoaXMucG9zaXRpb24ueCwgeSAtIHRoaXMucG9zaXRpb24ueSwgMCwgZW5kUm91bmQpO1xuICAgIH1cbiAgICBnbGlkZSh4LCB5LCByb3VuZCA9IDAsIGVuZFJvdW5kID0gMCkge1xuICAgICAgICB4ID0gcm91bmRGbG9hdCh4LCByb3VuZCk7XG4gICAgICAgIHkgPSByb3VuZEZsb2F0KHksIHJvdW5kKTtcbiAgICAgICAgaWYgKHggPT09IDAgJiYgeSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBvbGRPZmZzZXRYID0gdGhpcy5vZmZzZXQueDtcbiAgICAgICAgbGV0IG9sZE9mZnNldFkgPSB0aGlzLm9mZnNldC55O1xuICAgICAgICB0aGlzLm9mZnNldC54ID0gcm91bmRGbG9hdCh0aGlzLm9mZnNldC54ICsgeCwgZW5kUm91bmQpO1xuICAgICAgICB0aGlzLm9mZnNldC55ID0gcm91bmRGbG9hdCh0aGlzLm9mZnNldC55ICsgeSwgZW5kUm91bmQpO1xuICAgICAgICBpZiAodGhpcy5vZmZzZXQueCA9PT0gb2xkT2Zmc2V0WCAmJiB0aGlzLm9mZnNldC55ID09PSBvbGRPZmZzZXRZKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMueCA8IHRoaXMubWluLngpIHtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0LnggPSB0aGlzLm1pbi54IC0gdGhpcy5wb3NpdGlvbi54O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMueCA+IHRoaXMubWF4LngpIHtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0LnggPSB0aGlzLm1heC54IC0gdGhpcy5wb3NpdGlvbi54O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnkgPCB0aGlzLm1pbi55KSB7XG4gICAgICAgICAgICB0aGlzLm9mZnNldC55ID0gdGhpcy5taW4ueSAtIHRoaXMucG9zaXRpb24ueTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnkgPiB0aGlzLm1heC55KSB7XG4gICAgICAgICAgICB0aGlzLm9mZnNldC55ID0gdGhpcy5tYXgueSAtIHRoaXMucG9zaXRpb24ueTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vZmZzZXQueCA9PT0gb2xkT2Zmc2V0WCAmJiB0aGlzLm9mZnNldC55ID09PSBvbGRPZmZzZXRZKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50cy5wb3NpdGlvbi5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlM2QoJyArICh0aGlzLm9mZnNldC54ICogLTEpICsgJ3B4LCAnICsgKHRoaXMub2Zmc2V0LnkgKiAtMSkgKyAncHgsIDApJztcbiAgICAgICAgdGhpcy5sb2coW1xuICAgICAgICAgICAgeyBkZXNjOiAnb2Zmc2V0LngnLCBmcm9tOiBvbGRPZmZzZXRYLCB0bzogdGhpcy5vZmZzZXQueCB9LFxuICAgICAgICAgICAgeyBkZXNjOiAnb2Zmc2V0LnknLCBmcm9tOiBvbGRPZmZzZXRZLCB0bzogdGhpcy5vZmZzZXQueSB9XG4gICAgICAgIF0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgdXBkYXRlVmlld3BvcnQoKSB7XG4gICAgICAgIHRoaXMudmlld3BvcnQgPSB7XG4gICAgICAgICAgICB4OiAwIC0gdGhpcy5zdXJmYWNlV2lkdGggLyAyICsgdGhpcy5jb250YWluZXJXaWR0aCAvIDIsXG4gICAgICAgICAgICB5OiAwIC0gdGhpcy5zdXJmYWNlSGVpZ2h0IC8gMiArIHRoaXMuY29udGFpbmVySGVpZ2h0IC8gMlxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmVsZW1lbnRzLnZpZXdwb3J0LnN0eWxlLnRvcCA9IHRoaXMudmlld3BvcnQueSArICdweCc7XG4gICAgICAgIHRoaXMuZWxlbWVudHMudmlld3BvcnQuc3R5bGUubGVmdCA9IHRoaXMudmlld3BvcnQueCArICdweCc7XG4gICAgfVxuICAgIHVwZGF0ZVNrZXcoKSB7XG4gICAgICAgIGxldCBwZXJjZW50T2ZNYXhTY2FsZSA9ICh0aGlzLnNjYWxlIC0gdGhpcy5DT05GSUcuU0NBTEVfTUlOLlZBTFVFKSAvICh0aGlzLkNPTkZJRy5TQ0FMRV9NQVguVkFMVUUgLSB0aGlzLkNPTkZJRy5TQ0FMRV9NSU4uVkFMVUUpO1xuICAgICAgICB0aGlzLnNrZXcgPSB7XG4gICAgICAgICAgICB4OiByb3VuZEZsb2F0KHBlcmNlbnRPZk1heFNjYWxlICogdGhpcy5DT05GSUcuU0tFV19YX01BWC5WQUxVRSwgMiksXG4gICAgICAgICAgICB5OiAwXG4gICAgICAgIH07XG4gICAgfVxuICAgIGluaXRTY2FsZSgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVTa2V3KCk7XG4gICAgICAgIHRoaXMuZWxlbWVudHMuc2NhbGUuY2xhc3NMaXN0LmFkZCgndGlsdGVkLW5vdHJhbnNpdGlvbi0nICsgdGhpcy51dWlkKTtcbiAgICAgICAgdGhpcy5lbGVtZW50cy5zY2FsZS5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoJyArIHRoaXMuc2NhbGUgKyAnKSBwZXJzcGVjdGl2ZSgnICsgdGhpcy5DT05GSUcuUEVSU1BFQ1RJVkVfRElTVEFOQ0UuVkFMVUUgKyAncHgpIHJvdGF0ZTNkKDEsIDAsIDAsICcgKyB0aGlzLnNrZXcueCArICdkZWcpJztcbiAgICAgICAgdGhpcy5lbGVtZW50cy5zY2FsZS5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIHRoaXMuZWxlbWVudHMuc2NhbGUuY2xhc3NMaXN0LnJlbW92ZSgndGlsdGVkLW5vdHJhbnNpdGlvbi0nICsgdGhpcy51dWlkKTtcbiAgICB9XG4gICAgY2hhbmdlU2NhbGUoY2hhbmdlKSB7XG4gICAgICAgIGlmIChjaGFuZ2UgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgb2xkU2NhbGUgPSB0aGlzLnNjYWxlO1xuICAgICAgICB0aGlzLnNjYWxlID0gcm91bmRGbG9hdCh0aGlzLnNjYWxlICsgY2hhbmdlLCB0aGlzLkNPTkZJRy5TQ0FMRV9ST1VORC5WQUxVRSk7XG4gICAgICAgIHRoaXMuc2NhbGUgPSBNYXRoLm1heCh0aGlzLnNjYWxlLCB0aGlzLkNPTkZJRy5TQ0FMRV9NSU4uVkFMVUUpO1xuICAgICAgICB0aGlzLnNjYWxlID0gTWF0aC5taW4odGhpcy5zY2FsZSwgdGhpcy5DT05GSUcuU0NBTEVfTUFYLlZBTFVFKTtcbiAgICAgICAgaWYgKG9sZFNjYWxlID09PSB0aGlzLnNjYWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVTa2V3KCk7XG4gICAgICAgIHRoaXMuZWxlbWVudHMuc2NhbGUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKCcgKyB0aGlzLnNjYWxlICsgJykgcGVyc3BlY3RpdmUoJyArIHRoaXMuQ09ORklHLlBFUlNQRUNUSVZFX0RJU1RBTkNFLlZBTFVFICsgJ3B4KSByb3RhdGUzZCgxLCAwLCAwLCAnICsgdGhpcy5za2V3LnggKyAnZGVnKSc7XG4gICAgICAgIHRoaXMubG9nKFtcbiAgICAgICAgICAgIHsgZGVzYzogJ3NjYWxlJywgZnJvbTogb2xkU2NhbGUsIHRvOiB0aGlzLnNjYWxlIH1cbiAgICAgICAgXSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBsb2coY2hhbmdlcyA9IGZhbHNlKSB7XG4gICAgICAgIGlmICh0aGlzLkNPTkZJRy5ERUJVR19NT0RFLlZBTFVFID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNoYW5nZXNTdHJpbmcgPSAnJztcbiAgICAgICAgaWYgKGNoYW5nZXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGNoYW5nZSBvZiBjaGFuZ2VzKSB7XG4gICAgICAgICAgICAgICAgY2hhbmdlc1N0cmluZyArPSBjaGFuZ2UuZGVzYyArIChjaGFuZ2UuZnJvbSAhPT0gdW5kZWZpbmVkID8gJyBmcm9tICcgKyBjaGFuZ2UuZnJvbSA6ICcnKSArIChjaGFuZ2UudG8gIT09IHVuZGVmaW5lZCA/ICcgdG8gJyArIGNoYW5nZS50byA6ICcnKSArICdcXG4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGNoYW5nZXNTdHJpbmcgK1xuICAgICAgICAgICAgYHBvc2l0aW9uIFg6ICR7dGhpcy5wb3NpdGlvbi54fVxcbmAgK1xuICAgICAgICAgICAgYHBvc2l0aW9uIFk6ICR7dGhpcy5wb3NpdGlvbi55fVxcbmAgK1xuICAgICAgICAgICAgYG9mZnNldCBYOiAke3RoaXMub2Zmc2V0Lnh9XFxuYCArXG4gICAgICAgICAgICBgb2Zmc2V0IFk6ICR7dGhpcy5vZmZzZXQueX1cXG5gICtcbiAgICAgICAgICAgIGBsaW1pdC54OiAke3RoaXMubGltaXQueH1cXG5gICtcbiAgICAgICAgICAgIGBsaW1pdC55OiAke3RoaXMubGltaXQueX1cXG5gICtcbiAgICAgICAgICAgIGBzY2FsZTogJHt0aGlzLnNjYWxlfWApO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==