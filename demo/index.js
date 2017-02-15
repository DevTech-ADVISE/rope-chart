var myRopeChart = RopeChart('div#myRopeChart');
var averageJoe = RopeChart('div#averageJoe');
var amazingPhil = RopeChart('div#amazingPhil');
var james = RopeChart('div#james');
var annie = RopeChart('div#annie');
var zero = RopeChart('div#zero');

var data = [
  {name:'Average Joe',value:'43'},
  {name:'Bob',value:'38'},
  {name:'Janet',value:'21'},
  {name:'Phil',value:'60'},
  {name:'James',value:'22'},
  {name:'Annie',value: '57'},
  {name:'Eloise',value:'41'},
	{name: 'Bill', value: '60'},
  {name:'Zero', value:'0'}
];

var zeroData = [
  {name:'Zero',value:'0'},
  {name:'Average Joe',value:'0'},
  {name:'Bob',value:'0'},
  {name:'Janet',value:'0'},
  {name:'Phil',value:'0'},
  {name:'James',value:'0'},
  {name:'Annie',value: '0'},
  {name:'Eloise',value:'0'}
];

myRopeChart
  .knotRadius(10)
  .ropeWidth(4)
  .showThreshold(true)
  .focusName('Eloise')
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
 .render(data);

zero
 .knotRadius(10)
 .ropeWidth(4)
 .showThreshold(true)
 .focusName('Zero')
 .marginLeftPercentage(25)
 .render(zeroData);