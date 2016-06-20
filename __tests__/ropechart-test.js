jest.unmock('../src/ropeChart.js');
jest.unmock('../node_modules/d3/d3.js');

d3 = require('../node_modules/d3/d3.js');

describe('RopeChart', () => {

  // -----------------------------------------------------------------------------------
  // All of the unit tests for data calculations go here separate from the svg rendering
  // -----------------------------------------------------------------------------------
  describe('chart calculations for normal positioning', () => {
    var PARENT_ID = 'test';
    var RopeChart = require('../src/ropeChart.js')('#' + PARENT_ID);
    var data = [
      {name:'Bill',value:'33'},
      {name:'Bob',value:'54'},
      {name:'Janet',value:'21'},
      {name:'Phil',value:'60'},
      {name:'James',value:'29'},
      {name:'Annie',value:'36'},
      {name:'Eloise',value:'44'}
    ];

    var HEIGHT = 300, WIDTH = 300;
    RopeChart
      .width(WIDTH)
      .height(HEIGHT)
      .showAverage(true)
      .focusName('Annie')
      .data(data);

    var valueAccessor = function(d) { return d.value; };
    var yScale = d3.scale.linear()
      .domain([d3.min(data, valueAccessor), d3.max(data, valueAccessor)])
      .range([HEIGHT - RopeChart.chartGutter(), RopeChart.chartGutter()]);

    var max = d3.max(data, RopeChart.valueAccessor());
    var min = d3.min(data, RopeChart.valueAccessor());
    var average = d3.round(d3.mean(data, RopeChart.valueAccessor()));

    it('should have a height set for the chart', () => {
      expect(RopeChart.height()).toEqual(HEIGHT);
    });

    it('should have a width set for the chart', () => {
      expect(RopeChart.width()).toEqual(WIDTH);
    });

    it('should calculate the correct y-scale domain', () => {
      expect(RopeChart.yScale().domain()[0]).toEqual(yScale.domain()[0]);
      expect(RopeChart.yScale().domain()[1]).toEqual(yScale.domain()[1]);
    });

    it('should calculate the correct y-scale range', () => {
      expect(RopeChart.yScale().range()[0]).toEqual(yScale.range()[0]);
      expect(RopeChart.yScale().range()[1]).toEqual(yScale.range()[1]);
    });

    it('should position the rope correctly horizontally', () => {
      var expectedLeftPosition = WIDTH * (50/100);
      var actualLeftPosition = RopeChart.getRopeX();

      expect(actualLeftPosition).toEqual(expectedLeftPosition);
    });

    it('should generate a node for a data object', () => {
      var datum = data[0];
      var node = RopeChart.generateNode(datum, 'class-name');

      expect(node.x).toEqual(RopeChart.getRopeX());
      expect(node.y).toEqual(RopeChart.yScale()(RopeChart.valueAccessor()(datum)));
      expect(node.r).toEqual(RopeChart.knotRadius());
      expect(node.className).toEqual('class-name');
      expect(node.value).toEqual(RopeChart.valueAccessor()(datum));
      expect(node.label).toEqual(RopeChart.nameAccessor()(datum));

    });

    it('should calculate the top node as the max correctly', () => {
      var topNode = RopeChart.generateNodes()[0];
      var topValue = RopeChart.valueAccessor()(topNode);
      expect(topValue).toEqual(max);
    });

    it('should calculate the bottom node as the min correctly', () => {
      var bottomNode = RopeChart.generateNodes()[1];
      var bottomValue = RopeChart.valueAccessor()(bottomNode);

      expect(bottomValue).toEqual(min);
    });

    it('should calculate the average node as the average correctly', () => {
      var avgNode = RopeChart.generateNodes()[2];
      var avgValue = RopeChart.valueAccessor()(avgNode);
      expect(avgValue).toEqual(average);
    });

    it('should set the chart gutter as the chart radius', () => {
      var expectedRadius = 35;
      RopeChart.knotRadius(expectedRadius);

      expect(RopeChart.chartGutter()).toEqual(expectedRadius);
    });
  });

  // The edge cases include things like multiple datum as the max or min, and datum that may overlap when rendered
  describe('chart calculations for focus knot overlap', () => {
    var PARENT_ID = 'test';
    var RopeChart = require('../src/ropeChart.js')('#' + PARENT_ID);

    var data = [
      {name:'Average Joe',value:'40'},
      {name:'Bob',value:'38'},
      {name:'Janet',value:'21'},
      {name:'Phil',value:'60'},
      {name:'James',value:'22'},
      {name:'Annie',value: '59'},
      {name:'Eloise',value:'41'}
    ];

    var HEIGHT = 300, WIDTH = 300;
    RopeChart
      .width(WIDTH)
      .height(HEIGHT)
      .showAverage(true);

    var valueAccessor = function(d) { return d.value; };
    var yScale = d3.scale.linear()
      .domain([d3.min(data, valueAccessor), d3.max(data, valueAccessor)])
      .range([HEIGHT - RopeChart.chartGutter(), RopeChart.chartGutter()]);

    var max = d3.max(data, RopeChart.valueAccessor());
    var min = d3.min(data, RopeChart.valueAccessor());
    var average = d3.round(d3.mean(data, RopeChart.valueAccessor()));

    it('should calculate the correct text adjustment when the focus overlaps with the top knot', () => {
      RopeChart.focusName('Annie').data(data);
      var nodes = RopeChart.generateNodes();
      var focusY = yScale(59);
      var topY = yScale(max);
      var nodeDistance = focusY - topY;
      var expectedTextOverlapAdjust = 2 * RopeChart.knotRadius() -  nodeDistance;
      var generatedTextOverlapAdjust = nodes[3].adjustTextOverlap;

      expect(generatedTextOverlapAdjust).toEqual(expectedTextOverlapAdjust);
    });

    it('should calculate the correct text adjustment when the focus overlaps with the bottom knot', () => {
      RopeChart.focusName('James').data(data);
      var nodes = RopeChart.generateNodes();
      var focusY = yScale(22);
      var bottomY = yScale(min);
      var nodeDistance = bottomY - focusY;
      var expectedTextOverlapAdjust = -(2 * RopeChart.knotRadius() -  nodeDistance);
      var generatedTextOverlapAdjust = nodes[3].adjustTextOverlap;

      expect(generatedTextOverlapAdjust).toEqual(expectedTextOverlapAdjust);
    });

    it('should calculate the correct text adjustment when the focus overlaps above the average knot', () => {
      RopeChart.focusName('Eloise').data(data);
      var nodes = RopeChart.generateNodes();
      var focusY = yScale(41);
      var averageY = yScale(average);
      var nodeDistance = averageY - focusY;
      var expectedTextOverlapAdjust = -(2 * RopeChart.knotRadius() -  nodeDistance) / 2;
      var generatedTextOverlapAdjust = nodes[3].adjustTextOverlap;

      expect(generatedTextOverlapAdjust).toEqual(expectedTextOverlapAdjust);
    });

    it('should calculate the correct text adjustment when the focus overlaps below the average knot', () => {
      RopeChart.focusName('Bob').data(data);
      var nodes = RopeChart.generateNodes();
      var focusY = yScale(38);
      var averageY = yScale(average);
      var nodeDistance = focusY - averageY;
      var expectedTextOverlapAdjust = (2 * RopeChart.knotRadius() -  nodeDistance) / 2;
      var generatedTextOverlapAdjust = nodes[3].adjustTextOverlap;

      expect(generatedTextOverlapAdjust).toEqual(expectedTextOverlapAdjust);
    });

    it('should calculate the correct text adjustment when the focus equals the average', () => {
      RopeChart.focusName('Average Joe').data(data);
      var nodes = RopeChart.generateNodes();
      var focusY = yScale(40);
      var averageY = yScale(average);
      var nodeDistance = averageY - focusY;
      var expectedTextOverlapAdjust = -(2 * RopeChart.knotRadius() -  nodeDistance) / 2;
      var generatedTextOverlapAdjust = nodes[3].adjustTextOverlap;

      expect(generatedTextOverlapAdjust).toEqual(expectedTextOverlapAdjust);
    });

  });

  describe("how the chart will label multiple mins or multiple maxes", () => {
    var PARENT_ID = 'test';
    var RopeChart = require('../src/ropeChart.js')('#' + PARENT_ID);

    var data = [
      {name:'Average Joe',value:'40'},
      {name:'Bob',value:'38'},
      {name:'Janet',value:'21'},
      {name:'Phil',value:'60'},
      {name:'James',value:'21'},
      {name:'Annie',value: '60'},
      {name:'Eloise',value:'41'}
    ];

    var HEIGHT = 300, WIDTH = 300;
    RopeChart
      .width(WIDTH)
      .height(HEIGHT)
      .showAverage(true);

    var valueAccessor = function(d) { return d.value; };
    var yScale = d3.scale.linear()
      .domain([d3.min(data, valueAccessor), d3.max(data, valueAccessor)])
      .range([HEIGHT - RopeChart.chartGutter(), RopeChart.chartGutter()]);

    var max = d3.max(data, RopeChart.valueAccessor());
    var min = d3.min(data, RopeChart.valueAccessor());

    it('should set the top label correctly for multiple maxes with the focus as a max', () => {
      RopeChart.focusName('Annie').data(data);
      var nodes = RopeChart.generateNodes();
      var expectedLabel = "Annie and others";
      var actualLabel = nodes[0].label;

      expect(RopeChart.getMultipleMaxes()).not.toBe(false);
      expect(RopeChart.getMultipleMaxes().length).toEqual(2);
      expect(actualLabel).toEqual(expectedLabel);
    });

    it('should set the top label correctly for multiple maxes without the focus as a max', () => {
      RopeChart.focusName('Eloise').data(data);
      var nodes = RopeChart.generateNodes();
      var expectedLabel = "Multiple: Phil, Annie";
      var actualLabel = nodes[0].label;

      expect(RopeChart.getMultipleMaxes()).not.toBe(false);
      expect(RopeChart.getMultipleMaxes().length).toEqual(2);
      expect(actualLabel).toEqual(expectedLabel);
    });

    it('should set the bottom label correctly for multiple mins with the focus as a min', () => {
      RopeChart.focusName('James').data(data);
      var nodes = RopeChart.generateNodes();
      var expectedLabel = "James and others";
      var actualLabel = nodes[1].label;

      expect(RopeChart.getMultipleMins()).not.toBe(false);
      expect(RopeChart.getMultipleMins().length).toEqual(2);
      expect(actualLabel).toEqual(expectedLabel);
    });

    it('should set the bottom label correctly for multiple mins without the focus as a min', () => {
      RopeChart.focusName('Eloise').data(data);
      var nodes = RopeChart.generateNodes();
      var expectedLabel = "Multiple: Janet, James";
      var actualLabel = nodes[1].label;

      expect(RopeChart.getMultipleMins()).not.toBe(false);
      expect(RopeChart.getMultipleMins().length).toEqual(2);
      expect(actualLabel).toEqual(expectedLabel);
    });
  });

  describe('how the chart labels the max or min if the focus is the max or min', () => {
    var PARENT_ID = 'test';
    var RopeChart = require('../src/ropeChart.js')('#' + PARENT_ID);

    var data = [
      {name:'Average Joe',value:'40'},
      {name:'Bob',value:'38'},
      {name:'Janet',value:'21'},
      {name:'Phil',value:'60'},
      {name:'James',value:'22'},
      {name:'Annie',value: '59'},
      {name:'Eloise',value:'41'}
    ];

    var HEIGHT = 300, WIDTH = 300;
    RopeChart
      .width(WIDTH)
      .height(HEIGHT)
      .showAverage(true);

    it('should set the top knot as the focus if the focus is the only max', () => {
      RopeChart.focusName('Phil').data(data);
      var nodes = RopeChart.generateNodes();
      var focusNode = nodes[3];
      var topNode = nodes[0];

      expect(focusNode).toBeUndefined();
      expect(topNode.className).toEqual("max-focus-knot");
    });

    it('should set the top knot as the focus if the focus is the only max', () => {
      RopeChart.focusName('Janet').data(data);
      var nodes = RopeChart.generateNodes();
      var focusNode = nodes[3];
      var bottomNode = nodes[1];

      expect(focusNode).toBeUndefined();
      expect(bottomNode.className).toEqual("min-focus-knot");
    });
  })

  describe('chart rendering', () => {
    var PARENT_ID = 'test';
    var RopeChart = require('../src/ropeChart.js')('div#' + PARENT_ID);

    // Add the parent element to the document to render into
    document.body.innerHTML = '<div id=' + PARENT_ID + '></div>';

    var data = [
      {name:'Average Joe',value:'40'},
      {name:'Bob',value:'38'},
      {name:'Janet',value:'21'},
      {name:'Phil',value:'60'},
      {name:'James',value:'22'},
      {name:'Annie',value: '59'},
      {name:'Eloise',value:'41'}
    ];

    var HEIGHT = 300, WIDTH = 300;
    RopeChart
      .width(WIDTH)
      .height(HEIGHT)
      .showAverage(true)
      .focusName('Annie');

    it('should render an svg into the parent selection', () => {
      RopeChart.render(data);
      var svg = d3.select('#' + PARENT_ID)[0][0];

      expect(svg).not.toBeNull();
    });
   
  });

  // Some remaining coverage of getters and setters
  describe('getters and setters', () => {
     var PARENT_ID = 'test';
    var RopeChart = require('../src/ropeChart.js')('div#' + PARENT_ID);

    var data = [
      {student:'Average Joe',grade:'40'},
      {student:'Bob',grade:'38'},
      {student:'Janet',grade:'21'},
      {student:'Phil',grade:'60'},
      {student:'James',grade:'22'},
      {student:'Annie',grade: '59'},
      {student:'Eloise',grade:'41'}
    ];

    var HEIGHT = 300, WIDTH = 300;
    var valueAccessor = function(d) { return d.grade; };
    var nameAccessor = function(d) { return d.student; };
    RopeChart
      .width(WIDTH)
      .height(HEIGHT)
      .focusName('Annie')
      .valueAccessor(valueAccessor)
      .nameAccessor(nameAccessor)
      .data(data);

    
    var yScale = d3.scale.linear()
      .domain([0, 100])
      .range([HEIGHT - RopeChart.chartGutter(), RopeChart.chartGutter()]);

    it('should have a getter for data', () => {
      var expectedDataValue = data[0].value;

      expect(RopeChart.data()[0].value).toEqual(expectedDataValue);
    });

    it('should have a getter/setter for the y-scale', () => {
      RopeChart.yScale(yScale);
      var expectedDomain = yScale.domain();

      expect(RopeChart.yScale().domain()[0]).toEqual(expectedDomain[0]);
      expect(RopeChart.yScale().domain()[1]).toEqual(expectedDomain[1]);
    });

    it('should have a getter/setter for the margin left percentage', () => {
      RopeChart.marginLeftPercentage(25);

      expect(RopeChart.marginLeftPercentage()).toEqual(25);
    });

    it('should have a getter/setter for the rope width', () => {
      RopeChart.ropeWidth(3);

      expect(RopeChart.ropeWidth()).toEqual(3);
    });

    it('should have a getter/setter for the chart gutter', () => {
      RopeChart.chartGutter(15);

      expect(RopeChart.chartGutter()).toEqual(15);
    });

    it('should have a getter/setter for the threshold line length', () => {
      RopeChart.threshLineLength(5);

      expect(RopeChart.threshLineLength()).toEqual(5);
    });

    it('should have a getter/setter for the good color of the thresh line', () => {
      RopeChart.goodColor('#ccc');

      expect(RopeChart.goodColor()).toEqual('#ccc');
    });

    it('should have a getter/setter for the bad color of the thresh line', () => {
      RopeChart.badColor('#eee');

      expect(RopeChart.badColor()).toEqual('#eee');
    });

    it('should have a getter/setter for the flip direction of the thresh line', () => {
      RopeChart.flipDirection(true);

      expect(RopeChart.flipDirection()).toBe(true);
    });

    it('should have a getter/setter for the average label', () => {
      RopeChart.averageLabel('Average here');

      expect(RopeChart.averageLabel()).toEqual('Average here');
    });

    it('should have a getter/setter for the label margin', () => {
      RopeChart.labelMargin(5);

      expect(RopeChart.labelMargin()).toEqual(5);
    });

    it('should not create and average node if showAverage is not set to true', () => {
      var nodes = RopeChart.generateNodes();

      expect(nodes.length).toEqual(3);
    });
  });

});