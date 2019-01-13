queue()
    .defer(d3.json, "assets/data/sequencing_metrics2.json")
    .await(makeGraphs);
    
function makeGraphs(error, sequencingData) {
    var ndx = crossfilter(sequencingData);

    estimatedYield(ndx);
    clusterDensity(ndx);
    passFilter(ndx);
    Q30(ndx);

    dc.renderAll();
}

function estimatedYield(ndx) {
    var estimatedYield_dim = ndx.dimension(dc.pluck('Run'));
    var estimatedYield_group = estimatedYield_dim.group().reduceSum(dc.pluck('Yield'));
    
    dc.barChart("#yield")
        .width(1000)
        .height(500)
        .margins({top: 50, right: 50, bottom: 30, left: 50})
        .dimension(estimatedYield_dim)
        .group(estimatedYield_group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Run No.")
        .yAxisLabel("Yield - Gb")
        .yAxis().ticks(10);
}

function clusterDensity(ndx) {
    var clusterDensity_dim = ndx.dimension(dc.pluck('Run'));
    var clusterDensity_group = clusterDensity_dim.group().reduceSum(dc.pluck('ClusterDensity'));

    dc.barChart("#cluster-density")
        .width(1000)
        .height(500)
        .margins({top: 50, right: 50, bottom: 30, left: 50})
        .dimension(clusterDensity_dim)
        .group(clusterDensity_group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Run No.")
        .yAxisLabel("Cluster Density - K/mm2")
        .yAxis().ticks(10);
}

function passFilter(ndx) {
    var passFilter_dim = ndx.dimension(dc.pluck('Run'));
    var passFilter_group = passFilter_dim.group().reduceSum(dc.pluck('PassFilter'));

    dc.barChart("#pass-filter")
        .width(1000)
        .height(500)
        .margins({top: 50, right: 50, bottom: 30, left: 50})
        .dimension(passFilter_dim)
        .group(passFilter_group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Run No.")
        .yAxisLabel("Clusters Passing Filter")
        .yAxis().ticks(10);
}

function Q30(ndx) {
    var Q30_dim = ndx.dimension(dc.pluck('Run'));
    var Q30_group = Q30_dim.group().reduceSum(dc.pluck('Q30'));

    dc.barChart("#Q30")
        .width(1000)
        .height(500)
        .margins({top: 50, right: 50, bottom: 30, left: 50})
        .dimension(Q30_dim)
        .group(Q30_group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Run No.")
        .yAxisLabel("Q30 Score")
        .yAxis().ticks(10);
}