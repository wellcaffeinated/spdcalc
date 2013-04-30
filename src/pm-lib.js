/**
 * Phasematching Library
 * This is the file that will evolve into the lambda_ibrary of functions to compute phasematching.
 */

/**
 * BBO indicies. This is a test object that returns the index of refraction
 * for BBO. Eventually this will be called from the crystal database, but 
 * it is useful to have here for now.
 * @class BBO
 * @param {Array} temp [description]
 */
PhaseMatch.BBO = function BBO (temp) {
    //Selmeir coefficients for nx, ny, nz
    this.temp = temp;
    // this.lambda = lambda
};

PhaseMatch.BBO.prototype  = {
    indicies:function(lambda){
        lambda = lambda * Math.pow(10,6); //Convert for Sellmeir Coefficients
        var no = Math.sqrt(2.7359 + 0.01878/ (sq(lambda) - 0.01822) - 0.01354*sq(lambda));
        var ne = Math.sqrt(2.3753 + 0.01224 / (sq(lambda) - 0.01667) - 0.01516*sq(lambda));

        return [no, no, ne];
    }
};

/**
 * GetIndicies(). This get the principla indices of refraction from the 
 * crystal and computes the index of the photons depending on the
 * angle they make with the optic axes.
 * All angles in radians.
 *
 * @param {[type]} [varname] [description]
 * lambda = photon wavelength
 * theta = angle of lambda_p wrt to crystal axis
 * phi = azimuthal angle of lambda_p wrt to crystal axis
 * theta_s = angle of photon wrt to lambda_p direction
 * phi_s = azimuthal angle of photon wrt to lambda_p direction
 */
PhaseMatch.GetIndices = function GetIndices (crystal, lambda, theta, phi, theta_s, phi_s) {
    // First get the ransfomration to lambda_p coordinates
    var S_x = Math.sin(theta_s)*Math.cos(phi_s);
    var S_y = Math.sin(theta_s)*Math.sin(phi_s);
    var S_z = Math.cos(theta_s);

    // Transform from the lambda_p coordinates to crystal coordinates
    var SR_x = Math.cos(theta)*Math.cos(phi)*S_x - Math.sin(phi)*S_y + Math.sin(theta)*Math.cos(phi)*S_z;
    var SR_y = Math.cos(theta)*Math.sin(phi)*S_x + Math.cos(phi)*S_y + Math.sin(theta)*Math.sin(phi)*S_z;
    var SR_z = -Math.sin(theta)*S_x  + Math.cos(theta)*S_z;
    
    // Normalambda_ize the unit vector
    // FIX ME: When theta = 0, Norm goes to infinity. This messes up the rest of the calculations. In this
    // case I think the correct behaviour is for Norm = 1 ?
    var Norm =  Math.sqrt(sq(S_x) + sq(S_y) + sq(S_z));
    var Sx = SR_x/(Norm);
    var Sy = SR_y/(Norm);
    var Sz = SR_z/(Norm);

    // Get the crystal index of refraction
    var ind = crystal.indicies(lambda);

    var nx = ind[0];
    var ny = ind[1];
    var nz = ind[2];

    var B = sq(Sx) * (1/sq(ny) + 1/sq(nz)) + sq(Sy) *(1/sq(nx) + 1/sq(nz)) + sq(Sz) *(1/sq(nx) + 1/sq(ny));
    var C = sq(Sx) / (sq(ny) * sq(nz)) + sq(Sy) /(sq(nx) * sq(nz)) + sq(Sz) / (sq(nx) * sq(ny));
    var D = sq(B) - 4 * C;

    var nslow = Math.sqrt(2/ (B + Math.sqrt(D)));
    var nfast = Math.sqrt(2/ (B - Math.sqrt(D)));
    // console.log(nslow, nfast)

    return [nfast, nslow];
};

/**
 * GetPMTypeIndices()
 * Gets the index of refraction depending on phasematching type
 * All angles in radians.
 * crystal = crystal object
 * Type = String containg phasematching type
 * lambda_p = pump wavelength
 * lambda_s = signal wavelength
 * lambda_i = idler wavelength
 * theta = angle of lambda_p wrt to crystal axis
 * phi = azimuthal angle of lambda_p wrt to crystal axis
 * theta_s = angle of signal wrt to lambda_p direction
 * phi_s = azimuthal angle of signal wrt to lambda_p direction
 * theta_i = angle of idler wrt to lambda_p direction
 * phi_i = azimuthal angle of idler wrt to lambda_p direction
 */

PhaseMatch.GetPMTypeIndices = function GetPMTypeIndices(crystal, Type, lambda_p, lambda_s, lambda_i, theta, phi, theta_s, theta_i, phi_s, phi_i){
    var ind_s = PhaseMatch.GetIndices(crystal, lambda_s, theta, phi, theta_s, phi_s);
    var ind_i = PhaseMatch.GetIndices(crystal, lambda_i, theta, phi, theta_i, phi_i);
    var ind_p = PhaseMatch.GetIndices(crystal, lambda_p, theta, phi, 0.0, 0.0);
    var n_s, n_i, n_p;

    switch (Type){

        case "e -> o + o":
            n_s = ind_s[0];
            n_i = ind_i[0];
            n_p = ind_p[1];
        break;
        case "e -> e + o":
            n_s = ind_s[1];
            n_i = ind_i[0];
            n_p = ind_p[1];
        break;
        case "e -> o + e":
            n_s = ind_s[0];
            n_i = ind_i[1];
            n_p = ind_p[1];
        break;
        default:
            throw "Error: bad PMType specified";
    }

    return [n_s, n_i, n_p];
};

/*
 * spdc_to_pump_coordinates()
 * Returns a vector that transforms signal/idler into pump coordinates
 * theta = angle of photon wrt to pump direction
 * phi = azimuthal angle of photon wrt to pump direction
 */
PhaseMatch.spdc_to_pump_coordinates = function spdc_to_pump_coordinates(theta,phi){
    return [
        Math.sin(theta) * Math.cos(phi), 
        Math.sin(theta) * Math.sin(phi), 
        Math.cos(theta)
    ];
};
// How do I declare this globally so other functions can call it?
// var spdc_to_pump_coordinates = new spdc_to_pump_coordinates()

/*
 * calc_delK()
 * Gets the index of refraction depending on phasematching type
 * All angles in radians.
 * crystal = crystal object
 * Type = String containg phasematching type
 * lambda_p = pump wavelength
 * lambda_s = signal wavelength
 * lambda_i = idler wavelength
 * theta = angle of lambda_p wrt to crystal axis
 * phi = azimuthal angle of lambda_p wrt to crystal axis
 * theta_s = angle of signal wrt to lambda_p direction
 * phi_s = azimuthal angle of signal wrt to lambda_p direction
 * theta_i = angle of idler wrt to lambda_p direction
 * phi_i = azimuthal angle of idler wrt to lambda_p direction
 * poling_period = Poling period of the crystal
 */
PhaseMatch.calc_delK = function calc_delK (crystal, Type, lambda_p, lambda_s,lambda_i,theta, phi, theta_s, theta_i, phi_s, phi_i, poling_period){

    var ind = PhaseMatch.GetPMTypeIndices(crystal, Type, lambda_p, lambda_s, lambda_i, theta, phi, theta_s, theta_i, phi_s, phi_i);
    var n_s = ind[0];
    var n_i = ind[1];
    var n_p = ind[2];
    // Directions of the signal and idler photons in the lambda_p coordinates
    // This is throwing an error. Can't seem to reference this global function. Weird.
    // var Ss = spdc_to_lambda_p_coordinates(theta_s,phi_s)
    // var Si = spdc_to_lambda_p_coordinates(theta_i,phi_i)
    var Ss = [Math.sin(theta_s)*Math.cos(phi_s), Math.sin(theta_s)*Math.sin(phi_s), Math.cos(theta_s)];
    var Si = [Math.sin(theta_i)*Math.cos(phi_i), Math.sin(theta_i)*Math.sin(phi_i), Math.cos(theta_i)];
    // console.log("SS, SI", Ss, Si)

    var delKx = (2*Math.PI*(n_s*Ss[0]/lambda_s + n_i*Si[0]/lambda_i));
    var delKy = (2*Math.PI*(n_s*Ss[1]/lambda_s + n_i*Si[1]/lambda_i));
    var delKz = (2*Math.PI*(n_p/lambda_p - n_s*Ss[2]/lambda_s - n_i*Si[2]/lambda_i));
    delKz = delKz -2*Math.PI/poling_period;

    return [delKx, delKy, delKz];
};

/*
 * optimum_idler()
 * Analytically calcualte optimum idler photon wavelength
 * All angles in radians.
 * crystal = crystal object
 * Type = String containg phasematching type
 * lambda_p = pump wavelength
 * lambda_s = signal wavelength
 * theta = angle of lambda_p wrt to crystal axis
 * phi = azimuthal angle of lambda_p wrt to crystal axis
 * theta_s = angle of signal wrt to lambda_p direction
 * phi_s = azimuthal angle of signal wrt to lambda_p direction
 * poling_period = Poling period of the crystal
 */
PhaseMatch.optimum_idler = function optimum_idler(crystal, Type,  lambda_p, lambda_s, theta_s, phi_s, theta, phi, poling_period){
    var lambda_i = 1/(1/lambda_p - 1/lambda_s);
    var phi_i = phi_s + Math.PI;

    var delKpp = lambda_s/poling_period;

    var ind = PhaseMatch.GetPMTypeIndices(crystal, Type,lambda_p, lambda_s,lambda_i, theta, phi, theta_s, theta_s, phi_s, phi_i);
    var n_s = ind[0];
    var n_i = ind[1];
    var n_p = ind[2];
    var arg = sq(n_s) + sq(n_p*lambda_s/lambda_p);
    arg -= 2*n_s*n_p*(lambda_s/lambda_p)*Math.cos(theta_s) - 2*n_p*lambda_s/lambda_p*delKpp;
    arg += 2*n_s*Math.cos(theta_s)*delKpp + sq(delKpp);
    arg = Math.sqrt(arg);

    var arg2 = n_s*Math.sin(theta_s)/arg;

    var theta_i = Math.asin(arg2);
    // console.log(theta_i*180/Math.PI);
    return theta_i;
};

/*
 * phasematch()
 * Gets the index of refraction depending on phasematching type
 * All angles in radians.
 * crystal = crystal object
 * Type = String containg phasematching type
 * lambda_p = pump wavelength
 * p_bw = Pump bandwidth
 * W = pump waist
 * lambda_s = signal wavelength
 * lambda_i = idler wavelength
 * L = crystal Length
 * theta = angle of lambda_p wrt to crystal axis
 * phi = azimuthal angle of lambda_p wrt to crystal axis
 * theta_s = angle of signal wrt to lambda_p direction
 * phi_s = azimuthal angle of signal wrt to lambda_p direction
 * theta_i = angle of idler wrt to lambda_p direction
 * phi_i = azimuthal angle of idler wrt to lambda_p direction
 * poling_period = Poling period of the crystal
 * apodization = For periodically poled xtals this is the number of apodization steps
 * apodization_FWHM = Gaussian FWHM for the apodization function
 */
PhaseMatch.phasematch = function phasematch (crystal, Type, lambda_p, p_bw, W, lambda_s,lambda_i,L,theta, phi, theta_s, theta_i, phi_s, phi_i, poling_period, phase, apodization ,apodization_FWHM ){

    var lambda_p_c = 1/(1/lambda_s+1/lambda_i);
    var delK = PhaseMatch.calc_delK(crystal, Type, lambda_p_c, lambda_s,lambda_i,theta, phi, theta_s, theta_i, phi_s, phi_i, poling_period);
    var arg = L/2*(delK[2]);

    //More advanced calculation of phasematching in the z direction. Don't need it now.

    // var l_range = linspace(0,L,apodization+1)
    // A = Math.exp(-sq((l_range - L/2))/2/sq(apodization_FWHM))


    // PMz = 0
    // for m in range(apodization):
    //  delL = Math.abs(l_range[m+1] - l_range[m])
    //  PMz = PMz + A[m]*1j*(Math.exp(1j*delKz*l_range[m]) - Math.exp(1j*delKz*l_range[m+1]))/delKz/(delL) #* Math.exp(1j*delKz*delL/2)

    // PMz = PMz/(apodization)#/L/delKz

    // PMz_ref = Math.sin(arg)/arg * Math.exp(-1j*arg)

    // norm = Math.max(Math.absolute(PMz_ref)) / Math.max(Math.absolute(PMz))
    // PMz = PMz*norm 

    // Phasematching along z dir
    var PMz = Math.sin(arg)/arg; //* Math.exp(1j*arg)
    var PMz_real =  PMz * Math.cos(arg);
    var PMz_imag = PMz * Math.sin(arg);

    // Phasematching along transverse directions
    var PMt = Math.exp(-0.5*(sq(delK[0]) + sq(delK[1]))*sq(W));

    // console.log(PMz_real, PMz_imag,delK[2])
    // Calculate the Pump spectrum
    var alpha = 1;
    // var alpha = calc_alpha_w(Type, crystal, lambda_p, lambda_s,lambda_i, p_bw,theta, phi, theta_s, theta_i, phi_s, phi_i)

    // var PM = alpha*PMz*PMt

    //return the real and imaginary parts of Phase matching function
    return [alpha*PMt* PMz_real, alpha*PMt* PMz_imag];
};

/*
 * phasematch()
 * Gets the index of refraction depending on phasematching type
 * All angles in radians.
 * crystal = crystal object
 * Type = String containg phasematching type
 * lambda_p = pump wavelength
 * p_bw = Pump bandwidth
 * W = pump waist
 * lambda_s = signal wavelength
 * lambda_i = idler wavelength
 * L = crystal Length
 * theta = angle of lambda_p wrt to crystal axis
 * phi = azimuthal angle of lambda_p wrt to crystal axis
 * theta_s = angle of signal wrt to lambda_p direction
 * phi_s = azimuthal angle of signal wrt to lambda_p direction
 * theta_i = angle of idler wrt to lambda_p direction
 * phi_i = azimuthal angle of idler wrt to lambda_p direction
 * poling_period = Poling period of the crystal
 * phase = Bool. True means the phase is calculated 
 * apodization = For periodically poled xtals this is the number of apodization steps
 * apodization_FWHM = Gaussian FWHM for the apodization function
 */
PhaseMatch.phasematch_Int_Phase = function phasematch_Int_Phase(crystal, Type, lambda_p, p_bw, W, lambda_s,lambda_i,L,theta, phi, theta_s, theta_i, phi_s, phi_i, poling_period, phase, apodization ,apodization_FWHM ){
    
    // PM is a complex array. First element is real part, second element is imaginary.
    var PM = PhaseMatch.phasematch(crystal, Type, lambda_p, p_bw, W, lambda_s,lambda_i,L,theta, phi, theta_s, theta_i, phi_s, phi_i, poling_period, phase, apodization ,apodization_FWHM );
    // var PMInt = sq(PM[0]) + sq(PM[1])

    if (phase){
        var PMang = Math.atan2(PM[1],PM[0]) + Math.PI;
        // need to figure out an elegant way to apodize the phase. Leave out for now
        // var x = PMInt<0.01
        // var AP = PMInt
        // var AP[x] = 0.
        // var x = PMInt >0
        // var AP[x] = 1.

        // PM = PMang * AP;
    } else {
        // console.log  ("calculating Intensity")
        PM = sq(PM[0]) + sq(PM[1]);
    }
    // console.log(PM)
    return PM;
};
