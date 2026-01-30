import AFRAME from 'aframe'
const THREE = window.AFRAME.THREE;
import {isoInvert, isoMultiply} from './isometry3.js';

export function registerResetTarget() {
  // nothing to do
}

AFRAME.registerComponent('parent-notifier', {
  multiple: true,
  schema: {
    target: {type: 'selector'}
  },
  tock: function() {
    const target = this.data.target;
    if (target && target.emit) {
      this.el.object3D.updateMatrixWorld(true);
      const pose = [
	this.el.object3D.getWorldPosition(new THREE.Vector3()),
	this.el.object3D.getWorldQuaternion(new THREE.Quaternion())
      ];
      if (target.id === 'sciurus-r-arm') {
	console.warn('parent-notifier: parent world position=',pose[0],
		     'target=',target.id);
      }
      target.emit('parent-tocked',
		  { isometry: pose },// read only
		  false);
    }
  }
});

AFRAME.registerComponent('attach-to-another', {
  schema: {
    to: {type: 'string'},
    axis: {type: 'number', default: Number.MAX_SAFE_INTEGER},
    event: {type: 'string', default: ''},
  },
  init: function() {
    const evtArgs = this.data.event.split(',').map(e => e.trim()).filter(e => e.length > 0);
    const events = [];
    evtArgs.forEach( (evtName) => {
      if (evtName === 'a' || evtName === 'b' || evtName === 'x' || evtName === 'y') {
	events.push(evtName + 'buttondown');
	events.push(evtName + 'buttonup');
      } else if (evtName === 'trigger' || evtName === 'grip') {
	events.push(evtName + 'down');
	events.push(evtName + 'up');
      } else if (evtName === 'thumbstick') {
	events.push('thumbstickmoved');
	events.push('thumbstickdown');
	events.push('thumbstickup');
      } else {
	events.push(evtName);
      }
    });
    this.evtHandlers = [];
    this.updateParent = (evt) => {
      // console.warn('attach-to-another: parent-tocked received:', evt);
      // this.followed is expected to be attached to the robot's target link(axis)'s el,
      // robot's endLink or axis link's isometry is set in evt.detail.isometry
      // this.relativePose is the fixed isometry from the followed link to this.el
      if (this.followed && this.relativePose) {
	// this.followed.object3D.updateMatrixWorld(true);
	const worldToNew = evt.detail.isometry;
	if (this.el.id === 'sciurus-r-arm') {
	  console.warn('attach-to-another: worldToNew:', worldToNew[0]);
	}
	const worldToThis = isoMultiply(worldToNew, this.relativePose);
	this.el.object3D.updateMatrixWorld(true);
	const worldToOld = [
	  this.el.object3D.getWorldPosition(new THREE.Vector3()),
	  this.el.object3D.getWorldQuaternion(new THREE.Quaternion())
	];
	const oldToThis = isoMultiply(isoInvert(worldToOld), worldToThis);
	if (this.el.id === 'sciurus-r-arm') {
	this.el.object3D.position.copy(oldToThis[0]);
	this.el.object3D.quaternion.copy(oldToThis[1]);
	}
	// this.el.setAttribute('position',
	// 		    {x: oldToThis[0].x,
	// 		     y: oldToThis[0].y,
	// 		     z: oldToThis[0].z});
	// const euler = new THREE.Euler().setFromQuaternion(oldToThis[1],
	// 						  'XYZ');
	// // 'YXZ'?
	// this.el.setAttribute('rotation',
	// 		    {x: THREE.MathUtils.radToDeg(euler.x),
	// 		     y: THREE.MathUtils.radToDeg(euler.y),
	// 		     z: THREE.MathUtils.radToDeg(euler.z)});
      }
    };
    this.onSceneLoaded = () => {
      const attachToRobot = (robEl) => {
	// attach this.el to robot's endLink
	const endLink = robEl?.endLink;
	if (!endLink) {
	  console.warn('endLink:',endLink);
	  console.warn(`Robot ${robEl.id} has no endLink to attach to.`);
	  return;
	}
	if (robEl?.axes == null || !Array.isArray(robEl.axes)) {
	  console.warn(`Robot ${robEl.id} has no axes array to attach to.`);
	  return;
	}
	// console.debug('QQQQQ endLink.hasLoaded?',endLink.hasLoaded);
	console.debug('QQQQQ Attaching this.data.axis:',this.data.axis,
		    'to robot:',robEl.id,
		    'with axes:',robEl.axes.length,
		    'endLink:',endLink.id);
	try {
	  const targetAxisNum = this.data.axis-1;
	  let targetLink;
	  if (targetAxisNum < 0 || robEl.axes.length <= targetAxisNum) {
	    targetLink = endLink;
	  } else {
	    targetLink = robEl.axes[targetAxisNum];
	  }
	  // targetLink.appendChild(this.el);
	  this.el.sceneEl.appendChild(this.el);
	  this.el.removeAttribute('position');
	  this.el.removeAttribute('rotation');
	  this.el.removeAttribute('scale');
	  const myRelativePose = [ this.el.object3D.position.clone(),
				   this.el.object3D.quaternion.clone() ];
	  const myId = this.el.id || this.el.uuid;
	  targetLink.setAttribute(`parent-notifier__${myId}`,
				  {target: this.el});
	  this.followed = targetLink;
	  this.relativePose = myRelativePose;
	  this.el.addEventListener('parent-tocked', this.updateParent);
	  events.forEach( (evtName) => {
	    const evtFunc = (evt) => {
              // console.debug(`Forwarding event ${evtName} from robot `+
              //            `${robEl.id} to attached child ${this.el.id}`);
	      this.el.emit(evtName, evt, false);
	    };
	    robEl.addEventListener(evtName, evtFunc);
	    this.evtHandlers.push({el: robEl, name: evtName,
				   func: evtFunc});
	  });
	  // this.el.play();
	  console.debug(`QQQQQ Attached ${this.el.id} to ${robEl.id}'s`,
		      this.data.axis>=robEl.axes.length
		      ? `endLink :${endLink.id}`
		      : `axis ${this.data.axis}`);
	  if (!(robEl.attached && Array.isArray(robEl.attached))) {
	    robEl.attached = [];
	  }
	  robEl.attached.push(this.el);
	  robEl.emit('attached', {child: this.el}, false);
	  this.el.emit('attach',
		       {parent: robEl, endLink: targetLink}, false);
	} catch (e) {
	  console.error('appendChild failed:',e);
	}
      };
      const robotEl = document.getElementById(this.data.to);
      if (robotEl?.endLink && Array.isArray(robotEl?.axes) ) {
	// robot has been registered
	attachToRobot(robotEl);
      } else if (typeof robotEl?.addEventListener === 'function') {
	robotEl.addEventListener('robot-registered', () => {
	  attachToRobot(robotEl);
	});
      } else {
	console.warn(`Cannot attach to ${this.data.to}: not found or invalid robot entity.`);
      }
    };
    // **** Wait for scene to load
    if (this.el.sceneEl.hasLoaded) {
      this.onSceneLoaded();
    } else {
      this.el.sceneEl.addEventListener('loaded', this.onSceneLoaded);
    }
  },
  remove: function() {
    // remove virtual parent's notifier
    if (this.followed && this.followed.removeAttribute) {
      const myId = this.el.id || this.el.uuid;
      this.followed.removeAttribute(`parent-notifier__${myId}`);
    }
    // remove event forwarders on virtual parent
    this.evtHandlers.forEach( (handler) => {
      if (handler.el && handler.el.removeEventListener) {
	handler.el.removeEventListener(handler.name, handler.func);
      }
    });
  },
  // tick: function() {
  //   if (!this.standardTickDisabled) {
  //     const comps = this.el.components;
  //     if (comps.position) comps.position.tick = function() {};
  //     if (comps.rotation) comps.rotation.tick = function() {};
  //     if (comps.scale) comps.scale.tick = function() {};
      
  //     this.standardTickDisabled = true;
  //   }
  // }
});
