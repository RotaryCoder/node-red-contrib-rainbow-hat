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

    const channel = {
        A: 21,
        B: 20,
        C: 16
    };

    function RainbowHatTouch(config) {
        RED.nodes.createNode(this, config);


        const subChannel = channel[config.button];
        const listener = (channel, value) => {
            if (channel !== subChannel) {
                return;
            }
            const payload = config.mode === 'true' ? !value : value;

            this.send({payload: payload});
        };
        gpio.on('change', listener);

        gpio.setup(subChannel, gpio.DIR_IN, gpio.EDGE_BOTH, (err) => {
            if (err) {
                this.error('Touch input initialization failed for channel #' + subChannel + ': ' + JSON.stringify(err));
                this.status({fill:"red",shape:"ring",text:"not connected"});
            } else {
                if (config.mode === 'false') {
                    this.send({payload: true});
                }
                this.status({});
            }
        });

        this.on('close', () => {
            gpio.removeListener('change', listener);
            gpio.destroy();
        });
    }

    RED.nodes.registerType("rainbow-hat-touch-input", RainbowHatTouch);
}