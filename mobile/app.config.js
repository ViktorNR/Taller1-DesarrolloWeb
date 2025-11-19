require('dotenv').config();

module.exports = {
  expo: {
    name: "Mini Marketplace UNAB",
    slug: "mini-marketplace-unab",
    version: "0.1.0",
    sdkVersion: "54.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#002B5C"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.unab.minimarketplace"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#002B5C"
      },
      package: "com.unab.minimarketplace",
      permissions: []
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      apiUrl: process.env.API_URL || "http://172.10.20.3:8000"
    }
  }
};