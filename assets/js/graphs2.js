queue()
    .defer(d3.json, "assets/data/sequencing_metrics2.json")
    .await(makeGraphs);
    
function makeGraphs(error, sequencingData) {
    var ndx = crossfilter(sequencingData);
    
    chemistryCount(ndx);
    chemistry_average_yield(ndx);
    orderChemistryByExperiment(ndx);
    orderChemistryByUser(ndx);

    dc.renderAll();
}

function chemistryCount(ndx) {
    var count_dim = ndx.dimension(dc.pluck('Chemistry'));
    var count_group = count_dim.group();
    
    dc.barChart("#chemistry-count")
        .width(400)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(count_dim)
        .group(count_group)
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
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
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
        // .yAxis().ticks(4);
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
        // .yAxis().ticks(4);
}
