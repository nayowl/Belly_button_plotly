function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}



// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var sampleData=data.samples;
    var sampleMetaData=data.metadata;
    // Create a variable that filters the samples for the object with the desired sample number.
    var filteredDataArray=sampleData.filter(sampleObj=>sampleObj.id==sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray=sampleMetaData.filter(row=>row.id==sample);

    console.log (metadataArray);
    // Create a variable that holds the first sample in the array.
    var resultData=filteredDataArray[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    var metaResultData=metadataArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids=resultData.otu_ids;
    var otu_labels=resultData.otu_labels;
    var sample_values=resultData.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var wash_freq=parseFloat(metaResultData.wfreq);
    // Create the yticks for the bar chart.
    var yticks = otu_ids.slice(0,10).map(id=>"OTU "+id).reverse()
    var xticks= sample_values.slice(0,10).map(id=>id).reverse()
    var hlabel= otu_labels.slice(0,10).map(id=>id).reverse()
    // Bar chart
    var barData = [{
      x:xticks,
      y:yticks,
      type:'bar',
      orientation:"h",
      text:hlabel,
      marker: {
        color: 'rgba(58,200,225,.5)',
        line: {
          color: 'rgb(8,48,107)',
          width: 1.5
        }
    
      }
    }];
    //  Create the layout for the bar chart. 
    var barLayout = {
      title: "TOP 10 Bacteria Cultures Found",
      paper_bgcolor:'rgba(0,0,0,0)',
      plot_bgcolor:'rgba(0,0,0,0)',
      font: {
        size: 12,
        color: '#FFFFFF'
    
      }
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    //  Create the trace for the bubble chart.
    var bubbleData = [
      {
        x:otu_ids,
        y:sample_values,
        text:otu_labels,
        mode:"markers",
        marker:{size:sample_values,color:otu_ids,colorscale:'Portland'},
        


      }
   
    ];

    //  Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis:{title:"OTU ID"},
      hovermode:'closest',
      height: 600,
      width:1200,
      paper_bgcolor:'rgba(0,0,0,0)',
      plot_bgcolor:'rgba(0,0,0,0)',
      font: {
        size: 12,
        color: '#FFFFFF'
    
      }
    };

    //  Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 
   
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
     {
      value:wash_freq,
      type:"indicator",
      mode:"gauge+number",
      title: { text: "Scrubs Per Week",font: { size: 16 } },
      gauge: { axis: { range: [null, 10] },
      bar: { color: "black" },
      steps: [
        { range: [0, 2], color: "orangered" },
        { range: [2, 4], color: "darkorange" },
        { range: [4, 6], color: "gold" },
        { range: [6, 8], color: "yellowgreen" },
        { range: [8, 10], color: "forestgreen" }]
    
    
    
    } ,
     
     }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: 'Belly Button Washing Frequency',
      titlefont: {"size": 25},
      width: 400,
      height: 300,
      paper_bgcolor:'rgba(0,0,0,0)',
      plot_bgcolor:'rgba(0,0,0,0)',
      font: {
        size: 12,
        color: '#FFFFFF'
    
      }
     // margin: { t: 25, r: 25, l: 25, b: 25 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);
  });
}
