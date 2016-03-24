var myRopeChart = RopeChart('div#myRopeChart');
var data = [{name:'Bill',value:'33'},
            {name:'Bob',value:'54'},
            {name:'Janet',value:'21'},
            {name:'Phil',value:'60'},
            {name:'James',value:'29'},
            {name:'Annie',value:'36'},
            {name:'Eloise',value:'44'}];

myRopeChart
  .knotRadius(5)
  .ropeWidth(2)
  .showAverage(true)
  .focusName('Annie')
  .render(data);