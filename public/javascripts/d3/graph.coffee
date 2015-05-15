$ ->
    width = 500
    height = 500
    margin = 
        left: 20
        right: 20
        top: 20
        bottom: 20
    svg = d3.select "body"
        .append "svg"
        .attr
            width: width + margin.left + margin.right
            height: height + margin.top + margin.bottom
            id: "graph"
    linkLayer = svg.append "g"
        .attr
            id: "links"
    nodeLayer = svg.append "g"
        .attr
            id: "nodes"
    
    
    data = {}
    nodes = []
    links = []
    colorScale = d3.scale.category20()
    strokeScale = (d) ->
        d3.rgb(colorScale(d)).darker().toString()
    updateData = ->
        rScale = d3.scale.sqrt()
            .domain d3.extent(data.nodes,(d)->d.playcount)
            .range [3, 12]
        data.nodes.forEach (d) ->
            d.x = Math.floor(Math.random() * width)
            d.y = Math.floor(Math.random() * width)
            d.r = rScale(d.playcount)
        
        nodeMap = {}
        data.nodes.forEach (d) ->
            nodeMap[d.id] = d
        
        data.links.forEach (d) ->
            d.source = nodeMap[d.source]
            d.target = nodeMap[d.target]
            
        updateNodes()
        updateLinks()
        updateLayout()
        
        
    updateNodes = ->    
        nodes = nodeLayer.selectAll "circle.node"
            .data data.nodes
        nodes.enter()
            .append "circle"
            .attr
                cx: (d) -> d.x
                cy: (d) -> d.y
                r: (d) -> d.r
                class: "node"
                fill: (d) -> colorScale(d.artist)
                stroke: (d) -> strokeScale(d.artist)
            .on "mouseover", (e) ->
                links.style "stroke", (d) -> 
                        if (d.source is e or d.target is e) then "#555" else "#eee"
            .on "mouseout", (e) ->
                links.style "stroke", "#ddd"
        nodes.exit().remove()
    
    updateLinks = ->
        links = linkLayer.selectAll "line.link"
            .data data.links
        links.enter()
            .append "line"
            .attr
                x1: (d) -> d.source.x
                y1: (d) -> d.source.y
                x2: (d) -> d.target.x
                y2: (d) -> d.target.y
                class: "link"
        links.exit().remove()
            
            
    force = d3.layout.force()
    force.size [width,height]
    updateLayout = ->
        forceTick = (e) ->
            nodes.attr
                cx: (d) -> d.x
                cy: (d) -> d.y
            links.attr
                x1: (d) -> d.source.x
                y1: (d) -> d.source.y
                x2: (d) -> d.target.x
                y2: (d) -> d.target.y
        force.on "tick", forceTick
            .charge -40
            .linkDistance 10
        force.nodes data.nodes
        force.start()
        
    # load data
    d3.json "javascripts/d3/graph.json", (json) ->
        data = json
        updateData()
    