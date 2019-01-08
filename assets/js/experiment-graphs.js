queue()
    .defer(d3.json, "assets/data/sequencing_metrics2.json")
    .await(makeGraphs);
    
function makeGraphs(error, sequencingData) {
    var ndx = crossfilter(sequencingData);
    
    experimentCount(ndx);
    experimentAverageYield(ndx);
    experimentAveragePassFilter(ndx);
    experimentAverageClusterDensity(ndx);
    experimentAverageQ30(ndx);
    orderExperimentByChemistry(ndx);
    orderExperimentByUser(ndx);

    dc.renderAll();
}

function experimentCount(ndx) {
    var count_dim = ndx.dimension(dc.pluck('Experiment'));
    var count_group = count_dim.group();

    dc.barChart("#experiment--count")
        // .width(400)
        // .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(count_dim)
        .group(count_group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .brushOn(false)
        .yAxis().ticks(20);
}

function experimentAverageYield(ndx) {
    var experimentAverageYield_dim = ndx.dimension(dc.pluck('Experiment'));
    
    function add_item(p, v) {
        p.count++;
        p.total += v.Yield;
        p.average = p.total / p.count;
        return p;
    }
    
    function remove_item(p, v) {
        p.count--;
        if(p.count == 0) {
            p.total = 0;
            p.average = 0;
        } else {
          p.total -= v.Yield;
          p.average = p.total / p.count;
        }
        return p;
    }
    
    function initialise() {
        return {count: 0, total: 0, average: 0};
    }
    
    var experimentAverageYield_group = experimentAverageYield_dim.group().reduce(add_item, remove_item, initialise);
    
    dc.barChart("#experiment--average-yield")
        // .width(400)
        // .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(experimentAverageYield_dim)
        .group(experimentAverageYield_group)
        .valueAccessor(function(d){
            return d.value.average.toFixed(2);
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .yAxisLabel("Yield - Gb")
        .yAxis().ticks(6);
} 

function experimentAveragePassFilter(ndx) {
    var experimentAveragePassFilter_dim = ndx.dimension(dc.pluck('Experiment'));
    
    function add_item(p, v) {
        p.count++;
        p.total += v.PassFilter;
        p.average = p.total / p.count;
        return p;
    }
    
    function remove_item(p, v) {
        p.count--;
        if(p.count == 0) {
            p.total = 0;
            p.average = 0;
        } else {
          p.total -= v.PassFilter;
          p.average = p.total / p.count;
        }
        return p;
    }
    
    function initialise() {
        return {count: 0, total: 0, average: 0};
    }
    
    var experimentAveragePassFilter_group = experimentAveragePassFilter_dim.group().reduce(add_item, remove_item, initialise);
    
    dc.barChart("#experiment--average-pass-filter")
        // .width(400)
        // .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(experimentAveragePassFilter_dim)
        .group(experimentAveragePassFilter_group)
        .valueAccessor(function(d){
            return d.value.average.toFixed(2);
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .yAxisLabel("Pass Filter - %")
        .yAxis().ticks(6);
} 

function experimentAverageClusterDensity(ndx) {
    var experimentAverageClusterDensity_dim = ndx.dimension(dc.pluck('Experiment'));
    
    function add_item(p, v) {
        p.count++;
        p.total += v.ClusterDensity;
        p.average = p.total / p.count;
        return p;
    }
    
    function remove_item(p, v) {
        p.count--;
        if(p.count == 0) {
            p.total = 0;
            p.average = 0;
        } else {
          p.total -= v.ClusterDensity;
          p.average = p.total / p.count;
        }
        return p;
    }
    
    function initialise() {
        return {count: 0, total: 0, average: 0};
    }
    
    var experimentAverageClusterDensity_group = experimentAverageClusterDensity_dim.group().reduce(add_item, remove_item, initialise);
    
    dc.barChart("#experiment--average-cluster-density")
        // .width(400)
        // .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(experimentAverageClusterDensity_dim)
        .group(experimentAverageClusterDensity_group)
        .valueAccessor(function(d){
            return d.value.average.toFixed(2);
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .yAxisLabel("Cluster Density - K/mm2")
        .yAxis().ticks(6);
}

function experimentAverageQ30(ndx) {
    var experimentAverageQ30_dim = ndx.dimension(dc.pluck('Experiment'));
    
    function add_item(p, v) {
        p.count++;
        p.total += v.Q30;
        p.average = p.total / p.count;
        return p;
    }
    
    function remove_item(p, v) {
        p.count--;
        if(p.count == 0) {
            p.total = 0;
            p.average = 0;
        } else {
          p.total -= v.Q30;
          p.average = p.total / p.count;
        }
        return p;
    }
    
    function initialise() {
        return {count: 0, total: 0, average: 0};
    }
    
    var experimentAverageQ30_group = experimentAverageQ30_dim.group().reduce(add_item, remove_item, initialise);
    
    dc.barChart("#experiment--average-Q30")
        // .width(400)
        // .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(experimentAverageQ30_dim)
        .group(experimentAverageQ30_group)
        .valueAccessor(function(d){
            return d.value.average.toFixed(2);
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .yAxisLabel("Q30 - %")
        .yAxis().ticks(6);
}

function orderExperimentByChemistry(ndx) {
    
    function orderByChemistry(dimension, chemistry) {
        return dimension.group().reduce(
            function (p, v) {
                p.total++;
                if(v.Chemistry == chemistry) {
                    p.match++;
                }
                return p;
            },
            function (p, v) {
                p.total--;
                if(v.Chemistry == chemistry) {
                    p.match--;
                }
                return p;
            },
            function () {
                return {total: 0, match: 0};
            }
        );
    }
    
    var dim = ndx.dimension(dc.pluck("Experiment"));
    var high300 = orderByChemistry(dim, "High300");
    var mid150 = orderByChemistry(dim, "Mid150");
    var mid300 = orderByChemistry(dim, "Mid300");

    
    dc.barChart("#experiment--chemistry-distribution")
        // .width(400)
        // .height(300)
        .dimension(dim)
        .group(high300, "High300")
        .stack(mid150, "Mid150")
        .stack(mid300, "Mid300")
        .valueAccessor(function(d) {
            if(d.value.total > 0) {
                return (d.value.match / d.value.total) * 100;
            } else {
                return 0;
            }
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .legend(dc.legend().x(320).y(20).itemHeight(15).gap(5))
        .margins({top: 10, right: 100, bottom: 30, left: 30});
}

function orderExperimentByUser(ndx) {
    
    function orderByUser(dimension, user) {
        return dimension.group().reduce(
            function (p, v) {
                p.total++;
                if(v.User == user) {
                    p.match++;
                }
                return p;
            },
            function (p, v) {
                p.total--;
                if(v.User == user) {
                    p.match--;
                }
                return p;
            },
            function () {
                return {total: 0, match: 0};
            }
        );
    }
    
    var dim = ndx.dimension(dc.pluck("Experiment"));
    var thomas = orderByUser(dim, "Thomas");
    var jane = orderByUser(dim, "Jane");
    var wayne = orderByUser(dim, "Wayne");
    var sarah = orderByUser(dim, "Sarah");
    var andrew = orderByUser(dim, "Andrew");
    var helen = orderByUser(dim, "Helen");

    dc.barChart("#experiment--user-distribution")
        // .width(null) //400
        // .height(null) //300
        .dimension(dim)
        .group(thomas, "Thomas")
        .stack(jane, "Jane")
        .stack(wayne, "Wayne")
        .stack(sarah, "Sarah")
        .stack(andrew, "Andrew")
        .stack(helen, "Helen")
        .valueAccessor(function(d) {
            if(d.value.total > 0) {
                return (d.value.match / d.value.total) * 100;
            } else {
                return 0;
            }
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .legend(dc.legend().x(320).y(20).itemHeight(15).gap(5))
        .margins({top: 10, right: 100, bottom: 30, left: 30});
}
