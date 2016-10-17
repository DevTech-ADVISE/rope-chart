/**
 * Rope chart implementation.
 *
 * @class RopeChart
 * @param {String} selection - any valid d3 selector. This selector is used to place the chart.
 * @return {RopeChart}
 */

// d3 is an external, it won't be bundled in
var d3 = require('d3');
var dtip = require('d3-tip')(d3);
require('./ropeChart.scss');
require('./tooltips.scss');

var RopeChart = function (selection){
  var chart = {};
  // settings
  var svg,
      svgWidth         = 250,
      svgHeight        = 250,
      marginLeftPercentage = 50,
      knotRadius       = 20,
      chartGutter      = knotRadius,
      ropeWidth        = 10,
      fontSize         = 20,
      flipDirection    = false,
      labelMargin      = 5,
      showThreshold      = false,
      thresholdLabel     = "Average",
      ttOffset = [0, 0],
      showTooltip = true,
      handleTooltipExternally = false,
      tooltipLabel = "&#8505;",
      valueDisplayFormatter = function(d) { return Math.round(d); };

  // css class names
  var d3TipClass = "d3-tip-mouse",
    topRopeClass = "top-rope",
    bottomRopeClass = "bottom-rope",
    topKnotClass = "top-knot",
    bottomKnotClass = "bottom-knot",
    focusKnotClass = "focus-knot",
    thresholdKnotClass = "threshold-knot";

  var yScale, ropeX, max, min, thresholdValue, focusName, focus, data, multipleMaxes, multipleMins, nodes;

  var valueAccessor = function (d) { return Number(d.value); };
  var nameAccessor  = function (d) { return d.name; };
  var thresholdGenerator = function(chartData) { return d3.mean(chartData, chart.valueAccessor());};
  var tooltipContentFunc = function(d) {
    var tooltipContent = "<label>Name: </label>" + d.label;
    tooltipContent += "<br/><label>Value: " + valueDisplayFormatter(d.value);

    return tooltipContent;
  };

  /**
   * Render the RopeChart instance. Simply renders chart when called with no parameter. Updates data, then renders, if called with parameter
   * @method render
   * @memberof RopeChart
   * @instance
   * @param  {Object} [data]
   * @return {RopeChart} 
   */
  chart.render = function(_) {

    // initialize svg
    svg = d3.select(selection).html('').classed('Rope-Chart', true).append('svg');
    var ttId = d3.select(selection).attr('id') + '-tip';
    var tt = d3.tip()
      .attr("class", d3TipClass)
      .attr("id", ttId)
      .html(tooltipContentFunc)
      .offset(ttOffset)
      .positionAnchor("mouse");

    if (!!arguments.length)
      chart.data(_);

    // size the svg, and reset the center          
    svg.attr("width", function(){
      return svgWidth;
    });
    svg.attr("height",function(){
      return svgHeight;
    }); 

    // derive bar data
    var barX = ropeX - (ropeWidth/2);
    var bottomBar = {
      x: barX, 
      y: yScale(thresholdValue), 
      height: svgHeight - yScale(thresholdValue) - knotRadius, 
      width: ropeWidth, 
      className: (flipDirection) ? topRopeClass : bottomRopeClass
    };
    var topBar = {
      x: barX,
      y: knotRadius,
      height: yScale(thresholdValue) - knotRadius,
      width: ropeWidth,
      className: (flipDirection) ? bottomRopeClass : topRopeClass
    }
    var bars = [bottomBar, topBar];

    // render bar svg 
      // update
    var barSvg = svg.selectAll('rect')
        .data(bars)
        .attr('x', function(d){ return d.x; })
        .attr('y', function(d){ return d.y; })
        .attr('height', function(d){ return d.height; })
        .attr('width', function(d){ return d.width; })
        .attr('class', function(d){ return d.className; });
      // enter
    barSvg.enter().append('rect')
        .attr('x', function(d){ return d.x; })
        .attr('y', function(d){ return d.y; })
        .attr('height', function(d){ return d.height; })
        .attr('width', function(d){ return d.width; })
        .attr('class', function(d){ return d.className; });
      // exit
    barSvg.exit().remove();

    // render nodes svg 
      // update
    var circleSvg = svg.selectAll('circle')
        .data(nodes)
        .attr('cx', function(d){ return d.x; })
        .attr('cy', function(d){ return d.y; })
        .attr('r', function(d){ return d.r; })
        .attr('class', function(d){ return d.className; });
      // enter
    circleSvg.enter().append('circle')
        .attr('cx', function(d){ return d.x; })
        .attr('cy', function(d){ return d.y; })
        .attr('r', function(d){ return d.r; })
        .attr('class', function(d){ return d.className; });
      // exit
    circleSvg.exit().remove();
    
    // render value text
      // update
    var valueText = svg.selectAll('text.value')
        .data(nodes)
        .attr('text-anchor', function(d) { return 'end'; })
        .attr('x', function(d) { return d.x - (d.r + labelMargin); })
        .attr('y', function(d) { return d.y + d.adjustTextOverlap; })
        .attr('dy', function(d) { return '.3em'; })
        .attr('font-size', function(d) { return d.r * 2 + 'px'; })
        .text(function(d) { return valueDisplayFormatter(valueAccessor(d)); });
      // enter
    valueText.enter().append('text')
        .attr('class', function(d) { return d.className + '-value'; })
        .attr('text-anchor', function(d) { return 'end'; })
        .attr('x', function(d) { return d.x - (d.r + labelMargin); })
        .attr('y', function(d) { return d.y + d.adjustTextOverlap; })
        .attr('dy', function(d) { return '.3em'; })
        .attr('font-size', function(d) { return d.r * 2 + 'px'; })
        .text(function(d) { return valueDisplayFormatter(valueAccessor(d)); });
      // exit
    valueText.exit().remove();

    // render label text
      // update
    var labelText = svg.selectAll('text.label')
        .data(nodes)
        .attr('text-anchor', function(d) { return 'start'; })
        .attr('x', function(d) { return d.x + (d.r + labelMargin); })
        .attr('y', function(d) { return d.y + d.adjustTextOverlap; })
        .attr('dy', function(d) { return '.3em'; })
        .attr('font-size', function(d) { return d.r * 2 + 'px'; })
        .text(function(d) { return d.label; });
    
      // enter
    labelText.enter().append('text')
        .attr('class', function(d) { return d.className + '-label'; })
        .attr('text-anchor', function(d) { return 'start'; })
        .attr('x', function(d) { return d.x + (d.r + labelMargin); })
        .attr('y', function(d) { return d.y + d.adjustTextOverlap; })
        .attr('dy', function(d) { return '.3em'; })
        .attr('font-size', function(d) { return d.r * 2 + 'px'; })
        .text(function(d) { return d.label; })
      .filter(function(d) { return d.tooltipLabel !== undefined; })
        .append('tspan')
        .classed('tooltip-label', true)
        .style("cursor", "default")
        .html(function(d) { 
          return " " + tooltipLabel;
        });
      // exit
    labelText.exit().remove();

    if(!handleTooltipExternally) {
      // remove previous tooltip if there was one for this chart
      if (!d3.select('#' + tt.attr("id")).empty()) d3.select('#' + tt.attr("id")).remove(); 

      var tippables = svg.selectAll("tspan.tooltip-label");
      tippables.call(tt);
      tippables.on("mouseover", tt.show)
        .on("mouseout", tt.hide)
        .on("mousemove", tt.updatePosition);
    }


    return chart;
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
  chart.data = function(_) {
    if (!arguments.length){
      return data;
    }

    data   = _;
    max    = data.filter(function(d) { return chart.valueAccessor()(d) === d3.max(data, chart.valueAccessor()); })[0];
    min    = data.filter(function(d) { return chart.valueAccessor()(d) === d3.min(data, chart.valueAccessor()); })[0];
    thresholdValue = thresholdGenerator(data);
    multipleMaxes = chart.getMultipleMaxes();
    multipleMins = chart.getMultipleMins();

    yScale = d3.scale.linear()
      .domain([min.value, max.value])
      .range([svgHeight - chartGutter, chartGutter]);

    ropeX = chart.getRopeX();

    nodes = chart.generateNodes();

    return chart;
  };

  chart.getMultipleMaxes = function() {
    var maxes = data.filter( d => chart.valueAccessor()(d) === chart.valueAccessor()(max));
    if(maxes.length === 1) return false;
    return maxes;
  };

  chart.getMultipleMins = function() {
    var mins = data.filter( d => chart.valueAccessor()(d) === chart.valueAccessor()(min));
    if(mins.length === 1) return false;
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
  chart.yScale = function(_) {
    if(!arguments.length){
      return yScale;
    }
    yScale = _;

    return chart;
  }

  /**
   * Get/set the name/key used to access the "focus" item for the chart. The "focus" is the member of the data set that you want to compare to the rest of the group.
   * @method width
   * @memberof RopeChart
   * @instance
   * @param  {String} [recordName - should be the value of the name property for the record you want as your focus.]
   * @return {Object} [Acts as getter if called with no parameter. Returns a record from your data set.]
   * @return {RopeChart} [Acts as setter if called with parameter]
   */
  chart.focusName = function(_) {
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
  chart.width = function(_) {
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
  chart.height = function(_) {
    if (!arguments.length) {
      return svgHeight;
    }
    svgHeight = _;

    return chart;
  };  

  chart.getRopeX = function() {
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
  chart.marginLeftPercentage = function(_) {
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
  chart.knotRadius = function(_) {
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
  chart.ropeWidth = function(_) {
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
  chart.chartGutter = function(_) {
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
  chart.flipDirection = function(_) {
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
  chart.showThreshold = function(_) {
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
  chart.thresholdLabel = function(_) {
    if (!arguments.length) {
      return thresholdLabel;
    }
    thresholdLabel = _;
    return chart;
  };

  /**
   * Get/set the threshold generator function
   * @method thresholdGenerator
   * @memberof RopeChart
   * @instance
   * @param {Function} [function]
   * @return {Function} [Acts as getter if called with no parameter. Returns the threshold function that returns the value for the threshold knot.]
   * @return {RopeChart} [Acts as setter if called with parameter]
   */
  chart.thresholdGenerator = function(_) {
    if(!arguments.length) return thresholdGenerator;
    thresholdGenerator = _;

    return chart;
  } ;

  /**
   * Get/set the margin between labels and "knot" circles.
   * @method labelMargin
   * @memberof RopeChart
   * @instance
   * @param  {Integer} [labelMargin=5]
   * @return {Integer} [Acts as getter if called with no parameter]
   * @return {RopeChart} [Acts as setter if called with parameter]
   */
  chart.labelMargin = function(_) {
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
  chart.valueAccessor = function(_) {
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
  chart.nameAccessor = function(_) {
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
  chart.valueDisplayFormatter = function(_) {
    if(!arguments.length) return valueDisplayFormatter;
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
  chart.tooltipContent = function(_) {
    if(!arguments.length) return tooltipContentFunc;
    tooltipContentFunc = _;

    return chart;
  };

  /**
   * Set whether or not to show the tooltip. The tooltip gets displayed next to the threshold knot
   * @method showTooltip
   * @memberof RopeChart
   * @instance
   * @param  {boolean} [showTooltip]
   * @return {Function} [Acts as getter if called with no parameter]
   * @return {RopeChart} [Acts as setter if called with parameter]
   */
  chart.showTooltip = function(_) {
    if(!arguments.length) return showTooltip;
    showTooltip = _;

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
  chart.handleTooltipExternally = function(_) {
    if(!arguments.length) return handleTooltipExternally;
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
  chart.tooltipLabel = function(_) {
    if(!arguments.length) return tooltipLabel;
    tooltipLabel = _;

    return chart;
  };

  chart.generateNodes = function() {
    // derive node data & configure scale
    var topNode     = chart.generateNode(max, topKnotClass, 2, 'top');
    var bottomNode  = chart.generateNode(min, bottomKnotClass, 2, 'bottom');

    var nodes, adjustedNodes;

    focus = data.filter(function(d){ return chart.nameAccessor()(d) === chart.focusName();})[0];
    var focusNode   = chart.generateNode(focus, focusKnotClass, 1, 'focus');

    if (chart.showThreshold()) {
      var ttLabel = "";
      if(showTooltip) ttLabel = tooltipLabel;
      var thresholdNode = {x: ropeX, 
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

    if(flipDirection) {
      var topValue = adjustedNodes[0].value,
        topLabel = adjustedNodes[0].label,
        bottomValue = adjustedNodes[1].value,
        bottomLabel = adjustedNodes[1].label;

      adjustedNodes[0].value = bottomValue
      adjustedNodes[0].label = bottomLabel
      adjustedNodes[1].value = topValue
      adjustedNodes[1].label = topLabel
    }

    return adjustedNodes;
  }

  chart.generateNode = function(datum, className, labelOrderPriority, nodeName) {

    return {
      x: ropeX,
      y: yScale(chart.valueAccessor()(datum)),
      r: knotRadius,
      adjustTextOverlap: 0,
      className: className,
      value: chart.valueAccessor()(datum),
      name: chart.nameAccessor()(datum),
      label: chart.nameAccessor()(datum),
      labelOrderPriority: labelOrderPriority,
      nodeName: nodeName
    };
  };

  chart.adjustForOverlapAndMultiples = function(top, bottom, focus, threshold) {

    // if the focus is the max or min, show the max or min as the focus
    // if there are multiple maxes or mins show all of the maxes or mins
    var focusIsMax = false, focusIsMin = false;
    if(multipleMaxes) {
      if(focus.value === top.value) {
        focusIsMax = true;
        top.className = "max-focus-knot";
        top.label = focus.label + " and others";    
        focus = undefined;  
      }
      else {
        top.label = "Multiple: ";
        multipleMaxes.forEach( d => top.label += chart.nameAccessor()(d) + ", " );
        top.label = top.label.substring(0, top.label.length - 2);
      } 
    }
    // remove the focus knot if the focus is the only max, show the max as the focus
    else if(focus.value === top.value) {
      focusIsMax = true;
      focus = undefined;
      top.className = "max-focus-knot";
    }

    if(multipleMins) {
      if(focus && focus.value === bottom.value) {
        focusIsMin = true;
        bottom.className = "min-focus-knot";
        bottom.label = focus.label + " and others";
        focus = undefined;
      }
      else {
        bottom.label = "Multiple: ";
        multipleMins.forEach( d => bottom.label += chart.nameAccessor()(d) + ", " );
        bottom.label = bottom.label.substring(0, bottom.label.length - 2);
      }
    }
    // remove the focus knot if the focus is the only min, show the min as the focus
    else if(focus && focus.value === bottom.value) {
      focusIsMin = true;
      focus = undefined;
      bottom.className = "min-focus-knot";
    }

    // Node overlapping algorithm for top/threshold/focus, or bottom/threshold/focus overlap
    var multiNodeOverlap = false;
    if(chart.showThreshold() && !focusIsMax && !focusIsMin) {
      
      var topOverlapNodes = [top, threshold, focus];
      var bottomOverlapNodes = [bottom, threshold, focus];
      if(!nodesHaveMinimumSpace(topOverlapNodes)) {
        multiNodeOverlap = true;
        var stackedIndex = getStackedIndex(topOverlapNodes);
        var stackFromBottom = (flipDirection) ? true : false;
        threshold.adjustTextOverlap = stackedPositionFromOrientation(topOverlapNodes.length - stackedIndex.threshold - 1, threshold.y, stackFromBottom);
        focus.adjustTextOverlap = stackedPositionFromOrientation(topOverlapNodes.length - stackedIndex.focus - 1, focus.y, stackFromBottom);
      }
      else if(!nodesHaveMinimumSpace(bottomOverlapNodes)) {
        multiNodeOverlap = true;
        var stackedIndex = getStackedIndex(bottomOverlapNodes);
        var stackFromBottom = (flipDirection) ? false : true;
        threshold.adjustTextOverlap = stackedPositionFromOrientation(stackedIndex.threshold, threshold.y, stackFromBottom);
        focus.adjustTextOverlap = stackedPositionFromOrientation(stackedIndex.focus, focus.y, stackFromBottom);
      }
    }
    
    // Normal overlapping algorithm for top/focus, bottom/focus, threshold/focus, threshold/top(focus=top), threshold/bottom(focus=bottom)
    if(!multiNodeOverlap) {
      
      // fix focus knot overlap with top/bottom
      if(!focusIsMax && !focusIsMin) {
        var topFocusOverlap = chart.nodeIsOverlapping(focus, top);
        var bottomFocusOverlap = chart.nodeIsOverlapping(focus, bottom);
        // the focus is in overlap range of the top knot
        if(topFocusOverlap !== false) {
          focus.adjustTextOverlap = topFocusOverlap;
        }
        // the focus is in overlap range of the bottom knot
        else if(bottomFocusOverlap !== false) {
          focus.adjustTextOverlap = bottomFocusOverlap;
        }
        else if(threshold) {
          var thresholdOverlap = chart.nodeIsOverlapping(focus, threshold);

          if(threshold.value === focus.value) {
            threshold.adjustTextOverlap = thresholdOverlap / 2;
            focus.adjustTextOverlap = -thresholdOverlap / 2;
          }
          else {
            threshold.adjustTextOverlap = -(thresholdOverlap / 2);
            focus.adjustTextOverlap = thresholdOverlap /2;
          }
        }
      }
      // fix threshold knot overlap with top/bottom or focus knot
      else if(threshold) {

        if(focusIsMax) {
          var thresholdTopOverlap = chart.nodeIsOverlapping(threshold, top);
          threshold.adjustTextOverlap = thresholdTopOverlap;
        }
        else if(focusIsMin) {
          var thresholdBottomOverlap = chart.nodeIsOverlapping(threshold, bottom);
          threshold.adjustTextOverlap = thresholdBottomOverlap;
        }
        else {
          var thresholdOverlap = chart.nodeIsOverlapping(focus, threshold);

          if(threshold.value === focus.value) {
            threshold.adjustTextOverlap = thresholdOverlap / 2;
            focus.adjustTextOverlap = -thresholdOverlap / 2;
          }
          else {
            threshold.adjustTextOverlap = -(thresholdOverlap / 2);
            focus.adjustTextOverlap = thresholdOverlap /2;
          }
        }

      }
    }

    // put back together the adjusted nodes
    var adjustedNodes = [top, bottom];
    if(chart.showThreshold()) adjustedNodes.push(threshold);
    if(focus) adjustedNodes.push(focus);

    return adjustedNodes;
  };

  chart.nodeIsOverlapping = function(node, compareToNode) {
    // if the center of the knot is within 2 knot radii of the other knot center
    if(node.y <= (compareToNode.y + (2 * knotRadius)) && node.y >= (compareToNode.y - (2 * knotRadius))) {
      var nodeDistance = compareToNode.y - node.y;

      // node is greater than compareToNode
      if(nodeDistance < 0) return (2 * knotRadius) - Math.abs(nodeDistance);
      else if(nodeDistance > 0) return -((2 * knotRadius) - nodeDistance);
      else return 2 * knotRadius;
    }

    return false;
  };

  // if the distance between any two of the nodes is >= the minimum distance needed for no overlap, then the nodesHaveMinimumSpace
  function nodesHaveMinimumSpace(nodes) {
    var nodeLength = nodes.length;
    var inOverlapRange = true;
    var minimumSpace = (nodeLength - 1) * 2 * knotRadius;

    for(var i = 0; i < nodeLength; i ++) {
      var yPosition = nodes[i].y;
      for(var j = 0; j < nodeLength; j ++) {
        var compareYPosition = nodes[j].y;
        var yDistance = Math.abs(yPosition - compareYPosition);
        if(yDistance <= minimumSpace) continue;
        else {
          inOverlapRange = false;
          break;
        }
      }

      if(inOverlapRange === false) break;
    }

    return !inOverlapRange;
  }

  // Stack the nodes ascending by value, and higher priority first
  function getStackedIndex(nodes) {

    var sortedNodes = nodes.sort(function(a, b) {
      if(a.value > b.value) return 1;
      if(a.value < b.value) return -1;
      if(a.value === b.value) {
        if(a.labelOrderPriority > b.labelOrderPriority) return -1;
        if(a.labelOrderPriority < b.labelOrderPriority) return 1;
        return 0;
      }
    });

    var keyedNodes = {};
    sortedNodes.forEach(function(node, index) {
      keyedNodes[node.nodeName] = index;
    });

    return keyedNodes;
  }

  // Get the actual Y position to place the stacked text
  function stackedPositionFromOrientation(overlapIndex, nodePosition, bottom) {
    if(!bottom) {
      return 0 + (2 * knotRadius * overlapIndex) - nodePosition + chartGutter;
    }
    else {
      return svgHeight - (2 * knotRadius * overlapIndex) - nodePosition - chartGutter;
    }
  }

  return chart;
}

module.exports = RopeChart;