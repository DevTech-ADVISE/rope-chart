# ropeChart

The rope chart provides a simplified visualization of where a particular value lies within a group.

# Getting Started

For now, you must use a script tag to include ropeChart. D3 must be available in the global namespace as well. Download ropeChart.js, put something like the following in your <head> and you should be good to go.

```
<script src="d3.js" charset="utf-8"></script>
<script src="ropeChart.js" charset="utf-8"></script>
```

# Example

HTML would look something like this

```
<!DOCTYPE html>
<html lang="en-US">
	<head>
		<script src="d3.js" charset="utf-8"></script>
		<script src="ropeChart.js" charset="utf-8"></script>
		
	</head>
	<body>
		<div id="myRopeChart"></div>	
	</body>
	<script src="index.js"></script>
</html>
```

And the index.js here would contain something like this

```
var data = {
  min: {value: 5, label: 'Country A'},
  max: {value: 95, label: 'Country B'},
  threshold: {value: 60, label: 'Region Average'},
  focus: {value: 45, label: 'Mongolia'}
}

var myRopeChart = ropeChart('div#myRopeChart');
	.data(data)
	.width(250)
	.height(250)
	.ropeWidth(10)
	.knotRadius(10)
	.render();
```

# API Reference
<a name="ropeChart"></a>

## ropeChart
**Kind**: global class  

* [ropeChart](#ropeChart)
    * [new ropeChart(selection)](#new_ropeChart_new)
    * [.data()](#ropeChart+data) ⇒ <code>[ropeChart](#ropeChart)</code>
    * [.data([none])](#ropeChart+data) ⇒ <code>Object</code> &#124; <code>[ropeChart](#ropeChart)</code>
    * [.width([width])](#ropeChart+width) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>
    * [.height([height])](#ropeChart+height) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>
    * [.knotRadius([knotRadius])](#ropeChart+knotRadius) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>
    * [.ropeWidth([ropeWidth])](#ropeChart+ropeWidth) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>
    * [.threshLineLength([threshLineLength])](#ropeChart+threshLineLength) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>
    * [.goodColor([goodColor])](#ropeChart+goodColor) ⇒ <code>String</code> &#124; <code>[ropeChart](#ropeChart)</code>
    * [.badColor([goodColor])](#ropeChart+badColor) ⇒ <code>String</code> &#124; <code>[ropeChart](#ropeChart)</code>
    * [.flipDirection([flipDirection])](#ropeChart+flipDirection) ⇒ <code>Boolean</code> &#124; <code>[ropeChart](#ropeChart)</code>
    * [.labelMargin([labelMargin])](#ropeChart+labelMargin) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>

<a name="new_ropeChart_new"></a>

### new ropeChart(selection)
Rope chart implementation.


| Param | Type | Description |
| --- | --- | --- |
| selection | <code>String</code> | any valid d3 selector. This selector is used to place the chart. |

<a name="ropeChart+data"></a>

### ropeChart.data() ⇒ <code>[ropeChart](#ropeChart)</code>
Render the ropeChart instance. Simply renders chart when called with no parameter. Updates data, then renders, if called with parameter

**Kind**: instance method of <code>[ropeChart](#ropeChart)</code>  

| Type |
| --- |
| <code>Object</code> | 

<a name="ropeChart+data"></a>

### ropeChart.data([none]) ⇒ <code>Object</code> &#124; <code>[ropeChart](#ropeChart)</code>
Get/set the data for the ropeChart instance

**Kind**: instance method of <code>[ropeChart](#ropeChart)</code>  
**Returns**: <code>Object</code> - [Acts as getter if called with no parameter]<code>[ropeChart](#ropeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [none] | <code>Object</code> | 

<a name="ropeChart+width"></a>

### ropeChart.width([width]) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>
Get/set the width of the chart SVG

**Kind**: instance method of <code>[ropeChart](#ropeChart)</code>  
**Returns**: <code>Integer</code> - [Acts as getter if called with no parameter]<code>[ropeChart](#ropeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [width] | <code>Integer</code> | <code>500</code> | 

<a name="ropeChart+height"></a>

### ropeChart.height([height]) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>
Get/set the height of the chart SVG

**Kind**: instance method of <code>[ropeChart](#ropeChart)</code>  
**Returns**: <code>Integer</code> - [Acts as getter if called with no parameter]<code>[ropeChart](#ropeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [height] | <code>Integer</code> | <code>500</code> | 

<a name="ropeChart+knotRadius"></a>

### ropeChart.knotRadius([knotRadius]) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>
Get/set the radius of "knot" circles at max, min, and focus value positions.

**Kind**: instance method of <code>[ropeChart](#ropeChart)</code>  
**Returns**: <code>Integer</code> - [Acts as getter if called with no parameter]<code>[ropeChart](#ropeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [knotRadius] | <code>Integer</code> | <code>20</code> | 

<a name="ropeChart+ropeWidth"></a>

### ropeChart.ropeWidth([ropeWidth]) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>
Get/set the width of the "rope" rectangle.

**Kind**: instance method of <code>[ropeChart](#ropeChart)</code>  
**Returns**: <code>Integer</code> - [Acts as getter if called with no parameter]<code>[ropeChart](#ropeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [ropeWidth] | <code>Integer</code> | <code>20</code> | 

<a name="ropeChart+threshLineLength"></a>

### ropeChart.threshLineLength([threshLineLength]) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>
Get/set the length of the horizontal "threshold" line.

**Kind**: instance method of <code>[ropeChart](#ropeChart)</code>  
**Returns**: <code>Integer</code> - [Acts as getter if called with no parameter]<code>[ropeChart](#ropeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [threshLineLength] | <code>Integer</code> | <code>20</code> | 

<a name="ropeChart+goodColor"></a>

### ropeChart.goodColor([goodColor]) ⇒ <code>String</code> &#124; <code>[ropeChart](#ropeChart)</code>
Get/set the color used on the "good" side of the threshold.

**Kind**: instance method of <code>[ropeChart](#ropeChart)</code>  
**Returns**: <code>String</code> - [Acts as getter if called with no parameter]<code>[ropeChart](#ropeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [goodColor] | <code>String</code> | <code>green</code> | 

<a name="ropeChart+badColor"></a>

### ropeChart.badColor([goodColor]) ⇒ <code>String</code> &#124; <code>[ropeChart](#ropeChart)</code>
Get/set the color used on the "bad" side of the threshold.

**Kind**: instance method of <code>[ropeChart](#ropeChart)</code>  
**Returns**: <code>String</code> - [Acts as getter if called with no parameter]<code>[ropeChart](#ropeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [goodColor] | <code>String</code> | <code>red</code> | 

<a name="ropeChart+flipDirection"></a>

### ropeChart.flipDirection([flipDirection]) ⇒ <code>Boolean</code> &#124; <code>[ropeChart](#ropeChart)</code>
Get/set boolean that "flips direction" of the "good"/"bad" sides of threshold. By default the top section is "good" (green). If flipDirection is true, then top section becomes "bad" (red).

**Kind**: instance method of <code>[ropeChart](#ropeChart)</code>  
**Returns**: <code>Boolean</code> - [Acts as getter if called with no parameter]<code>[ropeChart](#ropeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [flipDirection] | <code>Boolean</code> | <code>false</code> | 

<a name="ropeChart+labelMargin"></a>

### ropeChart.labelMargin([labelMargin]) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>
Get/set the margin between labels and "knot" circles.

**Kind**: instance method of <code>[ropeChart](#ropeChart)</code>  
**Returns**: <code>Integer</code> - [Acts as getter if called with no parameter]<code>[ropeChart](#ropeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [labelMargin] | <code>Integer</code> | <code>5</code> | 

