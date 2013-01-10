// Generated by CoffeeScript 1.3.3
var dn, makeDNViz, makeForceLayout, makeLinks;

dn = [];

dn.nodes = [];

dn.links = [];

makeDNViz = function() {
  return d3.json("json/dn_tree.flat.r1.json", function(error, json) {
    var data;
    if (error) {
      console.warn("ERROR", error);
    }
    data = json;
    return makeForceLayout(data);
  });
};

makeForceLayout = function(data) {
  var circle, force, height, label, link, node, r, svg, width;
  width = $("#network").width();
  height = $("#network").height();
  r = 5;
  makeLinks(data);
  force = d3.layout.force().gravity(0.1).charge(-135).linkDistance(function(d) {
    if (d.target.id === 1) {
      return 150;
    } else if (d.target.id === 2) {
      return 120;
    } else {
      return 10;
    }
  }).linkStrength(1.3).theta(.6).friction(0.65).size([width, height]);
  svg = d3.select("#network");
  link = svg.selectAll("line.link").data(dn.links).enter().append("line").attr("class", "link").style({
    "stroke-width": 1,
    "stroke": "#2D72D9",
    "stroke-dasharray": "2, 3"
  });
  node = svg.selectAll(".node").data(data).enter().append("svg:g").attr("class", "node").attr("id", function(d) {
    return d.id;
  }).call(force.drag);
  label = node.append("g").attr("class", "label").append("svg:text").text(function(d) {
    return d.display_name;
  }).attr({
    "text-anchor": "middle",
    "dy": r * 2.5
  });
  circle = node.append("svg:circle").attr("r", r).style({
    "fill": function(d) {
      if (d.id === 1) {
        return "red";
      } else if (d.id === 2) {
        return "red";
      } else {
        return "#2D72D9";
      }
    }
  });
  force.nodes(data).on("tick", function() {
    /*circle.attr("cx", (d) -> d.x = Math.max(r, Math.min(width - r, d.x)) )
    			.attr("cy", (d) -> d.y = Math.max(r, Math.min(width - r, d.y)) )
    */
    node.attr("transform", function(d) {
      var newx, newy;
      newx = d.x = Math.max(r, Math.min(width - r, d.x));
      newy = d.y = Math.max(r, Math.min(width - r, d.y));
      return "translate(" + newx + "," + newy + ")";
    });
    return link.attr("x1", function(d) {
      return d.source.x;
    }).attr("y1", function(d) {
      return d.source.y;
    }).attr("x2", function(d) {
      return d.target.x;
    }).attr("y2", function(d) {
      return d.target.y;
    });
  }).links(dn.links).start();
  return force;
};

makeLinks = function(data) {
  _.each(data, function(row, index) {
    console.log("r>", row.id + " > " + row.invited_by_id);
    if (row.invited_by_id !== null) {
      return dn['links'].push({
        "source": index,
        "target": row.invited_by_id - 1,
        "value": 1
      });
    }
  });
  return console.log(dn.links);
};
