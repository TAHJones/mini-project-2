queue()
    .defer(d3.json, "assets/data/sequencing_metrics2.json")
    .await(makeGraphs);
    
function makeGraphs(error, sequencingData) {
    var ndx = crossfilter(sequencingData);
    
    user(ndx);
    experiment(ndx);
    chemistry(ndx);
    chemistry_average_yield(ndx);
    orderExperimentByChemistry(ndx);
    
    yield(ndx);
    clusterDensity(ndx);
    passFilter(ndx);
    Q30(ndx);
    
    
    dc.renderAll();
}


function user(ndx) {
    var user_dim = ndx.dimension(dc.pluck('User'));
    var user_group = user_dim.group();
    
    dc.selectMenu("#user")
        .dimension(user_dim)
        .group(user_group);
}

function experiment(ndx) {
    var experiment_dim = ndx.dimension(dc.pluck('Experiment'));
    var experiment_group = experiment_dim.group();
    
    dc.barChart("#experiment")
        .width(400)
        .height(600)
        .margins({top: 50, right: 50, bottom: 30, left: 50})
        .dimension(experiment_dim)
        .group(experiment_group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        // .elasticY(true)
        // .xAxisLabel("Sequencing Experiment")
        .yAxis().ticks(20);
}

function chemistry(ndx) {
    var dim = ndx.dimension(dc.pluck('Chemistry'));
    var group = dim.group();
    
    dc.barChart("#chemistry")
        .width(300)
        .height(500)
        .margins({top: 50, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .brushOn(false)
        // .elasticY(true)
        // .xAxisLabel("Sequencing Chemistry")
        .yAxis().ticks(20);
}

function chemistry_average_yield(ndx) {
    var chemistry_average_yield_dim = ndx.dimension(dc.pluck('Chemistry'));
    
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
    
    var chemistry_average_yield_group = chemistry_average_yield_dim.group().reduce(add_item, remove_item, initialise);
    
    dc.barChart("#chemistry-average-yield")
        .width(400)
        .height(600)
        .margins({top: 50, right: 50, bottom: 30, left: 50})
        .dimension(chemistry_average_yield_dim)
        .group(chemistry_average_yield_group)
        .valueAccessor(function(d){
            // return d.value.average.toFixed(2);
            return d.value.average;
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        // .xAxisLabel("Sequencing Chemistry")
        .yAxisLabel("Average Yield - Gb")
        .yAxis().ticks(6);
}

function orderExperimentByChemistry(ndx) {
    
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
    var captureByChemistry = orderByExperiment(dim, "Capture");
    var exomeByChemistry = orderByExperiment(dim, "Exome");
    var genomeByChemistry = orderByExperiment(dim, "Genome");
    
    dc.barChart("#experiment-by-chemistry")
        .width(400)
        .height(600)
        .dimension(dim)
        .group(captureByChemistry, "Capture")
        .stack(exomeByChemistry, "Exome")
        .stack(genomeByChemistry, "Genome")
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

function yield(ndx) {
    var yield_dim = ndx.dimension(dc.pluck('Run'));
    var yield_group = yield_dim.group().reduceSum(dc.pluck('Yield'));
    
    dc.barChart("#yield")
        .width(1100)
        .height(600)
        .margins({top: 50, right: 50, bottom: 30, left: 50})
        .dimension(yield_dim)
        .group(yield_group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Run No.")
        .yAxisLabel("Yield - Gb")
        .yAxis().ticks(50);
}

function clusterDensity(ndx) {
    var cluster_density_dim = ndx.dimension(dc.pluck('Run'));
    var cluster_density_group = cluster_density_dim.group().reduceSum(dc.pluck('Cluster-Density'));

    dc.barChart("#cluster-density")
        .width(1100)
        .height(600)
        .margins({top: 50, right: 50, bottom: 30, left: 50})
        .dimension(cluster_density_dim)
        .group(cluster_density_group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Run No.")
        .yAxisLabel("Cluster Density - K/mm2")
        .yAxis().ticks(50);
}

function passFilter(ndx) {
    var pass_filter_dim = ndx.dimension(dc.pluck('Run'));
    var pass_filter_group = pass_filter_dim.group().reduceSum(dc.pluck('Pass-Filter'));

    dc.barChart("#pass-filter")
        .width(1100)
        .height(600)
        .margins({top: 50, right: 50, bottom: 30, left: 50})
        .dimension(pass_filter_dim)
        .group(pass_filter_group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Run No.")
        .yAxisLabel("Clusters Passing Filter")
        .yAxis().ticks(50);
}

function Q30(ndx) {
    var Q30_dim = ndx.dimension(dc.pluck('Run'));
    var Q30_group = Q30_dim.group().reduceSum(dc.pluck('Pass-Filter'));

    dc.barChart("#Q30")
        .width(1100)
        .height(600)
        .margins({top: 50, right: 50, bottom: 30, left: 50})
        .dimension(Q30_dim)
        .group(Q30_group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Run No.")
        .yAxisLabel("Q30 Score")
        .yAxis().ticks(50);
}