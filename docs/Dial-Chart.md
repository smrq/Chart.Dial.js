---
title: Dial Charts
anchor: dial-chart
---
###Introduction

A dial chart is a way of showing a single point of data relative to a maximum possible value.

### Example usage

```javascript
var myDialChart = new Chart(ctx).Dial(data, options);
```

### Data structure

```javascript
var data = {
	value: 300,
	maxValue: 500,
	color: 'rgba(220, 22, 22, 1)',
	background: 'rgba(250, 240, 240, 1)'
};
```

### Chart options

These are the customisation options specific to Dial charts. These options are merged with the [global chart configuration options](#getting-started-global-chart-configuration), and form the options of the chart.

```javascript
{
	//Number - The size of the dial arc as a percentage of a circle
	percentageArc: 70,

	//Number - The percentage of the chart that we cut out of the middle
	percentageInnerCutout: 70,

	//Number - Amount of animation steps
	animationSteps: 100,

	//String - Animation easing effect
	animationEasing: "easeOutBounce",

	{% raw %}
	//String - A legend template
	legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><li><span style=\"background-color:<%=segment.fillColor%>\"></span><%if(segment.label){%><%=segment.label%><%}%></li></ul>"
	{% endraw %}
}
```
You can override these for your `Chart` instance by passing a second argument into the `Dial` method as an object with the keys you want to override.

For example, we could have a dial chart with a larger arc:

```javascript
new Chart(ctx).Dial(data, {
	percentageArc: 80
});
// This will create a chart with all of the default options, merged from the global config,
// and the Dial chart defaults but this particular instance will have `percentageArc` set to `80`.
```

We can also change these default values for each Dial type that is created, this object is available at `Chart.defaults.Dial`.

### Prototype methods

#### .update( )

Calling `update()` on your Chart instance will re-render the chart with any updated values, allowing you to edit the value of multiple existing points, then render those in one animated render loop.

```javascript
myDialChart.value = 10;
myDialChart.update();
// Calling update now animates the value of the dial from its current value to 10.
```
