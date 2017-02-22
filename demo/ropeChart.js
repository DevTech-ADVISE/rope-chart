(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3"));
	else if(typeof define === 'function' && define.amd)
		define(["d3"], factory);
	else if(typeof exports === 'object')
		exports["RopeChart"] = factory(require("d3"));
	else
		root["RopeChart"] = factory(root["d3"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Rope chart implementation.
	 *
	 * @class RopeChart
	 * @param {String} selection - any valid d3 selector. This selector is used to place the chart.
	 * @return {RopeChart}
	 */
	
	// d3 is an external, it won't be bundled in
	var d3 = __webpack_require__(1);
	var dtip = __webpack_require__(2)(d3);
	__webpack_require__(3);
	__webpack_require__(7);
	
	var RopeChart = function RopeChart(selection) {
	  var chart = {};
	  // settings
	  var svg,
	      svgWidth = 250,
	      svgHeight = 250,
	      marginLeftPercentage = 50,
	      knotRadius = 20,
	      chartGutter = knotRadius,
	      ropeWidth = 10,
	      fontSize = 20,
	      flipDirection = false,
	      labelMargin = 5,
	      showThreshold = false,
	      thresholdLabel = "Average",
	      ttOffset = [0, 0],
	      showTooltip = { threshold: false, top: false, bottom: false, focus: false },
	      tooltipOnlyForMultiple = { top: true, bottom: true },
	      tooltip = { threshold: undefined, top: undefined, bottom: undefined, focus: undefined },
	      handleTooltipExternally = false,
	      tooltipLabel = "&#8505;",
	      valueDisplayFormatter = function valueDisplayFormatter(d) {
	    return Math.round(d);
	  };
	
	  // css class names
	  var d3TipClass = "d3-tip-mouse",
	      topRopeClass = "top-rope",
	      bottomRopeClass = "bottom-rope",
	      topKnotClass = "top-knot",
	      bottomKnotClass = "bottom-knot",
	      focusKnotClass = "focus-knot",
	      thresholdKnotClass = "threshold-knot";
	
	  var yScale, ropeX, max, min, thresholdValue, focusName, focus, data, multipleMaxes, multipleMins, nodes;
	
	  var valueAccessor = function valueAccessor(d) {
	    return Number(d.value);
	  };
	  var nameAccessor = function nameAccessor(d) {
	    return d.name;
	  };
	  var thresholdGenerator = function thresholdGenerator(chartData) {
	    return d3.mean(chartData, chart.valueAccessor());
	  };
	  var defaultTooltipContentFunc = function defaultTooltipContentFunc(d) {
	    var tooltipContent = "";
	    if (d.multipleData) {
	      d.multipleData.forEach(function (datum) {
	        tooltipContent += "<label>Name: </label>" + chart.nameAccessor()(datum);
	        tooltipContent += "<br/><label>Value: " + chart.valueAccessor()(datum) + "<br/>";
	      });
	    } else {
	      tooltipContent = "<label>Name: </label>" + d.label;
	      tooltipContent += "<br/><label>Value: " + valueDisplayFormatter(d.value);
	    }
	
	    return tooltipContent;
	  };
	  var tooltipContent = {
	    threshold: defaultTooltipContentFunc,
	    top: defaultTooltipContentFunc,
	    bottom: defaultTooltipContentFunc,
	    focus: defaultTooltipContentFunc
	  };
	
	  chart.setupTooltip = function (key) {
	    var id = d3.select(selection).attr('id') + '-tip-' + key;
	    var tip = d3.tip().attr("class", d3TipClass).attr("id", id).html(tooltipContent[key]).offset(ttOffset).positionAnchor("mouse");
	    tip['key'] = key;
	
	    return tip;
	  };
	
	  /**
	   * Render the RopeChart instance. Simply renders chart when called with no parameter. Updates data, then renders, if called with parameter
	   * @method render
	   * @memberof RopeChart
	   * @instance
	   * @param  {Object} [data]
	   * @return {RopeChart} 
	   */
	  chart.render = function (_) {
	
	    // initialize svg
	    svg = d3.select(selection).html('').classed('Rope-Chart', true).append('svg');
	    for (var prop in showTooltip) {
	      if (showTooltip[prop]) tooltip[prop] = chart.setupTooltip(prop);
	    }
	
	    if (!!arguments.length) chart.data(_);
	
		// check data for 0s
 		max = d3.max(data, chart.valueAccessor());
	    if (max === 0){
		    svg.attr("width", function () {
		      return 200;
		    });
		    svg.attr("height", function () {
		      return 40;
		    });
	    	return svg.append("text").attr('x',5).attr('y',15).style({'font-size':'20px'}).text('Not enough data.');
	    }

	    // size the svg, and reset the center         
	    svg.attr("width", function () {
	      return svgWidth;
	    });
	    svg.attr("height", function () {
	      return svgHeight;
	    });
	
	    // derive bar data
	    var barX = ropeX - ropeWidth / 2;
	    var bottomBar = {
	      x: barX,
	      y: yScale(thresholdValue),
	      height: svgHeight - yScale(thresholdValue) - knotRadius,
	      width: ropeWidth,
	      className: flipDirection ? topRopeClass : bottomRopeClass
	    };
	    var topBar = {
	      x: barX,
	      y: knotRadius,
	      height: yScale(thresholdValue) - knotRadius,
	      width: ropeWidth,
	      className: flipDirection ? bottomRopeClass : topRopeClass
	    };
	    var bars = [bottomBar, topBar];
	
	    // render bar svg
	    // update
	    var barSvg = svg.selectAll('rect').data(bars).attr('x', function (d) {
	      return d.x;
	    }).attr('y', function (d) {
	      return d.y;
	    }).attr('height', function (d) {
	      return d.height;
	    }).attr('width', function (d) {
	      return d.width;
	    }).attr('class', function (d) {
	      return d.className;
	    });
	    // enter
	    barSvg.enter().append('rect').attr('x', function (d) {
	      return d.x;
	    }).attr('y', function (d) {
	      return d.y;
	    }).attr('height', function (d) {
	      return d.height;
	    }).attr('width', function (d) {
	      return d.width;
	    }).attr('class', function (d) {
	      return d.className;
	    });
	    // exit
	    barSvg.exit().remove();
	
	    // render nodes svg
	    // update
	    var circleSvg = svg.selectAll('circle').data(nodes).attr('cx', function (d) {
	      return d.x;
	    }).attr('cy', function (d) {
	      return d.y;
	    }).attr('r', function (d) {
	      return d.r;
	    }).attr('class', function (d) {
	      return d.className;
	    });
	    // enter
	    circleSvg.enter().append('circle').attr('cx', function (d) {
	      return d.x;
	    }).attr('cy', function (d) {
	      return d.y;
	    }).attr('r', function (d) {
	      return d.r;
	    }).attr('class', function (d) {
	      return d.className;
	    });
	    // exit
	    circleSvg.exit().remove();
	
	    // render value text
	    // update
	    var valueText = svg.selectAll('text.value').data(nodes).attr('text-anchor', function (d) {
	      return 'end';
	    }).attr('x', function (d) {
	      return d.x - (d.r + labelMargin);
	    }).attr('y', function (d) {
	      return d.y + d.adjustTextOverlap;
	    }).attr('dy', function (d) {
	      return '.3em';
	    }).attr('font-size', function (d) {
	      return d.r * 2 + 'px';
	    }).text(function (d) {
	      return valueDisplayFormatter(valueAccessor(d));
	    });
	    // enter
	    valueText.enter().append('text').attr('class', function (d) {
	      return d.className + '-value';
	    }).attr('text-anchor', function (d) {
	      return 'end';
	    }).attr('x', function (d) {
	      return d.x - (d.r + labelMargin);
	    }).attr('y', function (d) {
	      return d.y + d.adjustTextOverlap;
	    }).attr('dy', function (d) {
	      return '.3em';
	    }).attr('font-size', function (d) {
	      return d.r * 2 + 'px';
	    }).text(function (d) {
	      return valueDisplayFormatter(valueAccessor(d));
	    });
	    // exit
	    valueText.exit().remove();
	
	    // render label text
	    // update
	    var labelText = svg.selectAll('text.label').data(nodes).attr('text-anchor', function (d) {
	      return 'start';
	    }).attr('x', function (d) {
	      return d.x + (d.r + labelMargin);
	    }).attr('y', function (d) {
	      return d.y + d.adjustTextOverlap;
	    }).attr('dy', function (d) {
	      return '.3em';
	    }).attr('font-size', function (d) {
	      return d.r * 2 + 'px';
	    }).text(function (d) {
	      return d.label;
	    });
	
	    // enter
	    labelText.enter().append('text').attr('class', function (d) {
	      return d.className + '-label';
	    }).attr('text-anchor', function (d) {
	      return 'start';
	    }).attr('x', function (d) {
	      return d.x + (d.r + labelMargin);
	    }).attr('y', function (d) {
	      return d.y + d.adjustTextOverlap;
	    }).attr('dy', function (d) {
	      return '.3em';
	    }).attr('font-size', function (d) {
	      return d.r * 2 + 'px';
	    }).text(function (d) {
	      return d.label;
	    }).filter(function (d) {
	      return d.tooltipLabel !== undefined;
	    }).append('tspan').attr('class', function (d) {
	      return chart.tooltipLabelClass(d.nodeName);
	    }).style("cursor", "default").html(function (d) {
	      return " " + d.tooltipLabel;
	    });
	    // exit
	    labelText.exit().remove();
	
	    // Call the tooltips on their anchor element if the parent app isn't handling tooltips externally
	    if (!handleTooltipExternally) {
	      for (var prop in tooltip) {
	        var node = nodes.filter(function (node) {
	          return node.nodeName === prop;
	        })[0];
	        if (node && node.tooltipLabel && tooltip[prop]) chart.callTooltip(tooltip[prop]);
	      }
	    }
	
	    return chart;
	  };
	
	  chart.tooltipLabelClass = function (key) {
	    return 'tooltip-label-' + key;
	  };
	
	  chart.callTooltip = function (tooltip) {
	    // remove previous tooltip if there was one for this chart
	    if (!d3.select('#' + tooltip.attr("id")).empty()) d3.select('#' + tooltip.attr("id")).remove();
	
	    var tippables = svg.selectAll('.' + chart.tooltipLabelClass(tooltip.key));
	    tippables.call(tooltip);
	    tippables.on("mouseover", tooltip.show).on("mouseout", tooltip.hide).on("mousemove", tooltip.updatePosition);
	  };
	
	  /**
	   * Get/set the data for the RopeChart instance
	   * @method data
	   * @memberof RopeChart
	   * @instance
	   * @param  {Object} [data]
	   * @return {Object} [Acts as getter if called with no parameter]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.data = function (_) {
	    if (!arguments.length) {
	      return data;
	    }
	
	    data = _;
	    max = data.filter(function (d) {
	      return chart.valueAccessor()(d) === d3.max(data, chart.valueAccessor());
	    })[0];
	    min = data.filter(function (d) {
	      return chart.valueAccessor()(d) === d3.min(data, chart.valueAccessor());
	    })[0];
	    thresholdValue = thresholdGenerator(data);
	    multipleMaxes = chart.getMultipleMaxes();
	    multipleMins = chart.getMultipleMins();
	
	    yScale = d3.scale.linear().domain([min.value, max.value]).range([svgHeight - chartGutter, chartGutter]);
	
	    ropeX = chart.getRopeX();
	
	    nodes = chart.generateNodes();
	
	    return chart;
	  };
	
	  chart.getMultipleMaxes = function () {
	    var maxes = data.filter(function (d) {
	      return chart.valueAccessor()(d) === chart.valueAccessor()(max);
	    });
	    if (maxes.length === 1) return false;
	    return maxes;
	  };
	
	  chart.getMultipleMins = function () {
	    var mins = data.filter(function (d) {
	      return chart.valueAccessor()(d) === chart.valueAccessor()(min);
	    });
	    if (mins.length === 1) return false;
	    return mins;
	  };
	
	  /**
	   * Get/set the y-scale
	   * @method yScale
	   * @memberof RopeChart
	   * @instance
	   * @param {object} [d3 scale]
	   * @return {Object} [Acts as getter if called with no parameter. Returns the y-scale used to place knots on the rope.]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.yScale = function (_) {
	    if (!arguments.length) {
	      return yScale;
	    }
	    yScale = _;
	
	    return chart;
	  };
	
	  /**
	   * Get/set the name/key used to access the "focus" item for the chart. The "focus" is the member of the data set that you want to compare to the rest of the group.
	   * @method width
	   * @memberof RopeChart
	   * @instance
	   * @param  {String} [recordName - should be the value of the name property for the record you want as your focus.]
	   * @return {Object} [Acts as getter if called with no parameter. Returns a record from your data set.]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.focusName = function (_) {
	    if (!arguments.length) {
	      return focusName;
	    }
	    focusName = _;
	    return chart;
	  };
	
	  /**
	   * Get/set the width of the chart SVG
	   * @method width
	   * @memberof RopeChart
	   * @instance
	   * @param  {Integer} [width=500]
	   * @return {Integer} [Acts as getter if called with no parameter]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.width = function (_) {
	    if (!arguments.length) {
	      return svgWidth;
	    }
	    svgWidth = _;
	    return chart;
	  };
	
	  /**
	   * Get/set the height of the chart SVG
	   * @method height
	   * @memberof RopeChart
	   * @instance
	   * @param  {Integer} [height=500]
	   * @return {Integer} [Acts as getter if called with no parameter]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.height = function (_) {
	    if (!arguments.length) {
	      return svgHeight;
	    }
	    svgHeight = _;
	
	    return chart;
	  };
	
	  chart.getRopeX = function () {
	    return svgWidth * (marginLeftPercentage / 100);
	  };
	
	  /**
	  * Get/set the position of the rope horizontally from the left
	  * @method marginLeftPercentage
	  * @memberof RopeChart
	  * @instance
	  * @param  {Integer} [percentage=50]
	  * @return {Integer} [Acts as getter if called with no parameter]
	  * @return {RopeChart} [Acts as setter if called with parameter]
	  */
	  chart.marginLeftPercentage = function (_) {
	    if (!arguments.length) {
	      return marginLeftPercentage;
	    }
	    marginLeftPercentage = _;
	
	    return chart;
	  };
	
	  /**
	   * Get/set the radius of "knot" circles at max, min, and focus value positions.
	   * @method knotRadius
	   * @memberof RopeChart
	   * @instance
	   * @param  {Integer} [knotRadius=20]
	   * @return {Integer} [Acts as getter if called with no parameter]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.knotRadius = function (_) {
	    if (!arguments.length) {
	      return knotRadius;
	    }
	    knotRadius = _;
	    chartGutter = knotRadius;
	
	    return chart;
	  };
	
	  /**
	   * Get/set the width of the "rope" rectangle.
	   * @method ropeWidth
	   * @memberof RopeChart
	   * @instance
	   * @param  {Integer} [ropeWidth=20]
	   * @return {Integer} [Acts as getter if called with no parameter]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.ropeWidth = function (_) {
	    if (!arguments.length) {
	      return ropeWidth;
	    }
	    ropeWidth = _;
	    return chart;
	  };
	
	  /**
	   * Get/set the chart gutter to account for the knot radius
	   * @method chartGutter
	   * @memberof RopeChart
	   * @instance
	   * @param  {Integer} [chartGutter=knotRadius]
	   * @return {Integer} [Acts as getter if called with no parameter]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.chartGutter = function (_) {
	    if (!arguments.length) {
	      return chartGutter;
	    }
	    chartGutter = _;
	    return chart;
	  };
	
	  /**
	   * Get/set boolean that "flips direction" of the "good"/"bad" sides of threshold. By default the top section is "good" (green). If flipDirection is true, then top section becomes "bad" (red).
	   * @method flipDirection
	   * @memberof RopeChart
	   * @instance
	   * @param  {Boolean} [flipDirection=false]
	   * @return {Boolean} [Acts as getter if called with no parameter]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.flipDirection = function (_) {
	    if (!arguments.length) {
	      return flipDirection;
	    }
	    flipDirection = _;
	    return chart;
	  };
	
	  /**
	   * Get/set boolean that toggles display of a "knot" for the threshold.
	   * @method showThreshold
	   * @memberof RopeChart
	   * @instance
	   * @param  {Boolean} [showThreshold=false]
	   * @return {Boolean} [Acts as getter if called with no parameter]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.showThreshold = function (_) {
	    if (!arguments.length) {
	      return showThreshold;
	    }
	    showThreshold = _;
	    return chart;
	  };
	
	  /**
	   * Get/set label for threshold knot location.
	   * @method thresholdLabel
	   * @memberof RopeChart
	   * @instance
	   * @param  {String} [thresholdLabel="Average"]
	   * @return {String} [Acts as getter if called with no parameter]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.thresholdLabel = function (_) {
	    if (!arguments.length) {
	      return thresholdLabel;
	    }
	    thresholdLabel = _;
	    return chart;
	  };
	
	  /**
	   * Get/set the threshold generator function
	   * @method yScale
	   * @memberof RopeChart
	   * @instance
	   * @param {object} [d3 scale]
	   * @return {Object} [Acts as getter if called with no parameter. Returns the y-scale used to place knots on the rope.]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.thresholdGenerator = function (_) {
	    if (!arguments.length) return thresholdGenerator;
	    thresholdGenerator = _;
	
	    return chart;
	  };
	
	  /**
	   * Get/set the margin between labels and "knot" circles.
	   * @method labelMargin
	   * @memberof RopeChart
	   * @instance
	   * @param  {Integer} [labelMargin=5]
	   * @return {Integer} [Acts as getter if called with no parameter]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.labelMargin = function (_) {
	    if (!arguments.length) {
	      return labelMargin;
	    }
	    labelMargin = _;
	    return chart;
	  };
	
	  /**
	   * Get/set the function used to access "value" property from each data record. Defaults to: 
	   * ```
	   * function (d){ return d.value; }
	   * ```
	   * @method valueAccessor
	   * @memberof RopeChart
	   * @instance
	   * @param  {Function} [valueAccessorFunction]
	   * @return {Function} [Acts as getter if called with no parameter]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.valueAccessor = function (_) {
	    if (!arguments.length) {
	      return valueAccessor;
	    }
	    valueAccessor = _;
	    return chart;
	  };
	
	  /**
	   * Get/set the function used to access "name" property from each data record. Defaults to: 
	   * ```
	   * function (d){ return d.name; }
	   * ```
	   * @method nameAccessor
	   * @memberof RopeChart
	   * @instance
	   * @param  {Function} [nameAccessorFunction]
	   * @return {Function} [Acts as getter if called with no parameter]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.nameAccessor = function (_) {
	    if (!arguments.length) {
	      return nameAccessor;
	    }
	    nameAccessor = _;
	    return chart;
	  };
	
	  /**
	   * Get/set the function to format the display of data values shown next to the knots
	   * @method valueDisplayFormatter
	   * @memberof RopeChart
	   * @instance
	   * @param {Function} [valueFormatterFunction]
	   * @return {Function} [Acts as getter if called with no parameter]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.valueDisplayFormatter = function (_) {
	    if (!arguments.length) return valueDisplayFormatter;
	    valueDisplayFormatter = _;
	
	    return chart;
	  };
	
	  /**
	   * Get/set function used to set the tooltip of each data knot. Defaults to: 
	   * ```
	   *  var tooltipContentFunc = function(d) {
	   *    var tooltipContent = "<label>Name: </label>" + chart.nameAccessor()(d);
	   *    tooltipContent += "<br/><label>Value: " + chart.valueAccessor()(d);
	   *
	   *    return tooltipContent;
	   *  };
	   * ```
	   * @method tooltipContent
	   * @memberof RopeChart
	   * @instance
	   * @param  {Function} [tooltipContentFunction]
	   * @return {Function} [Acts as getter if called with no parameter]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.tooltipContent = function (_) {
	    if (!arguments.length) return tooltipContent;
	    Object.assign(tooltipContent, _);
	
	    return chart;
	  };
	
	  /**
	   * Set whether or not to show the tooltip. The tooltip gets displayed next to the threshold knot
	   * @method showTooltip
	   * @memberof RopeChart
	   * @instance
	   * @param  {Object} [showTooltip]
	   * @return {Function} [Acts as getter if called with no parameter]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.showTooltip = function (_) {
	    if (!arguments.length) return showTooltip;
	    Object.assign(showTooltip, _);
	
	    return chart;
	  };
	
	  /**
	   * Set which knots should show the tooltip only when that knot has multiple members. The default is that top and bottom only show the tooltip for multiples. 
	   * @method tooltipOnlyForMultiple
	   * @memberof RopeChart
	   * @instance
	   * @param  {Object} [tooltipOnlyForMultiple]
	   * @return {Function} [Acts as getter if called with no parameter]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.tooltipOnlyForMultiple = function (_) {
	    if (!arguments.length) return tooltipOnlyForMultiple;
	    Object.assign(tooltipOnlyForMultiple, _);
	
	    return chart;
	  };
	
	  /**
	   * Get/Set whether or not the tooltip generation will be handled outside the chart
	   * This can be useful if the standard d3-tip solution doesn't fit your needs
	   * @method handleTooltipExternally
	   * @memberof RopeChart
	   * @instance
	   * @param  {boolean} [handleTooltipExternally]
	   * @return {Function} [Acts as getter if called with no parameter]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.handleTooltipExternally = function (_) {
	    if (!arguments.length) return handleTooltipExternally;
	    handleTooltipExternally = _;
	
	    return chart;
	  };
	
	  /**
	   * Set the text, that when hovered over will display the tooltip. The text gets displayed next to the threshold knot. It accepts unicode codes, so you can include icons from something like font-awesome if you have the unicode. 
	   * @method tooltipLabel
	   * @memberof RopeChart
	   * @instance
	   * @param  {string} [tooltipLabel]
	   * @return {Function} [Acts as getter if called with no parameter]
	   * @return {RopeChart} [Acts as setter if called with parameter]
	   */
	  chart.tooltipLabel = function (_) {
	    if (!arguments.length) return tooltipLabel;
	    tooltipLabel = _;
	
	    return chart;
	  };
	
	  chart.generateNodes = function () {
	    // derive node data & configure scale
	    var topNode = chart.generateNode(max, topKnotClass, 2, 'top');
	    var bottomNode = chart.generateNode(min, bottomKnotClass, 2, 'bottom');
	
	    var nodes, adjustedNodes;
	
	    focus = data.filter(function (d) {
	      return chart.nameAccessor()(d) === chart.focusName();
	    })[0];
	    var focusNode = chart.generateNode(focus, focusKnotClass, 1, 'focus');
	
	    if (chart.showThreshold()) {
	      var ttLabel = undefined;
	      if (showTooltip.threshold) ttLabel = tooltipLabel;
	      var thresholdNode = { x: ropeX,
	        y: yScale(thresholdValue),
	        adjustTextOverlap: 0,
	        r: knotRadius,
	        className: thresholdKnotClass,
	        value: thresholdValue,
	        name: thresholdLabel,
	        label: thresholdLabel,
	        tooltipLabel: ttLabel,
	        labelOrderPriority: 0,
	        nodeName: 'threshold'
	      };
	      nodes = [topNode, bottomNode, thresholdNode, focusNode];
	      adjustedNodes = chart.adjustForOverlapAndMultiples(topNode, bottomNode, focusNode, thresholdNode);
	    } else {
	      nodes = [topNode, bottomNode, focusNode];
	      adjustedNodes = chart.adjustForOverlapAndMultiples(topNode, bottomNode, focusNode);
	    }
	
	    return adjustedNodes;
	  };
	
	  chart.generateNode = function (datum, className, labelOrderPriority, nodeName) {
	    var ttLabel = undefined;
	    if (showTooltip[nodeName]) ttLabel = tooltipLabel;
	
	    return {
	      x: ropeX,
	      y: yScale(chart.valueAccessor()(datum)),
	      r: knotRadius,
	      adjustTextOverlap: 0,
	      className: className,
	      value: chart.valueAccessor()(datum),
	      name: chart.nameAccessor()(datum),
	      label: chart.nameAccessor()(datum),
	      tooltipLabel: ttLabel,
	      labelOrderPriority: labelOrderPriority,
	      nodeName: nodeName
	    };
	  };
	
	  // All of the edge cases are taken care of in this function, refactor in the future if possible.
	  // This function handles what to do when knots overlap, and when knots contain multiple members
	  chart.adjustForOverlapAndMultiples = function (top, bottom, focus, threshold) {
	
	    // if the focus is the max or min, show the max or min as the focus
	    // if there are multiple maxes or mins show all of the maxes or mins
	    var focusIsMax = false,
	        focusIsMin = false;
	    if (multipleMaxes) {
	      top.multipleData = multipleMaxes; // For use in tooltip
	
	      if (focus.value === top.value) {
	        focusIsMax = true;
	
	        top.className = "max-focus-knot";
	        if (showTooltip.top || showTooltip.focus) {
	          top.label = "Multiple";
	          top.tooltipLabel = tooltipLabel;
	        } else top.label = focus.label + " and others";
	
	        // top.nodeName = focus.nodeName;
	        focus = undefined;
	      } else {
	        if (showTooltip.top && !flipDirection || showTooltip.bottom && flipDirection) {
	          top.label = "Multiple";
	        } else {
	          top.label = "Multiple: ";
	          multipleMaxes.forEach(function (d) {
	            return top.label += chart.nameAccessor()(d) + ", ";
	          });
	          top.label = top.label.substring(0, top.label.length - 2);
	        }
	      }
	    }
	    // remove the focus knot if the focus is the only max, show the max as the focus
	    else if (focus.value === top.value) {
	        focusIsMax = true;
	        top.className = "max-focus-knot";
	        top.tooltipLabel = focus.tooltipLabel;
	        // top.nodeName = focus.nodeName;
	        focus = undefined;
	      }
	
	    if (multipleMins) {
	      bottom.multipleData = multipleMins; // For use in tooltip
	
	      if (focus && focus.value === bottom.value) {
	        focusIsMin = true;
	        bottom.className = "min-focus-knot";
	
	        if (showTooltip.bottom || showTooltip.focus) {
	          bottom.label = "Multiple";
	          bottom.tooltipLabel = focus.tooltipLabel;
	        } else bottom.label = focus.label + " and others";
	
	        // bottom.nodeName = focus.nodeName;
	        focus = undefined;
	      } else {
	        if (showTooltip.bottom && !flipDirection || showTooltip.top && flipDirection) {
	          bottom.label = "Multiple";
	        } else {
	          bottom.label = "Multiple: ";
	          multipleMins.forEach(function (d) {
	            return bottom.label += chart.nameAccessor()(d) + ", ";
	          });
	          bottom.label = bottom.label.substring(0, bottom.label.length - 2);
	        }
	      }
	    }
	    // remove the focus knot if the focus is the only min, show the min as the focus
	    else if (focus && focus.value === bottom.value) {
	        focusIsMin = true;
	        bottom.className = "min-focus-knot";
	        bottom.tooltipLabel = focus.tooltipLabel;
	        // bottom.nodeName = focus.nodeName;
	        focus = undefined;
	      }
	
	    // Node overlapping algorithm for top/threshold/focus, or bottom/threshold/focus overlap
	    var multiNodeOverlap = false;
	    if (chart.showThreshold() && !focusIsMax && !focusIsMin) {
	
	      var topOverlapNodes = [top, threshold, focus];
	      var bottomOverlapNodes = [bottom, threshold, focus];
	      if (!nodesHaveMinimumSpace(topOverlapNodes)) {
	        multiNodeOverlap = true;
	        var stackedIndex = getStackedIndex(topOverlapNodes);
	        var stackFromBottom = flipDirection ? true : false;
	        threshold.adjustTextOverlap = stackedPositionFromOrientation(topOverlapNodes.length - stackedIndex.threshold - 1, threshold.y, stackFromBottom);
	        focus.adjustTextOverlap = stackedPositionFromOrientation(topOverlapNodes.length - stackedIndex.focus - 1, focus.y, stackFromBottom);
	      } else if (!nodesHaveMinimumSpace(bottomOverlapNodes)) {
	        multiNodeOverlap = true;
	        var stackedIndex = getStackedIndex(bottomOverlapNodes);
	        var stackFromBottom = flipDirection ? false : true;
	        threshold.adjustTextOverlap = stackedPositionFromOrientation(stackedIndex.threshold, threshold.y, stackFromBottom);
	        focus.adjustTextOverlap = stackedPositionFromOrientation(stackedIndex.focus, focus.y, stackFromBottom);
	      }
	    }
	
	    // Normal overlapping algorithm for top/focus, bottom/focus, threshold/focus, threshold/top(top=focus), threshold/bottom(bottom=focus)
	    if (!multiNodeOverlap) {
	
	      // Adjust focus knot overlap with top/bottom
	      if (!focusIsMax && !focusIsMin) {
	        var topFocusOverlap = chart.nodeIsOverlapping(focus, top);
	        var bottomFocusOverlap = chart.nodeIsOverlapping(focus, bottom);
	        // the focus is in overlap range of the top knot
	        if (topFocusOverlap !== false) {
	          focus.adjustTextOverlap = topFocusOverlap;
	        }
	        // the focus is in overlap range of the bottom knot
	        else if (bottomFocusOverlap !== false) {
	            focus.adjustTextOverlap = bottomFocusOverlap;
	          } else if (threshold) {
	            var thresholdOverlapWithFocus = chart.nodeIsOverlapping(focus, threshold);
	            var thresholdOverlapWithTop = chart.nodeIsOverlapping(threshold, top);
	            var thresholdOverlapWithBottom = chart.nodeIsOverlapping(threshold, bottom);
	
	            // Adjust threshold and focus in equal opposite directions if they are the same value
	            if (threshold.value === focus.value) {
	              threshold.adjustTextOverlap = thresholdOverlapWithFocus / 2;
	              focus.adjustTextOverlap = -thresholdOverlapWithFocus / 2;
	            }
	            // Adjust threshold if it overlaps with the focus
	            else if (thresholdOverlapWithFocus !== false) {
	                threshold.adjustTextOverlap = -(thresholdOverlapWithFocus / 2);
	                focus.adjustTextOverlap = thresholdOverlapWithFocus / 2;
	              } else if (thresholdOverlapWithTop !== false) {
	                threshold.adjustTextOverlap = thresholdOverlapWithTop;
	              } else if (thresholdOverlapWithBottom !== false) {
	                threshold.adjustTextOverlap = thresholdOverlapWithBottom;
	              }
	          }
	      }
	      // Adjust threshold knot overlap with top/bottom or focus knot
	      else if (threshold) {
	
	          if (focusIsMax) {
	            var thresholdTopOverlap = chart.nodeIsOverlapping(threshold, top);
	            threshold.adjustTextOverlap = thresholdTopOverlap;
	          } else if (focusIsMin) {
	            var thresholdBottomOverlap = chart.nodeIsOverlapping(threshold, bottom);
	            threshold.adjustTextOverlap = thresholdBottomOverlap;
	          } else {
	            var thresholdOverlap = chart.nodeIsOverlapping(focus, threshold);
	
	            if (threshold.value === focus.value) {
	              threshold.adjustTextOverlap = thresholdOverlap / 2;
	              focus.adjustTextOverlap = -thresholdOverlap / 2;
	            } else {
	              threshold.adjustTextOverlap = -(thresholdOverlap / 2);
	              focus.adjustTextOverlap = thresholdOverlap / 2;
	            }
	          }
	        }
	    }
	
	    // Flip direction of top and bottom knots
	    // !!! Note: still need to implement the flipping of the threshold and focus knot position and top/bottom ropes!!!
	    if (flipDirection) {
	
	      var topValue = top.value,
	          topLabel = top.label,
	          topMultipleData = top.multipleData,
	          bottomValue = bottom.value,
	          bottomLabel = bottom.label,
	          bottomMultipleData = bottom.multipleData;
	
	      top.value = bottomValue;
	      top.label = bottomLabel;
	      top.multipleData = bottomMultipleData;
	      bottom.value = topValue;
	      bottom.label = topLabel;
	      bottom.multipleData = topMultipleData;
	    }
	
	    // Only show tooltip on the top/bottom knot if it has multiple members
	    if (!top.multipleData && tooltipOnlyForMultiple.top) top.tooltipLabel = undefined;
	    if (!bottom.multipleData && tooltipOnlyForMultiple.bottom) bottom.tooltipLabel = undefined;
	
	    // put back together the adjusted nodes
	    var adjustedNodes = [top, bottom];
	    if (chart.showThreshold()) adjustedNodes.push(threshold);
	    if (focus) adjustedNodes.push(focus);
	
	    return adjustedNodes;
	  };
	
	  chart.nodeIsOverlapping = function (node, compareToNode) {
	    // if the center of the knot is within 2 knot radii of the other knot center
	    if (node.y <= compareToNode.y + 2 * knotRadius && node.y >= compareToNode.y - 2 * knotRadius) {
	      var nodeDistance = compareToNode.y - node.y;
	
	      // node is greater than compareToNode
	      if (nodeDistance < 0) return 2 * knotRadius - Math.abs(nodeDistance);else if (nodeDistance > 0) return -(2 * knotRadius - nodeDistance);else return 2 * knotRadius;
	    }
	
	    return false;
	  };
	
	  // if the distance between any two of the nodes is >= the minimum distance needed for no overlap, then the nodesHaveMinimumSpace
	  function nodesHaveMinimumSpace(nodes) {
	    var nodeLength = nodes.length;
	    var inOverlapRange = true;
	    var minimumSpace = (nodeLength - 1) * 2 * knotRadius;
	
	    for (var i = 0; i < nodeLength; i++) {
	      var yPosition = nodes[i].y;
	      for (var j = 0; j < nodeLength; j++) {
	        var compareYPosition = nodes[j].y;
	        var yDistance = Math.abs(yPosition - compareYPosition);
	        if (yDistance <= minimumSpace) continue;else {
	          inOverlapRange = false;
	          break;
	        }
	      }
	
	      if (inOverlapRange === false) break;
	    }
	
	    return !inOverlapRange;
	  }
	
	  // Stack the nodes ascending by value, and higher priority number first(for nodes that have the same value)
	  function getStackedIndex(nodes) {
	
	    var sortedNodes = nodes.sort(function (a, b) {
	      if (a.value > b.value) return 1;
	      if (a.value < b.value) return -1;
	      if (a.value === b.value) {
	        if (a.labelOrderPriority > b.labelOrderPriority) return -1;
	        if (a.labelOrderPriority < b.labelOrderPriority) return 1;
	        return 0;
	      }
	    });
	
	    var keyedNodes = {};
	    sortedNodes.forEach(function (node, index) {
	      keyedNodes[node.nodeName] = index;
	    });
	
	    return keyedNodes;
	  }
	
	  // Get the actual Y position to place the stacked text
	  function stackedPositionFromOrientation(overlapIndex, nodePosition, bottom) {
	    if (!bottom) {
	      // start + desiredFinalPosition - nodePosition + chartGutter => adjustedTextPosition
	      // Resulting in only the extra y to 'adjustTextPosition' from where the node will be positioned by its original y value
	      return 0 + 2 * knotRadius * overlapIndex - nodePosition + chartGutter;
	    } else {
	      return svgHeight - 2 * knotRadius * overlapIndex - nodePosition - chartGutter;
	    }
	  }
	
	  return chart;
	};
	
	module.exports = RopeChart;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// d3.tip
	// Copyright (c) 2013 Justin Palmer
	//
	// Tooltips for d3.js SVG visualizations
	
	(function (root, factory) {
	  if (true) {
	    // AMD. Register as an anonymous module with d3 as a dependency.
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  } else if (typeof module === 'object' && module.exports) {
	    // CommonJS
	    module.exports = function(d3) {
	      d3.tip = factory(d3)
	      return d3.tip
	    }
	  } else {
	    // Browser global.
	    factory(root.d3)
	  }
	}(this, function (d3) {
	
	  // Public - contructs a new tooltip
	  //
	  // Returns a tip
	  d3.tip = function() {
	    var direction = d3_tip_direction,
	        offset    = d3_tip_offset,
	        html      = d3_tip_html,
	        node      = initNode(),
	        svg       = null,
	        point     = null,
	        target    = null,
	        positionAnchor = d3_tip_positionAnchor;
	
	    function tip(vis) {
	      svg = getSVGNode(vis)
	      point = svg.createSVGPoint()
	      document.body.appendChild(node)
	    }
	
	    // Public - show the tooltip on the screen
	    //
	    // Returns a tip
	    tip.show = function() {
	      var args = Array.prototype.slice.call(arguments)
	      if(args[args.length - 1] instanceof SVGElement) target = args.pop()
	
	      var content = html.apply(this, args),
	          poffset = offset.apply(this, args),
	          dir     = direction.apply(this, args),
	          nodel   = d3.select(node),
	          i       = directions.length,
	          coords,
	          scrollTop  = document.documentElement.scrollTop || document.body.scrollTop,
	          scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
	
	      nodel.html(content)
	        .style({ opacity: 1, 'pointer-events': 'all', 'z-index': 100, display: 'block' })
	
	      while(i--) nodel.classed(directions[i], false)
	      coords = direction_callbacks.get(dir).apply(this)
	      var rightEdge =  coords.left + poffset[1] + scrollLeft + nodel.property('offsetWidth');
	      var bottomEdge = coords.top +  poffset[0] + scrollTop + nodel.property('offsetHeight');
	      var overFlowRight = tipOverFlowRight(rightEdge);
	      var overFlowBottom = tipOverFlowBottom(bottomEdge);
	      var leftEdge = coords.left + poffset[1] + scrollLeft;
	      var overFlowLeft = tipOverFlowLeft(leftEdge);
	      var topEdge = coords.top + poffset[0] + scrollTop;
	
	      if(overFlowRight) leftEdge -= overFlowRight;
	      if(overFlowLeft) leftEdge += overFlowLeft;
	      if(overFlowBottom) topEdge -= overFlowBottom;
	
	      if(positionAnchor() === 'shape') {
	        nodel.classed(dir, true).style({
	          top: topEdge + 'px',
	          left: leftEdge + 'px'
	        });
	      }
	      else if(positionAnchor() === 'mouse') {
	        nodel.classed(dir, true);
	        tip.updatePosition(poffset);
	      }
	      
	      return tip
	    }
	
	    // Public - hide the tooltip
	    //
	    // Returns a tip
	    tip.hide = function() {
	      var nodel = d3.select(node)
	      nodel.style({ opacity: 0, 'pointer-events': 'none', 'z-index': -1, display: 'none' })
	      return tip
	    }
	
	    //Public - update position of tooltip based on mouse
	    //
	    // Returns a tip
	    tip.updatePosition = function(v) {
	      var nodel = d3.select(node);
	      var mouseX = d3.mouse(d3.select("html").node())[0] + 10;
	      var mouseY = d3.mouse(d3.select("html").node())[1] + 20;
	      var rightEdge = mouseX + nodel.property('offsetWidth');
	      var bottomEdge = mouseY + nodel.property('offsetHeight');
	      var overFlowRight = tipOverFlowRight(rightEdge);
	      var overFlowLeft = tipOverFlowLeft(mouseX);
	      var overFlowBottom = tipOverFlowBottom(bottomEdge);
	
	      if(v.length) {
	        mouseX += v[0];
	        mouseY += v[1];
	      }
	      if(overFlowRight) mouseX -= overFlowRight;
	      if(overFlowLeft) mouseX += overFlowLeft;
	      if(overFlowBottom) mouseY -= overFlowBottom;
	
	      nodel.style({
	        top: mouseY + 'px',
	        left: mouseX + 'px'
	      });
	      return tip;
	    };
	
	    function tipOverFlowRight(rightEdge) {
	      var windowWidth = window.outerWidth;
	      if(rightEdge > windowWidth)
	        return rightEdge - windowWidth;
	      else
	        return false;
	    }
	
	    function tipOverFlowLeft(leftEdge) {
	      var windowWidth = window.outerWidth;
	      if(leftEdge < 0)
	        return -(leftEdge);
	      else
	        return false;
	    }
	
	    function tipOverFlowBottom(bottomEdge) {
	      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	      var windowHeight = window.innerHeight + scrollTop;
	      if(bottomEdge > windowHeight)
	        return bottomEdge - windowHeight;
	      else
	        return false;
	    }
	    // Public: Proxy attr calls to the d3 tip container.  Sets or gets attribute value.
	    //
	    // n - name of the attribute
	    // v - value of the attribute
	    //
	    // Returns tip or attribute value
	    tip.attr = function(n, v) {
	      if (arguments.length < 2 && typeof n === 'string') {
	        return d3.select(node).attr(n)
	      } else {
	        var args =  Array.prototype.slice.call(arguments)
	        d3.selection.prototype.attr.apply(d3.select(node), args)
	      }
	
	      return tip
	    }
	
	    // Public: Proxy style calls to the d3 tip container.  Sets or gets a style value.
	    //
	    // n - name of the property
	    // v - value of the property
	    //
	    // Returns tip or style property value
	    tip.style = function(n, v) {
	      if (arguments.length < 2 && typeof n === 'string') {
	        return d3.select(node).style(n)
	      } else {
	        var args =  Array.prototype.slice.call(arguments)
	        d3.selection.prototype.style.apply(d3.select(node), args)
	      }
	
	      return tip
	    }
	
	    // Public: Set or get the direction of the tooltip
	    //
	    // v - One of n(north), s(south), e(east), or w(west), nw(northwest),
	    //     sw(southwest), ne(northeast) or se(southeast)
	    //
	    // Returns tip or direction
	    tip.direction = function(v) {
	      if (!arguments.length) return direction
	      direction = v == null ? v : d3.functor(v)
	
	      return tip
	    }
	
	    // Public: Set or get the position anchor of the tool tip.
	    //
	    // v - either 'ordinal' - the default position that uses ordinal positioning
	    // or 'mouse' - to position the tool tip wherever the mouse goes on the selected node
	    //
	    // Returns tip or position
	    tip.positionAnchor = function(v) {
	      if (!arguments.length) return positionAnchor;
	      positionAnchor = v == null ? v : d3.functor(v);
	
	      return tip;
	    };
	
	    // Public: Sets or gets the offset of the tip
	    //
	    // v - Array of [x, y] offset
	    //
	    // Returns offset or
	    tip.offset = function(v) {
	      if (!arguments.length) return offset
	      offset = v == null ? v : d3.functor(v)
	
	      return tip
	    }
	
	    // Public: sets or gets the html value of the tooltip
	    //
	    // v - String value of the tip
	    //
	    // Returns html value or tip
	    tip.html = function(v) {
	      if (!arguments.length) return html
	      html = v == null ? v : d3.functor(v)
	
	      return tip
	    }
	
	    function d3_tip_direction() { return 'n' }
	    function d3_tip_offset() { return [0, 0] }
	    function d3_tip_html() { return ' ' }
	    function d3_tip_positionAnchor() { return 'shape';}
	
	    var direction_callbacks = d3.map({
	      n:  direction_n,
	      s:  direction_s,
	      e:  direction_e,
	      w:  direction_w,
	      nw: direction_nw,
	      ne: direction_ne,
	      sw: direction_sw,
	      se: direction_se
	    }),
	
	    directions = direction_callbacks.keys()
	
	    function direction_n() {
	      var bbox = getScreenBBox()
	      return {
	        top:  bbox.n.y - node.offsetHeight,
	        left: bbox.n.x - node.offsetWidth / 2
	      }
	    }
	
	    function direction_s() {
	      var bbox = getScreenBBox()
	      return {
	        top:  bbox.s.y,
	        left: bbox.s.x - node.offsetWidth / 2
	      }
	    }
	
	    function direction_e() {
	      var bbox = getScreenBBox()
	      return {
	        top:  bbox.e.y - node.offsetHeight / 2,
	        left: bbox.e.x
	      }
	    }
	
	    function direction_w() {
	      var bbox = getScreenBBox()
	      return {
	        top:  bbox.w.y - node.offsetHeight / 2,
	        left: bbox.w.x - node.offsetWidth
	      }
	    }
	
	    function direction_nw() {
	      var bbox = getScreenBBox()
	      return {
	        top:  bbox.nw.y - node.offsetHeight,
	        left: bbox.nw.x - node.offsetWidth
	      }
	    }
	
	    function direction_ne() {
	      var bbox = getScreenBBox()
	      return {
	        top:  bbox.ne.y - node.offsetHeight,
	        left: bbox.ne.x
	      }
	    }
	
	    function direction_sw() {
	      var bbox = getScreenBBox()
	      return {
	        top:  bbox.sw.y,
	        left: bbox.sw.x - node.offsetWidth
	      }
	    }
	
	    function direction_se() {
	      var bbox = getScreenBBox()
	      return {
	        top:  bbox.se.y,
	        left: bbox.e.x
	      }
	    }
	
	    function initNode() {
	      var node = d3.select(document.createElement('div'))
	      node.style({
	        position: 'absolute',
	        top: 0,
	        opacity: 0,
	        'pointer-events': 'none',
	        'box-sizing': 'border-box'
	      })
	
	      return node.node()
	    }
	
	    function getSVGNode(el) {
	      el = el.node()
	      if(el.tagName.toLowerCase() === 'svg')
	        return el
	
	      return el.ownerSVGElement
	    }
	
	    // Private - gets the screen coordinates of a shape
	    //
	    // Given a shape on the screen, will return an SVGPoint for the directions
	    // n(north), s(south), e(east), w(west), ne(northeast), se(southeast), nw(northwest),
	    // sw(southwest).
	    //
	    //    +-+-+
	    //    |   |
	    //    +   +
	    //    |   |
	    //    +-+-+
	    //
	    // Returns an Object {n, s, e, w, nw, sw, ne, se}
	    function getScreenBBox() {
	      var targetel   = target || d3.event.target;
	
	      while ('undefined' === typeof targetel.getScreenCTM && 'undefined' === targetel.parentNode) {
	          targetel = targetel.parentNode;
	      }
	
	      var bbox       = {},
	          matrix     = targetel.getScreenCTM(),
	          tbbox      = targetel.getBBox(),
	          width      = tbbox.width,
	          height     = tbbox.height,
	          x          = tbbox.x,
	          y          = tbbox.y
	
	      point.x = x
	      point.y = y
	      bbox.nw = point.matrixTransform(matrix)
	      point.x += width
	      bbox.ne = point.matrixTransform(matrix)
	      point.y += height
	      bbox.se = point.matrixTransform(matrix)
	      point.x -= width
	      bbox.sw = point.matrixTransform(matrix)
	      point.y -= height / 2
	      bbox.w  = point.matrixTransform(matrix)
	      point.x += width
	      bbox.e = point.matrixTransform(matrix)
	      point.x -= width / 2
	      point.y -= height / 2
	      bbox.n = point.matrixTransform(matrix)
	      point.y += height
	      bbox.s = point.matrixTransform(matrix)
	
	      return bbox
	    }
	
	    return tip
	  };
	  return d3.tip
	}));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./ropeChart.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./ropeChart.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports
	
	
	// module
	exports.push([module.id, ".Rope-Chart .top-knot {\n  fill: #7DD0D4; }\n\n.Rope-Chart .bottom-knot {\n  fill: #7DD0D4; }\n\n.Rope-Chart .focus-knot {\n  fill: #338ED8;\n  stroke: #C55353;\n  stroke-width: 2px; }\n\n.Rope-Chart .max-focus-knot {\n  fill: #338ED8;\n  stroke: #C55353;\n  stroke-width: 2px; }\n\n.Rope-Chart .min-focus-knot {\n  fill: #338ED8;\n  stroke: #C55353;\n  stroke-width: 2px; }\n\n.Rope-Chart .threshold-knot {\n  fill: #105B98; }\n\n.Rope-Chart .bottom-rope {\n  fill: #B1B1B1; }\n\n.Rope-Chart .top-rope {\n  fill: #E4E4E4; }\n\n.Rope-Chart tspan.tooltip-label-threshold, .Rope-Chart tspan.tooltip-label-top,\n.Rope-Chart tspan.tooltip-label-bottom, .Rope-Chart tspan.tooltip-label-focus {\n  fill: #6482a5; }\n  .Rope-Chart tspan.tooltip-label-threshold:hover, .Rope-Chart tspan.tooltip-label-top:hover,\n  .Rope-Chart tspan.tooltip-label-bottom:hover, .Rope-Chart tspan.tooltip-label-focus:hover {\n    fill: #30619a; }\n", ""]);
	
	// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(8);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./tooltips.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./tooltips.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports
	
	
	// module
	exports.push([module.id, ".d3-tip-mouse {\n  font-size: 13px;\n  line-height: 16px;\n  padding: 8px;\n  background: rgba(0, 0, 0, 0.8);\n  color: #fff;\n  border-radius: 2px;\n  pointer-events: none;\n  z-index: 100;\n  outline: none; }\n  .d3-tip-mouse label {\n    font-family: 'Abel', Helvetica, Arial, sans-serif;\n    font-weight: 400;\n    font-size: 13px;\n    line-height: 16px;\n    color: #fff;\n    display: inline; }\n\n.d3-tip {\n  font-size: 13px;\n  line-height: 16px;\n  padding: 8px;\n  background: rgba(0, 0, 0, 0.8);\n  color: #fff;\n  border-radius: 2px;\n  pointer-events: none;\n  z-index: 100;\n  outline: none;\n  /* Creates a small triangle extender for the tooltip */\n  /* Northward tooltips */\n  /* Eastward tooltips */\n  /* Southward tooltips */\n  /* Westward tooltips */ }\n  .d3-tip label {\n    font-family: 'Abel', Helvetica, Arial, sans-serif;\n    font-weight: 400; }\n  .d3-tip:after {\n    box-sizing: border-box;\n    display: inline;\n    font-size: 10px;\n    width: 100%;\n    line-height: 1;\n    color: rgba(0, 0, 0, 0.8);\n    position: absolute;\n    pointer-events: none;\n    z-index: 100; }\n  .d3-tip.n:after {\n    content: \"\\25BC\";\n    top: auto;\n    bottom: -7px;\n    left: 0;\n    text-align: center; }\n  .d3-tip.ne:after {\n    content: \"\\25BC\";\n    top: auto;\n    bottom: -7px;\n    left: 0;\n    text-align: left;\n    padding-left: 8px; }\n  .d3-tip.nw:after {\n    content: \"\\25BC\";\n    top: auto;\n    bottom: -7px;\n    left: 0;\n    text-align: right;\n    padding-right: 8px; }\n  .d3-tip.e:after {\n    content: \"\\25C0\";\n    margin: -4px 0 0 0;\n    top: 50%;\n    left: -7px; }\n  .d3-tip.s:after {\n    content: \"\\25B2\";\n    margin: 0 0 1px 0;\n    top: -8px;\n    left: 0;\n    text-align: center; }\n  .d3-tip.w:after {\n    content: \"\\25B6\";\n    margin: -4px 0 0 -2px;\n    top: 50%;\n    left: 100%; }\n", ""]);
	
	// exports


/***/ }
/******/ ])
});
;
//# sourceMappingURL=ropeChart.js.map