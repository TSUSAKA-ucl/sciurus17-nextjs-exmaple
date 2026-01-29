//234567890123456789012345678901234567890123456789012345678901234567890123456789
"use client";
import * as React from 'react';
import 'aframe';
import '@ucl-nuee/robot-loader/robotRegistry.js';
import '@ucl-nuee/robot-loader/robotLoader.js';
import '@ucl-nuee/robot-loader/ikWorker.js';
import '@ucl-nuee/robot-loader/reflectWorkerJoints.js';
import '@ucl-nuee/robot-loader/reflectCollision.js';
import '@ucl-nuee/robot-loader/reflectJointLimits.js';
import '@ucl-nuee/robot-loader/armMotionUI.js';
import '@ucl-nuee/robot-loader/vrControllerThumbMenu.js';
import '@ucl-nuee/robot-loader/axesFrame.js';
import '@ucl-nuee/robot-loader/baseMover.js';
import '@ucl-nuee/robot-loader/attachToAnother.js';
import '@ucl-nuee/robot-loader/ChangeOpacity.js';
import '@ucl-nuee/robot-loader/fingerCloser.js';

function App() {
  const toSchema = (obj, separator='; ') => {
    if (typeof obj !== 'object' || obj === null) {
      return String(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map((v) => toSchema(v, ',')).join(', ');
    }
    return Object.entries(obj)
      .map(([key, value]) => `${key}: `+toSchema(value,','))
      .join(separator);
  };
  const deg30 = Math.PI / 6.0;
  const deg90 = Math.PI/2;
  const deg67 = Math.PI*3/8;
  const deg45 = Math.PI/4;
  const deg22 = Math.PI/8;
  return (
    <a-scene xr-mode-ui="XRMode: xr"
             renderer="colorManagement: true"
    >
      <a-entity camera position="-0.5 1.2 1.2"
      		wasd-controls="acceleration: 20; maxSpeed: 0.05; fly: true"
                look-controls></a-entity>
      <a-entity id="robot-registry"
                robot-registry >
        <a-entity right-controller
                  laser-controls="hand: right"
                  thumbstick-menu={
                    toSchema({items: ['sciurus-r-arm',
                                      'piper',
				      'sciurus-l-arm',
				      'ray'],
			      laser: false})}
                  target-selector="id: sciurus-r-arm"
                  event-distributor
                  visible="false">
          <a-entity a-axes-frame="length: 0.1" />
        </a-entity>
        <a-entity left-controller
                  laser-controls="hand: left"
                  thumbstick-menu={
                    toSchema({items: ['sciurus-r-arm',
                                      'a0509',
                                      'sciurus-l-arm',
                                      'ray'],
                              laser: false})}
                  target-selector="id: sciurus-l-arm"
                  event-distributor
                  visible="false">
          <a-entity a-axes-frame="length: 0.1" />
        </a-entity>
      </a-entity>
      <a-plane id="piper"
               position="1.5 0.0 -1.0" rotation="-90 0 90"
               width="0.04" height="0.04" color="blue"
               robot-loader="model: piper"
               ik-worker={`0, 0.24, -0.40, 0, 0.23, 0`}
               reflect-worker-joints
               reflect-collision="color: yellow"
               reflect-joint-limits
               arm-motion-ui
               base-mover="velocityMax: 0.2; angularVelocityMax: 0.5"
      >
        <a-circle id="piper-finger7"
                  radius="0.03" color="blue"
                  robot-loader="model: piper-finger7"
                  attach-to-another="to: piper;event: a,b,x,y"
                  finger-closer={toSchema({closeMax: 0, openMax: 3,
                                           openSpeed: 0.03,
                                           closeSpeed: 0.03,
                                           closeEvent: 'abuttondown',
                                           closeStopEvent: 'abuttonup',
                                           openEvent: 'bbuttondown',
                                           openStopEvent: 'bbuttonup'})}
        />
        <a-circle id="piper-finger8"
                  radius="0.03" color="blue"
                  robot-loader="model: piper-finger8"
                  attach-to-another="to: piper;event: a,b,x,y"
                  finger-closer={toSchema({closeMax: 0, openMax: -3,
                                           openSpeed: 0.03,
                                           closeSpeed: 0.03,
                                           closeEvent: 'abuttondown',
                                           closeStopEvent: 'abuttonup',
                                           openEvent: 'bbuttondown',
                                           openStopEvent: 'bbuttonup'})}
        />
      </a-plane>
      <a-plane id="a0509"
               position="-1.5 0.0 -1.0" rotation="-90 0 90"
               width="0.04" height="0.04" color="blue"
               robot-loader="model: a0509"
               ik-worker={`0, ${0}, ${deg90}, 0, ${deg90}, 0`}
               reflect-worker-joints
               reflect-collision="color: yellow"
               reflect-joint-limits
               arm-motion-ui
               base-mover="velocityMax: 0.2; angularVelocityMax: 0.5"
               attach-color-recursively="color: lightblue"
      />
      <a-plane id="sciurus17"
               position="0.0 -0.2 -0.5" rotation="-90 0 110"
               width="0.4" height="0.4" color="tan"
      >
        <a-plane id="sciurus-l-arm"
                 position="0.0 0.0 0.0" rotation="0 0 0"
                 width="0.1" height="0.1" color="tan"
                 material="opacity: 0.5; transparent: true; side: double;"
                 robot-loader="model: sciurus17left"
                 ik-worker={
                   toSchema([0, -deg22, deg45, -deg45, -deg90, 0, deg67, 0])}
                 joint-desirable={
                   toSchema({gain: {1:21, 2:21, 6:21},
			     upper: {1:-deg45, 2:deg67, 6:deg67},
			     lower: {1:-deg45, 2:deg67, 6:deg67}})}
                 joint-desirable-vlimit="all: 0.5"
                 joint-weight="override: 0:0.0064"
                 reflect-worker-joints
                 reflect-collision="color: yellow"
                 reflect-joint-limits
                 add-frame-to-joints="from: 0; to: 1"
                 arm-motion-ui
                 base-mover="velocityMax: 0.2; angularVelocityMax: 0.5"
                 change-original-color-recursively="color: azure"
                 /* attach-opacity-recursively="opacity: 0.5" */
                 /* attach-color-recursively="color: lightskyblue" */
        >
          <a-circle id="sciurus-lgripperA"
                    radius="0.03" color="blue"
                    robot-loader="model: sciurus17lgripperA"
                    attach-to-another="to: sciurus-l-arm;event: a,b,x,y"
                    finger-closer={toSchema({closeMax: 0, openMax: -45,
                                             closeEvent: 'xbuttondown',
                                             closeStopEvent: 'xbuttonup',
                                             openEvent: 'ybuttondown',
                                             openStopEvent: 'ybuttonup'})}
          />
          <a-circle id="sciurus-lgripperB"
                    radius="0.03" color="blue"
                    robot-loader="model: sciurus17lgripperB"
                    attach-to-another="to: sciurus-l-arm;event: a,b,x,y"
                    finger-closer={toSchema({closeMax: 0, openMax: -45,
                                             closeEvent: 'xbuttondown',
                                             closeStopEvent: 'xbuttonup',
                                             openEvent: 'ybuttondown',
                                             openStopEvent: 'ybuttonup'})}
	  />
        </a-plane>
        <a-plane id="sciurus-r-arm"
                 position="0.0 0.0 0.0" rotation="0 0 0"
                 width="0.1" height="0.1" color="white"
                 material="opacity: 0.5; transparent: true; side: double;"
                 robot-loader="model: sciurus17right"
                 attach-to-another="to: sciurus-l-arm; axis: 1"
                 ik-worker={
                   toSchema([deg22, -deg45, deg45, deg90, 0, -deg67, 0])}
                 joint-desirable={
                   toSchema({gain: {0:21, 1:21, 5:21},
                             upper: {0:deg45, 1:-deg67, 5:-deg67},
			     lower: {0:deg45, 1:-deg67, 5:-deg67}})}
                 joint-desirable-vlimit="all: 0.5"
                 reflect-worker-joints
                 reflect-collision="color: yellow"
                 reflect-joint-limits
                 arm-motion-ui
                 change-original-color-recursively="color: azure"
                 /* attach-opacity-recursively="opacity: 0.5" */
                 /* attach-color-recursively="color: lightskyblue" */
        >
          <a-circle id="sciurus-rgripperA"
                    radius="0.03" color="blue"
                    robot-loader="model: sciurus17rgripperA"
                    attach-to-another="to: sciurus-r-arm;event: a,b,x,y"
                    finger-closer="closeMax: 0;openMax: 45;"
          />
          <a-circle id="sciurus-rgripperB"
                    radius="0.03" color="blue"
                    robot-loader="model: sciurus17rgripperB"
                    attach-to-another="to: sciurus-r-arm;event: a,b,x,y"
                    finger-closer="closeMax: 0;openMax: 45;"
          />
        </a-plane>
      </a-plane>
    </a-scene>
  );
}

export default App;
