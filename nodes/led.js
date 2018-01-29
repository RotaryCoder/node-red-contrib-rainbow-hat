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
    const gpio = require('rpi-gpio');

    gpio.setMode(gpio.MODE_BCM);

    function RainbowHatLED(config) {
        RED.nodes.createNode(this, config);

        gpio.setup(config.channel || 6, gpio.DIR_OUT, (err) => {
            if (err) {
                this.error('LED initialization failed for channel #' + config.channel + ': ' + err);
                this.status({fill:"red",shape:"ring",text:"not connected"});
            } else {
                this.status({});
            }
        });

        this.on('close', () => {
            gpio.destroy();
        });

        this.on('input', (val) => {
            gpio.write(config.channel, !val || !val.payload ? false : val.payload, (err) => {
                if (err) {
                    this.error('LED initialization failed for channel #' + config.channel + ': ' + err);
                    this.status({fill:"red",shape:"ring",text:"write error"});
                } else {
                    this.status({});
                }
            });
        });
    }

    RED.nodes.registerType("rainbow-hat-led", RainbowHatLED);
}