var myRopeChart = RopeChart('div#myRopeChart');
var averageJoe = RopeChart('div#averageJoe');
var amazingPhil = RopeChart('div#amazingPhil');
var james = RopeChart('div#james');
var annie = RopeChart('div#annie');

var data = [
  {name:'Average Joe',value:'100'},
  {name:'Bob',value:'50'},
  {name:'Janet',value:'50'},
  {name:'Phil',value:'50'},
  {name:'James',value:'50'},
  {name:'Annie',value: '50'},
  {name:'Eloise',value:'50'},
  {name: 'Bill', value: '52'}
];

myRopeChart
  .knotRadius(10)
  .ropeWidth(4)
  .showThreshold(true)
  .focusName('Bill')
  .tooltipContent({ threshold: function(d) { return "Custom markup showing <em>" + d.label + "</em> score is <em>" + d.value + "</em>"; } })
  .tooltipLabel('&#128129;')
  .showTooltip({ threshold: true, top: true})
  .marginLeftPercentage(25)
  .render(data);

averageJoe
  .knotRadius(10)
  .ropeWidth(4)
  .showThreshold(true)
  .showTooltip({ threshold: true })
  .focusName('Average Joe')
  .marginLeftPercentage(25)
  .render(data);

amazingPhil
 .knotRadius(10)
 .ropeWidth(4)
 .showThreshold(true)
 .showTooltip({ threshold: true, top: true })
 .focusName('Phil')
 .marginLeftPercentage(25)
 .render(data);

james
 .knotRadius(10)
 .ropeWidth(4)
 .showThreshold(true)
 .showTooltip({ threshold: true, top: true })
 .focusName('James')
 .marginLeftPercentage(25)
 .render(data);

annie
 .knotRadius(10)
 .ropeWidth(4)
 .showThreshold(true)
 .showTooltip({ threshold: true })
 .focusName('Annie')
 .marginLeftPercentage(25)
 .render(data);