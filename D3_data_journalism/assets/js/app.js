// Define SVG attributes
var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;
var margin = { top: 20, right: 40, bottom: 100, left: 100 };
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG object
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append an SVG group
var chart = svg.append("g");

// Read in data from the CSV file
d3.csv("assets/data/data.csv", function (err, myData) {
  console.log("assets/data/data.csv")

  if (err) throw err;

  myData.forEach(function (data) {
    data.poverty = Number(data.poverty);
    data.age = Number(data.age);
    data.income = Number(data.income);
    data.obese = Number(data.obesity);
    data.smokes = Number(data.smokes);
    data.healthcard = Number(data.healthcare);
  });

  console.log(myData);

  // Scatter plot X & Y axis computation
  var yScale = d3.scaleLinear().range([height, 0]);
  var xScale = d3.scaleLinear().range([0, width]);

  // Create scaled X and Y axis
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // Column's minimum and maximum values in data.csv
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  // Function to identify the minimum and maximum values for X-axis
  function findMinAndMax_X(dataColumnX) {
    xMin = d3.min(myData, function (data) {
      return Number(data[dataColumnX]) * 0.8;
    });

    xMax = d3.max(myData, function (data) {
      return Number(data[dataColumnX]) * 1.1;
    });
  }

  // Function to identify the minimum and maximum values for Y-axis
  function findMinAndMax_Y(dataColumnY) {
    yMin = d3.min(myData, function (data) {
      return Number(data[dataColumnY]) * 0.5;
    });

    yMax = d3.max(myData, function (data) {
      return Number(data[dataColumnY]) * 1.1;
    });
  }

  // Default label for X-axis is 'poverty and for Y-axis is 'obese' 
  // Another axis can be assigned to the variable during an onclick event.
  var currentAxisLabelX = "poverty";

  var currentAxisLabelY = "obese";

  writeAnalysis(currentAxisLabelX, currentAxisLabelY);

  // Find the minimum and maximum values for X-axis and Y-axis
  findMinAndMax_X(currentAxisLabelX);
  findMinAndMax_Y(currentAxisLabelY);

  // Scatter plot X & Y axis computation
  xScale.domain([xMin, xMax]);
  yScale.domain([yMin, yMax]);

  // Tool Tip box to show state, X stats, and Y stats
  var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    // Define position
    .offset([80, -60])
    // The html() method allows mix of JS and HTML in callback function
    .html(function (data) {
      var stateName = data.state;
      var data_X = Number(data[currentAxisLabelX]);
      var data_Y = Number(data[currentAxisLabelY]);

      return stateName + "<hr>" + currentAxisLabelX + ": " + data_X + "%<br>" + currentAxisLabelY + ": " + data_Y + "%";
    });

  // Create tooltip
  chart.call(toolTip);

  // Append the circles for each row of data
  chart
    .selectAll("circle")
    .data(myData)
    .enter()
    .append("circle")
    .attr("cx", function (data, index) {
      return xScale(Number(data[currentAxisLabelX]));
    })
    .attr("cy", function (data, index) {
      return yScale(Number(data[currentAxisLabelY]));
    })
    .attr("r", "12")
    .attr("fill", "lightblue")
    // Both circle and text instances have mouseover & mouseout event handlers
    .on("mouseover", function (data) {
      toolTip.show(data)
    })
    .on("mouseout", function (data) {
      toolTip.hide(data)
    });

  // Apply state abbreviation on circles
  chart
    .selectAll("text")
    .data(myData)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("class", "stateAbbr")
    .style("fill", "black")
    .style("font", "10px sans-serif")
    .style("font-weight", "bold")
    .text(function (data) {
      return data.abbr;
    })
    .on("mouseover", function (data) {
      toolTip.show(data)
    })
    .on("mouseout", function (data) {
      toolTip.hide(data)
    })
    .attr("x", function (data, index) {
      return xScale(Number(data[currentAxisLabelX]));
    })
    .attr("y", function (data, index) {
      return yScale(Number(data[currentAxisLabelY])) + 4;
    });

  // Append an SVG group for the x-axis, then display X-axis
  chart
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    // The class name assigned here will be used for transition effects
    .attr("class", "x-axis")
    .call(xAxis);

  // Append a group for y-axis, then display Y-axis
  chart.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

  // Append y-axis label
  chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text-Y inactive")
    .attr("data-axis-name-Y", "healthcare")
    .text("Lacks Healthcare (%)");

  chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 20)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text-Y inactive")
    .attr("data-axis-name-Y", "smokes")
    .text("Smokes (%)");

  chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text-Y active")
    .attr("data-axis-name-Y", "obese")
    .text("Obese (%)");

  // Append x-axis labels
  chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    .attr("class", "axis-text-X active")
    .attr("data-axis-name-X", "poverty")
    .text("In Poverty (%)");

  chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 45) + ")"
    )
    .attr("class", "axis-text-X inactive")
    .attr("data-axis-name-X", "age")
    .text("Age (Median)");

  chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 65) + ")"
    )
    .attr("class", "axis-text-X inactive")
    .attr("data-axis-name-X", "income")
    .text("Household Income (Median)");

  // Function to change the active/inactive on X-axis
  function labelChange_X(clickedAxis_X) {
    d3
      .selectAll(".axis-text-X")
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    clickedAxis_X.classed("inactive", false).classed("active", true);
    writeAnalysis(currentAxisLabelX, currentAxisLabelY);
  }

  // Mouse click on a lable on X-axis
  d3.selectAll(".axis-text-X").on("click", function () {
    // Assign a variable to current axis
    var clickedSelection_X = d3.select(this);
    // "true" or "false" based on whether the axis is currently selected
    var isClickedSelectionInactive = clickedSelection_X.classed("inactive");

    if (isClickedSelectionInactive) {
      // Assign the clicked axis to the variable currentAxisLabelX
      currentAxisLabelX = clickedSelection_X.attr("data-axis-name-X");
      // Call findMinAndMax() to define the min and max domain values.
      findMinAndMax_X(currentAxisLabelX);
      // Set the domain for the x-axis
      xScale.domain([xMin, xMax]);
      // Create a transition effect for the x-axis
      svg
        .select(".x-axis")
        .transition()
        .duration(1800)
        .call(xAxis);

      // Update location of the circles
      d3.selectAll("circle").each(function () {
        d3
          .select(this)
          .transition()
          .attr("cx", function (data, index) {
            return xScale(Number(data[currentAxisLabelX]));
          })
          .duration(1800);
      });

      d3.selectAll(".stateAbbr").each(function () {
        d3
          .select(this)
          .transition()
          .attr("x", function (data, index) {
            return xScale(Number(data[currentAxisLabelX]));
          })
          .duration(1800);
      });

      // Change the status of the X-axes
      labelChange_X(clickedSelection_X);
    }
  });

  // Function to change the active/inactive on Y-axis
  function labelChange_Y(clickedAxis_Y) {
    d3
      .selectAll(".axis-text-Y")
      .filter(".active")
      // An alternative to .attr("class", <className>) method. Used to toggle classes.
      .classed("active", false)
      .classed("inactive", true);

    clickedAxis_Y.classed("inactive", false).classed("active", true);
    writeAnalysis(currentAxisLabelX, currentAxisLabelY);
  }

  // Mouse click on a lable on Y-axis
  d3.selectAll(".axis-text-Y").on("click", function () {
    // Assign a variable to current axis
    var clickedSelection_Y = d3.select(this);
    // "true" or "false" based on whether the axis is currently selected
    var isClickedSelectionInactive_Y = clickedSelection_Y.classed("inactive");

    if (isClickedSelectionInactive_Y) {
      // Assign the clicked axis to the variable currentAxisLabelX
      currentAxisLabelY = clickedSelection_Y.attr("data-axis-name-Y");
      // Call findMinAndMax() to define the min and max domain values.
      findMinAndMax_Y(currentAxisLabelY);
      // Set the domain for the Y-axis
      yScale.domain([yMin, yMax]);
      // Create a transition effect for the Y-axis
      svg
        .select(".y-axis")
        .transition()
        .duration(1800)
        .call(yAxis);

      // Update location of the circles
      d3.selectAll("circle").each(function () {
        d3
          .select(this)
          .transition()
          // .ease(d3.easeBounce)
          .attr("cy", function (data, index) {
            return yScale(Number(data[currentAxisLabelY]));
          })
          .duration(1800);
      });

      d3.selectAll(".stateAbbr").each(function () {
        d3
          .select(this)
          .transition()
          .attr("y", function (data, index) {
            return yScale(Number(data[currentAxisLabelY]));
          })
          .duration(1800);
      });

      // Change the status of the axes. See above for more info on this function.
      labelChange_Y(clickedSelection_Y);
    }
  });

});

function writeAnalysis(xAxis, yAxis) {
  var analysisText = parent.document.getElementById('analysis');

  var responses = ["The increase of poverty percentage is strongly related to the increase of obesity, smokes, and lack healthcare.",
    "Ages between 36 to 40 years old indicate seriously high obesity, smokes, and lack healthcare percentages.",
    "Income below $55.000 US dollars is most likely to result in obesity, smokes, and lack healthcard."];

  var answer;

  if (xAxis === "poverty") {
    answer = responses[0];
  }
  else {
    if (xAxis === "age") {
      answer = responses[1];
    }
    else {
      answer = responses[2];
    }
  }
  analysisText.innerHTML = answer;
};
