define(
    [
        'jquery',
        'stapes',
        'phasematch',
        'tpl!templates/pm-ui.tpl',
        'tpl!templates/parameters-panel.tpl',
        'jquery-ui',
        'bootstrap-tooltip',
        'jquery.dropkick',
        'jquery.tagsinput',
        'custom-checkbox',

        // physics modules
        'modules/parameters',
        'modules/jsa-ui',
        'modules/hom-ui'
    ],
    function(
        $,
        Stapes,
        PhaseMatch,
        tplPMUI,
        tplParametersPanel,
        _jqui,
        _bstt,
        _dk,
        _jqtags,
        customCheckbox,

        // physics modules
        Parameters,
        jsaUI,
        homUI
    ) {

        'use strict';

        /**
         * Page-level Mediator
         * @module PMUI
         * @implements {Stapes}
         */
        var Mediator = Stapes.subclass({

            /**
             * Mediator Constructor
             * @return {void}
             */
            constructor : function(){

                var self = this;

                self.initParameters();
                self.initUI();
                self.initEvents();
                self.initModules();

                $(function(){
                    self.emit('domready');
                });
            },

            /**
             * Initialize events
             * @return {void}
             */
            initEvents : function(){

                var self = this;
                
                self.on({

                    'domready': self.onDomReady,

                    'ready': function(){
                        
                        // default
                        self.load('jsa');

                        self.emit('info', 'Application Loaded');
                    },

                    'resize': function(){

                        self.elMain.css('height', $(window).height());

                        if (self._curr){
                            self._curr.resize();
                        }
                    },

                    'calculate': function(){

                        self.emit('info', 'recalculating...');
                    },

                    'info': function( msg ){
                        if (!msg) {
                            return;
                        }

                        self.elLogs.append('<p>' + msg + '</p>');
                    }
                });

                self.parameters.on('change', function(){

                    // if (!self.autocalc){
                    //     return;
                    // }

                    self.emit('calculate');
                });

                // collapse button
                self.el.on('click', '.collapse-ctrl', function(e){
                    e.preventDefault();
                    var target = self.elParameters.parent()
                        ,text = target.is('.collapsed') ? '-' : '+'
                        ;

                    $(this).text( text );
                    target.toggleClass('collapsed');
                });

                // autocalc checkbox
                self.el.on('change', '#autocalc', function(){

                    var enabled = $(this).is(':checked');
                    $('.ctrl-calc').prop('disabled', enabled);
                    self.autocalc = enabled;
                });

                // calculate button
                self.el.on('click', '.ctrl-calc', function(){

                    self.emit('calculate');
                });

                // parameters fields
                self.elParameters.on('change', 'input', function(){

                    var $this = $(this)
                        ,key = $this.attr('name')
                        ,val = $this.val()
                        ;
                    // console.log("in PM-ui", key, val);
                    // update the corresponding property in the parameters object
                    self.parameters.set( key, val );
                });

                // PM Type dropdown box
                self.el.find('#PM-Type-Dropdown').change(function(){
                    self.parameters.set("Type", self.el.find('#PM-Type-Dropdown').val() );  
                });

                // Crystal selection dropdown box
                self.el.find('#Crystal-Dropdown').change(function(){
                    self.parameters.set("xtal", self.el.find('#Crystal-Dropdown').val() );  
                });

                self.el.find('#autocalctheta').change(function(){
                    console.log('autocaltheta clicked', self.el.find('#autocalctheta').is(':checked'));
                    self.parameters.set("autocalctheta", self.el.find('#autocalctheta').is(':checked'));
                });
                
                

                var to;
                $(window).on('resize', function(){

                    if (to){
                        clearTimeout( to );
                    }

                    // wait until stopped resizing before triggering resize
                    to = setTimeout(function(){

                        self.emit('resize');    
                    }, 100);
                });
            },

            initUI: function(){

                var self = this;
                self.el = $(tplPMUI.render());

                self.elMain = self.el.find('#main');
                self.elParameters = self.el.find('#parameters');
                self.elLogs = self.el.find('#logs');

                // init parameters panel
                self.elParameters.append( $(tplParametersPanel.render( self.parameters.getAll() )) );
            },

            initParameters: function(){
                
                var self = this;
                self.parameters = Parameters();
            },

            initModules: function(){
                
                var self = this;

                // JSA
                self.set('jsa', jsaUI());
                // HOM
                self.set('hom', homUI());
            },

            /**
             * Load a particular UI
             * @param  {String} id The UI id
             * @return {self}
             */
            load: function( id ){

                var self = this
                    ,mod = self.get( id )
                    ;

                if (!mod){
                    return this;
                }

                self.emit('info', 'Loading ' + id + ' module');

                if (self._curr){
                    self._curr.disconnect( self );
                }

                self._curr = mod;

                // inject containers
                self.elMain.empty().append( mod.getMainPanel() );
                mod.connect( self );

                self.emit('resize');

                return this;
            },

            /**
             * DomReady Callback
             * @return {void}
             */
            onDomReady : function(){

                var self = this;

                // append the main ui elements
                $('#pm-ui').empty().append( self.el );
                customCheckbox( self.el );

                // display type select box
                self.el.find('#ui-modules').dropkick({
                    change: function (value, label) {

                        self.load( value );
                    }
                });

                //  // display Phasematch type select box
                self.elParameters.find('select').dropkick({
                    change: function (value, label) {

                        
                    }
                });

                // Init tags input
                $("#tagsinput").tagsInput();

                // Init jQuery UI slider
                $("#slider").slider({
                    min: 1,
                    max: 5,
                    value: 2,
                    orientation: "horizontal",
                    range: "min"
                });

                // JS input/textarea placeholder
                // $("input, textarea").placeholder();

                // Make pagination demo work
                $(".pagination a").click(function() {
                    if (!$(this).parent().hasClass("previous") && !$(this).parent().hasClass("next")) {
                        $(this).parent().siblings("li").removeClass("active");
                        $(this).parent().addClass("active");
                    }
                });

                $(".btn-group a").click(function() {
                    $(this).siblings().removeClass("active");
                    $(this).addClass("active");
                });

                // Disable link click not scroll top
                $("a[href='#']").click(function() {
                    return false;
                });

                self.emit('ready');
            }

        });

        return new Mediator();
    }
);



