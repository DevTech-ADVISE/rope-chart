var myRopeChart = RopeChart('div#myRopeChart');
var data = [{name:'Bill',value:'33'},
            {name:'Bob',value:'54'},
            {name:'Janet',value:'21'},
            {name:'Phil',value:'60'},
            {name:'James',value:'29'},
            {name:'Annie',value:'36'},
            {name:'Eloise',value:'44'}];

myRopeChart
  .knotRadius(10)
  .ropeWidth(4)
  .showAverage(true)
  .focusName('Annie')
  .render(data);

var chartWithEdgeCases = RopeChart('div#ropeChartEdgeCases');
var data = [{name:'Bill',value:'33'},
            {name:'Bob',value:'54'},
            {name:'Janet',value:'21'},
            {name:'Phil',value:'60'},
            {name:'James',value:'29'},
            {name:'Annie',value:'36'},
            {name:'Eloise',value:'44'},
            {name:'Average Joe', value: '21'}];

chartWithEdgeCases
  .knotRadius(10)
  .ropeWidth(4)
  .showAverage(true)
  .focusName('Average Joe')
  .render(data);