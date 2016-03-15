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
myRopeChart = ropeChart('div#myRopeChart');

myRopeChart({
  min: {value: 5, label: 'Country A'},
  max: {value: 95, label: 'Country B'},
  threshold: {value: 60, label: 'Region Average'},
  focus: {value: 45, label: 'Mongolia'}
});
```

# API Reference
<a name="ropeChart"></a>

## ropeChart
**Kind**: global class  

* [ropeChart](#ropeChart)
    * [new ropeChart(selection)](#new_ropeChart_new)
    * [.width([width])](#ropeChart+width) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>
    * [.height([height])](#ropeChart+height) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>
    * [.nodeRadius([nodeRadius])](#ropeChart+nodeRadius) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>
    * [.barWidth([barWidth])](#ropeChart+barWidth) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>
    * [.threshLineWidth([threshLineWidth])](#ropeChart+threshLineWidth) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>
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

<a name="ropeChart+nodeRadius"></a>

### ropeChart.nodeRadius([nodeRadius]) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>
Get/set the radius of "knot" circles at max, min, and focus value positions.

**Kind**: instance method of <code>[ropeChart](#ropeChart)</code>  
**Returns**: <code>Integer</code> - [Acts as getter if called with no parameter]<code>[ropeChart](#ropeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [nodeRadius] | <code>Integer</code> | <code>20</code> | 

<a name="ropeChart+barWidth"></a>

### ropeChart.barWidth([barWidth]) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>
Get/set the width of the "rope" rectangle.

**Kind**: instance method of <code>[ropeChart](#ropeChart)</code>  
**Returns**: <code>Integer</code> - [Acts as getter if called with no parameter]<code>[ropeChart](#ropeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [barWidth] | <code>Integer</code> | <code>20</code> | 

<a name="ropeChart+threshLineWidth"></a>

### ropeChart.threshLineWidth([threshLineWidth]) ⇒ <code>Integer</code> &#124; <code>[ropeChart](#ropeChart)</code>
Get/set the length of the horizontal "threshold" line.

**Kind**: instance method of <code>[ropeChart](#ropeChart)</code>  
**Returns**: <code>Integer</code> - [Acts as getter if called with no parameter]<code>[ropeChart](#ropeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [threshLineWidth] | <code>Integer</code> | <code>20</code> | 

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

