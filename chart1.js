// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 100, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y"),
    parseDateTime = d3.timeParse("%m-%d-%Y %H:%M:%S"),
    parseDateTime2 = d3.timeParse("%Y-%m-%d %H:%M:%S"),
    parseTime = d3.timeParse("%H:%M:%S"),
    parseDate = d3.timeParse("%m-%d-%Y"),
    parseMonthYear = d3.timeParse("%Y-%m")
    ;

var formatYearMonth = d3.timeFormat("%Y-%m"),
    formatMonthYear = d3.timeFormat("%b %Y")

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.time); });



// Get the data
d3.csv("trump.csv", function(error, data) {
    if (error) throw error;

    /*
        created_at      "07-25-2018 12:41:14"
        favorite_count  "51711"
        id_str          "1022099454005051392"
        is_retweet      "false"
        retweet_count   "12099"
        source          "Twitter for iPhone"
        text            "Congratulations to Brian Kemp on your very big win in Georgia last night. Wow 69-30 those are big numbers. Now go win against the open border crime loving opponent that the Democrats have given you. She is weak on Vets the Military and the 2nd Amendment. Win!"
    */

    data.filter(function(d) {
        if (!parseDateTime(d.created_at)) {
            return;
        }
        d.favorite_count    = +parseInt(d.favorite_count);
        d.retweet_count     = +parseInt(d.retweet_count);
        d.time              = parseTime( d.created_at.substr(11))
        d.date              = parseDate( d.created_at.substr(0, 10) )
    });

    data.sort(function(a, b) {
        return a.date - b.date;
    });

    var o = {};
    var f = function(x){
        var key = formatYearMonth( x.date );

        if (o[key] === undefined) {
            o[key] = {"date": x.date, "count": 0};
        };

        o[key].count = o[key].count + 1
    }

    data.map(x => f(x)) //apply f to each member of data

    var months = []
    Object.keys(o).forEach(function (k) {
        months.push({ "month": k, "date": o[k].date, "count": o[k].count })
    })

    doChart1(months)
    doChart2(data)

});

function doChart2 (data) {

        data = data.filter(function (d) {
            if (d.date != null && d.date >= parseDate("01-20-2016") && d.date <= parseDate("07-24-2018")) {
                return d
            }
        })


        // set the ranges
        var x = d3.scaleTime()
            .range([0, width]);
        var y = d3.scaleTime()
            .range([height, 0]);

        x.domain([new Date(2016, 0, 20), new Date(2018, 6, 24)])
        y.domain([parseTime("00:00:00"), parseTime("23:59:59")])

        var svg2 = d3.select("#chart2")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Add the scatterplot
        svg2.selectAll("dot")
            .data(data)
          .enter().append("circle")
            .attr("r", 5)
            .style('opacity', 0.3)
            .style('fill', 'red')
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.time); });

        // Add the X Axis
        svg2.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%b %Y")))

        // Add the Y Axis
        svg2.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Time");
}




function doChart1 (months) {
    months = months.filter(function (d) {
        // if (d.date != null && d.date >= parseDate("01-20-2016") && d.date <= parseDate("07-24-2018")) {
        if (d.date != null) {
            return d
        }
    })

    // var zoom = d3.zoom()
    //     .scaleExtent([1, 32])
    //     .translateExtent([[0, 0], [width, height]])
    //     .extent([[0, 0], [width, height]])
    //     .on("zoom", zoomed);

    // set the ranges
    var x = d3.scaleTime()
        .range([0, width]);
    var y = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom(x),
        yAxis = d3.axisLeft(y);

    x.domain(d3.extent(months, function(d) { return d.date; }));
    y.domain([0, d3.max(months, function(d) { return d.count; })]);

    var tooltipMargin = 13;

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg1 = d3.select("#chart1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the scatterplot
    svg1.selectAll(".bar")
        .data(months)
      .enter().append("rect")
        .attr("class", "rect")
        .style('opacity', 0.8)
        .style('fill', 'red')
        .attr("x", function(d) { return x(parseMonthYear(d.month)); })
        .attr("y", function(d) { return y(d.count); })
        .attr("width", width/months.length - 5)
        .attr("height", function(d) { return height - y(d.count); })
        .on("mouseover", function(d) {
                d3.selectAll('.bar')
                    .style("opacity", 0.8);
                d3.select(this) 
                    .style("opacity", 1);

                let g = svg1
                    .style("cursor", "pointer")
                    .append("g")
                    .attr("class", "tooltip")
                    .style("opacity", 0);
           
                g.append("text")
                    .attr("class", "name-text")
                    .text(`${ formatMonthYear(d.date) } (${ parseInt(d.count) })`)
                    .attr('text-anchor', 'middle');
              
                let text = g.select("text");
                let bbox = text.node().getBBox();
                let padding = 2;
                g.insert("rect", "text")
                    .attr("x", bbox.x - padding)
                    .attr("y", bbox.y - padding)
                    .attr("width", bbox.width + (padding*2))
                    .attr("height", bbox.height + (padding*2))
                    .style("fill", "white")
                    .style("opacity", 0.75);
            })
            .on("mousemove", function(d) {
                let mousePosition = d3.mouse(this);
                let x = mousePosition[0] //+ width/2;
                let y = mousePosition[1]  - 2*tooltipMargin;//+ height/2

                let text = d3.select('.tooltip text');
                let bbox = text.node().getBBox();
                if (x - bbox.width/2 < 0) {
                    x = bbox.width/2;
                } else if (width - x - bbox.width/2 < 0) {
                    x = width - bbox.width/2;
                } 

                if (y - bbox.height/2 < 0) {
                    y = bbox.height + tooltipMargin;
                } else if (height - y - bbox.height/2 < 0) {
                    y = height - bbox.height/2;
                } 

                d3.select('.tooltip')
                    .style("opacity", 1)
                    .attr('transform',`translate(${x}, ${y})`);
            })
            .on("mouseout", function(d) {   
                d3.select("#search_price svg")
                    .style("cursor", "default");
                  
                d3.select(".tooltip").remove();
                d3.selectAll('.bar')
                    .style("opacity", 0.8);
            })
            .on("touchstart", function(d) {
                d3.select("#chart1 svg")
                    .style("cursor", "default");    
            })
            .each(function(d, i) { this._current = i; });

    // Add the X Axis
    var g = svg1.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis
            .tickFormat(d3.timeFormat("%b %Y")))

    // Add the Y Axis
    svg1.append("g")
        .attr("class", "axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Time");

    var d0 = new Date(2016, 0, 20),
        d1 = new Date();

    // // Gratuitous intro zoom!
    // svg1.call(zoom).transition()
    //     .duration(1500)
    //     .call(zoom.transform, d3.zoomIdentity
    //         .scale(width / (x(d1) - x(d0)))
    //         .translate(-x(d0), 0));

    
}