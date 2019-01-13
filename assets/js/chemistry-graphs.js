queue()
    .defer(d3.json, "assets/data/sequencing_metrics2.json")
    .await(makeGraphs);
    
function makeGraphs(error, sequencingData) {
    var ndx = crossfilter(sequencingData);
    
    chemistryCount(ndx);
    chemistryAverageYield(ndx);
    chemistryAveragePassFilter(ndx);
    chemistryAverageClusterDensity(ndx);
    chemistryAverageQ30(ndx);
    orderChemistryByExperiment(ndx);
    orderChemistryByUser(ndx);

    dc.renderAll();
}

function chemistryCount(ndx) {
    var count_dim = ndx.dimension(dc.pluck('Chemistry'));
    var count_group = count_dim.group();
    var colorChoice = d3.scale.ordinal()
        .domain(["High300","Mid150","Mid300"])
        .range(["#1f77b4","#ff7f0e","#2ca02c"]);

    dc.pieChart('#chemistry--count')
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

function chemistryAverageYield(ndx) {
    var chemistryAverageYield_dim = ndx.dimension(dc.pluck('Chemistry'));
    var colorChoice = d3.scale.ordinal()
        .domain(["High300","Mid150","Mid300"])
        .range(["#1f77b4","#ff7f0e","#2ca02c"]);
    
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
          p.total -= v.salary;
          p.average = p.total / p.count;
        }
        return p;
    }
    
    function initialise() {
        return {count: 0, total: 0, average: 0};
    }
    
    var chemistryAverageYield_group = chemistryAverageYield_dim.group().reduce(add_item, remove_item, initialise);
    
    dc.barChart("#chemistry--average-yield")
        .width(400)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(chemistryAverageYield_dim)
        .group(chemistryAverageYield_group)
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

function chemistryAveragePassFilter(ndx) {
    var chemistryAveragePassFilter_dim = ndx.dimension(dc.pluck('Chemistry'));
    var colorChoice = d3.scale.ordinal()
        .domain(["High300","Mid150","Mid300"])
        .range(["#1f77b4","#ff7f0e","#2ca02c"]);

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
    
    var chemistryAveragePassFilter_group = chemistryAveragePassFilter_dim.group().reduce(add_item, remove_item, initialise);
    
    dc.barChart("#chemistry--average-pass-filter")
        .width(400)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(chemistryAveragePassFilter_dim)
        .group(chemistryAveragePassFilter_group)
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

function chemistryAverageClusterDensity(ndx) {
    var chemistryAverageClusterDensity_dim = ndx.dimension(dc.pluck('Chemistry'));
    var colorChoice = d3.scale.ordinal()
        .domain(["High300","Mid150","Mid300"])
        .range(["#1f77b4","#ff7f0e","#2ca02c"]);

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
    
    var chemistryAverageClusterDensity_group = chemistryAverageClusterDensity_dim.group().reduce(add_item, remove_item, initialise);
    
    dc.barChart("#chemistry--average-cluster-density")
        .width(400)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(chemistryAverageClusterDensity_dim)
        .group(chemistryAverageClusterDensity_group)
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

function chemistryAverageQ30(ndx) {
    var chemistryAverageQ30_dim = ndx.dimension(dc.pluck('Chemistry'));
    var colorChoice = d3.scale.ordinal()
        .domain(["High300","Mid150","Mid300"])
        .range(["#1f77b4","#ff7f0e","#2ca02c"]);
        
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
    
    var chemistryAverageQ30_group = chemistryAverageQ30_dim.group().reduce(add_item, remove_item, initialise);
    
    dc.barChart("#chemistry--average-Q30")
        .width(400)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(chemistryAverageQ30_dim)
        .group(chemistryAverageQ30_group)
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

function orderChemistryByExperiment(ndx) {
    
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
    
    var dim = ndx.dimension(dc.pluck("Chemistry"));
    var capture = orderByExperiment(dim, "Capture");
    var exome = orderByExperiment(dim, "Exome");
    var genome = orderByExperiment(dim, "Genome");
    
    dc.barChart("#chemistry--experiment-distribution")
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

function orderChemistryByUser(ndx) {
    
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
    
    var dim = ndx.dimension(dc.pluck("Chemistry"));
    var thomas = orderByUser(dim, "Thomas");
    var jane = orderByUser(dim, "Jane");
    var wayne = orderByUser(dim, "Wayne");
    var sarah = orderByUser(dim, "Sarah");
    var andrew = orderByUser(dim, "Andrew");
    var helen = orderByUser(dim, "Helen");
    
    dc.barChart("#chemistry--user-distribution")
        .width(400)
        .height(300)
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
