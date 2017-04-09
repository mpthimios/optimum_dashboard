import { Meteor } from 'meteor/meteor';

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import '/imports/startup/client';

Meteor.startup(() => {
  GoogleMaps.load({ v: '3', key: 'AIzaSyDhvh_iswjNa3Gf19_ctf6Jd2ZucbXbxJQ'});
});
