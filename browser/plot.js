require([ 'jquery', 'modules/heat-map', 'phasematch' ], function( $, HeatMap, PhaseMatch ){

    'use strict';

    //This is my test function that lets me calculate entanlged spectral properties
    //of the photons. dim is the dim of the matrix.
    function plotJSA(P,ls_start, ls_stop, li_start,li_stop, dim){
        
        var PM = PhaseMatch.calcJSA(P,ls_start, ls_stop, li_start,li_stop, dim);

        var width = 600;
        var height = 600;

        var hm = new HeatMap({
            width: width,
            height: height
        });

        var startTime = new Date();
        hm.plotData( PM );
        var endTime = new Date();
        var timeDiff = (endTime - startTime)/1000;
        console.log("Plot time = ", timeDiff)
        $(function(){
        
            $('#viewport').append('<p>Timediff: '+timeDiff+'</p>');
        });
    }

    $(function(){
        // wait for domready
        // createPlot(500, 500);
        var con = PhaseMatch.constants;
        var l_start = 1500 * con.nm;
        var l_stop = 1600 * con.nm; 
        var P = new PhaseMatch.SPDCprop();
        plotJSA(P,l_start,l_stop,l_start,l_stop, 600)
    });
 

});