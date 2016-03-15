var myRopeChart = ropeChart('div#myRopeChart');
var data = {
  min: {value: 5, label: 'Country A'},
  max: {value: 95, label: 'Country B'},
  threshold: {value: 60, label: 'Region Average'},
  focus: {value: 45, label: 'Mongolia'}
};

myRopeChart.render(data);