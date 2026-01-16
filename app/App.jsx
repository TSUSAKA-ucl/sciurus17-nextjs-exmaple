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

function App() {
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
                  thumbstick-menu="items: ray; laser: false"
                  target-selector="id: sciurus-r-arm"
                  event-distributor
                  visible="false">
          <a-entity a-axes-frame="length: 0.1" />
        </a-entity>
        <a-entity left-controller
                  laser-controls="hand: left"
                  thumbstick-menu="items: ray; laser: false"
                  target-selector="id: sciurus-l-arm"
                  event-distributor
                  visible="false">
          <a-entity a-axes-frame="length: 0.1" />
        </a-entity>
      </a-entity>
      {/* <a-plane id="a0509" */}
      {/*          position="0.0 0.0 -1.0" rotation="-90 0 -90" */}
      {/*          width="0.04" height="0.04" color="blue" */}
      {/*          robot-loader="model: a0509white" */}
      {/*          ik-worker={`0, ${-deg90}, ${deg90}, 0, ${deg90}, 0`} */}
      {/*          reflect-worker-joints */}
      {/*          arm-motion-ui */}
      {/*          base-mover="velocityMax: 0.2; angularVelocityMax: 0.5" */}
      {/*          attach-color-recursively="color: lightblue" */}
      {/* /> */}
      <a-plane id="sciurus17"
               position="0.0 -0.2 -0.5" rotation="-90 0 110"
               width="0.4" height="0.4" color="tan"
      >
        <a-plane id="sciurus-l-arm"
                 position="0.0 0.0 0.0" rotation="0 0 0"
                 width="0.1" height="0.1" color="tan"
                 material="opacity: 0.5; transparent: true; side: double;"
                 robot-loader="model: sciurus17left"
                 ik-worker={`0, ${-deg22}, ${deg45}, ${-deg45}, ${-deg90}, ${0}, ${0}, ${0}, ${-deg67}`}
                 joint-desirable={`gain: 1:21,2:21; upper: 1:${-deg67},2:${deg22}; lower: 1:${-deg22},2:${deg22};`}
                 joint-desirable-vlimit="all: 0.5"
                 joint-weight="override: 0:0.0064"
                 reflect-worker-joints
                 reflect-collision="color: yellow"
                 reflect-joint-limits
                 attach-event-broadcaster
                 add-frame-to-joints="from: 0; to: 1"
                 arm-motion-ui
                 base-mover="velocityMax: 0.2; angularVelocityMax: 0.5"
                 change-original-color-recursively="color: azure"
                 /* attach-opacity-recursively="opacity: 0.5" */
                 /* attach-color-recursively="color: lightskyblue" */
        >
        </a-plane>
        <a-plane id="sciurus-r-arm"
                 position="0.0 0.0 0.0" rotation="0 0 0"
                 width="0.1" height="0.1" color="white"
                 material="opacity: 0.5; transparent: true; side: double;"
                 robot-loader="model: sciurus17right"
                 attach-to-another="to: sciurus-l-arm; axis: 1"
                 ik-worker={`${deg22}, ${-deg45}, ${deg45}, ${deg90}, ${0}, ${0}, ${0}, ${deg67}`}
                 joint-desirable={`gain: 0:21,1:21; upper: 0:${deg22},1:${-deg22}; lower: 0:${deg22},1:${-deg22};`}
                 joint-desirable-vlimit="all: 0.5"
                 reflect-worker-joints
                 reflect-collision="color: yellow"
                 reflect-joint-limits
                 attach-event-broadcaster
                 arm-motion-ui
                 change-original-color-recursively="color: azure"
                 /* attach-opacity-recursively="opacity: 0.5" */
                 /* attach-color-recursively="color: lightskyblue" */
        >
        </a-plane>
      </a-plane>
    </a-scene>
  );
}

export default App;
