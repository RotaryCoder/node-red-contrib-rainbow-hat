## Node-RED node for the Pimoroni Rainbow HAT

### Provided nodes

* Temperature/Pressure
* 4-digit Alphanumeric Character Display
* 7 Element Rainbow
* 3 Touch Inputs 
* 3 LEDs, Red, Green and Blue

Piezo Transducer (not supported)

### Supported configuration

* Raspberry Pi 3 Model B Rev 1.2
* RaspianOS: v4.9.59-v7
* Node-RED: v0.17.5
* Node.js: v8.9.4

### Pre-Installation check

Ensure that the following lines are uncommented in your ```/boot/config.txt```.
Reboot your device after changing the above file.

```
dtparam=i2c_arm=on
dtparam=spi=on
```
Note: If for some reason the installation process via "manage palette" will fail, try installing the rainbow-hat node via CLI.

```
cd ~/.node-red
npm i node-red-contrib-rainbow-hat
```

