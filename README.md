# Temper8 resin.io
-----------------
## Summary
This application reads and publishes the local temperature (in degress Celsius) on the Internet. The application connects to a Temper 8 device through a Vendor defined USB HID interface and reads sensor data from up to eight connected 1-wire DS18b20 temperature sensors.

The application is build on node.js for Raspberry Pi Zero W and is implemented with TypeScript. The application can be deployed to one or more Raspberry devices through the resin.io docker dashboard. The release contains a Dockerfile.Template for reasin.io. 

## Functionality
The application reads sensor data from all temperature senors connected to the Temper 8 device at regular intervals. Every fifth seconds the application initiates a new polling sequence. First the application asks the device how many sensors are connected and to which ports.  Then the application polls each connected sensor starting from the left most sensor (this is the sensor connected to the port with the lowest number).

At start up the application intiates an express application server at port 80. A successful http request results in a respons containing a JSON array with all sensors and their sensor values.

## Known issues
Here are some known issues with the implementation.

* You must restart the application  when/if the Temper8 device is detached. 
* The application assumes that you have four sensors connected to the device.
* The user interface is very poorly done.