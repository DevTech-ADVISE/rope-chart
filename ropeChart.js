/**
 * Rope chart implementation.
 *
 * @class ropeChart
 * @param {String} selection - any valid d3 selector. This selector is used to place the chart.
 * @return {ropeChart}
 */
function ropeChart(selection){
  chart = {};
  // settings
  var svgWidth         = 250,
      svgHeight        = 250,
      knotRadius       = 20,
      ropeWidth         = 10,
      threshLineLength = 40,
      goodColor        = "green",
      badColor         = "red",
      baseColor        = "black",
      flipDirection    = false,
      labelMargin      = 5;

  var max, min, thresh, focus, data;
  
  var svg = d3.select(selection)
    .append('svg');

  /**
   * Render the ropeChart instance. Simply renders chart when called with no parameter. Updates data, then renders, if called with parameter
   * @method render
   * @memberof ropeChart
   * @instance
   * @param  {Object} [data]
   * @return {ropeChart} 
   */
  chart.render = function(_) {

    if (!!arguments.length)
      chart.data(_);

    // size the svg          
    svg.attr("width", function(){
      return svgWidth;
    });
    svg.attr("height",function(){
      return svgHeight;
    });

    // reference values
    var centerPoint = {x: svgWidth/2, y: svgWidth/2};

    // derive node data & configure scale
    var topNode     = {x: centerPoint.x, 
                       y: knotRadius, 
                       r: knotRadius, 
                       fill: nodeColor(max.value),
                       value: max.value,
                       label: max.label};

    var bottomNode  = {x: centerPoint.x, 
                       y: svgHeight - knotRadius, 
                       r: knotRadius, 
                       fill: nodeColor(min.value),
                       value: min.value,
                       label: min.label};

    var yScale = d3.scale.linear()
      .domain([min.value, max.value])
      .range([bottomNode.y, topNode.y]);

    var focusNode   = {x: centerPoint.x, 
                       y: yScale(focus.value), 
                       r: knotRadius, 
                       fill: nodeColor(focus.value),
                       value: focus.value,
                       label: focus.label};

    var nodes       = [topNode, bottomNode,focusNode];

    // derive threshold line data
    var threshLine = {x1: centerPoint.x - (threshLineLength/2), y1: yScale(thresh.value),
                      x2: centerPoint.x + (threshLineLength/2), y2: yScale(thresh.value)};
    // derive bar data
    var barX = centerPoint.x - (ropeWidth/2);
    var topBar = {x: barX, y: knotRadius, height: threshLine.y1 - knotRadius, width: ropeWidth, fill: (flipDirection ? badColor : goodColor)};
    var botBar = {x: barX, y: threshLine.y1, height: svgHeight - (threshLine.y1 + knotRadius), width: ropeWidth, fill: (flipDirection ? goodColor : badColor)};
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
    var valueText = svg.selectAll('text.value')
        .data(nodes)
        .attr('text-anchor', function(d) { return 'end'; })
        .attr('x', function(d) { return d.x - (d.r + labelMargin); })
        .attr('y', function(d) { return d.y; })
        .attr('dy', function(d) { return '.3em'; })
        .attr('font-size', function(d) { return d.r * 2 + 'px'; })
        .text(function(d) { return d.value; });
      // enter
    valueText.enter().append('text')
        .attr('class', function(d) { return 'value'; })
        .attr('text-anchor', function(d) { return 'end'; })
        .attr('x', function(d) { return d.x - (d.r + labelMargin); })
        .attr('y', function(d) { return d.y; })
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
        .attr('y', function(d) { return d.y; })
        .attr('dy', function(d) { return '.3em'; })
        .attr('font-size', function(d) { return d.r * 2 + 'px'; })
        .text(function(d) { return d.label; });
      // enter
    labelText.enter().append('text')
        .attr('class', function(d) { return 'label'; })
        .attr('text-anchor', function(d) { return 'start'; })
        .attr('x', function(d) { return d.x + (d.r + labelMargin); })
        .attr('y', function(d) { return d.y; })
        .attr('dy', function(d) { return '.3em'; })
        .attr('font-size', function(d) { return d.r * 2 + 'px'; })
        .text(function(d) { return d.label; });
      // exit
    labelText.exit().remove();

    return chart;
  };

  /**
   * Get/set the data for the ropeChart instance
   * @method data
   * @memberof ropeChart
   * @instance
   * @param  {Object} [data]
   * @return {Object} [Acts as getter if called with no parameter]
   * @return {ropeChart} [Acts as setter if called with parameter]
   */
  chart.data = function(_) {
    if (!arguments.length)
      return data;

    data = _;
    max  = data.max,
    min    = data.min,
    thresh = data.threshold,
    focus  = data.focus;

    return chart;
  };

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
   * @method knotRadius
   * @memberof ropeChart
   * @instance
   * @param  {Integer} [knotRadius=20]
   * @return {Integer} [Acts as getter if called with no parameter]
   * @return {ropeChart} [Acts as setter if called with parameter]
   */
  chart.knotRadius = function(_) {
    if (!arguments.length) {
      return knotRadius;
    }
    knotRadius = _;
    return chart;
  };

  /**
   * Get/set the width of the "rope" rectangle.
   * @method ropeWidth
   * @memberof ropeChart
   * @instance
   * @param  {Integer} [ropeWidth=20]
   * @return {Integer} [Acts as getter if called with no parameter]
   * @return {ropeChart} [Acts as setter if called with parameter]
   */
  chart.ropeWidth = function(_) {
    if (!arguments.length) {
      return ropeWidth;
    }
    ropeWidth = _;
    return chart;
  };

  /**
   * Get/set the length of the horizontal "threshold" line.
   * @method threshLineLength
   * @memberof ropeChart
   * @instance
   * @param  {Integer} [threshLineLength=20]
   * @return {Integer} [Acts as getter if called with no parameter]
   * @return {ropeChart} [Acts as setter if called with parameter]
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