const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = config =>
  withAndroidManifest(config, async config => {
    let androidManifest = config.modResults.manifest;

    // add the the xmlns:tools
    androidManifest.$ = {
      ...androidManifest.$,
      "xmlns:tools": "http://schemas.android.com/tools",
    };

    return config;
  });

// import { withAndroidManifest } from "@expo/config-plugins";
// import { ExpoConfig } from "@expo/config-types";

// module.exports = (config: ExpoConfig) =>
//   withAndroidManifest(config, async config => {
//     let androidManifest = config.modResults.manifest;

//     // add the the xmlns:tools
//     androidManifest.$ = {
//       ...androidManifest.$,
//       "xmlns:tools": "http://schemas.android.com/tools",
//     };

//     return config;
//   });
