# iTemper Device
-----------------
## Summary
This application reads and publishes the local temperature (in degress Celsius) on the Internet. The application connects to a Temper 8 or Temper Gold device through a vendor defined USB HID interface and reads sensor data from up to eight connected 1-wire DS18b20 temperature sensors (Temper 8).

The application is build on node.js for Raspberry Pi Zero W and is implemented with TypeScript. The application can be deployed to one or more Raspberry devices through the resin.io docker dashboard. The release contains a Dockerfile.Template for resin.io. 

## Functionality
The application reads sensor data from all temperature senors connected to the Temper 8 device at regular intervals. Every fifth seconds the application initiates a new polling sequence. First the application asks the device how many sensors are connected and to which ports.  Then the application polls each connected sensor starting from the left most sensor (this is the sensor connected to the port with the lowest number).

At start up the application intiates an express application server at port 80. 

## Folder structure
### src
./src/
* browser - contains code to be run in a web browser, referenced in public/index.html
* public - static assets.
* routes and views - to be depricated
* models - good tuff

### sd
sd  - contains image for raspberry

### build
build - contains compiled code and the public folder

### top folder
.env - environment variables
tsconfig.browser.json - compiler options for compiling web browser code
tsconfig.json - compiler option for compiling server code to be run by node.js

## Known issues
Here are some known issues with the implementation.

* You must restart the application  when/if the Temper8 device is detached. 
* The application assumes that you have four sensors connected to the device.
* The user interface is very poorly done.

## Version control and configuration management
git add .
git status
git commit -m "<comment>"

## Build & run
Gulp build or Gulp Watch 
npm start_dev (development to read .env file as part of starting node)
NB! Before running npm start plug in a temper sensor device either on a PC or on a raspberry and start itemper-backend.

JSON API 
/Settings?debug=<info> | <debug> | <error>
/Settings?interval=<seconds>

## Release
Github repository: vadintor/iTemper-Device
git push origin master

## Deploy
git push resin master
Environment variables must be set on resin/balena before starting the device. see .env file, which is only used in development mode on PC.