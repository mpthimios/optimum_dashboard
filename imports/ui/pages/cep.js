import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import {EventNotifications} from '../../api/exports/exports.js';

import './cep.html';

var MAP_ZOOM = 5;

Session.setDefault("numberOfEventNotifications", null);
Session.setDefault("numberOfNotifiedUsers", null);

var updateData = function(start, end){
    Meteor.call("numberOfEventNotifications", start, end, function(err, res) {
        Session.set("numberOfEventNotifications", res);        
    });
    Meteor.call("numberOfNotifiedUsers", start, end, function(err, res) {
        Session.set("numberOfNotifiedUsers", res);        
    });       
}
 
Template.cep.onRendered(function() {
	let self = this;
	self.subscribe('EventNotifications',{
	      onStop: function(e) {
	          if (e) {
	              console.log("EventNotifications subscription error " + e);
	          }
	      }
	  });

    updateData(null, null);

  // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('cepmap', function(map) {
      var marker;

      // Create and move the marker when latLng changes.
      self.autorun(function() {
        var lastPoint = null;
        eventNotifications = EventNotifications.find({},{sort: {'datatime': -1}, limit: 50});
        console.log(eventNotifications);
        eventNotifications.forEach(function(obj){
            //console.log(obj.event.location);
            var pointLatLng = new google.maps.LatLng(parseFloat(obj.event.location[1]), parseFloat(obj.event.location[0]));
            // If the marker doesn't yet exist, create it.
            var point = new google.maps.Marker({
                position: new google.maps.LatLng(parseFloat(obj.event.location[1]), parseFloat(obj.event.location[0])),
                map: map.instance,
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 5
                },
              });            
              point.setPosition(pointLatLng);
              map.instance.setCenter(point.getPosition());
        });
      });
    });
});

Template.cep.helpers({
	 getNumberOfEventNotifications() {
        return Session.get("numberOfEventNotifications");
    },
    getNumberOfNotifiedUsers() {
        return Session.get("numberOfNotifiedUsers");
    },
    mapOptions: function() {
      // Initialize the map
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(51.508800670335646,-0.06943131238223),
          zoom: MAP_ZOOM
        };
      }
    }    
});