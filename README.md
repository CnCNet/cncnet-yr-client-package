# CnCNet Yuri's Revenge Client Package

The official CnCNet [Yuri's Revenge](https://cncnet.org/yuris-revenge) package for online.
This package is an add-on to the [XNA CnCNet Client](https://github.com/CnCNet/xna-cncnet-client) by [Rampastring](https://github.com/Rampastring)

### Contributors

* [tomsons26](https://github.com/tomsons26)
* [dkeetonx](https://github.com/dkeetonx)
* [GrantBartlett](https://github.com/GrantBartlett)
* [Martin](https://forums.cncnet.org/profile/32538-ravage/)
* [Kerbiter](https://github.com/Metadorius)
* [Burg](https://github.com/alexp8)
* [devo1929](https://github.com/devo1929)
* [Belonit](https://github.com/Belonit)
* [CCHyper](https://github.com/CCHyper)

### Development

**NOTE:** This is NOT the repository necessary for developing the CNCET client for Yuri's revenge. That is the **XNA CnCNet Client** mentioned above. This is simply a wrapper for it.

To contribute to the XNA client for YR, you must also check out the `xna-cncnet-client` repo mentioned above. Once that repo is checked out, you can copy and paste the `Directory.Build.Game.YR.props` file located into the root of the `xna-cncnet-client` checkout location. This file should automatically copy over all necessary resources from this repository to the output directory of the compiled `xna-cncnet-client` executable. Then, when launched, it should do so with with the Yuri's revenge theme.

You MUST edit the `YRSource` property in the `Directory.Build.Game.YR.props` file if you use it.

### Deployments

[Documentation](DEPLOYMENTS.md)
