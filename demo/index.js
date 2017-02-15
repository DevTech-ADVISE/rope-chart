var myRopeChart = RopeChart('div#myRopeChart');
var averageJoe = RopeChart('div#averageJoe');
var amazingPhil = RopeChart('div#amazingPhil');
var james = RopeChart('div#james');
var annie = RopeChart('div#annie');
var zero = RopeChart('div#zero');

var fullData = [
  {name:'Zero',value:'0'},
  {name:'Average Joe',value:'40'},
  {name:'Bob',value:'38'},
  {name:'Janet',value:'21'},
  {name:'Phil',value:'60'},
  {name:'James',value:'22'},
  {name:'Annie',value: '57'},
  {name:'Eloise',value:'41'}
];

var data = [
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
  .focusName('Bob')
  .tooltipContent(function(d) { return "Custom markup showing <em>" + d.label + "</em> score is <em>" + d.value + "</em>"; })
  .tooltipLabel('&#128129;')
  .render(fullData);

averageJoe
  .knotRadius(10)
  .ropeWidth(4)
  .showThreshold(true)
  .focusName('Average Joe')
  .render(fullData);

amazingPhil
 .knotRadius(10)
 .ropeWidth(4)
 .showThreshold(true)
 .focusName('Phil')
 .render(fullData);

james
 .knotRadius(10)
 .ropeWidth(4)
 .showThreshold(true)
 .focusName('James')
 .render(fullData);

annie
 .knotRadius(10)
 .ropeWidth(4)
 .showThreshold(true)
 .focusName('Annie')
 .render(fullData);

zero
 .knotRadius(10)
 .ropeWidth(4)
 .showThreshold(true)
 .focusName('Zero')
 .render(data);