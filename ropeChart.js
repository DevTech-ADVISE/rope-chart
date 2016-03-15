/**
 * Rope chart implementation.
 *
 * @class ropeChart
 * @param {String} selection - any valid d3 selector. This selector is used to place the chart.
 * @return {ropeChart}
 */
function ropeChart(selection){
  // settings
  var svgWidth        = 250,
      svgHeight       = 250,
      nodeRadius      = 20,
      barWidth        = 10,
      threshLineWidth = 40,
      goodColor       = "green",
      badColor        = "red",
      baseColor       = "black",
      flipDirection   = false,
      labelMargin     = 5;

  var max, min, thresh, focus;
  
  var svg = d3.select(selection)
    .append('svg');

  function chart(data) {

    // data inputs
    max  = data.max,
    min    = data.min,
    thresh = data.threshold,
    focus  = data.focus;

    // size the svg          
    svg.attr("width", function(){
      return svgWidth;
    });
    svg.attr("height",function(){
      return svgWidth;
    });

    // reference values
    var centerPoint = {x: svgWidth/2, y: svgWidth/2};

    // derive node data & configure scale
    var topNode     = {x: centerPoint.x, 
                       y: nodeRadius, 
                       r: nodeRadius, 
                       fill: nodeColor(max.value),
                       value: max.value};

    var bottomNode  = {x: centerPoint.x, 
                       y: svgHeight - nodeRadius, 
                       r: nodeRadius, 
                       fill: nodeColor(min.value),
                       value: min.value};

    var yScale = d3.scale.linear()
      .domain([min.value, max.value])
      .range([bottomNode.y, topNode.y]);

    var focusNode   = {x: centerPoint.x, 
                       y: yScale(focus.value), 
                       r: nodeRadius, 
                       fill: nodeColor(focus.value),
                       value: focus.value};

    var nodes       = [topNode, bottomNode,focusNode];

    // derive threshold line data
    var threshLine = {x1: centerPoint.x - (threshLineWidth/2), y1: yScale(thresh.value),
                      x2: centerPoint.x + (threshLineWidth/2), y2: yScale(thresh.value)};
    // derive bar data
    var barX = centerPoint.x - (barWidth/2);
    var topBar = {x: barX, y: nodeRadius, height: threshLine.y1 - nodeRadius, width: barWidth, fill: (flipDirection ? badColor : goodColor)};
    var botBar = {x: barX, y: threshLine.y1, height: svgHeight - (threshLine.y1 + nodeRadius), width: barWidth, fill: (flipDirection ? goodColor : badColor)};
    var bars = [topBar, botBar];

    // render bar svg 
      // update
    var barSvg = svg.selectAll('rect')
        .data(bars)
        .attr('x', function(d){ return d.x; })
        .attr('y', function(d){ return d.y; })
        .attr('height', function(d){ return d.height; })
        .attr('width', function(d){ return d.width; })
        .attr('fill', function(d){ return d.fill; });
      // enter
    barSvg.enter().append('rect')
        .attr('x', function(d){ return d.x; })
        .attr('y', function(d){ return d.y; })
        .attr('height', function(d){ return d.height; })
        .attr('width', function(d){ return d.width; })
        .attr('fill', function(d){ return d.fill; });
      // exit
    barSvg.exit().remove();

    // render nodes svg 
      // update
    var circleSvg = svg.selectAll('circle')
        .data(nodes)
        .attr('cx', function(d){ return d.x; })
        .attr('cy', function(d){ return d.y; })
        .attr('r', function(d){ return d.r; })
        .attr('fill', function(d){ return d.fill; });
      // enter
    circleSvg.enter().append('circle')
        .attr('cx', function(d){ return d.x; })
        .attr('cy', function(d){ return d.y; })
        .attr('r', function(d){ return d.r; })
        .attr('fill', function(d){ return d.fill; });
      // exit
    circleSvg.exit().remove();

    // render threshold line   
    svg.selectAll('line').remove();
    var lineSvg = svg.append('line')
      .attr('x1', function(){ return threshLine.x1; })
      .attr('y1', function(){ return threshLine.y1; })
      .attr('x2', function(){ return threshLine.x2; })
      .attr('y2', function(){ return threshLine.y2; })
      .attr('stroke', function(){ return baseColor; });
    
    // render value text
      // update
    var valueText = svg.selectAll('text')
        .data(nodes)
        .attr('text-anchor', function(d) { return 'end'; })
        .attr('x', function(d) { return d.x - (d.r + labelMargin); })
        .attr('y', function(d) { return d.y; })
        .attr('dy', function(d) { return '.3em'; })
        .attr('font-size', function(d) { return d.r * 2 + 'px'; })
        .text(function(d) { return d.value; });
      // enter
    valueText.enter().append('text')
        .attr('text-anchor', function(d) { return 'end'; })
        .attr('x', function(d) { return d.x - (d.r + labelMargin); })
        .attr('y', function(d) { return d.y; })
        .attr('dy', function(d) { return '.3em'; })
        .attr('font-size', function(d) { return d.r * 2 + 'px'; })
        .text(function(d) { return d.value; });
      // exit
    valueText.exit().remove();
  }

  /**
   * Get/set the width of the chart SVG
   * @method width
   * @memberof ropeChart
   * @instance
   * @param  {Integer} [width=500]
   * @return {Integer} [Acts as getter if called with no parameter]
   * @return {ropeChart} [Acts as setter if called with parameter]
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
   * @memberof ropeChart
   * @instance
   * @param  {Integer} [height=500]
   * @return {Integer} [Acts as getter if called with no parameter]
   * @return {ropeChart} [Acts as setter if called with parameter]
   */
  chart.height = function(_) {
    if (!arguments.length) {
      return svgHeight;
    }
    svgHeight = _;
    return chart;
  };  

  /**
   * Get/set the radius of "knot" circles at max, min, and focus value positions.
   * @method nodeRadius
   * @memberof ropeChart
   * @instance
   * @param  {Integer} [nodeRadius=20]
   * @return {Integer} [Acts as getter if called with no parameter]
   * @return {ropeChart} [Acts as setter if called with parameter]
   */
  chart.nodeRadius = function(_) {
    if (!arguments.length) {
      return nodeRadius;
    }
    nodeRadius = _;
    return chart;
  };

  /**
   * Get/set the width of the "rope" rectangle.
   * @method barWidth
   * @memberof ropeChart
   * @instance
   * @param  {Integer} [barWidth=20]
   * @return {Integer} [Acts as getter if called with no parameter]
   * @return {ropeChart} [Acts as setter if called with parameter]
   */
  chart.barWidth = function(_) {
    if (!arguments.length) {
      return barWidth;
    }
    barWidth = _;
    return chart;
  };

  /**
   * Get/set the length of the horizontal "threshold" line.
   * @method threshLineWidth
   * @memberof ropeChart
   * @instance
   * @param  {Integer} [threshLineWidth=20]
   * @return {Integer} [Acts as getter if called with no parameter]
   * @return {ropeChart} [Acts as setter if called with parameter]
   */
  chart.threshLineWidth = function(_) {
    if (!arguments.length) {
      return threshLineWidth;
    }
    threshLineWidth = _;
    return chart;
  };

  /**
   * Get/set the color used on the "good" side of the threshold.
   * @method goodColor
   * @memberof ropeChart
   * @instance
   * @param  {String} [goodColor=green]
   * @return {String} [Acts as getter if called with no parameter]
   * @return {ropeChart} [Acts as setter if called with parameter]
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
   * @memberof ropeChart
   * @instance
   * @param  {String} [goodColor=red]
   * @return {String} [Acts as getter if called with no parameter]
   * @return {ropeChart} [Acts as setter if called with parameter]
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
   * @memberof ropeChart
   * @instance
   * @param  {Boolean} [flipDirection=false]
   * @return {Boolean} [Acts as getter if called with no parameter]
   * @return {ropeChart} [Acts as setter if called with parameter]
   */
  chart.flipDirection = function(_) {
    if (!arguments.length) {
      return flipDirection;
    }
    flipDirection = _;
    return chart;
  };

  /**
   * Get/set the margin between labels and "knot" circles.
   * @method labelMargin
   * @memberof ropeChart
   * @instance
   * @param  {Integer} [labelMargin=5]
   * @return {Integer} [Acts as getter if called with no parameter]
   * @return {ropeChart} [Acts as setter if called with parameter]
   */
  chart.labelMargin = function(_) {
    if (!arguments.length) {
      return labelMargin;
    }
    labelMargin = _;
    return chart;
  };

  function nodeColor(value) {
    if (flipDirection) {
      if (value > thresh.value) {
        return  badColor;
      } else {
        return goodColor;
      }
    } else {
      if (value < thresh.value) {
        return badColor;
      } else {
        return goodColor;
      }
    }
  }

  return chart;
}