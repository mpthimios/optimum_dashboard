import { Meteor } from 'meteor/meteor';

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import '/imports/startup/client';

Meteor.startup(() => {
  GoogleMaps.load({v: '3', key: 'AIzaSyCnFyuZyNXy_X8J1RrZIrJcKfsqx8H4vSU'});
  //
  BlazeLayout.setRoot('body');
});
