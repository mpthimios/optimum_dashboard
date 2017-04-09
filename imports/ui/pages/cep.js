import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';
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
 
Template.cep.onCreated(function() {
	let self = this;

	self.subscribe('EventNotifications',{
	      onStop: function(e) {
	          if (e) {
	              console.log("EventNotifications subscription error " + e);
	          }
	      }
	  });

    updateData(null, null);


    GoogleMaps.ready('map', function(map) {
      var marker;

      // Create and move the marker when latLng changes.
      self.autorun(function() {
        var lastPoint = null;
        eventNotifications = EventNotifications.find({},{sort: {'datatime': -1}, limit: 100});
        console.log(eventNotifications);
        eventNotifications.forEach(function(obj){
            console.log(obj.event.location);
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

        // Center and zoom the map view onto the current position.        
        map.instance.setZoom(MAP_ZOOM);
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
    geolocationError: function() {
      var error = Geolocation.error();
      return error && error.message;
    },
    mapOptions: function() {
      //console.log(EventNotifications);
      // marker = new google.maps.Marker({
      //       position: new google.maps.LatLng(latLng.lat, latLng.lng),
      //       map: map.instance,
      //       icon: {
      //         path: google.maps.SymbolPath.CIRCLE,
      //         scale: 5
      //       }

      //     });

      var latLng = Geolocation.latLng();
      // Initialize the map once we have the latLng.
      if (GoogleMaps.loaded() && latLng) {
        return {
          center: new google.maps.LatLng(latLng.lat, latLng.lng),
          zoom: MAP_ZOOM
        };
      }
    }    
});