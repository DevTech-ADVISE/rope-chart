/**
 * Rope chart implementation.
 *
 * @class RopeChart
 * @param {String} selection - any valid d3 selector. This selector is used to place the chart.
 * @return {RopeChart}
 */

// d3 is an external, it won't be bundled in
var d3 = require('d3');
require('./ropeChart.scss');

var RopeChart = function (selection){
  var chart = {};
  // settings
  var svgWidth         = 250,
      svgHeight        = 250,
      marginLeftPercentage = 50,
      knotRadius       = 20,
      chartGutter      = knotRadius,
      ropeWidth        = 10,
      fontSize         = 20,
      flipDirection    = false,
      labelMargin      = 5,
      showAverage      = false,
      averageLabel     = "Average";

  var yScale, ropeX, max, min, avg, focusName, focus, data;

  var valueAccessor = function (d) { return d.value; };
  var nameAccessor  = function (d) { return d.name; };
  
  var svg = d3.select(selection)
    .classed('Rope-Chart', true)
    .append('svg');

  /**
   * Render the RopeChart instance. Simply renders chart when called with no parameter. Updates data, then renders, if called with parameter
   * @method render
   * @memberof RopeChart
   * @instance
   * @param  {Object} [data]
   * @return {RopeChart} 
   */
  chart.render = function(_) {

    if (!!arguments.length)
      chart.data(_);

    // size the svg, and reset the center          
    svg.attr("width", function(){
      return svgWidth;
    });
    svg.attr("height",function(){
      return svgHeight;
    });

    var nodes = chart.generateNodes(); 

    // derive bar data
    var barX = ropeX - (ropeWidth/2);
    var bar = {x: barX, 
               y: knotRadius, 
               height: svgHeight - 2 * knotRadius, 
               width: ropeWidth, 
               className: 'rope' };
    var bars = [bar];

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
        .text(function(d) { return d.value; });
      // enter
    valueText.enter().append('text')
        .attr('class', function(d) { return 'value'; })
        .attr('text-anchor', function(d) { return 'end'; })
        .attr('x', function(d) { return d.x - (d.r + labelMargin); })
        .attr('y', function(d) { return d.y + d.adjustTextOverlap; })
        .attr('dy', function(d) { return '.3em'; })
        .attr('font-size', function(d) { return d.r * 2 + 'px'; })
        .text(function(d) { return d.value; });
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
        .attr('class', function(d) { return 'label'; })
        .attr('text-anchor', function(d) { return 'start'; })
        .attr('x', function(d) { return d.x + (d.r + labelMargin); })
        .attr('y', function(d) { return d.y + d.adjustTextOverlap; })
        .attr('dy', function(d) { return '.3em'; })
        .attr('font-size', function(d) { return d.r * 2 + 'px'; })
        .text(function(d) { return d.label; });
      // exit
    labelText.exit().remove();

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
    avg    = d3.round(d3.mean(data, chart.valueAccessor()));

    yScale = d3.scale.linear()
      .domain([min.value, max.value])
      .range([svgHeight - chartGutter, chartGutter]);

    ropeX = chart.getRopeX();

    return chart;
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
   * Get/set the length of the horizontal "threshold" line.
   * @method threshLineLength
   * @memberof RopeChart
   * @instance
   * @param  {Integer} [threshLineLength=20]
   * @return {Integer} [Acts as getter if called with no parameter]
   * @return {RopeChart} [Acts as setter if called with parameter]
   */
  chart.threshLineLength = function(_) {
    if (!arguments.length) {
      return threshLineLength;
    }
    threshLineLength = _;
    return chart;
  };

  /**
   * Get/set the color used on the "good" side of the threshold.
   * @method goodColor
   * @memberof RopeChart
   * @instance
   * @param  {String} [goodColor=green]
   * @return {String} [Acts as getter if called with no parameter]
   * @return {RopeChart} [Acts as setter if called with parameter]
   */
  chart.goodColor = function(_) {
    if (!arguments.length) {
      return goodColor;
    }
    goodColor = _;
    return chart;
  };

  /**
   * Get/set the color used on the "bad" side of the threshold.
   * @method badColor
   * @memberof RopeChart
   * @instance
   * @param  {String} [goodColor=red]
   * @return {String} [Acts as getter if called with no parameter]
   * @return {RopeChart} [Acts as setter if called with parameter]
   */
  chart.badColor = function(_) {
    if (!arguments.length) {
      return badColor;
    }
    badColor = _;
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
   * Get/set boolean that toggles display of a "knot" for the group average.
   * @method showAverage
   * @memberof RopeChart
   * @instance
   * @param  {Boolean} [showAverage=false]
   * @return {Boolean} [Acts as getter if called with no parameter]
   * @return {RopeChart} [Acts as setter if called with parameter]
   */
  chart.showAverage = function(_) {
    if (!arguments.length) {
      return showAverage;
    }
    showAverage = _;
    return chart;
  };

  /**
   * Get/set label for average knot location.
   * @method averageLabel
   * @memberof RopeChart
   * @instance
   * @param  {String} [averageLabel="Average"]
   * @return {String} [Acts as getter if called with no parameter]
   * @return {RopeChart} [Acts as setter if called with parameter]
   */
  chart.averageLabel = function(_) {
    if (!arguments.length) {
      return averageLabel;
    }
    averageLabel = _;
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
  chart.labelMargin = function(_) {
    if (!arguments.length) {
      return labelMargin;
    }
    labelMargin = _;
    return chart;
  };

  /**
   * Get/set function used to access "value" property from each data record. Defaults to: 
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
   * Get/set function used to access "name" property from each data record. Defaults to: 
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

  chart.generateNodes = function() {
    // derive node data & configure scale
    var topNode     = chart.generateNode(max, "top-knot");
    var bottomNode  = chart.generateNode(min, "bottom-knot");

    var nodes, adjustedNodes;

    focus = data.filter(function(d){ return chart.nameAccessor()(d) === chart.focusName();})[0];
    var focusNode   = chart.generateNode(focus, "focus-knot");

    if (chart.showAverage()) {
      var averageNode = {x: ropeX, 
                         y: yScale(avg), 
                         adjustTextOverlap: 0,
                         r: knotRadius, 
                         className: "average-knot",
                         value: Number(avg),
                         label: averageLabel};
      nodes = [topNode, bottomNode, averageNode, focusNode];
      adjustedNodes = chart.adjustForOverlap(topNode, bottomNode, focusNode, averageNode);
    } else {
      nodes = [topNode, bottomNode, focusNode];
      adjustedNodes = chart.adjustForOverlap(topNode, bottomNode, focusNode);
    }

    return adjustedNodes;
  }

  chart.generateNode = function(datum, className) {

    return {
      x: ropeX,
      y: yScale(chart.valueAccessor()(datum)),
      r: knotRadius,
      adjustTextOverlap: 0,
      className: className,
      value: Number(chart.valueAccessor()(datum)),
      label: chart.nameAccessor()(datum)
    };
  };

  chart.adjustForOverlap = function(top, bottom, focus, average) {
    var topOverlap = chart.nodeIsOverlapping(focus, top);
    var bottomOverlap = chart.nodeIsOverlapping(focus, bottom);
    // the focus is in overlap range of the top knot
    if(topOverlap !== false) {
      focus.adjustTextOverlap = topOverlap;
    }
    // the focus is in overlap range of the bottom knot
    else if(bottomOverlap !== false) {
      if(focus.value = bottom.value) focus.adjustTextOverlap = -bottomOverlap;
      else focus.adjustTextOverlap = bottomOverlap;
    }
    // the focus is in overlap range of the average knot
    else if(average) {
      var avgOverlap = chart.nodeIsOverlapping(focus, average);

      if(average.value === focus.value) {
        average.adjustTextOverlap = avgOverlap / 2;
        focus.adjustTextOverlap = -avgOverlap / 2;
      }
      else {
        average.adjustTextOverlap = -(avgOverlap / 2);
        focus.adjustTextOverlap = avgOverlap /2;
      }
    }

    var adjustedNodes = [top, bottom, average];
    if(focus) adjustedNodes.push(focus);

    return adjustedNodes;
  };

  chart.nodeIsOverlapping = function(node, compareToNode) {
    if(node.y <= (compareToNode.y + (2 * knotRadius)) && node.y >= (compareToNode.y - (2 * knotRadius))) {
      var nodeDistance = compareToNode.y - node.y;

      // node is greater than compareToNode
      if(nodeDistance < 0) return (2 * knotRadius) - Math.abs(nodeDistance);
      else if(nodeDistance > 0) return -((2 * knotRadius) - nodeDistance);
      else return 2 * knotRadius;
    }

    return false;
  };

  return chart;
}

module.exports = RopeChart;