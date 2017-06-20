import d3 from './d3';
import _ from 'lodash';

// This is the chart function that will be exported
export default () => ({

  // Develop the reusable function for your chart in this render function.
  // cf. https://bost.ocks.org/mike/chart/
  render() {
    // Set default chart properties in this object. Users can overwrite
    // them by passing a props object to the chart creator.
    let props = {
      stroke: '#eee',
    };

    // Inner chart function
    function chart(selection) {
      selection.each(function (data) { // eslint-disable-line func-names
        // "this" refers to the selection
        const bbox = this.getBoundingClientRect();
        // const width = bbox.width < bbox.height ? bbox.width : bbox.height;
        
        const t = d3.transition()
          .duration(750);

        const allPrecincts = data['precincts']


         // if only early voting data, don't return
        const completedPrecincts = _.pickBy(allPrecincts, d => {
          return d.june.completed;
        });

        let juneVote = 0;
        let aprilVote = 0;

        // parse our data and return an object of the values we need
        const aprilData = _.keys(allPrecincts).map(key => {
          const precinct = allPrecincts[key]
          const precincts = precinct.april.precinct
          const aprilBallotCast = precinct.april.ballots_cast;

          aprilVote += aprilBallotCast

          return {
            'precinct': precincts,
            'aprilAccumulatedVotes': aprilVote
          };
        });

        const juneData = _.keys(completedPrecincts).map(key => {
          const precinct = allPrecincts[key]
          const precincts = precinct.june.precinct
          const juneBallotCast = precinct.june.ballots_cast;

          juneVote += juneBallotCast


          return {
            'precinct': precincts,
            'juneAccumulatedVotes': juneVote,
          };
        });


        // BOOM! sort array of objects alphabetically
        // aprilData.sort(function(a, b) {
        //    return a.precinct.localeCompare(b.precinct);
        // });

        // juneData.sort(function(a, b) {
        //    return a.precinct.localeCompare(b.precinct);
        // });
        // aprilData.sort(function(a, b) {
        //     return a.aprilAccumulatedVotes - b.aprilAccumulatedVotes;
        // });



        // D3 chart
        const margin = {
          top: 20,
          right: 15,
          bottom: 30,
          left: 40
        };

        const width = bbox.width - margin.left - margin.right;
        const height = width/1.5;

        // set the ranges
        // const x = d3.scaleOrdinal()
        //   .range([0, width]);  

        const x =d3.scaleBand().rangeRound([0, width]).padding(0.1)

        const y = d3.scaleLinear()
          .range([height, 0])

        // // Define the line
        const line = d3.line() 
          .x(function(d) { return x(d.precinct); })
          .y(function(d) { return y(d["aprilAccumulatedVotes"]); });

        const svg = d3.select(this).appendSelect('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
        .appendSelect('g')
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        x.domain(aprilData.map(function(d) { return d.precinct; }));
        y.domain([0, d3.max(aprilData, function(d) { return d["aprilAccumulatedVotes"]; })]);


        svg.append("path")
          .datum(aprilData)
          .attr("class", "line")
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("d", line);

        svg.selectAll("circle")
          .data(aprilData)
        .enter().append("circle")
          .attr("class", "circle")
          .attr("cx", function(d) { return x(d.precinct); })
          .attr("cy", function(d) { return y(d["aprilAccumulatedVotes"]); })
          .attr("r", 3)
          .style("fill", "steelblue")


        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        // add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

      });
    }

    // Getter-setters merge any provided properties with defaults.
    chart.props = (obj) => {
      if (!obj) return props;
      props = Object.assign(props, obj);
      return chart;
    };

    return chart;
  },


  // This function actually draws the chart using the
  // idempotent render function.
  draw() {
    const chart = this.render()
        .props(this._props);

    d3.select(this._selection)
      .datum(this._data)
      .call(chart);
  },

  // Creates the chart initially.
  create(selection, data, props) {
    this._selection = selection;
    this._data = data;
    this._props = props || {};

    this.draw();
  },

  // Updates the elements with new data.
  update(data) {
    this._data = data;
    this.draw();
  },

  // Resizes the chart.
  resize() {
    this.draw();
  },
});
