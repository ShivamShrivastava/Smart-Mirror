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

**Important:** `npm start` does **not** work via SSH, use `DISPLAY=:0 nohup npm start &` instead. This starts the mirror on the remote display.

**Note:** if you want to debug on Raspberry Pi you can use `npm start dev` which will start the SmartMirror app with Dev Tools enabled.

### Updating your Smart Mirror

If you want to update your Smart Mirror to the latest version, use your terminal to go to your Smart Mirror folder and type the following command:

```bash
git pull && npm install
```

If you changed nothing more than the config or the modules, this should work without any problems.
Type `git status` to see your changes, if there are any, you can reset them with `git reset --hard`. After that, git pull should be possible.

## Configuration

You'll can check your configuration running the follow command:
```bash
npm run config:check
```


## Modules

The following modules are installed by default.

- [**Clock**](modules/default/clock)
- [**Calendar**](modules/default/calendar)
- [**Current Weather**](modules/default/currentweather)
- [**Weather Forecast**](modules/default/weatherforecast)
- [**News Feed**](modules/default/newsfeed)
- [**Compliments**](modules/default/compliments)
- [**Hello World**](modules/default/helloworld)
- [**Alert**](modules/default/alert)
- [**Motion Sensor**](https://github.com/paviro/MMM-PIR-Sensor)
