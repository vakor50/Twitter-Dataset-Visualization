// // set the dimensions and margins of the graph
//     var margin = {top: 20, right: 20, bottom: 100, left: 50},
//         width = 960 - margin.left - margin.right,
//         height = 500 - margin.top - margin.bottom;

//     // parse the date / time
//     var parseTime = d3.timeParse("%d-%b-%y");

    

//     // define the line
//     var valueline = d3.line()
//         .x(function(d) { return x(d.date); })
//         .y(function(d) { return y(d.time); });

//     // append the svg obgect to the body of the page
//     // appends a 'group' element to 'svg'
//     // moves the 'group' element to the top left margin
//     var svg = d3.select("#chart2")
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     // Get the data
//     d3.csv("trump.csv", function(error, temp) {
//         if (error) throw error;

        
//             created_at      "07-25-2018 12:41:14"
//             favorite_count  "51711"
//             id_str          "1022099454005051392"
//             is_retweet      "false"
//             retweet_count   "12099"
//             source          "Twitter for iPhone"
//             text            "Congratulations to Brian Kemp on your very big win in Georgia last night. Wow 69-30 those are big numbers. Now go win against the open border crime loving opponent that the Democrats have given you. She is weak on Vets the Military and the 2nd Amendment. Win!"
        



//         data = []
//         temp.forEach(function(d) {
//             // console.log(d)
//             // d.created_at        = parseDateTime(d.created_at);
//             if (!d.created_at) {
//                 return;
//             }
//             d.favorite_count    = +parseInt(d.close);
//             d.retweet_count     = +parseInt(d.retweet_count);
//             d.time              = parseTime( d.created_at.substr(11))
//             d.date              = parseDate( d.created_at.substr(0, 10) )
//             if (d.date != null && d.date >= parseDate("01-20-2016") && d.date <= parseDate("07-24-2018")) {
//                 data.push(d)
//             }
//         });

//         data.sort(function(a, b) {
//             return a.date - b.date;
//         });

//         // Scale the range of the data
//         // x.domain(d3.extent(data, function(d) { return d.date; }));
//         // y.domain([0, d3.max(data, function(d) { return d.close; })]);



//         // // Add the valueline path.
//         // svg.append("path")
//         //     .data([data])
//         //     .attr("class", "line")
//         //     .attr("d", valueline);



//     });