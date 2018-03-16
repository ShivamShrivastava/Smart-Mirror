!Smart Mirror: The open source modular smart mirror platform.

**Smart Mirror** is a device that can display the user’s image and provide customizable information on the display. Our lifestyle has evolved in such a way that optimizing time is the most important thing. **Smart Mirror** allows you to convert your hallway or bathroom mirror into your personal assistant. Our work is based on the idea that we all look at the mirror when we go out, so why wouldn't the mirror become smart.

**Smart Mirror** focuses on a modular plugin system and uses Electron as an application wrapper. So no more web server or browser installs necessary!

## Characteristics of Smart Mirror
The **Smart Mirror** will consist of an electronic display along with a one-way mirror for the informational display. Some characteristics of Smart Mirror are:
1.	The system will have the ability to display widgets.
2.	The system will have the ability to detect the presence of the user. 
3.	The system will have a relatively lower cost than existing designs. 
4.	 The system should function as a mirror.
5.	 The system should look aesthetically appealing.
6.	 The system will have a customizable UI. 
7.	The system will provide social media interaction that appeals to most users.

## Table Of Contents

- [Usage](#usage)
- [Configuration](#configuration)
- [Modules](#modules)

## Usage

### Raspberry Pi Support
Electron, only supports the Raspberry Pi 2 & 3. The Raspberry Pi 1 is currently **not** supported. 

### Automatic Installer (Raspberry Pi Only!)

Execute the following command on your Raspberry Pi to install SmartMirror:
````
bash -c "$(curl -sL https://raw.githubusercontent.com/MichMich/SmartMirror/master/installers/raspberry.sh)"
````
## Install and run
1. Enter the repository: `cd ~/SmartMirror`
2. Install and run the app: `npm install && npm start`

## Modules

The following modules are installed by default.

- **Clock**
- **Calendar**
- **Compliments**
- **Hello World**
- **Alert**

## Other Modules

- [**Current Weather**](modules/default/currentweather)
- [**Weather Forecast**](modules/default/weatherforecast)
- [**News Feed**](modules/default/newsfeed)
- [**Motion Sensor**](https://github.com/paviro/MMM-PIR-Sensor)
