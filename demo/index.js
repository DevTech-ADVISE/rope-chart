var myRopeChart = RopeChart('div#myRopeChart');
var averageJoe = RopeChart('div#averageJoe');
var amazingPhil = RopeChart('div#amazingPhil');
var james = RopeChart('div#james');
var annie = RopeChart('div#annie');

var data = [
  {name:'Average Joe',value:'40'},
  {name:'Bob',value:'38'},
  {name:'Janet',value:'21'},
  {name:'Phil',value:'60'},
  {name:'James',value:'22'},
  {name:'Annie',value: '59'},
  {name:'Eloise',value:'41'}
];

myRopeChart
  .knotRadius(10)
  .ropeWidth(4)
  .showAverage(true)
  .focusName('Bob')
  .render(data);



averageJoe
  .knotRadius(10)
  .ropeWidth(4)
  .showAverage(true)
  .focusName('Average Joe')
  .render(data);

amazingPhil
 .knotRadius(10)
 .ropeWidth(4)
 .showAverage(true)
 .focusName('Phil')
 .render(data);

james
 .knotRadius(10)
 .ropeWidth(4)
 .showAverage(true)
 .focusName('James')
 .render(data);

annie
 .knotRadius(10)
 .ropeWidth(4)
 .showAverage(true)
 .focusName('Annie')
 .render(data);