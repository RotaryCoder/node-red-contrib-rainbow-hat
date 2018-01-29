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
    const spi = require('spi-device');

    const spiBus = spi.openSync(0, 0);
    const apa102 = new Apa102spi(7);

    function RainbowHatRainbow(config) {
        RED.nodes.createNode(this, config);

        this.on('input', (val) => {
            // turn off all leds
            if (!val || !val.payload) {
                for (let i = 0; i < 7; i++) {
                    apa102.setLedColor(i, 0, 0, 0, 0);
                }
            } else {
                if (Array.isArray(val.payload)) {
                    for (let idx in val.payload) {
                        let led = val.payload[idx];
                        apa102.setLedColor(idx,
                            parseInt(led.brightness) || 1,
                            parseInt(led.red) || 0,
                            parseInt(led.green) || 0,
                            parseInt(led.blue) || 0);
                    }
                } else {
                    for (let idx of Object.keys(val.payload)) {
                        let led = val.payload[idx];
                        apa102.setLedColor(idx,
                            parseInt(led.brightness) || 1,
                            parseInt(led.red) || 0,
                            parseInt(led.green) || 0,
                            parseInt(led.blue) || 0);
                    }
                }
            }

            apa102.sendLeds();
        });

        this.on('close', () => {
            turnOff();
        });
    }

    function turnOff() {
        for (let i = 0; i < 7; i++) {
            apa102.setLedColor(i, 0, 0, 0, 0);
        }
        apa102.sendLeds();
    }

    function Apa102spi (stringLength) {
        this.bufferLength = stringLength * 4;
        this.writeBuffer = Buffer.alloc(this.bufferLength);
        this.bufferLength += 9;
        this.writeBuffer = Buffer.concat([Buffer.alloc(4), this.writeBuffer, Buffer.alloc(5)], this.bufferLength);
    }

    Apa102spi.prototype.sendLeds = function () {
        const message = [{
            sendBuffer: this.writeBuffer,
            byteLength: this.bufferLength
        }];

        spiBus.transferSync(message);
    };

    Apa102spi.prototype.setLedColor = function (n, brightness, r, g, b) {
        n *= 4;
        n += 4;
        this.writeBuffer[n] = brightness | 0b11100000;
        this.writeBuffer[n + 1] = b;
        this.writeBuffer[n + 2] = g;
        this.writeBuffer[n + 3] = r;
    };

    RED.nodes.registerType("rainbow-hat-rainbow", RainbowHatRainbow);
};