<section class="form-horizontal">

    <!-- Plot Options -->
    <h3>Plot Options</h3>

    <div class="control-group">
        <label class="checkbox control-label" for="autocalc_plotopts"> 
            Auto calculate plot options
            <input type="checkbox" name="autocalc_plotopts" id="autocalc_plotopts" {{? it.autocalc_plotopts }}checked="checked"{{?}}> 
        </label>
    </div>

    <div id="plot-opt-signal-wavelength">
        <label>Signal Wavelength</label>
        <div class="control-group">
            <label class="control-label">
                Start (nm)
            </label>
            <div class="controls">
                <input type="text" data-parse="float" data-unit="nano" class="inputbox" name="ls_start" value="{{= this.converter.to('nano', parseFloat( it.ls_start )) }}" />
            </div>
        </div>

        <div class="control-group">
            <label class="control-label">
                Stop (nm)
            </label>
            <div class="controls">
                <input type="text" data-parse="float" data-unit="nano" class="inputbox" name="ls_stop" value="{{= this.converter.to('nano', parseFloat( it.ls_stop )) }}" />
            </div>
        </div>
    </div>

    <div id="plot-opt-idler-wavelength">
        <label>Idler Wavelength</label>
        <div class="control-group">
            <label class="control-label">
                Start (nm)
            </label>
            <div class="controls">
                <input type="text" data-parse="float" data-unit="nano" class="inputbox" name="li_start" value="{{= this.converter.to('nano', parseFloat( it.li_start )) }}" />
            </div>
        </div>

        <div class="control-group">
            <label class="control-label">
                Stop (nm)
            </label>
            <div class="controls">
                <input type="text" data-parse="float" data-unit="nano" class="inputbox" name="li_stop" value="{{= this.converter.to('nano', parseFloat( it.li_stop )) }}" />
            </div>
        </div>
    </div>

    <div id="plot-opt-theta">
        <label>Theta Range</label>
        <div class="control-group">
            <label class="control-label">
                Start (deg)
            </label>
            <div class="controls">
                <input type="text" data-parse="float" data-unit="deg" class="inputbox" name="theta_start" value="{{= this.converter.to('deg', parseFloat( it.theta_start )) }}" />
            </div>
        </div>

        <div class="control-group">
            <label class="control-label">
                Stop (deg)
            </label>
            <div class="controls">
                <input type="text" data-parse="float" data-unit="deg" class="inputbox" name="theta_stop" value="{{= this.converter.to('deg', parseFloat( it.theta_stop )) }}" />
            </div>
        </div>
    </div>

    <div id="plot-opt-time-delay">
        <label>Time Delay Range</label>
        <div class="control-group">
            <label class="control-label">
                Start (fs)
            </label>
            <div class="controls">
                <input type="text" data-parse="float" data-unit="femto" class="inputbox" name="delT_start" value="{{= this.converter.to('femto', parseFloat( it.delT_start )) }}" />
            </div>
        </div>

        <div class="control-group">
            <label class="control-label">
                Stop (fs)
            </label>
            <div class="controls">
                <input type="text" data-parse="float" data-unit="femto" class="inputbox" name="delT_stop" value="{{= this.converter.to('femto', parseFloat( it.delT_stop )) }}" />
            </div>
        </div>
    </div>
</section>