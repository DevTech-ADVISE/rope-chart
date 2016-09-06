var myRopeChart = RopeChart('div#myRopeChart');
var averageJoe = RopeChart('div#averageJoe');
var amazingPhil = RopeChart('div#amazingPhil');
var james = RopeChart('div#james');
var annie = RopeChart('div#annie');

var data = [
  {name:'Average Joe',value:'43'},
  {name:'Bob',value:'41'},
  {name:'Janet',value:'21'},
  {name:'Phil',value:'60'},
  {name:'James',value:'22'},
  {name:'Annie',value: '57'},
  {name:'Eloise',value:'41'},
  {name: 'Bill', value: '60'}
];

myRopeChart
  .knotRadius(10)
  .ropeWidth(4)
  .showThreshold(true)
  .focusName('Bob')
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