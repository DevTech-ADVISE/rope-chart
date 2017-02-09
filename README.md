# ropeChart

The rope chart provides a simplified visualization of where a particular value lies within a group.

Look at the [Demo](http://BI.github.io/rope-chart)

# Getting Started

LollipopChart is a UMD module, you can add the javascript in a scripts tag or require it using something like webpack. D3 must either be available in the global namespace or bundled in with your bundle tool. For the global namespace method download lollipopChart.js, put something like the following in your and you should be good to go.

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
var data = [
  {value: 5, label: 'Foo'},
  {value: 95, label: 'Bar'},
  {value: 60, label: 'Baz'},
  {value: 45, label: 'Qux'}
];

var myRopeChart = ropeChart('div#myRopeChart');
	.data(data)
	.width(250)
	.height(250)
	.ropeWidth(10)
	.knotRadius(10)
	.render();
```

# API Reference
<a name="RopeChart"></a>

## RopeChart
**Kind**: global class  

* [RopeChart](#RopeChart)
    * [new RopeChart(selection)](#new_RopeChart_new)
    * [.render([data])](#RopeChart+render) ⇒ <code>[RopeChart](#RopeChart)</code>
    * [.data([data])](#RopeChart+data) ⇒ <code>Object</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.yScale([d3 scale])](#RopeChart+yScale) ⇒ <code>Object</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.width()](#RopeChart+width) ⇒ <code>Object</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.width([width])](#RopeChart+width) ⇒ <code>Integer</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.height([height])](#RopeChart+height) ⇒ <code>Integer</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.marginLeftPercentage([percentage])](#RopeChart+marginLeftPercentage) ⇒ <code>Integer</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.knotRadius([knotRadius])](#RopeChart+knotRadius) ⇒ <code>Integer</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.ropeWidth([ropeWidth])](#RopeChart+ropeWidth) ⇒ <code>Integer</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.chartGutter([chartGutter])](#RopeChart+chartGutter) ⇒ <code>Integer</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.flipDirection([flipDirection])](#RopeChart+flipDirection) ⇒ <code>Boolean</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.showThreshold([showThreshold])](#RopeChart+showThreshold) ⇒ <code>Boolean</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.thresholdLabel([thresholdLabel])](#RopeChart+thresholdLabel) ⇒ <code>String</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.thresholdGenerator([function])](#RopeChart+thresholdGenerator) ⇒ <code>function</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.labelMargin([labelMargin])](#RopeChart+labelMargin) ⇒ <code>Integer</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.valueAccessor([valueAccessorFunction])](#RopeChart+valueAccessor) ⇒ <code>function</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.nameAccessor([nameAccessorFunction])](#RopeChart+nameAccessor) ⇒ <code>function</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.valueDisplayFormatter([valueFormatterFunction])](#RopeChart+valueDisplayFormatter) ⇒ <code>function</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.tooltipContent([tooltipContentFunction])](#RopeChart+tooltipContent) ⇒ <code>function</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.showTooltip([showTooltip])](#RopeChart+showTooltip) ⇒ <code>function</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.handleTooltipExternally([handleTooltipExternally])](#RopeChart+handleTooltipExternally) ⇒ <code>function</code> &#124; <code>[RopeChart](#RopeChart)</code>
    * [.tooltipLabel([tooltipLabel])](#RopeChart+tooltipLabel) ⇒ <code>function</code> &#124; <code>[RopeChart](#RopeChart)</code>

<a name="new_RopeChart_new"></a>

### new RopeChart(selection)
Rope chart implementation.


| Param | Type | Description |
| --- | --- | --- |
| selection | <code>String</code> | any valid d3 selector. This selector is used to place the chart. |

<a name="RopeChart+render"></a>

### ropeChart.render([data]) ⇒ <code>[RopeChart](#RopeChart)</code>
Render the RopeChart instance. Simply renders chart when called with no parameter. Updates data, then renders, if called with parameter

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  

| Param | Type |
| --- | --- |
| [data] | <code>Object</code> | 

<a name="RopeChart+data"></a>

### ropeChart.data([data]) ⇒ <code>Object</code> &#124; <code>[RopeChart](#RopeChart)</code>
Get/set the data for the RopeChart instance

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>Object</code> - [Acts as getter if called with no parameter]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [data] | <code>Object</code> | 

<a name="RopeChart+yScale"></a>

### ropeChart.yScale([d3 scale]) ⇒ <code>Object</code> &#124; <code>[RopeChart](#RopeChart)</code>
Get/set the y-scale

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>Object</code> - [Acts as getter if called with no parameter. Returns the y-scale used to place knots on the rope.]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [d3 scale] | <code>object</code> | 

<a name="RopeChart+width"></a>

### ropeChart.width() ⇒ <code>Object</code> &#124; <code>[RopeChart](#RopeChart)</code>
Get/set the name/key used to access the "focus" item for the chart. The "focus" is the member of the data set that you want to compare to the rest of the group.

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>Object</code> - [Acts as getter if called with no parameter. Returns a record from your data set.]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [recordName - should be the value of the name property for the record you want as your focus.] | <code>String</code> | 

<a name="RopeChart+width"></a>

### ropeChart.width([width]) ⇒ <code>Integer</code> &#124; <code>[RopeChart](#RopeChart)</code>
Get/set the width of the chart SVG

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>Integer</code> - [Acts as getter if called with no parameter]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [width] | <code>Integer</code> | <code>500</code> | 

<a name="RopeChart+height"></a>

### ropeChart.height([height]) ⇒ <code>Integer</code> &#124; <code>[RopeChart](#RopeChart)</code>
Get/set the height of the chart SVG

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>Integer</code> - [Acts as getter if called with no parameter]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [height] | <code>Integer</code> | <code>500</code> | 

<a name="RopeChart+marginLeftPercentage"></a>

### ropeChart.marginLeftPercentage([percentage]) ⇒ <code>Integer</code> &#124; <code>[RopeChart](#RopeChart)</code>
Get/set the position of the rope horizontally from the left

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>Integer</code> - [Acts as getter if called with no parameter]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [percentage] | <code>Integer</code> | <code>50</code> | 

<a name="RopeChart+knotRadius"></a>

### ropeChart.knotRadius([knotRadius]) ⇒ <code>Integer</code> &#124; <code>[RopeChart](#RopeChart)</code>
Get/set the radius of "knot" circles at max, min, and focus value positions.

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>Integer</code> - [Acts as getter if called with no parameter]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [knotRadius] | <code>Integer</code> | <code>20</code> | 

<a name="RopeChart+ropeWidth"></a>

### ropeChart.ropeWidth([ropeWidth]) ⇒ <code>Integer</code> &#124; <code>[RopeChart](#RopeChart)</code>
Get/set the width of the "rope" rectangle.

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>Integer</code> - [Acts as getter if called with no parameter]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [ropeWidth] | <code>Integer</code> | <code>20</code> | 

<a name="RopeChart+chartGutter"></a>

### ropeChart.chartGutter([chartGutter]) ⇒ <code>Integer</code> &#124; <code>[RopeChart](#RopeChart)</code>
Get/set the chart gutter to account for the knot radius

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>Integer</code> - [Acts as getter if called with no parameter]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [chartGutter] | <code>Integer</code> | <code>knotRadius</code> | 

<a name="RopeChart+flipDirection"></a>

### ropeChart.flipDirection([flipDirection]) ⇒ <code>Boolean</code> &#124; <code>[RopeChart](#RopeChart)</code>
Get/set boolean that "flips direction" of the "good"/"bad" sides of threshold. By default the top knot is the max value, and bottom knot is the min value.

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>Boolean</code> - [Acts as getter if called with no parameter]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [flipDirection] | <code>Boolean</code> | <code>false</code> | 

<a name="RopeChart+showThreshold"></a>

### ropeChart.showThreshold([showThreshold]) ⇒ <code>Boolean</code> &#124; <code>[RopeChart](#RopeChart)</code>
Get/set boolean that toggles display of a "knot" for the threshold.

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>Boolean</code> - [Acts as getter if called with no parameter]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [showThreshold] | <code>Boolean</code> | <code>false</code> | 

<a name="RopeChart+thresholdLabel"></a>

### ropeChart.thresholdLabel([thresholdLabel]) ⇒ <code>String</code> &#124; <code>[RopeChart](#RopeChart)</code>
Get/set label for threshold knot location.

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>String</code> - [Acts as getter if called with no parameter]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [thresholdLabel] | <code>String</code> | <code>&quot;Average&quot;</code> | 

<a name="RopeChart+thresholdGenerator"></a>

### ropeChart.thresholdGenerator([function]) ⇒ <code>function</code> &#124; <code>[RopeChart](#RopeChart)</code>
Get/set the threshold generator function

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>function</code> - [Acts as getter if called with no parameter. Returns the threshold function that returns the value for the threshold knot.]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [function] | <code>function</code> | 

<a name="RopeChart+labelMargin"></a>

### ropeChart.labelMargin([labelMargin]) ⇒ <code>Integer</code> &#124; <code>[RopeChart](#RopeChart)</code>
Get/set the margin between labels and "knot" circles.

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>Integer</code> - [Acts as getter if called with no parameter]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type | Default |
| --- | --- | --- |
| [labelMargin] | <code>Integer</code> | <code>5</code> | 

<a name="RopeChart+valueAccessor"></a>

### ropeChart.valueAccessor([valueAccessorFunction]) ⇒ <code>function</code> &#124; <code>[RopeChart](#RopeChart)</code>
Get/set the function used to access "value" property from each data record. Defaults to: 
```
function (d){ return d.value; }
```

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>function</code> - [Acts as getter if called with no parameter]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [valueAccessorFunction] | <code>function</code> | 

<a name="RopeChart+nameAccessor"></a>

### ropeChart.nameAccessor([nameAccessorFunction]) ⇒ <code>function</code> &#124; <code>[RopeChart](#RopeChart)</code>
Get/set the function used to access "name" property from each data record. Defaults to: 
```
function (d){ return d.name; }
```

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>function</code> - [Acts as getter if called with no parameter]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [nameAccessorFunction] | <code>function</code> | 

<a name="RopeChart+valueDisplayFormatter"></a>

### ropeChart.valueDisplayFormatter([valueFormatterFunction]) ⇒ <code>function</code> &#124; <code>[RopeChart](#RopeChart)</code>
Get/set the function to format the display of data values shown next to the knots

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>function</code> - [Acts as getter if called with no parameter]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [valueFormatterFunction] | <code>function</code> | 

<a name="RopeChart+tooltipContent"></a>

### ropeChart.tooltipContent([tooltipContentFunction]) ⇒ <code>function</code> &#124; <code>[RopeChart](#RopeChart)</code>
Get/set function used to set the tooltip of each data knot. Defaults to: 
```
 var tooltipContentFunc = function(d) {
   var tooltipContent = "<label>Name: </label>" + chart.nameAccessor()(d);
   tooltipContent += "<br/><label>Value: " + chart.valueAccessor()(d);

   return tooltipContent;
 };
```

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>function</code> - [Acts as getter if called with no parameter]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [tooltipContentFunction] | <code>function</code> | 

<a name="RopeChart+showTooltip"></a>

### ropeChart.showTooltip([showTooltip]) ⇒ <code>function</code> &#124; <code>[RopeChart](#RopeChart)</code>
Set whether or not to show the tooltip. The tooltip gets displayed next to the threshold knot

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>function</code> - [Acts as getter if called with no parameter]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [showTooltip] | <code>boolean</code> | 

<a name="RopeChart+handleTooltipExternally"></a>

### ropeChart.handleTooltipExternally([handleTooltipExternally]) ⇒ <code>function</code> &#124; <code>[RopeChart](#RopeChart)</code>
Get/Set whether or not the tooltip generation will be handled outside the chart
This can be useful if the standard d3-tip solution doesn't fit your needs

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>function</code> - [Acts as getter if called with no parameter]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [handleTooltipExternally] | <code>boolean</code> | 

<a name="RopeChart+tooltipLabel"></a>

### ropeChart.tooltipLabel([tooltipLabel]) ⇒ <code>function</code> &#124; <code>[RopeChart](#RopeChart)</code>
Set the text, that when hovered over will display the tooltip. The text gets displayed next to the threshold knot. It accepts unicode codes, so you can include icons from something like font-awesome if you have the unicode.

**Kind**: instance method of <code>[RopeChart](#RopeChart)</code>  
**Returns**: <code>function</code> - [Acts as getter if called with no parameter]<code>[RopeChart](#RopeChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [tooltipLabel] | <code>string</code> | 

