queue()
    .defer(d3.json, "assets/data/sequencing_metrics.json")
    .await(makeGraphs);
    
function makeGraphs(error, sequencingData) {
    var ndx = crossfilter(sequencingData);
    
    user(ndx);
    sequencingChemistry(ndx);
    
    dc.renderAll();
}

function user(ndx) {
    var dim = ndx.dimension(dc.pluck('User'));
    var group = dim.group();
    
    dc.selectMenu("#user")
        .dimension(dim)
        .group(group);
}

function sequencingChemistry(ndx) {
    var dim = ndx.dimension(dc.pluck('Chemistry'));
    var group = dim.group();
    
    dc.barChart("#sequencingChemistry")
        .width(400)
        .height(600)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        // .elasticY(true)
        .xAxisLabel("Sequencing Chemistry")
        .yAxis().ticks(20);
}