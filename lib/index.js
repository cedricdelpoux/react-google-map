(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["react-google-map"] = factory(require("react"));
	else
		root["react-google-map"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_7__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	__webpack_require__(1);

	var _iconMarkerSvg = __webpack_require__(5);

	var _iconMarkerSvg2 = _interopRequireDefault(_iconMarkerSvg);

	var _iconTrashSvg = __webpack_require__(6);

	var _iconTrashSvg2 = _interopRequireDefault(_iconTrashSvg);

	var _react = __webpack_require__(7);

	var _react2 = _interopRequireDefault(_react);

	var _reactGoogleMapsLoader = __webpack_require__(8);

	var _reactGoogleMapsLoader2 = _interopRequireDefault(_reactGoogleMapsLoader);

	var GoogleMap = (function (_Component) {
	  _inherits(GoogleMap, _Component);

	  function GoogleMap() {
	    _classCallCheck(this, _GoogleMap);

	    _Component.apply(this, arguments);

	    this.state = {
	      map: null,
	      markers: new Map()
	    };
	  }

	  GoogleMap.prototype.componentDidMount = function componentDidMount() {
	    var _this = this;

	    var _props = this.props;
	    var defaultLat = _props.defaultLat;
	    var defaultLng = _props.defaultLng;
	    var googleMaps = _props.googleMaps;
	    var zoom = _props.zoom;

	    var map = new googleMaps.Map(_react2['default'].findDOMNode(this.refs.map), {
	      zoom: zoom,
	      center: new googleMaps.LatLng(defaultLat, defaultLng),
	      panControl: false,
	      zoomControl: true,
	      mapTypeControl: false,
	      scaleControl: false,
	      streetViewControl: false,
	      overviewMapControl: false
	    });

	    this.setState({ map: map }, function () {
	      return _this.initMarkers();
	    });
	  };

	  GoogleMap.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	    var _this2 = this;

	    var newMarkers = nextProps.coordinates.some(function (coordinate) {
	      return !_this2.state.markers.has(_this2.getMarkerId(coordinate));
	    });
	    if (newMarkers) {
	      this.updateMarkers(nextProps.coordinates);
	    }
	  };

	  GoogleMap.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
	    return this.props.coordinates.length !== nextProps.coordinates.length;
	  };

	  GoogleMap.prototype.initMarkers = function initMarkers() {
	    this.addNewMarkers(this.props.coordinates);
	  };

	  GoogleMap.prototype.updateMarkers = function updateMarkers(coordinates) {
	    this.addNewMarkers(coordinates);

	    this.props.onChange(this.getNewCoordinates(), this.state.map.getZoom());
	  };

	  GoogleMap.prototype.addNewMarkers = function addNewMarkers(coordinates) {
	    var _this3 = this;

	    var markers = this.state.markers;

	    coordinates.forEach(function (coordinate, key) {
	      var markerId = _this3.getMarkerId(coordinate);
	      if (!markers.has(markerId)) {
	        markers.set(markerId, _this3.addMarker(markerId, coordinate));
	      }
	    });

	    this.setState({ markers: markers });
	  };

	  GoogleMap.prototype.getMarkerId = function getMarkerId(coordinate) {
	    return coordinate.latitude + '_' + coordinate.longitude;
	  };

	  GoogleMap.prototype.getNewCoordinates = function getNewCoordinates() {
	    return Array.from(this.state.markers.values()).map(function (marker) {
	      var position = marker.getPosition();
	      return {
	        description: marker.description,
	        latitude: position.lat(),
	        longitude: position.lng(),
	        title: marker.getTitle()
	      };
	    });
	  };

	  GoogleMap.prototype.addMarker = function addMarker(markerId, coordinate) {
	    var _this4 = this;

	    var googleMaps = this.props.googleMaps;
	    var map = this.state.map;

	    var marker = new googleMaps.Marker({
	      animation: googleMaps.Animation.DROP,
	      map: map,
	      position: new googleMaps.LatLng(coordinate.latitude, coordinate.longitude),
	      title: coordinate.title,
	      description: coordinate.description,
	      icon: _iconMarkerSvg2['default']
	    });

	    googleMaps.event.addListener(marker, 'mouseover', function () {
	      marker.setIcon(_iconTrashSvg2['default']);
	    });

	    googleMaps.event.addListener(marker, 'mouseout', function () {
	      marker.setIcon(_iconMarkerSvg2['default']);
	    });

	    googleMaps.event.addListener(marker, 'click', function () {
	      _this4.removeMarker(markerId);
	    });

	    return marker;
	  };

	  GoogleMap.prototype.removeMarker = function removeMarker(markerId) {
	    var onChange = this.props.onChange;
	    var _state = this.state;
	    var map = _state.map;
	    var markers = _state.markers;

	    var marker = markers.get(markerId);

	    marker.setMap(null);
	    markers['delete'](markerId);

	    onChange(this.getNewCoordinates(), map.getZoom());
	  };

	  GoogleMap.prototype.fitBounds = function fitBounds() {
	    var _props2 = this.props;
	    var boundsOffset = _props2.boundsOffset;
	    var googleMaps = _props2.googleMaps;
	    var _state2 = this.state;
	    var map = _state2.map;
	    var markers = _state2.markers;

	    if (!map || markers.size === 0) {
	      return;
	    }

	    var bounds = Array.from(markers.values()).reduce(function (bound, marker) {
	      return bound.extend(marker.getPosition());
	    }, new googleMaps.LatLngBounds());
	    var center = bounds.getCenter();

	    bounds.extend(new googleMaps.LatLng(center.lat() + boundsOffset, center.lng() + boundsOffset)).extend(new googleMaps.LatLng(center.lat() - boundsOffset, center.lng() - boundsOffset));
	    map.setCenter(center);

	    map.fitBounds(bounds);
	  };

	  GoogleMap.prototype.render = function render() {
	    this.fitBounds();
	    return _react2['default'].createElement('div', { ref: 'map', className: 'googleMap' });
	  };

	  _createClass(GoogleMap, null, [{
	    key: 'defaultProps',
	    value: {
	      boundsOffset: 0.002,
	      coordinates: [],
	      defaultLat: 43.604305,
	      defaultLng: 1.443999,
	      googleMaps: null,
	      onChange: function () {},
	      zoom: 8
	    },
	    enumerable: true
	  }]);

	  var _GoogleMap = GoogleMap;
	  GoogleMap = _reactGoogleMapsLoader2['default']({ libraries: 'places' })(GoogleMap) || GoogleMap;
	  return GoogleMap;
	})(_react.Component);

	exports['default'] = GoogleMap;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "iconMarker.svg"

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "iconTrash.svg"

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	!function(e,t){ true?module.exports=t(__webpack_require__(7)):"function"==typeof define&&define.amd?define(["react"],t):"object"==typeof exports?exports["react-google-maps-loader"]=t(require("react")):e["react-google-maps-loader"]=t(e.React)}(this,function(e){return function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={exports:{},id:o,loaded:!1};return e[o].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(e.__proto__=t)}t.__esModule=!0;var u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},i=n(2),c=o(i),s=n(1),l=o(s);t["default"]=function(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];return function(t){return function(n){function o(){r(this,o),n.apply(this,arguments),this.state={googleMaps:null}}return a(o,n),o.prototype.componentDidMount=function(){var t=this;if("undefined"==typeof window.google){window.googleMapsLoaded=function(){l["default"].done("google-maps-places")},e.callback="googleMapsLoaded";var n=Object.keys(e).reduce(function(t,n){return null!==e[n]&&void 0!==e[n]?t+=n+"="+e[n]+"&":t},"?").slice(0,-1);l["default"]("https://maps.googleapis.com/maps/api/js"+n),l["default"].ready("google-maps-places",function(){t.handleLoaded(google.maps)})}else this.handleLoaded(google.maps)},o.prototype.handleLoaded=function(e){this.setState({googleMaps:e})},o.prototype.render=function(){var e=this.state.googleMaps;return e?c["default"].createElement(t,u({googleMaps:e},this.props)):null},o}(i.Component)}},e.exports=t["default"]},function(e,t,n){var o,r;/*!
		  * $script.js JS loader & dependency manager
		  * https://github.com/ded/script.js
		  * (c) Dustin Diaz 2014 | License MIT
		  */
	!function(a,u){"undefined"!=typeof e&&e.exports?e.exports=u():(o=u,r="function"==typeof o?o.call(t,n,t,e):o,!(void 0!==r&&(e.exports=r)))}("$script",function(){function e(e,t){for(var n=0,o=e.length;o>n;++n)if(!t(e[n]))return c;return 1}function t(t,n){e(t,function(e){return!n(e)})}function n(a,u,i){function c(e){return e.call?e():p[e]}function l(){if(!--v){p[y]=1,h&&h();for(var n in g)e(n.split("|"),c)&&!t(g[n],c)&&(g[n]=[])}}a=a[s]?a:[a];var f=u&&u.call,h=f?u:i,y=f?a.join(""):u,v=a.length;return setTimeout(function(){t(a,function e(t,n){return null===t?l():(t=n||-1!==t.indexOf(".js")||/^https?:\/\//.test(t)||!r?t:r+t+".js",m[t]?(y&&(d[y]=1),2==m[t]?l():setTimeout(function(){e(t,!0)},0)):(m[t]=1,y&&(d[y]=1),void o(t,l)))})},0),n}function o(e,t){var n,o=u.createElement("script");o.onload=o.onerror=o[f]=function(){o[l]&&!/^c|loade/.test(o[l])||n||(o.onload=o[f]=null,n=1,m[e]=2,t())},o.async=1,o.src=a?e+(-1===e.indexOf("?")?"?":"&")+a:e,i.insertBefore(o,i.lastChild)}var r,a,u=document,i=u.getElementsByTagName("head")[0],c=!1,s="push",l="readyState",f="onreadystatechange",p={},d={},g={},m={};return n.get=o,n.order=function(e,t,o){!function r(a){a=e.shift(),e.length?n(a,r):n(a,t,o)}()},n.path=function(e){r=e},n.urlArgs=function(e){a=e},n.ready=function(o,r,a){o=o[s]?o:[o];var u=[];return!t(o,function(e){p[e]||u[s](e)})&&e(o,function(e){return p[e]})?r():!function(e){g[e]=g[e]||[],g[e][s](r),a&&a(u)}(o.join("|")),n},n.done=function(e){n([null],e)},n})},function(t,n){t.exports=e}])});

/***/ }
/******/ ])
});
;