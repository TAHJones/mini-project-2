queue()
    .defer(d3.json, "assets/data/sequencing_metrics.json")
    .await(makeGraphs);
    
function makeGraphs(error, sequencingData) {
    var ndx = crossfilter(sequencingData);
    
    userCount(ndx);
    userAverageYield(ndx);
    userAveragePassFilter(ndx);
    userAverageClusterDensity(ndx);
    userAverageQ30(ndx);
    orderUserByExperiment(ndx);
    orderUserByChemistry(ndx);

    dc.renderAll();
}

function userCount(ndx) {
    var count_dim = ndx.dimension(dc.pluck('User'));
    var count_group = count_dim.group();
    var colorChoice = d3.scale.ordinal()
        .domain(["Thomas","Jane","Wayne","Sarah","Andrew","Helen"])
        .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b"]);

/*    dc.barChart("#user--count")
        .width(400)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(count_dim)
        .group(count_group)
        .colorAccessor(function (d) {
            return d.key[4];
        })
        .colors(colorChoice)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .brushOn(false)
        .yAxis().ticks(20);*/

    dc.pieChart('#user--count')
        .height(400)
        .radius(200)
        .transitionDuration(1500)
        .dimension(count_dim)
        .group(count_group)
        .colorAccessor(function (d) {
            return d.key[4];
        })
        .colors(colorChoice);
}

function userAverageYield(ndx) {
    var user_average_yield_dim = ndx.dimension(dc.pluck('User'));
    var colorChoice = d3.scale.ordinal()
        .domain(["Thomas","Jane","Wayne","Sarah","Andrew","Helen"])
        .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b"]);
    
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
    
    var user_average_yield_group = user_average_yield_dim.group().reduce(add_item, remove_item, initialise);
    
    dc.barChart("#user--average-yield")
        .width(400)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(user_average_yield_dim)
        .group(user_average_yield_group)
        .colorAccessor(function (d) {
            return d.key[4];
        })
        .colors(colorChoice)
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

function userAveragePassFilter(ndx) {
    var userAveragePassFilter_dim = ndx.dimension(dc.pluck('User'));
    var colorChoice = d3.scale.ordinal()
        .domain(["Thomas","Jane","Wayne","Sarah","Andrew","Helen"])
        .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b"]);

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
    
    var userAveragePassFilter_group = userAveragePassFilter_dim.group().reduce(add_item, remove_item, initialise);
    
    dc.barChart("#user--average-pass-filter")
        .width(400)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(userAveragePassFilter_dim)
        .group(userAveragePassFilter_group)
        .colorAccessor(function (d) {
            return d.key[4];
        })
        .colors(colorChoice)
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

function userAverageClusterDensity(ndx) {
    var userAverageClusterDensity_dim = ndx.dimension(dc.pluck('User'));
    var colorChoice = d3.scale.ordinal()
        .domain(["Thomas","Jane","Wayne","Sarah","Andrew","Helen"])
        .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b"]);

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
    
    var userAverageClusterDensity_group = userAverageClusterDensity_dim.group().reduce(add_item, remove_item, initialise);
    
    dc.barChart("#user--average-cluster-density")
        .width(400)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(userAverageClusterDensity_dim)
        .group(userAverageClusterDensity_group)
        .colorAccessor(function (d) {
            return d.key[4];
        })
        .colors(colorChoice)
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

function userAverageQ30(ndx) {
    var userAverageQ30_dim = ndx.dimension(dc.pluck('User'));
    var colorChoice = d3.scale.ordinal()
        .domain(["Thomas","Jane","Wayne","Sarah","Andrew","Helen"])
        .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b"]);

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
    
    var userAverageQ30_group = userAverageQ30_dim.group().reduce(add_item, remove_item, initialise);
    
    dc.barChart("#user--average-Q30")
        .width(400)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(userAverageQ30_dim)
        .group(userAverageQ30_group)
        .colorAccessor(function (d) {
            return d.key[4];
        })
        .colors(colorChoice)
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

function orderUserByExperiment(ndx) {
    
    function orderByExperiment(dimension, experiment) {
        return dimension.group().reduce(
            function (p, v) {
                p.total++;
                if(v.Experiment == experiment) {
                    p.match++;
                }
                return p;
            },
            function (p, v) {
                p.total--;
                if(v.Experiment == experiment) {
                    p.match--;
                }
                return p;
            },
            function () {
                return {total: 0, match: 0};
            }
        );
    }
    
    var dim = ndx.dimension(dc.pluck("User"));
    var capture = orderByExperiment(dim, "Capture");
    var exome = orderByExperiment(dim, "Exome");
    var genome = orderByExperiment(dim, "Genome");
    
    dc.barChart("#user--experiment-distribution")
        .width(400)
        .height(300)
        .dimension(dim)
        .group(capture, "Capture")
        .stack(exome, "Exome")
        .stack(genome, "Genome")
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

function orderUserByChemistry(ndx) {
    
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
    
    var dim = ndx.dimension(dc.pluck("User"));
    var high300 = orderByChemistry(dim, "High300");
    var mid150 = orderByChemistry(dim, "Mid150");
    var mid300 = orderByChemistry(dim, "Mid300");
    
    dc.barChart("#user--chemistry-distribution")
        .width(400)
        .height(300)
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
