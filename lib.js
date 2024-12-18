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
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v4.js");
/* harmony import */ var _controls_mouse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../controls/mouse.js */ "./lib/controls/mouse.ts");


function dragSurface(surface, mouse) {
    if (mouse.button !== 0) {
        return;
    }
    let id = (0,uuid__WEBPACK_IMPORTED_MODULE_1__["default"])();
    surface.dragId = id;
    let x = mouse.x;
    let y = mouse.y;
    surface.isDragging = true;
    function moveSurfaceByDragging(mouse) {
        surface.move((x - mouse.x) / surface.scale, (y - mouse.y) / surface.scale);
        x = mouse.x;
        y = mouse.y;
    }
    function handleMoveEvent(event) {
        if (id === surface.dragId) {
            moveSurfaceByDragging((0,_controls_mouse_js__WEBPACK_IMPORTED_MODULE_0__.getMouseParams)(event, surface));
        }
    }
    surface.elements.container.addEventListener('mousemove', handleMoveEvent);
    surface.elements.container.addEventListener('touchmove', handleMoveEvent);
    function clearSurfaceDrag() {
        surface.elements.container.removeEventListener('mousemove', handleMoveEvent);
        surface.elements.container.removeEventListener('touchmove', handleMoveEvent);
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
        this.dragId = '';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LFlBQVk7QUFDbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNyS087QUFDUDtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNGQTtBQUNBLGlFQUFlLEVBQUUsWUFBWSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNEOUIsaUVBQWUsY0FBYyxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxHQUFHLDhFQUE4RSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNBMUs7QUFDQTtBQUNlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWcUM7QUFDckM7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QUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLHFEQUFVO0FBQ3RCLFlBQVkscURBQVU7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixxREFBVTtBQUNsQyx3QkFBd0IscURBQVU7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsdURBQXVEO0FBQ3JFLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxREFBVTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIscURBQVU7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGdCQUFnQjtBQUMzQywyQkFBMkIsZ0JBQWdCO0FBQzNDLHlCQUF5QixjQUFjO0FBQ3ZDLHlCQUF5QixjQUFjO0FBQ3ZDLHdCQUF3QixhQUFhO0FBQ3JDLHdCQUF3QixhQUFhO0FBQ3JDLHNCQUFzQixXQUFXO0FBQ2pDO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9UaWx0ZWQvLi9saWIvYW5pbWF0aW9uL2FuaW1hdGlvbi50cyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9saWIvYW5pbWF0aW9uL2VkZ2UudHMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbGliL2FuaW1hdGlvbi9leGVjdXRvci50cyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9saWIvYW5pbWF0aW9uL3N0b3JhZ2UudHMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbGliL2NvbmZpZy50cyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9saWIvY29udHJvbHMvY29udHJvbHMudHMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbGliL2NvbnRyb2xzL2RyYWcudHMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbGliL2NvbnRyb2xzL2VkZ2UudHMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbGliL2NvbnRyb2xzL2tleWJvYXJkLnRzIiwid2VicGFjazovL1RpbHRlZC8uL2xpYi9jb250cm9scy9tb3VzZS50cyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9saWIvY29udHJvbHMvc2NhbGUudHMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbGliL2Nzcy9jc3MudHMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbGliL3V0aWxzLnRzIiwid2VicGFjazovL1RpbHRlZC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvbmF0aXZlLmpzIiwid2VicGFjazovL1RpbHRlZC8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvcmVnZXguanMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9ybmcuanMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9zdHJpbmdpZnkuanMiLCJ3ZWJwYWNrOi8vVGlsdGVkLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci92NC5qcyIsIndlYnBhY2s6Ly9UaWx0ZWQvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3ZhbGlkYXRlLmpzIiwid2VicGFjazovL1RpbHRlZC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9UaWx0ZWQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1RpbHRlZC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1RpbHRlZC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1RpbHRlZC8uL2xpYi9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBBbmltYXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKHN1cmZhY2UpIHtcbiAgICAgICAgdGhpcy50aW1lc3RhbXBTdGFydCA9IDA7XG4gICAgICAgIHRoaXMudGltZXN0YW1wTGFzdCA9IDA7XG4gICAgICAgIHRoaXMuc3VyZmFjZSA9IHN1cmZhY2U7XG4gICAgfVxufVxuIiwiaW1wb3J0IEFuaW1hdGlvbiBmcm9tICcuL2FuaW1hdGlvbi5qcyc7XG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uU3VyZmFjZUVkZ2UgZXh0ZW5kcyBBbmltYXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKHN1cmZhY2UsIHgsIHkpIHtcbiAgICAgICAgc3VwZXIoc3VyZmFjZSk7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgIGxldCB0aW1lc3RhbXBTdGFydCA9IERhdGUubm93KCk7XG4gICAgICAgIHRoaXMudGltZXN0YW1wU3RhcnQgPSB0aW1lc3RhbXBTdGFydDtcbiAgICAgICAgdGhpcy50aW1lc3RhbXBMYXN0ID0gdGltZXN0YW1wU3RhcnQ7XG4gICAgfVxuICAgIHVwZGF0ZSh4LCB5KSB7XG4gICAgICAgIGlmICh0aGlzLnggIT09IHgpIHtcbiAgICAgICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMueSAhPT0geSkge1xuICAgICAgICAgICAgdGhpcy55ID0geTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGVwKHRpbWVzdGFtcEN1cnJlbnQpIHtcbiAgICAgICAgbGV0IHRpbWVGYWN0b3IgPSBNYXRoLm1heCgxLCAodGltZXN0YW1wQ3VycmVudCAtIHRoaXMudGltZXN0YW1wTGFzdCkpIC8gMTA7XG4gICAgICAgIGxldCB4ID0gdGhpcy5zdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfU1BFRUQuVkFMVUUgKiB0aGlzLnggLyB0aGlzLnN1cmZhY2Uuc2NhbGUgKiB0aW1lRmFjdG9yO1xuICAgICAgICBsZXQgeSA9IHRoaXMuc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX1NQRUVELlZBTFVFICogdGhpcy55IC8gdGhpcy5zdXJmYWNlLnNjYWxlICogdGltZUZhY3RvcjtcbiAgICAgICAgdGhpcy50aW1lc3RhbXBMYXN0ID0gdGltZXN0YW1wQ3VycmVudDtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3VyZmFjZS5tb3ZlKHgsIHkpO1xuICAgIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuaW1hdGlvbkV4ZWN1dG9yIHtcbiAgICBjb25zdHJ1Y3RvcihzdXJmYWNlLCBhbmltYXRpb25TdG9yYWdlKSB7XG4gICAgICAgIHRoaXMuZXhlY3V0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3VyZmFjZSA9IHN1cmZhY2U7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uU3RvcmFnZSA9IGFuaW1hdGlvblN0b3JhZ2U7XG4gICAgfVxuICAgIGluaXRpYXRlKCkge1xuICAgICAgICBpZiAoIXRoaXMuZXhlY3V0aW5nKSB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnN0ZXAoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGVwKCkge1xuICAgICAgICBsZXQgdGltZXN0YW1wQ3VycmVudCA9IERhdGUubm93KCk7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGluZyA9IGZhbHNlIHx8IHRoaXMuc3RlcFN1cmZhY2VFZGdlKHRpbWVzdGFtcEN1cnJlbnQpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZXhlY3V0aW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGVwKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzdGVwU3VyZmFjZUVkZ2UodGltZXN0YW1wQ3VycmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuYW5pbWF0aW9uU3RvcmFnZS5zdXJmYWNlRWRnZUlzU2V0KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc2hvdWxkQ29udGludWUgPSB0aGlzLmFuaW1hdGlvblN0b3JhZ2Uuc3VyZmFjZUVkZ2Uuc3RlcCh0aW1lc3RhbXBDdXJyZW50KTtcbiAgICAgICAgaWYgKCFzaG91bGRDb250aW51ZSkge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25TdG9yYWdlLmRlc3Ryb3lTdXJmYWNlRWRnZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaG91bGRDb250aW51ZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBbmltYXRpb25TdXJmYWNlRWRnZSB9IGZyb20gJy4vZWRnZS5qcyc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmltYXRpb25TdG9yYWdlIHtcbiAgICBjb25zdHJ1Y3RvcihzdXJmYWNlKSB7XG4gICAgICAgIHRoaXMuc3VyZmFjZUVkZ2UgPSBudWxsO1xuICAgICAgICB0aGlzLnN1cmZhY2UgPSBzdXJmYWNlO1xuICAgIH1cbiAgICBjcmVhdGVTdXJmYWNlRWRnZSh4LCB5KSB7XG4gICAgICAgIHRoaXMuc3VyZmFjZUVkZ2UgPSBuZXcgQW5pbWF0aW9uU3VyZmFjZUVkZ2UodGhpcy5zdXJmYWNlLCB4LCB5KTtcbiAgICB9XG4gICAgZGVzdHJveVN1cmZhY2VFZGdlKCkge1xuICAgICAgICB0aGlzLnN1cmZhY2VFZGdlID0gbnVsbDtcbiAgICB9XG4gICAgc3VyZmFjZUVkZ2VJc1NldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3VyZmFjZUVkZ2UgIT09IG51bGw7XG4gICAgfVxufVxuIiwidmFyIENvbmZpZ1Byb3BlcnR5VHlwZTtcbihmdW5jdGlvbiAoQ29uZmlnUHJvcGVydHlUeXBlKSB7XG4gICAgQ29uZmlnUHJvcGVydHlUeXBlW1wiQW5nbGVcIl0gPSBcImFuZ2xlXCI7XG4gICAgQ29uZmlnUHJvcGVydHlUeXBlW1wiQ29sb3JcIl0gPSBcImNvbG9yXCI7XG4gICAgQ29uZmlnUHJvcGVydHlUeXBlW1wiSW50ZWdlclwiXSA9IFwiaW50ZWdlclwiO1xuICAgIENvbmZpZ1Byb3BlcnR5VHlwZVtcIk51bWJlclwiXSA9IFwibnVtYmVyXCI7XG4gICAgQ29uZmlnUHJvcGVydHlUeXBlW1wiTGVuZ3RoXCJdID0gXCJsZW5ndGhcIjtcbiAgICBDb25maWdQcm9wZXJ0eVR5cGVbXCJUaW1lXCJdID0gXCJ0aW1lXCI7XG59KShDb25maWdQcm9wZXJ0eVR5cGUgfHwgKENvbmZpZ1Byb3BlcnR5VHlwZSA9IHt9KSk7XG5leHBvcnQgZnVuY3Rpb24gc2V0dXBDb25maWcoY29uZmlnQ3VzdG9tKSB7XG4gICAgbGV0IGNvbmZpZyA9IHtcbiAgICAgICAgREVCVUdfTU9ERTogMCxcbiAgICAgICAgU0NBTEVfU1RFUDogMC4yMCwgLy8gUGVyY2VudCBvZiAxLzIgdG90YWwgc2NhbGUsIGUuZy4gMC4yMCBtZWFucyA1IHN0ZXBzIGZyb20gMC4yNSB0byAwLjUwIGFuZCA1IHN0ZXBzIGZyb20gMC41MCB0byAxXG4gICAgICAgIFNDQUxFX01JTjogMC4yNSxcbiAgICAgICAgU0NBTEVfREVGQVVMVDogMC41MCxcbiAgICAgICAgU0NBTEVfTUFYOiAxLjAwLFxuICAgICAgICBTQ0FMRV9ST1VORDogMyxcbiAgICAgICAgUEVSU1BFQ1RJVkVfRElTVEFOQ0U6IDEwMDAsXG4gICAgICAgIFNLRVdfWF9NQVg6IDM1LFxuICAgICAgICBFREdFX01PVkVfRU5BQkxFRDogMCxcbiAgICAgICAgRURHRV9NT1ZFX0FSRUE6IDIwLFxuICAgICAgICBFREdFX01PVkVfU1BFRUQ6IDEwLFxuICAgICAgICBBTklNQVRJT05fU0NBTEVfVElNRTogNTAwLFxuICAgIH07XG4gICAgZm9yIChjb25zdCBwYXJhbWV0ZXIgaW4gY29uZmlnQ3VzdG9tKSB7XG4gICAgICAgIGlmIChjb25maWcuaGFzT3duUHJvcGVydHkocGFyYW1ldGVyKSkge1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gY29uZmlnQ3VzdG9tW3BhcmFtZXRlcl07XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25maWdbcGFyYW1ldGVyXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IENPTkZJRyA9IHtcbiAgICAgICAgREVCVUdfTU9ERToge1xuICAgICAgICAgICAgVkFMVUU6IGNvbmZpZy5ERUJVR19NT0RFLFxuICAgICAgICAgICAgVFlQRTogQ29uZmlnUHJvcGVydHlUeXBlLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgU0NBTEVfU1RFUDoge1xuICAgICAgICAgICAgVkFMVUU6IGNvbmZpZy5TQ0FMRV9TVEVQLFxuICAgICAgICAgICAgVFlQRTogQ29uZmlnUHJvcGVydHlUeXBlLk51bWJlclxuICAgICAgICB9LFxuICAgICAgICBTQ0FMRV9NSU46IHtcbiAgICAgICAgICAgIFZBTFVFOiBjb25maWcuU0NBTEVfTUlOLFxuICAgICAgICAgICAgVFlQRTogQ29uZmlnUHJvcGVydHlUeXBlLk51bWJlclxuICAgICAgICB9LFxuICAgICAgICBTQ0FMRV9ERUZBVUxUOiB7XG4gICAgICAgICAgICBWQUxVRTogY29uZmlnLlNDQUxFX0RFRkFVTFQsXG4gICAgICAgICAgICBUWVBFOiBDb25maWdQcm9wZXJ0eVR5cGUuTnVtYmVyXG4gICAgICAgIH0sXG4gICAgICAgIFNDQUxFX01BWDoge1xuICAgICAgICAgICAgVkFMVUU6IGNvbmZpZy5TQ0FMRV9NQVgsXG4gICAgICAgICAgICBUWVBFOiBDb25maWdQcm9wZXJ0eVR5cGUuTnVtYmVyXG4gICAgICAgIH0sXG4gICAgICAgIFNDQUxFX1JPVU5EOiB7XG4gICAgICAgICAgICBWQUxVRTogY29uZmlnLlNDQUxFX1JPVU5ELFxuICAgICAgICAgICAgVFlQRTogQ29uZmlnUHJvcGVydHlUeXBlLk51bWJlclxuICAgICAgICB9LFxuICAgICAgICBQRVJTUEVDVElWRV9ESVNUQU5DRToge1xuICAgICAgICAgICAgVkFMVUU6IE1hdGgucm91bmQoY29uZmlnLlBFUlNQRUNUSVZFX0RJU1RBTkNFKSxcbiAgICAgICAgICAgIFRZUEU6IENvbmZpZ1Byb3BlcnR5VHlwZS5MZW5ndGhcbiAgICAgICAgfSxcbiAgICAgICAgU0tFV19YX01BWDoge1xuICAgICAgICAgICAgVkFMVUU6IE1hdGgucm91bmQoY29uZmlnLlNLRVdfWF9NQVgpLFxuICAgICAgICAgICAgVFlQRTogQ29uZmlnUHJvcGVydHlUeXBlLkFuZ2xlXG4gICAgICAgIH0sXG4gICAgICAgIEVER0VfTU9WRV9FTkFCTEVEOiB7XG4gICAgICAgICAgICBWQUxVRTogY29uZmlnLkVER0VfTU9WRV9FTkFCTEVELFxuICAgICAgICAgICAgVFlQRTogQ29uZmlnUHJvcGVydHlUeXBlLkludGVnZXJcbiAgICAgICAgfSxcbiAgICAgICAgRURHRV9NT1ZFX0FSRUE6IHtcbiAgICAgICAgICAgIFZBTFVFOiBNYXRoLnJvdW5kKGNvbmZpZy5FREdFX01PVkVfQVJFQSksXG4gICAgICAgICAgICBUWVBFOiBDb25maWdQcm9wZXJ0eVR5cGUuTGVuZ3RoXG4gICAgICAgIH0sXG4gICAgICAgIEVER0VfTU9WRV9TUEVFRDoge1xuICAgICAgICAgICAgVkFMVUU6IE1hdGgucm91bmQoY29uZmlnLkVER0VfTU9WRV9TUEVFRCksXG4gICAgICAgICAgICBUWVBFOiBDb25maWdQcm9wZXJ0eVR5cGUuTGVuZ3RoXG4gICAgICAgIH0sXG4gICAgICAgIEFOSU1BVElPTl9TQ0FMRV9USU1FOiB7XG4gICAgICAgICAgICBWQUxVRTogTWF0aC5yb3VuZChjb25maWcuQU5JTUFUSU9OX1NDQUxFX1RJTUUpLFxuICAgICAgICAgICAgVFlQRTogQ29uZmlnUHJvcGVydHlUeXBlLlRpbWVcbiAgICAgICAgfSxcbiAgICB9O1xuICAgIHJldHVybiBDT05GSUc7XG59XG4iLCJpbXBvcnQgeyBtb3VzZU1vdmUsIG1vdXNlV2hlZWwsIG1vdXNlRG93biB9IGZyb20gJy4vbW91c2UuanMnO1xuaW1wb3J0IHsgYnV0dG9uUHJlc3NlZCB9IGZyb20gJy4va2V5Ym9hcmQuanMnO1xuaW1wb3J0IHsgc2NhbGVBbmRHbGlkZSB9IGZyb20gJy4vc2NhbGUuanMnO1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRDb250cm9scyhzdXJmYWNlKSB7XG4gICAgc3VyZmFjZS5lbGVtZW50cy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZSkgPT4geyBtb3VzZU1vdmUoZSwgc3VyZmFjZSk7IH0pO1xuICAgIHN1cmZhY2UuZWxlbWVudHMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ3aGVlbFwiLCAoZSkgPT4geyBtb3VzZVdoZWVsKGUsIHN1cmZhY2UpOyB9KTtcbiAgICBzdXJmYWNlLmVsZW1lbnRzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlKSA9PiB7IG1vdXNlRG93bihlLCBzdXJmYWNlKTsgfSk7XG4gICAgc3VyZmFjZS5lbGVtZW50cy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgKGUpID0+IHsgbW91c2VEb3duKGUsIHN1cmZhY2UpOyB9KTtcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7IGJ1dHRvblByZXNzZWQoZSwgc3VyZmFjZSk7IH0pO1xuICAgIHN1cmZhY2UuZWxlbWVudHMuY29udHJvbHNab29tSW4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHsgc2NhbGVBbmRHbGlkZShzdXJmYWNlLCAxKTsgfSk7XG4gICAgc3VyZmFjZS5lbGVtZW50cy5jb250cm9sc1pvb21PdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHsgc2NhbGVBbmRHbGlkZShzdXJmYWNlLCAtMSk7IH0pO1xuICAgIHN1cmZhY2UuZWxlbWVudHMuY29udGFpbmVyLm9uZHJhZ3N0YXJ0ID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgZ2V0TW91c2VQYXJhbXMgfSBmcm9tICcuLi9jb250cm9scy9tb3VzZS5qcyc7XG5leHBvcnQgZnVuY3Rpb24gZHJhZ1N1cmZhY2Uoc3VyZmFjZSwgbW91c2UpIHtcbiAgICBpZiAobW91c2UuYnV0dG9uICE9PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGlkID0gdXVpZHY0KCk7XG4gICAgc3VyZmFjZS5kcmFnSWQgPSBpZDtcbiAgICBsZXQgeCA9IG1vdXNlLng7XG4gICAgbGV0IHkgPSBtb3VzZS55O1xuICAgIHN1cmZhY2UuaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgZnVuY3Rpb24gbW92ZVN1cmZhY2VCeURyYWdnaW5nKG1vdXNlKSB7XG4gICAgICAgIHN1cmZhY2UubW92ZSgoeCAtIG1vdXNlLngpIC8gc3VyZmFjZS5zY2FsZSwgKHkgLSBtb3VzZS55KSAvIHN1cmZhY2Uuc2NhbGUpO1xuICAgICAgICB4ID0gbW91c2UueDtcbiAgICAgICAgeSA9IG1vdXNlLnk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGhhbmRsZU1vdmVFdmVudChldmVudCkge1xuICAgICAgICBpZiAoaWQgPT09IHN1cmZhY2UuZHJhZ0lkKSB7XG4gICAgICAgICAgICBtb3ZlU3VyZmFjZUJ5RHJhZ2dpbmcoZ2V0TW91c2VQYXJhbXMoZXZlbnQsIHN1cmZhY2UpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdXJmYWNlLmVsZW1lbnRzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBoYW5kbGVNb3ZlRXZlbnQpO1xuICAgIHN1cmZhY2UuZWxlbWVudHMuY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGhhbmRsZU1vdmVFdmVudCk7XG4gICAgZnVuY3Rpb24gY2xlYXJTdXJmYWNlRHJhZygpIHtcbiAgICAgICAgc3VyZmFjZS5lbGVtZW50cy5jb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgaGFuZGxlTW92ZUV2ZW50KTtcbiAgICAgICAgc3VyZmFjZS5lbGVtZW50cy5jb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgaGFuZGxlTW92ZUV2ZW50KTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5vbm1vdXNldXAgPSBudWxsO1xuICAgICAgICBkb2N1bWVudC5ib2R5Lm9udG91Y2hlbmQgPSBudWxsO1xuICAgICAgICBzdXJmYWNlLmlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICB9XG4gICAgZG9jdW1lbnQuYm9keS5vbm1vdXNldXAgPSBjbGVhclN1cmZhY2VEcmFnO1xuICAgIGRvY3VtZW50LmJvZHkub250b3VjaGVuZCA9IGNsZWFyU3VyZmFjZURyYWc7XG59XG47XG4iLCJ2YXIgRGlyZWN0aW9uO1xuKGZ1bmN0aW9uIChEaXJlY3Rpb24pIHtcbiAgICBEaXJlY3Rpb25bXCJUb3BcIl0gPSBcInRvcFwiO1xuICAgIERpcmVjdGlvbltcIkJvdHRvbVwiXSA9IFwiYm90dG9tXCI7XG4gICAgRGlyZWN0aW9uW1wiTGVmdFwiXSA9IFwibGVmdFwiO1xuICAgIERpcmVjdGlvbltcIlJpZ2h0XCJdID0gXCJyaWdodFwiO1xuICAgIERpcmVjdGlvbltcIk5vbmVcIl0gPSBcIm5vbmVcIjtcbn0pKERpcmVjdGlvbiB8fCAoRGlyZWN0aW9uID0ge30pKTtcbmV4cG9ydCBmdW5jdGlvbiBtb3ZlU3VyZmFjZUJ5RWRnZShzdXJmYWNlLCBtb3VzZSkge1xuICAgIGlmIChzdXJmYWNlLmlzRHJhZ2dpbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBsZXQgZGlyZWN0aW9uID0ge1xuICAgICAgICB4OiBEaXJlY3Rpb24uTm9uZSxcbiAgICAgICAgeTogRGlyZWN0aW9uLk5vbmVcbiAgICB9O1xuICAgIGlmIChtb3VzZS55IDw9IHN1cmZhY2UuQ09ORklHLkVER0VfTU9WRV9BUkVBLlZBTFVFKSB7XG4gICAgICAgIGlmIChtb3VzZS54IDw9IHN1cmZhY2UuQ09ORklHLkVER0VfTU9WRV9BUkVBLlZBTFVFKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb24ueCA9IERpcmVjdGlvbi5MZWZ0O1xuICAgICAgICAgICAgZGlyZWN0aW9uLnkgPSBEaXJlY3Rpb24uVG9wO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG1vdXNlLnggPj0gc3VyZmFjZS5jb250YWluZXJXaWR0aCAtIHN1cmZhY2UuQ09ORklHLkVER0VfTU9WRV9BUkVBLlZBTFVFKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb24ueCA9IERpcmVjdGlvbi5SaWdodDtcbiAgICAgICAgICAgIGRpcmVjdGlvbi55ID0gRGlyZWN0aW9uLlRvcDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbi55ID0gRGlyZWN0aW9uLlRvcDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChtb3VzZS55ID49IHN1cmZhY2UuY29udGFpbmVySGVpZ2h0IC0gc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX0FSRUEuVkFMVUUpIHtcbiAgICAgICAgaWYgKG1vdXNlLnggPD0gc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX0FSRUEuVkFMVUUpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbi54ID0gRGlyZWN0aW9uLkxlZnQ7XG4gICAgICAgICAgICBkaXJlY3Rpb24ueSA9IERpcmVjdGlvbi5Cb3R0b207XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobW91c2UueCA+PSBzdXJmYWNlLmNvbnRhaW5lcldpZHRoIC0gc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX0FSRUEuVkFMVUUpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbi54ID0gRGlyZWN0aW9uLlJpZ2h0O1xuICAgICAgICAgICAgZGlyZWN0aW9uLnkgPSBEaXJlY3Rpb24uQm90dG9tO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGlyZWN0aW9uLnkgPSBEaXJlY3Rpb24uQm90dG9tO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAobW91c2UueCA8PSBzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSkge1xuICAgICAgICAgICAgZGlyZWN0aW9uLnggPSBEaXJlY3Rpb24uTGVmdDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChtb3VzZS54ID49IHN1cmZhY2UuY29udGFpbmVyV2lkdGggLSBzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSkge1xuICAgICAgICAgICAgZGlyZWN0aW9uLnggPSBEaXJlY3Rpb24uUmlnaHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IHggPSAwO1xuICAgIGxldCB5ID0gMDtcbiAgICBpZiAoZGlyZWN0aW9uLnkgIT09IERpcmVjdGlvbi5Ob25lIHx8IGRpcmVjdGlvbi54ICE9PSBEaXJlY3Rpb24uTm9uZSkge1xuICAgICAgICBpZiAoZGlyZWN0aW9uLnkgPT09IERpcmVjdGlvbi5Ub3ApIHtcbiAgICAgICAgICAgIHkgPSAoc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX0FSRUEuVkFMVUUgKyAxIC0gbW91c2UueSkgLyAoc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX0FSRUEuVkFMVUUgKyAxKSAqIC0xO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRpcmVjdGlvbi55ID09PSBEaXJlY3Rpb24uQm90dG9tKSB7XG4gICAgICAgICAgICB5ID0gKHN1cmZhY2UuQ09ORklHLkVER0VfTU9WRV9BUkVBLlZBTFVFICsgMSAtIChzdXJmYWNlLmNvbnRhaW5lckhlaWdodCAtIG1vdXNlLnkpKSAvIChzdXJmYWNlLkNPTkZJRy5FREdFX01PVkVfQVJFQS5WQUxVRSArIDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaXJlY3Rpb24ueCA9PT0gRGlyZWN0aW9uLkxlZnQpIHtcbiAgICAgICAgICAgIHggPSAoc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX0FSRUEuVkFMVUUgKyAxIC0gbW91c2UueCkgLyAoc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX0FSRUEuVkFMVUUgKyAxKSAqIC0xO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRpcmVjdGlvbi54ID09PSBEaXJlY3Rpb24uUmlnaHQpIHtcbiAgICAgICAgICAgIHggPSAoc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX0FSRUEuVkFMVUUgKyAxIC0gKHN1cmZhY2UuY29udGFpbmVyV2lkdGggLSBtb3VzZS54KSkgLyAoc3VyZmFjZS5DT05GSUcuRURHRV9NT1ZFX0FSRUEuVkFMVUUgKyAxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgeE1vdmVJc1plcm8gPSBmYWxzZTtcbiAgICBpZiAoeCA9PT0gMCB8fCAoeCA+IDAgJiYgc3VyZmFjZS54ID49IHN1cmZhY2UubWF4LngpIHx8ICh4IDwgMCAmJiBzdXJmYWNlLnggPD0gc3VyZmFjZS5taW4ueCkpIHtcbiAgICAgICAgeE1vdmVJc1plcm8gPSB0cnVlO1xuICAgIH1cbiAgICBsZXQgeU1vdmVJc1plcm8gPSBmYWxzZTtcbiAgICBpZiAoeSA9PT0gMCB8fCAoeSA+IDAgJiYgc3VyZmFjZS55ID49IHN1cmZhY2UubWF4LnkpIHx8ICh5IDwgMCAmJiBzdXJmYWNlLnkgPD0gc3VyZmFjZS5taW4ueSkpIHtcbiAgICAgICAgeU1vdmVJc1plcm8gPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoeE1vdmVJc1plcm8gJiYgeU1vdmVJc1plcm8pIHtcbiAgICAgICAgaWYgKHN1cmZhY2UuYW5pbWF0aW9uU3RvcmFnZS5zdXJmYWNlRWRnZUlzU2V0KCkpIHtcbiAgICAgICAgICAgIHN1cmZhY2UuYW5pbWF0aW9uU3RvcmFnZS5kZXN0cm95U3VyZmFjZUVkZ2UoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghc3VyZmFjZS5hbmltYXRpb25TdG9yYWdlLnN1cmZhY2VFZGdlSXNTZXQoKSkge1xuICAgICAgICBzdXJmYWNlLmFuaW1hdGlvblN0b3JhZ2UuY3JlYXRlU3VyZmFjZUVkZ2UoeCwgeSk7XG4gICAgICAgIHN1cmZhY2UuYW5pbWF0aW9uRXhlY3V0b3IuaW5pdGlhdGUoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHN1cmZhY2UuYW5pbWF0aW9uU3RvcmFnZS5zdXJmYWNlRWRnZS51cGRhdGUoeCwgeSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuIiwiaW1wb3J0IHsgc2NhbGVBbmRHbGlkZSB9IGZyb20gJy4vc2NhbGUuanMnO1xuZXhwb3J0IGZ1bmN0aW9uIGJ1dHRvblByZXNzZWQoZXZlbnQsIHN1cmZhY2UpIHtcbiAgICBpZiAoc3VyZmFjZS5lbGVtZW50cy5jb250YWluZXIubWF0Y2hlcygnOmhvdmVyJykpIHtcbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gXCJBZGRcIiB8fCBldmVudC5rZXkgPT09IFwiK1wiKSB7XG4gICAgICAgICAgICBzY2FsZUFuZEdsaWRlKHN1cmZhY2UsIDEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gXCJTdWJ0cmFjdFwiIHx8IGV2ZW50LmtleSA9PT0gXCItXCIpIHtcbiAgICAgICAgICAgIHNjYWxlQW5kR2xpZGUoc3VyZmFjZSwgLTEpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgc2NhbGVBbmRHbGlkZSB9IGZyb20gJy4vc2NhbGUuanMnO1xuaW1wb3J0IHsgbW92ZVN1cmZhY2VCeUVkZ2UgfSBmcm9tICcuL2VkZ2UuanMnO1xuaW1wb3J0IHsgZHJhZ1N1cmZhY2UgfSBmcm9tICcuL2RyYWcuanMnO1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1vdXNlUGFyYW1zKGV2ZW50LCBzdXJmYWNlKSB7XG4gICAgbGV0IGJvdW5kcyA9IHN1cmZhY2UuZWxlbWVudHMuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGJ1dHRvbjogKGV2ZW50IGluc3RhbmNlb2YgVG91Y2hFdmVudCA/IDAgOiBldmVudC5idXR0b24pLFxuICAgICAgICB4OiAoZXZlbnQgaW5zdGFuY2VvZiBUb3VjaEV2ZW50ID8gZXZlbnQudG91Y2hlc1swXS5jbGllbnRYIC0gYm91bmRzLmxlZnQgOiBldmVudC5jbGllbnRYIC0gYm91bmRzLmxlZnQpLFxuICAgICAgICB5OiAoZXZlbnQgaW5zdGFuY2VvZiBUb3VjaEV2ZW50ID8gZXZlbnQudG91Y2hlc1swXS5jbGllbnRZIC0gYm91bmRzLnRvcCA6IGV2ZW50LmNsaWVudFkgLSBib3VuZHMudG9wKVxuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0V2hlZWxQYXJhbXMoZXZlbnQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB4OiBldmVudC5kZWx0YVgsXG4gICAgICAgIHk6IGV2ZW50LmRlbHRhWVxuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gbW91c2VNb3ZlKGV2ZW50LCBzdXJmYWNlKSB7XG4gICAgaWYgKHN1cmZhY2UuQ09ORklHLkVER0VfTU9WRV9FTkFCTEVELlZBTFVFID09PSAxKSB7XG4gICAgICAgIG1vdmVTdXJmYWNlQnlFZGdlKHN1cmZhY2UsIGdldE1vdXNlUGFyYW1zKGV2ZW50LCBzdXJmYWNlKSk7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlV2hlZWwoZXZlbnQsIHN1cmZhY2UpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHNjYWxlQW5kR2xpZGUoc3VyZmFjZSwgKGdldFdoZWVsUGFyYW1zKGV2ZW50KS55IDwgMCA/IDEgOiAtMSksIGdldE1vdXNlUGFyYW1zKGV2ZW50LCBzdXJmYWNlKSk7XG59XG5leHBvcnQgZnVuY3Rpb24gbW91c2VEb3duKGV2ZW50LCBzdXJmYWNlKSB7XG4gICAgZHJhZ1N1cmZhY2Uoc3VyZmFjZSwgZ2V0TW91c2VQYXJhbXMoZXZlbnQsIHN1cmZhY2UpKTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBzY2FsZUFuZEdsaWRlKHN1cmZhY2UsIHN0ZXBzLCBtb3VzZSA9IG51bGwpIHtcbiAgICBsZXQgY2hhbmdlO1xuICAgIGlmIChzdXJmYWNlLnNjYWxlIDwgc3VyZmFjZS5DT05GSUcuU0NBTEVfREVGQVVMVC5WQUxVRSB8fCAoc3RlcHMgPCAwICYmIHN1cmZhY2Uuc2NhbGUgPD0gc3VyZmFjZS5DT05GSUcuU0NBTEVfREVGQVVMVC5WQUxVRSkpIHtcbiAgICAgICAgY2hhbmdlID0gc3RlcHMgKiAoc3VyZmFjZS5DT05GSUcuU0NBTEVfREVGQVVMVC5WQUxVRSAtIHN1cmZhY2UuQ09ORklHLlNDQUxFX01JTi5WQUxVRSkgKiBzdXJmYWNlLkNPTkZJRy5TQ0FMRV9TVEVQLlZBTFVFO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY2hhbmdlID0gc3RlcHMgKiAoc3VyZmFjZS5DT05GSUcuU0NBTEVfTUFYLlZBTFVFIC0gc3VyZmFjZS5DT05GSUcuU0NBTEVfREVGQVVMVC5WQUxVRSkgKiBzdXJmYWNlLkNPTkZJRy5TQ0FMRV9TVEVQLlZBTFVFO1xuICAgIH1cbiAgICBsZXQgc2NhbGVDaGFuZ2VkID0gc3VyZmFjZS5jaGFuZ2VTY2FsZShjaGFuZ2UpO1xuICAgIGlmIChzY2FsZUNoYW5nZWQgJiYgbW91c2UgIT09IG51bGwpIHtcbiAgICAgICAgbGV0IG1vdmVYID0gTWF0aC5yb3VuZCgobW91c2UueCAtIHN1cmZhY2UuY29udGFpbmVyV2lkdGggLyAyKSAqIDAuMjAgLyBzdXJmYWNlLnNjYWxlKTtcbiAgICAgICAgbGV0IG1vdmVZID0gTWF0aC5yb3VuZCgobW91c2UueSAtIHN1cmZhY2UuY29udGFpbmVySGVpZ2h0IC8gMikgKiAwLjIwIC8gc3VyZmFjZS5zY2FsZSk7XG4gICAgICAgIGlmIChjaGFuZ2UgPCAwKSB7XG4gICAgICAgICAgICBtb3ZlWCA9IG1vdmVYICogLTE7XG4gICAgICAgICAgICBtb3ZlWSA9IG1vdmVZICogLTE7XG4gICAgICAgIH1cbiAgICAgICAgc3VyZmFjZS5nbGlkZShtb3ZlWCwgbW92ZVkpO1xuICAgIH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUNzc0R5bmFtaWMoc3VyZmFjZSkge1xuICAgIHJldHVybiBgXHJcbiAgQHByb3BlcnR5IC0tdGlsdGVkLWNvbnRhaW5lci13aWR0aC1gICsgc3VyZmFjZS51dWlkICsgYCB7XHJcbiAgICBzeW50YXg6IFwiPGxlbmd0aD5cIjtcclxuICAgIGluaGVyaXRzOiB0cnVlO1xyXG4gICAgaW5pdGlhbC12YWx1ZTogYCArIHN1cmZhY2UuY29udGFpbmVyV2lkdGggKyBgcHg7XHJcbiAgfVxyXG4gIEBwcm9wZXJ0eSAtLXRpbHRlZC1jb250YWluZXItaGVpZ2h0LWAgKyBzdXJmYWNlLnV1aWQgKyBgIHtcclxuICAgIHN5bnRheDogXCI8bGVuZ3RoPlwiO1xyXG4gICAgaW5oZXJpdHM6IHRydWU7XHJcbiAgICBpbml0aWFsLXZhbHVlOiBgICsgc3VyZmFjZS5jb250YWluZXJIZWlnaHQgKyBgcHg7XHJcbiAgfVxyXG5cclxuICBAcHJvcGVydHkgLS10aWx0ZWQtc3VyZmFjZS13aWR0aC1gICsgc3VyZmFjZS51dWlkICsgYCB7XHJcbiAgICBzeW50YXg6IFwiPGxlbmd0aD5cIjtcclxuICAgIGluaGVyaXRzOiB0cnVlO1xyXG4gICAgaW5pdGlhbC12YWx1ZTogYCArIHN1cmZhY2Uuc3VyZmFjZVdpZHRoICsgYHB4O1xyXG4gIH1cclxuICBAcHJvcGVydHkgLS10aWx0ZWQtc3VyZmFjZS1oZWlnaHQtYCArIHN1cmZhY2UudXVpZCArIGAge1xyXG4gICAgc3ludGF4OiBcIjxsZW5ndGg+XCI7XHJcbiAgICBpbmhlcml0czogdHJ1ZTtcclxuICAgIGluaXRpYWwtdmFsdWU6IGAgKyBzdXJmYWNlLnN1cmZhY2VIZWlnaHQgKyBgcHg7XHJcbiAgfWA7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVDc3NTdGF0aWMoc3VyZmFjZSkge1xuICAgIGxldCBzdHJpbmcgPSAnJztcbiAgICBmb3IgKGNvbnN0IHBhcmFtZXRlciBpbiBzdXJmYWNlLkNPTkZJRykge1xuICAgICAgICBsZXQgbWVhc3VyZSA9ICcnO1xuICAgICAgICBpZiAoc3VyZmFjZS5DT05GSUdbcGFyYW1ldGVyXS5UWVBFID09PSAnbGVuZ3RoJykge1xuICAgICAgICAgICAgbWVhc3VyZSA9ICdweCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3VyZmFjZS5DT05GSUdbcGFyYW1ldGVyXS5UWVBFID09PSAnYW5nbGUnKSB7XG4gICAgICAgICAgICBtZWFzdXJlID0gJ2RlZyc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3VyZmFjZS5DT05GSUdbcGFyYW1ldGVyXS5UWVBFID09PSAndGltZScpIHtcbiAgICAgICAgICAgIG1lYXN1cmUgPSAnbXMnO1xuICAgICAgICB9XG4gICAgICAgIHN0cmluZyArPSBgQHByb3BlcnR5IC0tJHtwYXJhbWV0ZXJ9IHsgYDtcbiAgICAgICAgc3RyaW5nICs9IGBzeW50YXg6IFwiPCR7c3VyZmFjZS5DT05GSUdbcGFyYW1ldGVyXS5UWVBFfT5cIjsgYDtcbiAgICAgICAgc3RyaW5nICs9IGBpbmhlcml0czogdHJ1ZTsgYDtcbiAgICAgICAgc3RyaW5nICs9IGBpbml0aWFsLXZhbHVlOiAke3N1cmZhY2UuQ09ORklHW3BhcmFtZXRlcl0uVkFMVUV9JHttZWFzdXJlfTsgfSBgO1xuICAgIH1cbiAgICBzdHJpbmcgKz0gYFxyXG5cclxuICAudGlsdGVkLWNvbnRhaW5lci1gICsgc3VyZmFjZS51dWlkICsgYCB7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmUgIWltcG9ydGFudDtcclxuXHJcbiAgICBjdXJzb3I6IG1vdmU7XHJcbiAgICBjdXJzb3I6IGdyYWI7XHJcbiAgICBjdXJzb3I6IC1tb3otZ3JhYjtcclxuICAgIGN1cnNvcjogLXdlYmtpdC1ncmFiO1xyXG5cclxuICAgIC13ZWJraXQtdG91Y2gtY2FsbG91dDogbm9uZTtcclxuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XHJcbiAgICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XHJcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xyXG4gICAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xyXG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XHJcbiAgfVxyXG5cclxuICAudGlsdGVkLWNvbnRhaW5lci1gICsgc3VyZmFjZS51dWlkICsgYDphY3RpdmUge1xyXG4gICAgY3Vyc29yOiBncmFiYmluZztcclxuICAgIGN1cnNvcjogLW1vei1ncmFiYmluZztcclxuICAgIGN1cnNvcjogLXdlYmtpdC1ncmFiYmluZztcclxuICB9XHJcblxyXG4gIC50aWx0ZWQtY29udHJvbHMtYCArIHN1cmZhY2UudXVpZCArIGAge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOiAxMDBweDtcclxuICAgIHJpZ2h0OiAzMHB4O1xyXG4gICAgd2lkdGg6IDMwcHg7XHJcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgICBib3gtc2hhZG93OiByZ2JhKDAsIDAsIDAsIDAuMTYpIDBweCAxcHggNHB4O1xyXG4gICAgYm94LXNpemluZzogY29udGVudC1ib3g7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gIH1cclxuXHJcbiAgLnRpbHRlZC1jb250cm9scy16b29tLWluLWAgKyBzdXJmYWNlLnV1aWQgKyBgLFxyXG4gIC50aWx0ZWQtY29udHJvbHMtem9vbS1vdXQtYCArIHN1cmZhY2UudXVpZCArIGAge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgd2lkdGg6IDMwcHg7XHJcbiAgICBoZWlnaHQ6IDMwcHg7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmY2M7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICBib3gtc2l6aW5nOiBjb250ZW50LWJveDtcclxuICB9XHJcbiAgLnRpbHRlZC1jb250cm9scy16b29tLWluLWAgKyBzdXJmYWNlLnV1aWQgKyBge1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICM0NDQ0NDQ7XHJcbiAgfVxyXG4gIC50aWx0ZWQtY29udHJvbHMtem9vbS1pbi1gICsgc3VyZmFjZS51dWlkICsgYDphY3RpdmUsXHJcbiAgLnRpbHRlZC1jb250cm9scy16b29tLW91dC1gICsgc3VyZmFjZS51dWlkICsgYDphY3RpdmUge1xyXG4gICAgYmFja2dyb3VuZDogI2ZmZmZmZjtcclxuICB9XHJcbiAgXHJcbiAgICBcclxuXHJcbiAgXHJcbiAgLnRpbHRlZC1jb250cm9scy16b29tLWluLWAgKyBzdXJmYWNlLnV1aWQgKyBgOmJlZm9yZSxcclxuICAudGlsdGVkLWNvbnRyb2xzLXpvb20taW4tYCArIHN1cmZhY2UudXVpZCArIGA6YWZ0ZXIsXHJcbiAgLnRpbHRlZC1jb250cm9scy16b29tLW91dC1gICsgc3VyZmFjZS51dWlkICsgYDpiZWZvcmUge1xyXG4gICAgY29udGVudDogXCJcIjtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgYmFja2dyb3VuZDogIzQ0NDQ0NDtcclxuICB9XHJcblxyXG4gIC50aWx0ZWQtY29udHJvbHMtem9vbS1pbi1gICsgc3VyZmFjZS51dWlkICsgYDpiZWZvcmUsXHJcbiAgLnRpbHRlZC1jb250cm9scy16b29tLW91dC1gICsgc3VyZmFjZS51dWlkICsgYDpiZWZvcmUge1xyXG4gICAgaGVpZ2h0OiAycHg7XHJcbiAgICB3aWR0aDogMThweDtcclxuICAgIHRvcDogMTRweDtcclxuICAgIGxlZnQ6IDZweDtcclxuICB9XHJcbiAgLnRpbHRlZC1jb250cm9scy16b29tLWluLWAgKyBzdXJmYWNlLnV1aWQgKyBgOmFmdGVyIHtcclxuICAgIGhlaWdodDogMThweDtcclxuICAgIHdpZHRoOiAycHg7XHJcbiAgICB0b3A6IDZweDtcclxuICAgIGxlZnQ6IDE0cHg7XHJcbiAgfVxyXG4gIFxyXG4gIC50aWx0ZWQtdmlld3BvcnQtYCArIHN1cmZhY2UudXVpZCArIGAge1xyXG4gICAgd2lkdGg6IHZhcigtLXRpbHRlZC1zdXJmYWNlLXdpZHRoLWAgKyBzdXJmYWNlLnV1aWQgKyBgKSAhaW1wb3J0YW50O1xyXG4gICAgaGVpZ2h0OiB2YXIoLS10aWx0ZWQtc3VyZmFjZS1oZWlnaHQtYCArIHN1cmZhY2UudXVpZCArIGApICFpbXBvcnRhbnQ7XHJcbiAgXHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmUgIWltcG9ydGFudDtcclxuICBcclxuICAgIHdpbGwtY2hhbmdlOiB0b3AsIGxlZnQ7XHJcbiAgfVxyXG4gIFxyXG4gIC50aWx0ZWQtc2NhbGUtYCArIHN1cmZhY2UudXVpZCArIGAgeyAgIFxyXG4gICAgd2lkdGg6IHZhcigtLXRpbHRlZC1zdXJmYWNlLXdpZHRoLWAgKyBzdXJmYWNlLnV1aWQgKyBgKSAhaW1wb3J0YW50O1xyXG4gICAgaGVpZ2h0OiB2YXIoLS10aWx0ZWQtc3VyZmFjZS1oZWlnaHQtYCArIHN1cmZhY2UudXVpZCArIGApICFpbXBvcnRhbnQ7XHJcbiAgXHJcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gdmFyKC0tQU5JTUFUSU9OX1NDQUxFX1RJTUUpICFpbXBvcnRhbnQ7XHJcbiAgXHJcbiAgICB3aWxsLWNoYW5nZTogdHJhbnNmb3JtO1xyXG4gIH1cclxuICBcclxuICAudGlsdGVkLXBvc2l0aW9uLWAgKyBzdXJmYWNlLnV1aWQgKyBgIHtcclxuICAgIHdpZHRoOiB2YXIoLS10aWx0ZWQtc3VyZmFjZS13aWR0aC1gICsgc3VyZmFjZS51dWlkICsgYCkgIWltcG9ydGFudDtcclxuICAgIGhlaWdodDogdmFyKC0tdGlsdGVkLXN1cmZhY2UtaGVpZ2h0LWAgKyBzdXJmYWNlLnV1aWQgKyBgKSAhaW1wb3J0YW50O1xyXG5cclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZSAhaW1wb3J0YW50O1xyXG4gICAgdG9wOiAwO1xyXG4gICAgbGVmdDogMDtcclxuICAgIFxyXG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIHZhcigtLUFOSU1BVElPTl9TQ0FMRV9USU1FKSAhaW1wb3J0YW50O1xyXG4gICAgd2lsbC1jaGFuZ2U6IHRyYW5zZm9ybSwgdG9wLCBsZWZ0O1xyXG4gIH1cclxuICBcclxuICAudGlsdGVkLXN1cmZhY2UtYCArIHN1cmZhY2UudXVpZCArIGAge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlICFpbXBvcnRhbnQ7XHJcbiAgICBcclxuICAgIG92ZXJmbG93OiB2aXNpYmxlICFpbXBvcnRhbnQ7XHJcbiAgXHJcbiAgICB6LWluZGV4OiAxMDAgIWltcG9ydGFudDtcclxuICB9XHJcbiAgICBcclxuICAudGlsdGVkLW5vdHJhbnNpdGlvbi1gICsgc3VyZmFjZS51dWlkICsgYCB7XHJcbiAgICAtd2Via2l0LXRyYW5zaXRpb246IG5vbmUgIWltcG9ydGFudDtcclxuICAgIC1tb3otdHJhbnNpdGlvbjogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgLW8tdHJhbnNpdGlvbjogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgdHJhbnNpdGlvbjogbm9uZSAhaW1wb3J0YW50O1xyXG4gIH1gO1xuICAgIHJldHVybiBzdHJpbmc7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gcm91bmRGbG9hdCh2YWx1ZSwgcHJlY2lzaW9uKSB7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUudG9GaXhlZChwcmVjaXNpb24pKTtcbn1cbiIsImNvbnN0IHJhbmRvbVVVSUQgPSB0eXBlb2YgY3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiBjcnlwdG8ucmFuZG9tVVVJRCAmJiBjcnlwdG8ucmFuZG9tVVVJRC5iaW5kKGNyeXB0byk7XG5leHBvcnQgZGVmYXVsdCB7IHJhbmRvbVVVSUQgfTtcbiIsImV4cG9ydCBkZWZhdWx0IC9eKD86WzAtOWEtZl17OH0tWzAtOWEtZl17NH0tWzEtOF1bMC05YS1mXXszfS1bODlhYl1bMC05YS1mXXszfS1bMC05YS1mXXsxMn18MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwfGZmZmZmZmZmLWZmZmYtZmZmZi1mZmZmLWZmZmZmZmZmZmZmZikkL2k7XG4iLCJsZXQgZ2V0UmFuZG9tVmFsdWVzO1xuY29uc3Qgcm5kczggPSBuZXcgVWludDhBcnJheSgxNik7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBybmcoKSB7XG4gICAgaWYgKCFnZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjcnlwdG8gPT09ICd1bmRlZmluZWQnIHx8ICFjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NyeXB0by5nZXRSYW5kb21WYWx1ZXMoKSBub3Qgc3VwcG9ydGVkLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkI2dldHJhbmRvbXZhbHVlcy1ub3Qtc3VwcG9ydGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0UmFuZG9tVmFsdWVzID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKGNyeXB0byk7XG4gICAgfVxuICAgIHJldHVybiBnZXRSYW5kb21WYWx1ZXMocm5kczgpO1xufVxuIiwiaW1wb3J0IHZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUuanMnO1xuY29uc3QgYnl0ZVRvSGV4ID0gW107XG5mb3IgKGxldCBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gICAgYnl0ZVRvSGV4LnB1c2goKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnNsaWNlKDEpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB1bnNhZmVTdHJpbmdpZnkoYXJyLCBvZmZzZXQgPSAwKSB7XG4gICAgcmV0dXJuIChieXRlVG9IZXhbYXJyW29mZnNldCArIDBdXSArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMV1dICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAyXV0gK1xuICAgICAgICBieXRlVG9IZXhbYXJyW29mZnNldCArIDNdXSArXG4gICAgICAgICctJyArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNF1dICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA1XV0gK1xuICAgICAgICAnLScgK1xuICAgICAgICBieXRlVG9IZXhbYXJyW29mZnNldCArIDZdXSArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgN11dICtcbiAgICAgICAgJy0nICtcbiAgICAgICAgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA4XV0gK1xuICAgICAgICBieXRlVG9IZXhbYXJyW29mZnNldCArIDldXSArXG4gICAgICAgICctJyArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTBdXSArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTFdXSArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTJdXSArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTNdXSArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTRdXSArXG4gICAgICAgIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMTVdXSkudG9Mb3dlckNhc2UoKTtcbn1cbmZ1bmN0aW9uIHN0cmluZ2lmeShhcnIsIG9mZnNldCA9IDApIHtcbiAgICBjb25zdCB1dWlkID0gdW5zYWZlU3RyaW5naWZ5KGFyciwgb2Zmc2V0KTtcbiAgICBpZiAoIXZhbGlkYXRlKHV1aWQpKSB7XG4gICAgICAgIHRocm93IFR5cGVFcnJvcignU3RyaW5naWZpZWQgVVVJRCBpcyBpbnZhbGlkJyk7XG4gICAgfVxuICAgIHJldHVybiB1dWlkO1xufVxuZXhwb3J0IGRlZmF1bHQgc3RyaW5naWZ5O1xuIiwiaW1wb3J0IG5hdGl2ZSBmcm9tICcuL25hdGl2ZS5qcyc7XG5pbXBvcnQgcm5nIGZyb20gJy4vcm5nLmpzJztcbmltcG9ydCB7IHVuc2FmZVN0cmluZ2lmeSB9IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcbmZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gICAgaWYgKG5hdGl2ZS5yYW5kb21VVUlEICYmICFidWYgJiYgIW9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIG5hdGl2ZS5yYW5kb21VVUlEKCk7XG4gICAgfVxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGNvbnN0IHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpO1xuICAgIHJuZHNbNl0gPSAocm5kc1s2XSAmIDB4MGYpIHwgMHg0MDtcbiAgICBybmRzWzhdID0gKHJuZHNbOF0gJiAweDNmKSB8IDB4ODA7XG4gICAgaWYgKGJ1Zikge1xuICAgICAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgKytpKSB7XG4gICAgICAgICAgICBidWZbb2Zmc2V0ICsgaV0gPSBybmRzW2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBidWY7XG4gICAgfVxuICAgIHJldHVybiB1bnNhZmVTdHJpbmdpZnkocm5kcyk7XG59XG5leHBvcnQgZGVmYXVsdCB2NDtcbiIsImltcG9ydCBSRUdFWCBmcm9tICcuL3JlZ2V4LmpzJztcbmZ1bmN0aW9uIHZhbGlkYXRlKHV1aWQpIHtcbiAgICByZXR1cm4gdHlwZW9mIHV1aWQgPT09ICdzdHJpbmcnICYmIFJFR0VYLnRlc3QodXVpZCk7XG59XG5leHBvcnQgZGVmYXVsdCB2YWxpZGF0ZTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyByb3VuZEZsb2F0IH0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBzZXR1cENvbmZpZyB9IGZyb20gJy4vY29uZmlnLmpzJztcbmltcG9ydCB7IGluaXRDb250cm9scyB9IGZyb20gJy4vY29udHJvbHMvY29udHJvbHMuanMnO1xuaW1wb3J0IEFuaW1hdGlvbkV4ZWN1dG9yIGZyb20gJy4vYW5pbWF0aW9uL2V4ZWN1dG9yLmpzJztcbmltcG9ydCBBbmltYXRpb25TdG9yYWdlIGZyb20gJy4vYW5pbWF0aW9uL3N0b3JhZ2UuanMnO1xuaW1wb3J0IHsgZ2VuZXJhdGVDc3NEeW5hbWljLCBnZW5lcmF0ZUNzc1N0YXRpYyB9IGZyb20gJy4vY3NzL2Nzcy5qcyc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdXJmYWNlIHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50Q29udGFpbmVyLCBlbGVtZW50TWFwLCBjb25maWcgPSB7fSkge1xuICAgICAgICB0aGlzLnV1aWQgPSB1dWlkdjQoKTtcbiAgICAgICAgdGhpcy52aWV3cG9ydCA9IHsgeDogMCwgeTogMCB9O1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0geyB4OiAwLCB5OiAwIH07XG4gICAgICAgIHRoaXMub2Zmc2V0ID0geyB4OiAwLCB5OiAwIH07XG4gICAgICAgIHRoaXMuc2tldyA9IHsgeDogMCwgeTogMCB9O1xuICAgICAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kcmFnSWQgPSAnJztcbiAgICAgICAgdGhpcy5DT05GSUcgPSBzZXR1cENvbmZpZyhjb25maWcpO1xuICAgICAgICB0aGlzLmVsZW1lbnRzID0gdGhpcy5zZXR1cEVsZW1lbnRzKGVsZW1lbnRDb250YWluZXIsIGVsZW1lbnRNYXApO1xuICAgICAgICB0aGlzLnN0eWxlcyA9IHRoaXMuc2V0dXBTdHlsZXMoKTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25TdG9yYWdlID0gbmV3IEFuaW1hdGlvblN0b3JhZ2UodGhpcyk7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRXhlY3V0b3IgPSBuZXcgQW5pbWF0aW9uRXhlY3V0b3IodGhpcywgdGhpcy5hbmltYXRpb25TdG9yYWdlKTtcbiAgICAgICAgaW5pdENvbnRyb2xzKHRoaXMpO1xuICAgICAgICB0aGlzLnVwZGF0ZVZpZXdwb3J0KCk7XG4gICAgICAgIG5ldyBSZXNpemVPYnNlcnZlcigoKSA9PiB7IHRoaXMudXBkYXRlVmlld3BvcnQoKTsgdGhpcy51cGRhdGVDc3NEeW5hbWljKCk7IH0pLm9ic2VydmUodGhpcy5lbGVtZW50cy5jb250YWluZXIpO1xuICAgICAgICBuZXcgUmVzaXplT2JzZXJ2ZXIoKCkgPT4geyB0aGlzLnVwZGF0ZUNzc0R5bmFtaWMoKTsgfSkub2JzZXJ2ZSh0aGlzLmVsZW1lbnRzLnN1cmZhY2UpO1xuICAgICAgICB0aGlzLnNjYWxlID0gdGhpcy5DT05GSUcuU0NBTEVfREVGQVVMVC5WQUxVRTtcbiAgICAgICAgdGhpcy5pbml0U2NhbGUoKTtcbiAgICB9XG4gICAgc2V0dXBFbGVtZW50cyhlbGVtZW50Q29udGFpbmVyLCBlbGVtZW50TWFwKSB7XG4gICAgICAgIGVsZW1lbnRDb250YWluZXIuY2xhc3NMaXN0LmFkZCgndGlsdGVkLWNvbnRhaW5lci0nICsgdGhpcy51dWlkKTtcbiAgICAgICAgbGV0IGVsZW1lbnRWaWV3cG9ydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbGVtZW50Vmlld3BvcnQuY2xhc3NMaXN0LmFkZCgndGlsdGVkLXZpZXdwb3J0LScgKyB0aGlzLnV1aWQpO1xuICAgICAgICBsZXQgZWxlbWVudFNjYWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsZW1lbnRTY2FsZS5jbGFzc0xpc3QuYWRkKCd0aWx0ZWQtc2NhbGUtJyArIHRoaXMudXVpZCk7XG4gICAgICAgIGxldCBlbGVtZW50UG9zaXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWxlbWVudFBvc2l0aW9uLmNsYXNzTGlzdC5hZGQoJ3RpbHRlZC1wb3NpdGlvbi0nICsgdGhpcy51dWlkKTtcbiAgICAgICAgZWxlbWVudE1hcC5jbGFzc0xpc3QuYWRkKCd0aWx0ZWQtc3VyZmFjZS0nICsgdGhpcy51dWlkKTtcbiAgICAgICAgbGV0IGVsZW1lbnRDb250cm9scyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbGVtZW50Q29udHJvbHMuY2xhc3NMaXN0LmFkZCgndGlsdGVkLWNvbnRyb2xzLScgKyB0aGlzLnV1aWQpO1xuICAgICAgICBsZXQgZWxlbWVudENvbnRyb2xzWm9vbUluID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsZW1lbnRDb250cm9sc1pvb21Jbi5jbGFzc0xpc3QuYWRkKCd0aWx0ZWQtY29udHJvbHMtem9vbS1pbi0nICsgdGhpcy51dWlkKTtcbiAgICAgICAgbGV0IGVsZW1lbnRDb250cm9sc1pvb21PdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWxlbWVudENvbnRyb2xzWm9vbU91dC5jbGFzc0xpc3QuYWRkKCd0aWx0ZWQtY29udHJvbHMtem9vbS1vdXQtJyArIHRoaXMudXVpZCk7XG4gICAgICAgIGVsZW1lbnRDb250cm9scy5hcHBlbmRDaGlsZChlbGVtZW50Q29udHJvbHNab29tSW4pO1xuICAgICAgICBlbGVtZW50Q29udHJvbHMuYXBwZW5kQ2hpbGQoZWxlbWVudENvbnRyb2xzWm9vbU91dCk7XG4gICAgICAgIGVsZW1lbnRQb3NpdGlvbi5hcHBlbmRDaGlsZChlbGVtZW50TWFwKTtcbiAgICAgICAgZWxlbWVudFNjYWxlLmFwcGVuZENoaWxkKGVsZW1lbnRQb3NpdGlvbik7XG4gICAgICAgIGVsZW1lbnRWaWV3cG9ydC5hcHBlbmRDaGlsZChlbGVtZW50U2NhbGUpO1xuICAgICAgICBlbGVtZW50Q29udGFpbmVyLmFwcGVuZENoaWxkKGVsZW1lbnRWaWV3cG9ydCk7XG4gICAgICAgIGVsZW1lbnRDb250YWluZXIuYXBwZW5kQ2hpbGQoZWxlbWVudENvbnRyb2xzKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbnRhaW5lcjogZWxlbWVudENvbnRhaW5lcixcbiAgICAgICAgICAgIGNvbnRyb2xzOiBlbGVtZW50Q29udHJvbHMsXG4gICAgICAgICAgICBjb250cm9sc1pvb21JbjogZWxlbWVudENvbnRyb2xzWm9vbUluLFxuICAgICAgICAgICAgY29udHJvbHNab29tT3V0OiBlbGVtZW50Q29udHJvbHNab29tT3V0LFxuICAgICAgICAgICAgdmlld3BvcnQ6IGVsZW1lbnRWaWV3cG9ydCxcbiAgICAgICAgICAgIHNjYWxlOiBlbGVtZW50U2NhbGUsXG4gICAgICAgICAgICBwb3NpdGlvbjogZWxlbWVudFBvc2l0aW9uLFxuICAgICAgICAgICAgc3VyZmFjZTogZWxlbWVudE1hcFxuICAgICAgICB9O1xuICAgIH1cbiAgICBzZXR1cFN0eWxlcygpIHtcbiAgICAgICAgbGV0IGVsZW1lbnRTdHlsZVN0YXRpYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIGVsZW1lbnRTdHlsZVN0YXRpYy5jbGFzc0xpc3QuYWRkKCd0aWx0ZWQtY3NzLXN0YXRpYy0nICsgdGhpcy51dWlkKTtcbiAgICAgICAgZWxlbWVudFN0eWxlU3RhdGljLmlubmVySFRNTCA9IGdlbmVyYXRlQ3NzU3RhdGljKHRoaXMpO1xuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGVsZW1lbnRTdHlsZVN0YXRpYyk7XG4gICAgICAgIGxldCBlbGVtZW50U3R5bGVEeW5hbWljID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgZWxlbWVudFN0eWxlRHluYW1pYy5jbGFzc0xpc3QuYWRkKCd0aWx0ZWQtY3NzLWR5bmFtaWMtJyArIHRoaXMudXVpZCk7XG4gICAgICAgIGVsZW1lbnRTdHlsZUR5bmFtaWMuaW5uZXJIVE1MID0gZ2VuZXJhdGVDc3NEeW5hbWljKHRoaXMpO1xuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGVsZW1lbnRTdHlsZUR5bmFtaWMpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdGljOiBlbGVtZW50U3R5bGVTdGF0aWMsXG4gICAgICAgICAgICBkeW5hbWljOiBlbGVtZW50U3R5bGVEeW5hbWljXG4gICAgICAgIH07XG4gICAgfVxuICAgIHVwZGF0ZUNzc0R5bmFtaWMoKSB7XG4gICAgICAgIHRoaXMuc3R5bGVzLmR5bmFtaWMuaW5uZXJIVE1MID0gZ2VuZXJhdGVDc3NEeW5hbWljKHRoaXMpO1xuICAgIH1cbiAgICBnZXQgY29udGFpbmVyV2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnRzLmNvbnRhaW5lci5vZmZzZXRXaWR0aDtcbiAgICB9XG4gICAgZ2V0IGNvbnRhaW5lckhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudHMuY29udGFpbmVyLm9mZnNldEhlaWdodDtcbiAgICB9XG4gICAgZ2V0IHN1cmZhY2VXaWR0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudHMuc3VyZmFjZS5vZmZzZXRXaWR0aDtcbiAgICB9XG4gICAgZ2V0IHN1cmZhY2VIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnRzLnN1cmZhY2Uub2Zmc2V0SGVpZ2h0O1xuICAgIH1cbiAgICBnZXQgeCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24ueCArIHRoaXMub2Zmc2V0Lng7XG4gICAgfVxuICAgIGdldCB5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5vZmZzZXQueTtcbiAgICB9XG4gICAgZ2V0IGxpbWl0KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogTWF0aC5yb3VuZCh0aGlzLnN1cmZhY2VXaWR0aCAvIDIgLSB0aGlzLmNvbnRhaW5lcldpZHRoICogMC4yNSksXG4gICAgICAgICAgICB5OiBNYXRoLnJvdW5kKHRoaXMuc3VyZmFjZUhlaWdodCAvIDIgLSB0aGlzLmNvbnRhaW5lckhlaWdodCAqIDAuMjUpXG4gICAgICAgIH07XG4gICAgfVxuICAgIGdldCBtaW4oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB0aGlzLmxpbWl0LnggKiAtMSxcbiAgICAgICAgICAgIHk6IHRoaXMubGltaXQueSAqIC0xXG4gICAgICAgIH07XG4gICAgfVxuICAgIGdldCBtYXgoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB0aGlzLmxpbWl0LngsXG4gICAgICAgICAgICB5OiB0aGlzLmxpbWl0LnlcbiAgICAgICAgfTtcbiAgICB9XG4gICAgbW92ZSh4LCB5LCByb3VuZCA9IDAsIGVuZFJvdW5kID0gMCkge1xuICAgICAgICB4ID0gcm91bmRGbG9hdCh4LCByb3VuZCk7XG4gICAgICAgIHkgPSByb3VuZEZsb2F0KHksIHJvdW5kKTtcbiAgICAgICAgaWYgKHggPT09IDAgJiYgeSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBvbGRQb3NpdGlvblggPSB0aGlzLnBvc2l0aW9uLng7XG4gICAgICAgIGxldCBvbGRQb3NpdGlvblkgPSB0aGlzLnBvc2l0aW9uLnk7XG4gICAgICAgIHRoaXMucG9zaXRpb24ueCA9IHJvdW5kRmxvYXQodGhpcy5wb3NpdGlvbi54ICsgeCwgZW5kUm91bmQpO1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgPSByb3VuZEZsb2F0KHRoaXMucG9zaXRpb24ueSArIHksIGVuZFJvdW5kKTtcbiAgICAgICAgaWYgKHRoaXMucG9zaXRpb24ueCA9PT0gb2xkUG9zaXRpb25YICYmIHRoaXMucG9zaXRpb24ueSA9PT0gb2xkUG9zaXRpb25ZKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMueCA8IHRoaXMubWluLngpIHtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCA9IHRoaXMubWluLnggLSB0aGlzLm9mZnNldC54O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMueCA+IHRoaXMubWF4LngpIHtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24ueCA9IHRoaXMubWF4LnggLSB0aGlzLm9mZnNldC54O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnkgPCB0aGlzLm1pbi55KSB7XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgPSB0aGlzLm1pbi55IC0gdGhpcy5vZmZzZXQueTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnkgPiB0aGlzLm1heC55KSB7XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnkgPSB0aGlzLm1heC55IC0gdGhpcy5vZmZzZXQueTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wb3NpdGlvbi54ID09PSBvbGRQb3NpdGlvblggJiYgdGhpcy5wb3NpdGlvbi55ID09PSBvbGRQb3NpdGlvblkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnRzLnBvc2l0aW9uLnN0eWxlLnRvcCA9ICh0aGlzLnBvc2l0aW9uLnkgKiAtMSkgKyAncHgnO1xuICAgICAgICB0aGlzLmVsZW1lbnRzLnBvc2l0aW9uLnN0eWxlLmxlZnQgPSAodGhpcy5wb3NpdGlvbi54ICogLTEpICsgJ3B4JztcbiAgICAgICAgdGhpcy5sb2coW1xuICAgICAgICAgICAgeyBkZXNjOiAncG9zaXRpb24ueCcsIGZyb206IG9sZFBvc2l0aW9uWCwgdG86IHRoaXMucG9zaXRpb24ueCB9LFxuICAgICAgICAgICAgeyBkZXNjOiAncG9zaXRpb24ueScsIGZyb206IG9sZFBvc2l0aW9uWSwgdG86IHRoaXMucG9zaXRpb24ueSB9XG4gICAgICAgIF0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgbW92ZVRvKHgsIHksIGVuZFJvdW5kID0gMCkge1xuICAgICAgICB4ID0gcm91bmRGbG9hdCh4LCBlbmRSb3VuZCk7XG4gICAgICAgIHkgPSByb3VuZEZsb2F0KHksIGVuZFJvdW5kKTtcbiAgICAgICAgaWYgKHRoaXMucG9zaXRpb24ueCA9PT0geCAmJiB0aGlzLnBvc2l0aW9uLnkgPT09IHkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5tb3ZlKHggLSB0aGlzLnBvc2l0aW9uLngsIHkgLSB0aGlzLnBvc2l0aW9uLnksIDAsIGVuZFJvdW5kKTtcbiAgICB9XG4gICAgZ2xpZGUoeCwgeSwgcm91bmQgPSAwLCBlbmRSb3VuZCA9IDApIHtcbiAgICAgICAgeCA9IHJvdW5kRmxvYXQoeCwgcm91bmQpO1xuICAgICAgICB5ID0gcm91bmRGbG9hdCh5LCByb3VuZCk7XG4gICAgICAgIGlmICh4ID09PSAwICYmIHkgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgb2xkT2Zmc2V0WCA9IHRoaXMub2Zmc2V0Lng7XG4gICAgICAgIGxldCBvbGRPZmZzZXRZID0gdGhpcy5vZmZzZXQueTtcbiAgICAgICAgdGhpcy5vZmZzZXQueCA9IHJvdW5kRmxvYXQodGhpcy5vZmZzZXQueCArIHgsIGVuZFJvdW5kKTtcbiAgICAgICAgdGhpcy5vZmZzZXQueSA9IHJvdW5kRmxvYXQodGhpcy5vZmZzZXQueSArIHksIGVuZFJvdW5kKTtcbiAgICAgICAgaWYgKHRoaXMub2Zmc2V0LnggPT09IG9sZE9mZnNldFggJiYgdGhpcy5vZmZzZXQueSA9PT0gb2xkT2Zmc2V0WSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnggPCB0aGlzLm1pbi54KSB7XG4gICAgICAgICAgICB0aGlzLm9mZnNldC54ID0gdGhpcy5taW4ueCAtIHRoaXMucG9zaXRpb24ueDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnggPiB0aGlzLm1heC54KSB7XG4gICAgICAgICAgICB0aGlzLm9mZnNldC54ID0gdGhpcy5tYXgueCAtIHRoaXMucG9zaXRpb24ueDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy55IDwgdGhpcy5taW4ueSkge1xuICAgICAgICAgICAgdGhpcy5vZmZzZXQueSA9IHRoaXMubWluLnkgLSB0aGlzLnBvc2l0aW9uLnk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy55ID4gdGhpcy5tYXgueSkge1xuICAgICAgICAgICAgdGhpcy5vZmZzZXQueSA9IHRoaXMubWF4LnkgLSB0aGlzLnBvc2l0aW9uLnk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub2Zmc2V0LnggPT09IG9sZE9mZnNldFggJiYgdGhpcy5vZmZzZXQueSA9PT0gb2xkT2Zmc2V0WSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudHMucG9zaXRpb24uc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZTNkKCcgKyAodGhpcy5vZmZzZXQueCAqIC0xKSArICdweCwgJyArICh0aGlzLm9mZnNldC55ICogLTEpICsgJ3B4LCAwKSc7XG4gICAgICAgIHRoaXMubG9nKFtcbiAgICAgICAgICAgIHsgZGVzYzogJ29mZnNldC54JywgZnJvbTogb2xkT2Zmc2V0WCwgdG86IHRoaXMub2Zmc2V0LnggfSxcbiAgICAgICAgICAgIHsgZGVzYzogJ29mZnNldC55JywgZnJvbTogb2xkT2Zmc2V0WSwgdG86IHRoaXMub2Zmc2V0LnkgfVxuICAgICAgICBdKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHVwZGF0ZVZpZXdwb3J0KCkge1xuICAgICAgICB0aGlzLnZpZXdwb3J0ID0ge1xuICAgICAgICAgICAgeDogMCAtIHRoaXMuc3VyZmFjZVdpZHRoIC8gMiArIHRoaXMuY29udGFpbmVyV2lkdGggLyAyLFxuICAgICAgICAgICAgeTogMCAtIHRoaXMuc3VyZmFjZUhlaWdodCAvIDIgKyB0aGlzLmNvbnRhaW5lckhlaWdodCAvIDJcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5lbGVtZW50cy52aWV3cG9ydC5zdHlsZS50b3AgPSB0aGlzLnZpZXdwb3J0LnkgKyAncHgnO1xuICAgICAgICB0aGlzLmVsZW1lbnRzLnZpZXdwb3J0LnN0eWxlLmxlZnQgPSB0aGlzLnZpZXdwb3J0LnggKyAncHgnO1xuICAgIH1cbiAgICB1cGRhdGVTa2V3KCkge1xuICAgICAgICBsZXQgcGVyY2VudE9mTWF4U2NhbGUgPSAodGhpcy5zY2FsZSAtIHRoaXMuQ09ORklHLlNDQUxFX01JTi5WQUxVRSkgLyAodGhpcy5DT05GSUcuU0NBTEVfTUFYLlZBTFVFIC0gdGhpcy5DT05GSUcuU0NBTEVfTUlOLlZBTFVFKTtcbiAgICAgICAgdGhpcy5za2V3ID0ge1xuICAgICAgICAgICAgeDogcm91bmRGbG9hdChwZXJjZW50T2ZNYXhTY2FsZSAqIHRoaXMuQ09ORklHLlNLRVdfWF9NQVguVkFMVUUsIDIpLFxuICAgICAgICAgICAgeTogMFxuICAgICAgICB9O1xuICAgIH1cbiAgICBpbml0U2NhbGUoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlU2tldygpO1xuICAgICAgICB0aGlzLmVsZW1lbnRzLnNjYWxlLmNsYXNzTGlzdC5hZGQoJ3RpbHRlZC1ub3RyYW5zaXRpb24tJyArIHRoaXMudXVpZCk7XG4gICAgICAgIHRoaXMuZWxlbWVudHMuc2NhbGUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKCcgKyB0aGlzLnNjYWxlICsgJykgcGVyc3BlY3RpdmUoJyArIHRoaXMuQ09ORklHLlBFUlNQRUNUSVZFX0RJU1RBTkNFLlZBTFVFICsgJ3B4KSByb3RhdGUzZCgxLCAwLCAwLCAnICsgdGhpcy5za2V3LnggKyAnZGVnKSc7XG4gICAgICAgIHRoaXMuZWxlbWVudHMuc2NhbGUub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB0aGlzLmVsZW1lbnRzLnNjYWxlLmNsYXNzTGlzdC5yZW1vdmUoJ3RpbHRlZC1ub3RyYW5zaXRpb24tJyArIHRoaXMudXVpZCk7XG4gICAgfVxuICAgIGNoYW5nZVNjYWxlKGNoYW5nZSkge1xuICAgICAgICBpZiAoY2hhbmdlID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG9sZFNjYWxlID0gdGhpcy5zY2FsZTtcbiAgICAgICAgdGhpcy5zY2FsZSA9IHJvdW5kRmxvYXQodGhpcy5zY2FsZSArIGNoYW5nZSwgdGhpcy5DT05GSUcuU0NBTEVfUk9VTkQuVkFMVUUpO1xuICAgICAgICB0aGlzLnNjYWxlID0gTWF0aC5tYXgodGhpcy5zY2FsZSwgdGhpcy5DT05GSUcuU0NBTEVfTUlOLlZBTFVFKTtcbiAgICAgICAgdGhpcy5zY2FsZSA9IE1hdGgubWluKHRoaXMuc2NhbGUsIHRoaXMuQ09ORklHLlNDQUxFX01BWC5WQUxVRSk7XG4gICAgICAgIGlmIChvbGRTY2FsZSA9PT0gdGhpcy5zY2FsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlU2tldygpO1xuICAgICAgICB0aGlzLmVsZW1lbnRzLnNjYWxlLnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgnICsgdGhpcy5zY2FsZSArICcpIHBlcnNwZWN0aXZlKCcgKyB0aGlzLkNPTkZJRy5QRVJTUEVDVElWRV9ESVNUQU5DRS5WQUxVRSArICdweCkgcm90YXRlM2QoMSwgMCwgMCwgJyArIHRoaXMuc2tldy54ICsgJ2RlZyknO1xuICAgICAgICB0aGlzLmxvZyhbXG4gICAgICAgICAgICB7IGRlc2M6ICdzY2FsZScsIGZyb206IG9sZFNjYWxlLCB0bzogdGhpcy5zY2FsZSB9XG4gICAgICAgIF0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgbG9nKGNoYW5nZXMgPSBmYWxzZSkge1xuICAgICAgICBpZiAodGhpcy5DT05GSUcuREVCVUdfTU9ERS5WQUxVRSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjaGFuZ2VzU3RyaW5nID0gJyc7XG4gICAgICAgIGlmIChjaGFuZ2VzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBjaGFuZ2Ugb2YgY2hhbmdlcykge1xuICAgICAgICAgICAgICAgIGNoYW5nZXNTdHJpbmcgKz0gY2hhbmdlLmRlc2MgKyAoY2hhbmdlLmZyb20gIT09IHVuZGVmaW5lZCA/ICcgZnJvbSAnICsgY2hhbmdlLmZyb20gOiAnJykgKyAoY2hhbmdlLnRvICE9PSB1bmRlZmluZWQgPyAnIHRvICcgKyBjaGFuZ2UudG8gOiAnJykgKyAnXFxuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhjaGFuZ2VzU3RyaW5nICtcbiAgICAgICAgICAgIGBwb3NpdGlvbiBYOiAke3RoaXMucG9zaXRpb24ueH1cXG5gICtcbiAgICAgICAgICAgIGBwb3NpdGlvbiBZOiAke3RoaXMucG9zaXRpb24ueX1cXG5gICtcbiAgICAgICAgICAgIGBvZmZzZXQgWDogJHt0aGlzLm9mZnNldC54fVxcbmAgK1xuICAgICAgICAgICAgYG9mZnNldCBZOiAke3RoaXMub2Zmc2V0Lnl9XFxuYCArXG4gICAgICAgICAgICBgbGltaXQueDogJHt0aGlzLmxpbWl0Lnh9XFxuYCArXG4gICAgICAgICAgICBgbGltaXQueTogJHt0aGlzLmxpbWl0Lnl9XFxuYCArXG4gICAgICAgICAgICBgc2NhbGU6ICR7dGhpcy5zY2FsZX1gKTtcbiAgICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=