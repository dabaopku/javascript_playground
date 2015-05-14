$(function(){
var div = function(){
    var dataset = [];
    for (var i = 0; i < 25; i++) {
        dataset.push(Math.random()*30);
    }
    d3.select("body")
        .selectAll("div")
        .data(dataset)
        .enter()
        .append("div")
        .attr("class", "bar")
        .style("height", function(d){ return d * 5 + "px"; });
};

var svg= function(){
    var w = 500;
    var h = 100;
    var svg = d3
        .select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
    var dataset = [ 5, 10, 15, 20, 25 ];
    var circles = svg
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle");
    circles
        .attr("cx", function(d, i){ return i * 50 + 25; })
        .attr("cy", h/2)
        .attr("r", function(d, i){ return d; });
};

var barChart = function(){
    var w = 500;
    var h = 100;
    var svg = d3
        .select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
    var dataset = [];
    for (var i = 0; i < Math.round(Math.random() * 20 + 10); i++) {
        dataset.push(Math.round(Math.random() * (h - 20) + 20));
    }
    
    var rects = svg
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect");
    var dw = Math.round(w / dataset.length);
    var padding = 2;
    rects
        .attr("x", function(d, i){ return i * dw; })
        .attr("y", function(d, i){ return h - d; })
        .attr("width", function(d, i){ return dw - padding; })
        .attr("height", function(d, i){ return d * 4; })
        .attr("fill", function(d, i){ return "rgb(0,0," + Math.round(d/h*255) + ")"; });
    
    var labels = svg
        .selectAll("text")
        .data(dataset)
        .enter()
        .append("text");
    labels
        .text(function(d) { return d; })
        .attr("x", function(d, i) { return (i + 0.5) * dw; })
        .attr("y", function(d) { return h - d + 15; })
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .attr("font-size", "12px");
};

var scale = function(){
    var w = 500;
    var h = 300;
    var padding = 50;
    var dataset = [];
    for (var i = 0; i < 16; i++) {
        dataset.push([
            Math.round(Math.random()*500),
            Math.round(Math.random()*1000)
        ]);
    }
    var xScale = d3.scale.linear()
        .domain([0, 500])
        .range([padding, w - padding]);
    var yScale = d3.scale.linear()
        .domain([0, 1000])
        .range([h - padding, padding]);
    
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
        
    var points = svg
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle");
    points
        .attr("cx", function(d){ return xScale(d[0]); })
        .attr("cy", function(d){ return yScale(d[1]); })
        .attr("r", function(d){ return 5; });
        
    /*
    var texts = svg
        .selectAll("text")
        .data(dataset)
        .enter()
        .append("text");
    texts
        .attr("x", function(d){ return xScale(d[0]); })
        .attr("y", function(d){ return yScale(d[1]) - 5; })
        .text(function(d){ return d[0] + "," + d[1]; })
        .style("fill", "red")
        .style("font-size", "12px")
        .style("text-anchor", "middle");
    */
    
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(5)
        .tickFormat(d3.format("0.1f"));
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);
        
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);
};

var animation = function(){
    var svg = d3
        .select("body")
        .append("svg")
        .attr("width", 400)
        .attr("height", 300);
    var circle = svg
        .append("circle")
        .style("stroke", "grey")
        .style("fill", "white")
        .attr("cx", 100)
        .attr("cy", 100)
        .attr("r", 50)
        .on("mouseover", function(){ d3.select(this).style("fill", "pink"); })
        .on("mouseout", function(){ d3.select(this).style("fill", "white"); })
        .on("mousedown", function(){
            d3.select(this)
            .transition()
                .duration(500)
                .attr("r", 100)
                .style("fill", "grey")
            .transition()
                .duration(100)
                .attr("r", 50)
                .style("fill", "white");
        });
};

});