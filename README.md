![POLITICO](https://rawgithub.com/The-Politico/src/master/images/logo/badge.png)

# politico-turnout-chart

Chart module for _{your chart type here}_.

![](preview.png)

### Install
```bash
$ npm install --save git+ssh://git@github.com:The-Politico/graphic_politico-turnout-chart
```

##### Requirements

This module uses ES6 syntax. To use as a pre-compiled module, you'll need a compiler like [babel](https://babeljs.io/).

### Use

In the client, include the `global-chart.js` bundle, which defines a global chart object, `TurnoutChart`:

```html
<script src="some/path/to/global-chart.js"></script>
```

To use as a module, simply import the chart object:
```javascript
import TurnoutChart from 'politico-turnout-chart';
```

The chart object has three methods, one to create the chart, initially, another to update chart elements with new data, and one to resize the chart.

```javascript
var myChart = new TurnoutChart();

// The create method needs a selection string, which will be parent
// to the chart elements, and a data array. You can also provide an
// optional properties object.

const props = {
  stroke: 'orange',
};

myChart.create('#chart', data, props);

// The update method takes new data to update chart elements.
myChart.update(newData);

// The resize method can be called at any point to update the chart's size.
myChart.resize();
```

To apply this chart's default styles when using SCSS, simply define the variable `$TurnoutChart-container` to represent the ID or class of the chart's container(s) and import the `_chart-styles.scss` partial.

```CSS
$TurnoutChart-container: '#chart';

@import 'path/to/politico-turnout-chart/src/scss/_chart-styles';
```


### Developing the chart

Write your chart code in `chart.js` and add custom styles to `_chart-styles.scss`.

Run gulp to compile scripts:
```bash
$ gulp
```

To minimize javascript before publishing:
```bash
$ gulp --production
```

#### Writing idempotent chart functions

The chart module is structured around an idempotent chart function. Your chart's render method can be called anywhere and will produce the same chart as long as it's called with the same data parameters. This lets you create multiples of your chart easily as well as update the chart with new data.

To help you write idempotent chart functions, the module adds a custom method to d3. `appendSelect` will either append an element (with a class) if it doesn't exist or will return the selection of the existing element.

```javascript
selection.appendSelect(<selector_string>, <class_string>);
// class_string is optional
```

For example:

```javascript
function render(selection, data) {
  // Use this...
  var svg = d3.select(selection).appendSelect('svg', 'chart');
  // ... instead of awkward constructions like this...
  var svg = d3.select(selection).select('svg.chart').size() === 0 ?
    d3.select(selection).append('svg').attr('class', 'chart') :
    d3.select(selection).select('svg.chart');
  // ...
}
// ... so that you can call this function multiple times without
// creating duplicate svg elements.
render('myChart', data);
render('anotherChart', otherData);
render('myChart', newData);
```

#### Configurable chart options

Set configurable options on your chart's props object:

```javascript
// Set default options.
let props = {
  stroke: '#eee',
  fill: 'orange',
  legend: true,
  // etc.
};

// Then use these props in your chart's render method like this:
circles
  .attr('stroke', props.stroke)
  .attr('fill', props.fill);

// When you call your chart, pass custom props that will
// overwrite defaults.
myChart.create('#chart', data, { stroke: 'orange' });
```
# module-georgia-turnout-chart
