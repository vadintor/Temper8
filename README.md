# Temper resin.io

Summary
This application reads and publish the local temperature (in degress Celsius) on the Internet. The application connects to a Temper 8 device through USB HID and reads sensor data from up to eight connected 1-wire DS18b20 temperature sensors.

The application is build on node.js for Raspberry pi Zero w using typeScript and can be deployed to one or more Raspberry devices through the resin.io docker dashboard.



Main feature of the application

Modify the `package.json`, `.vscode/launch.json` and README.md file as required, `npm install`, then implement code in the `lib` directory.

Note that `@types` dependencies are currently in the `devDependencies` section of `package.json`. This is because this template is considered a stand-alone application. Should it be intended to be a library then move the `@types` to the `dependencies` section instead.

Compiled code will be output into the `build` directory (transpiled JS, declaration files and source maps).
