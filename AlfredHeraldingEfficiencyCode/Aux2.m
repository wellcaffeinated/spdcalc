function [EE,FF,GG,HH,II,AA1,AA2,BB1,BB2]=Aux2(Xi1,Xi2,L,ks,ki,kp,Wx,Wy,Wfs,z0,Rho,Phis,Psis,hs,LAM)


EE = (-2.*Wx.^2 + (1i.*L.*Xi1)./ki - (1i.*L.*Xi1)./kp - (1i.*L.*Xi2)./ki + (1i.*L.*Xi2)./kp - ...
         (ks.*(1i.*kp.*Wx.^2 + 2.*z0 - L.*Xi1).^2)./(kp.*(1i.*ks.*(-2.*z0 + L.*Xi1) + kp.*(-1i.*L.*(-1 + Xi1) + ks.*(Wx.^2 + Wfs.^2.*Phis)))) + ...
         (ks.*(kp.*Wx.^2 + 1i.*2.*z0 - 1i.*L.*Xi2).^2)./(kp.*(1i.*ks.*(2.*z0 - L.*Xi2) + kp.*(1i.*L.*(-1 + Xi2) + ks.*(Wx.^2 + Wfs.^2.*Phis)))))./4;
     
FF=  (-2.*Wy.^2 + (1i.*L.*Xi1)./ki - (1i.*L.*Xi1)./kp - (ks.*(1i.*kp.*Wy.^2 + 2.*z0 - L.*Xi1).^2)./ ...
          (kp.*(kp.*(ks.*(Wfs.^2 + Wy.^2) - 1i.*L.*(-1 + Xi1)) + 1i.*ks.*(-2.*z0 + L.*Xi1))) - (1i.*L.*Xi2)./ki + (1i.*L.*Xi2)./kp - ...
         (ks.*(-1i.*kp.*Wy.^2 + 2.*z0 - L.*Xi2).^2)./(kp.*(kp.*(ks.*(Wfs.^2 + Wy.^2) + 1i.*L.*(-1 + Xi2)) + 1i.*ks.*(2.*z0 - L.*Xi2))))./4;
     
     
GG=  ((-4.*hs.*ks.*(1i.*kp.*Wx.^2 + 2.*z0 - L.*Xi1))./(1i.*ks.*(-2.*z0 + L.*Xi1) + kp.*(-1i.*L.*(-1 + Xi1) + ks.*(Wx.^2 + Wfs.^2.*Phis))) + ...
         (1i.*4.*hs.*ks.*(kp.*Wx.^2 + 1i.*2.*z0 - 1i.*L.*Xi2))./(1i.*ks.*(2.*z0 - L.*Xi2) + kp.*(1i.*L.*(-1 + Xi2) + ks.*(Wx.^2 + Wfs.^2.*Phis))) + ...
         (1i.*2.*ks.*Wfs.^2.*(1i.*kp.*Wx.^2 + 2.*z0 - L.*Xi1).*Phis.*Psis)./(1i.*ks.*(-2.*z0 + L.*Xi1) + kp.*(-1i.*L.*(-1 + Xi1) + ks.*(Wx.^2 + Wfs.^2.*Phis))) - ...
         (2.*ks.*Wfs.^2.*(kp.*Wx.^2 + 1i.*2.*z0 - 1i.*L.*Xi2).*Phis.*Psis)./(1i.*ks.*(2.*z0 - L.*Xi2) + kp.*(1i.*L.*(-1 + Xi2) + ks.*(Wx.^2 + Wfs.^2.*Phis))))./4; 
     
     
HH=  (1i.*2.*L.*Xi1.*Rho - (2.*ks.*L.*(1 + Xi1).*(1i.*kp.*Wy.^2 + 2.*z0 - L.*Xi1).*Rho)./(kp.*(ks.*(Wfs.^2 + Wy.^2) - 1i.*L.*(-1 + Xi1)) + 1i.*ks.*(-2.*z0 + L.*Xi1)) - ...
         1i.*2.*L.*Xi2.*Rho - (2.*ks.*L.*(1 + Xi2).*(-1i.*kp.*Wy.^2 + 2.*z0 - L.*Xi2).*Rho)./(kp.*(ks.*(Wfs.^2 + Wy.^2) + 1i.*L.*(-1 + Xi2)) + 1i.*ks.*(2.*z0 - L.*Xi2)))./4;
     
II=     (-1i.*2.*ki.*L.*Xi1 + 1i.*2.*kp.*L.*Xi1 - 1i.*2.*ks.*L.*Xi1 + (1i.*4.*L.*pi.*Xi1)./LAM + 1i.*2.*ki.*L.*Xi2 - 1i.*2.*kp.*L.*Xi2 + 1i.*2.*ks.*L.*Xi2 - (1i.*4.*L.*pi.*Xi2)./LAM - ...
         (kp.*ks.*L.^2.*(1 + Xi1).^2.*Rho.^2)./(kp.*(ks.*(Wfs.^2 + Wy.^2) - 1i.*L.*(-1 + Xi1)) + 1i.*ks.*(-2.*z0 + L.*Xi1)) - ...
         (kp.*ks.*L.^2.*(1 + Xi2).^2.*Rho.^2)./(kp.*(ks.*(Wfs.^2 + Wy.^2) + 1i.*L.*(-1 + Xi2)) + 1i.*ks.*(2.*z0 - L.*Xi2)) - ...
         (4.*hs.^2.*kp.*ks)./(1i.*ks.*(-2.*z0 + L.*Xi1) + kp.*(-1i.*L.*(-1 + Xi1) + ks.*(Wx.^2 + Wfs.^2.*Phis))) - ...
         (4.*hs.^2.*kp.*ks)./(1i.*ks.*(2.*z0 - L.*Xi2) + kp.*(1i.*L.*(-1 + Xi2) + ks.*(Wx.^2 + Wfs.^2.*Phis))) + ...
         (1i.*4.*hs.*kp.*ks.*Wfs.^2.*Phis.*Psis)./(1i.*ks.*(-2.*z0 + L.*Xi1) + kp.*(-1i.*L.*(-1 + Xi1) + ks.*(Wx.^2 + Wfs.^2.*Phis))) - ...
         (1i.*4.*hs.*kp.*ks.*Wfs.^2.*Phis.*Psis)./(1i.*ks.*(2.*z0 - L.*Xi2) + kp.*(1i.*L.*(-1 + Xi2) + ks.*(Wx.^2 + Wfs.^2.*Phis))) - 2.*Wfs.^2.*Phis.*Psis.^2 + ...
         (kp.*ks.*Wfs.^4.*Phis.^2.*Psis.^2)./(1i.*ks.*(-2.*z0 + L.*Xi1) + kp.*(-1i.*L.*(-1 + Xi1) + ks.*(Wx.^2 + Wfs.^2.*Phis))) + ...
         (kp.*ks.*Wfs.^4.*Phis.^2.*Psis.^2)./(1i.*ks.*(2.*z0 - L.*Xi2) + kp.*(1i.*L.*(-1 + Xi2) + ks.*(Wx.^2 + Wfs.^2.*Phis))))./4;
     
     
AA1=(-1i.*0.25.*L)./ks - Wx.^2./4. + (1i.*0.5.*z0)./kp - (1i.*0.25.*L.*Xi1)./kp + (1i.*0.25.*L.*Xi1)./ks - (Wfs.^2.*Phis)./4;

BB1=(-1i.*0.25.*L)./ks - Wfs.^2./4. - Wy.^2./4. + (1i.*0.5.*z0)./kp - (1i.*0.25.*L.*Xi1)./kp + (1i.*0.25.*L.*Xi1)./ks;

AA2=(1i.*0.25.*L)./ks - Wx.^2./4. - (1i.*0.5.*z0)./kp + (1i.*0.25.*L.*Xi2)./kp - (1i.*0.25.*L.*Xi2)./ks - (Wfs.^2.*Phis)./4;

BB2=(1i.*0.25.*L)./ks - Wfs.^2./4. - Wy.^2./4. - (1i.*0.5.*z0)./kp + (1i.*0.25.*L.*Xi2)./kp - (1i.*0.25.*L.*Xi2)./ks;
     

      