/**
 //   Initialize the dashboard visualizations
  **/

  // Use the list of sample names to populate the select options
 d3.json('/samples').then(data => {  
  // Grab a reference to the dropdown select element
  var selector = d3.select('#selDataset');

  var sampleNames = data['names'];

  sampleNames.sort((a,b) => (a-b));

  sampleNames.forEach(sample => {
    selector
      .append('option')
      .property('value', sample)
      .text(sample);        
  });

  // Use the first sample from the list to build the initial plots
  var firstSample = sampleNames[0];

  //we call the functions here to make our more user-friendly
  //that is, by making it display starting with index 0
  buildCharts(firstSample);
  buildMetadata(firstSample);
  });


  /** 
  //Hints: Create additional functions to build the charts,
  //           build the gauge chart, set up the metadata,
  //           and handle the event listeners
*/


/**
   buildCharts() function
**/
function buildCharts(sample) {
d3.json('/samples').then(data => {
  var samples = data['samples'];
  var resultArray = samples['filter'](sampleObj => sampleObj['id'] == sample);
  var result = resultArray[0];

  var otu_ids = result['otu_ids'];
  var otu_labels = result['otu_labels'];
  var sample_values = result['sample_values'];

  console.log(otu_ids);
  console.log(sample_values);

  /**
  // Build the Bubble Chart
 **/
  var bubbleLayout = {
    title: 'Bacteria Cultures Per Sample',
    xaxis: { title: 'OTU ID' }
  };
  
  var bubbleData = [
    {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    }
  ];

  Plotly.newPlot('bubble', bubbleData, bubbleLayout);

  /**
  // Build the Bar Chart
**/
  
  var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`);

  var barData = [
    {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks.reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h',
    }
  ];

  var barLayout = {
    title: 'Top 10 Bacteria Cultures Found',
    margin: { t: 30, l: 150 },
    xaxis: {'title': 'Sample Values'},
  };

  Plotly.newPlot('bar', barData, barLayout);
});
}

/**
// buildMetadata() function
**/

function buildMetadata(sample) {
d3.json('/samples').then((data) => {
  var metadata = data['metadata'];

  // Applying a filter to the data for
  var resultArray = metadata.filter(sampleObj => sampleObj['id'] == sample);
  var result = resultArray[0];
  
  // Use d3 to select `#sample-metadata` in HTML file
  var PANEL = d3.select('#sample-metadata');

  // The `.html('') will clear/remove any existing metadata
  PANEL.html('');

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  Object.entries(result).forEach(([key, value]) => {
    PANEL.append('h6').text(`${key.toUpperCase()}: ${value}`);
  });

  // Build the Gauge Chart
  wash_frequency = result.wfreq;
  buildGauge(wash_frequency);
 
});
}

/**
 // buildGauge() function
**/
function buildGauge(wash_frequency) {

var data = [
  {
    type: "indicator",
    mode: "gauge+number",
    value: wash_frequency,
    title: { text: "Weekly Wash Frequency", font: { size: 16 } },
    gauge: {
      axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
      bar: { color: "darkblue" },
      bgcolor: "white",
      borderwidth: 2,
      bordercolor: "gray",
      steps: [
        { range: [0, 9], color: "lavender" },
      ]
    }
  }
];

var layout = {
  width: 350,
  height: 300,
  margin: { t: 25, r: 25, l: 25, b: 25 },
  font: { size: 12 }
};

var GAUGE = d3.select('#gauge').node();
Plotly.newPlot(GAUGE, data, layout);

}

/**
//   optionChanged() function
**/
 function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
} 