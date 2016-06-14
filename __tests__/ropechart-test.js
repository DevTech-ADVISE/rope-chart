jest.unmock('../src/ropeChart.js');
jest.unmock('../node_modules/d3/d3.js');

d3 = require('../node_modules/d3/d3.js');

describe('RopeChart', () => {

  // -----------------------------------------------------------------------------------
  // All of the unit tests for data calculations go here separate from the svg rendering
  // -----------------------------------------------------------------------------------
  describe('chart calculations', () => {
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
      .data(data);

    var valueAccessor = function(d) { return d.value; };
    var yScale = d3.scale.linear()
      .domain([d3.min(data, valueAccessor), d3.max(data, valueAccessor)])
      .range([HEIGHT - RopeChart.chartGutter(), RopeChart.chartGutter()]);

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


  });

});