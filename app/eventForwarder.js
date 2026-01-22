import AFRAME from 'aframe';
import {registerResetTarget} from '@ucl-nuee/robot-loader/attachToAnother.js';

// event-forwarder="target:id;event:eventName"
AFRAME.registerComponent('event-forwarder', {
  multiple: true,
  schema: {
    target: {type: 'string'},
    event: {type: 'string'}
  },
  init: function() {
    this.forwardEvent = (evt) => {
      console.log('event-forwarder: enter', this.data.event);
      const targetEl = document.getElementById(this.data.target);
      if (targetEl) {
	targetEl.emit(this.data.event, evt.detail);
	console.log('event-forwarder: emit', this.data.event, ' target:', targetEl.id);
      }
    };
    console.log('event-forwarder: addEventListener',this.data.event,'to',this.el.id);
    this.el.addEventListener(this.data.event, this.forwardEvent);
    console.log('event-forwarder: addEventListner',this.data.event,'to',this.el.id);
    registerResetTarget(this);
  },
  // play: function() {
  // },
  // pause: function() {
  // },
  // update: function() {
  // },
  remove: function() {
    this.el.removeEventListener(this.data.event, this.forwardEvent);
  }
});
