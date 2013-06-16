define(
    [
        'jquery',
        'stapes',
        'phasematch',
        'modules/heat-map',
        'modules/line-plot',
        'modules/skeleton-ui',
        'modules/converter',
        'tpl!templates/schmidt-2d-layout.tpl'
    ],
    function(
        $,
        Stapes,
        PhaseMatch,
        HeatMap,
        LinePlot,
        SkeletonUI,
        converter,
        tplSchmidtLayout
    ) {

        'use strict';

        var con = PhaseMatch.constants;
        
        /**
         * @module schmidtUI
         * @implements {Stapes}
         */
        var schmidtUI = SkeletonUI.subclass({

            constructor: SkeletonUI.prototype.constructor,
            tplPlots: tplSchmidtLayout,
            showPlotOpts: [
                'grid_size',
                'signal-wavelength',
                'idler-wavelength'
            ],

            /**
             * Initialize Plots
             * @return {void}
             */
            initPlots : function(){

                var self = this;

                var margins = {
                    top: 60,
                    right: 40,
                    left: 80,
                    bottom: 60
                };

                // init plot
                self.plot = new HeatMap({
                    title: 'Schmidt number',
                    el: self.el.find('.heat-map-wrapper').get( 0 ),
                    margins: margins,
                    width: 480,
                    height: 480,
                    labels: {
                        x: 'Crystal Length (um)',
                        y: 'Pump Bandwidth (nm)'
                    },
                    xrange: [ 0, 200 ],
                    yrange: [ 0, 100 ],
                    antialias: false,
                    format: {
                        x: '.01f',
                        y: '.02f'
                    }
                });

                self.addPlot( self.plot );
            },

            autocalcPlotOpts: function(){

                var self = this
                    ,threshold = 0.5
                    ,props = self.parameters.getProps()
                    ,lim
                    ;

                // this does nothing... need to use .set()
                props.lambda_i = 1/(1/props.lambda_p - 1/props.lambda_s);
                lim = PhaseMatch.autorange_lambda(props, threshold);

                self.plotOpts.set({
                    'grid_size': 20,
                    'ls_start': lim.lambda_s.min,
                    'ls_stop': lim.lambda_s.max,
                    'li_start': lim.lambda_i.min,
                    'li_stop': lim.lambda_i.max
                });
            },

            calc: function( props ){

                var self = this;
                var po = this.plotOpts;

                var dim = 20;
                var params = {
                    x: "L",
                    y: "BW"
                };

                var x_start = 100e-6;
                var x_stop = 10000e-6;
                var y_start = .1e-9;
                var y_stop = 20e-9;

                var PM = PhaseMatch.calc_schmidt_plot(
                    props, 
                    x_start, 
                    x_stop, 
                    y_start, 
                    y_stop, 
                    self.plotOpts.get('ls_start'), 
                    self.plotOpts.get('ls_stop'),
                    self.plotOpts.get('li_start'), 
                    self.plotOpts.get('li_stop'), 
                    po.get('grid_size'), 
                    params);
                console.log(PM);
                self.data = PM;

                // self.plot.scales.z = d3.scale.linear().domain([0, 50]);
                self.plot.setZRange([1,5]);
                self.plot.setXRange( [ converter.to('micro',x_start), converter.to('micro',x_stop)]);
                self.plot.setYRange( [ converter.to('nano',y_start), converter.to('nano',y_stop)]);
                
                // self.plot.setXRange([ converter.to('nano', self.plotOpts.get('ls_start')), converter.to('nano', self.plotOpts.get('ls_stop')) ]);
                // self.plot.setYRange([ converter.to('nano', self.plotOpts.get('li_start')), converter.to('nano', self.plotOpts.get('li_stop')) ]);
            },

            draw: function(){

                var self = this
                    ,data = self.data
                    ;

                if (!data){
                    return this;
                }

                self.plot.plotData( data );
            }
        });

        return function( config ){

            return new schmidtUI( config );
        };
    }
);