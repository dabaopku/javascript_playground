$ ->
    csvFile = "https://gist.githubusercontent.com/mbostock/4063663/raw/3fbba4b18a1412f6fed34e780e82ae4108c175f2/flowers.csv"
    d3.csv csvFile,(err,data) ->
        # Dimensions
        dimensions = d3.keys data[0]
            .filter (d) -> d isnt "species"
        dimensionPairs = []
        domains = {}
        dimensions.forEach (x, i) ->
            dimensions.forEach (y, j) ->
                dimensionPairs.push
                    x: x
                    y: y
                    i: i
                    j: j
            domains[x] = d3.extent data, (d) ->
                d[x]
        
        # Cells
        n = dimensions.length
        size = 80
        padding = 20
        svg = d3.select "body"
            .style "background-color","#f6f6f6"
            .append "svg"
            .attr
                width: size*n+padding*(n+1)
                height: size*n+padding*(n+1)
                id: "scatter"
            .style
                border: "solid #bbb 1px"
                "background-color": "#fff"
                margin: "10px"
                "padding": "20px"
                
        id = (dim) ->
            "cell_#{dim.i}_#{dim.j}"
        cellLayer = svg.append "g"
            .attr
                class: "cells"
        cells = cellLayer
            .selectAll ".cell"
            .data dimensionPairs
            .enter()
            .append "g"
            .attr
                class: "cell"
                transform: (d) ->
                    "translate(#{padding+d.i*(size+padding)},#{padding+(n-1-d.j)*(size+padding)})"
                id: (d) -> id(d)
                style:
                    x:1
        
        # Cell
        color = d3.scale.category10()
        x = d3.scale.linear()
            .range [0, size]
        y = d3.scale.linear()
            .range [size, 0]
        cells.each (dim) ->
            x.domain domains[dim.x]
            y.domain domains[dim.y]
            cell = cellLayer.select "##{id(dim)}"
            cell
                .selectAll "circle"
                .data data
                .enter()
                .append "circle"
                .attr
                    cx: (d) -> x(d[dim.x])
                    cy: (d) -> y(d[dim.y])
                    r: 3
                    fill: (d) -> color(d["species"])
                    opacity: 0.5
            cell.append "rect"
                .attr
                    width: size
                    height: size
                    x: 0
                    y: 0
                .style
                    fill: "none"
                    stroke: "#aaa"
        
        # Axis
        xAxis = d3.svg.axis()
            .scale x
            .orient "bottom"
            .ticks 4
            .tickSize (size+padding)*n-padding
        yAxis = d3.svg.axis()
            .scale y
            .orient "left"
            .ticks 4
            .tickSize (size+padding)*n-padding
        axisLayer = svg.insert "g",".cells"
            .attr
                class: "axises"
        axisLayer.selectAll ".x.axis"
            .data dimensions
            .enter()
            .append "g"
            .attr
                class: "x axis"
                transform: (d,i) -> "translate(#{i*(size+padding)+padding}, #{padding})"
            .each (dim) ->
                x.domain domains[dim]
                d3.select(this).call xAxis
        axisLayer.selectAll ".y.axis"
            .data dimensions
            .enter()
            .append "g"
            .attr
                class: "y axis"
                transform: (d,i) -> "translate(#{(padding+size)*n}, #{padding + (n-1-i)*(size+padding)})"
            .each (dim) ->
                y.domain domains[dim]
                d3.select(this).call yAxis
                
        
        # Brush
        currentBrushCell = null
        brush = d3.svg.brush()
            .x x
            .y y
            .on "brushstart", (p) ->
                if currentBrushCell isnt this
                    d3.select currentBrushCell
                        .call brush.clear()
                    x.domain domains[p.x]
                    y.domain domains[p.y]
                    currentBrushCell = this
                cells.selectAll "circle"
                    .style
                        "fill": "#ccc"
            .on "brush", (p) ->
                e = brush.extent()
                cells.selectAll "circle"
                    .style
                        "fill": (d) ->
                            if e[0][0] <= d[p.x] <= e[1][0] and e[0][1] <= d[p.y] <= e[1][1]
                                color(d["species"])
                            else
                                "#ccc"
            .on "brushend", ->
                if brush.empty()
                    cells.selectAll "circle"
                        .style
                            "fill": (d) -> color(d["species"])
        cells.call brush