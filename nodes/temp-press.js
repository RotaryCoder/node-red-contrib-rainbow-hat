/**
 * Copyright 2018 Wolfgang Flohr-Hochbichler wflohr72@gmail.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
module.exports = function (RED) {

    "use strict";
    const BME280 = require('bme280-sensor');

    function RainbowHatTouchInput(config) {
        RED.nodes.createNode(this, config);

        const options = {
            i2cBusNo   : 1, // defaults to 1
            i2cAddress : BME280.BME280_DEFAULT_I2C_ADDRESS() // defaults to 0x77
        };

        const bme280 = new BME280(options);
        let intervalTimer;

        // Read BME280 sensor data, repeat
        //
        const readSensorData = () => {
            bme280.readSensorData()
                .then((data) => {
                    // temperature_C, pressure_hPa, and humidity are returned by default.
                    // I'll also calculate some unit conversions for display purposes.
                    //
                    data.temperature_F = BME280.convertCelciusToFahrenheit(data.temperature_C);
                    data.pressure_inHg = BME280.convertHectopascalToInchesOfMercury(data.pressure_hPa);

                    this.send({
                        topic: config.topic,
                        payload: data
                    });
                })
                .catch((err) => {
                    this.error('Temperature/Pressure read error', err);
                });
        };

        // Initialize the BME280 sensor
        //
        bme280.init()
            .then(() => {
                if (config.interval > 0) {
                    intervalTimer = setInterval(readSensorData, config.interval);
                }
            })
            .catch((err) => this.error('Temperature/Pressure initialization failed', err));

        this.on('input', () => {
            readSensorData();
        });

        this.on('close', () => {
            // tidy up any state
            if (intervalTimer) {
                clearInterval(intervalTimer);
                intervalTimer=null;
            }
        });
    }

    RED.nodes.registerType("rainbow-hat-temp-press", RainbowHatTouchInput);
}