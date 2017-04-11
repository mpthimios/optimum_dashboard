import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';

//import { EventNotifications } from './exports.js';

import './googlemaps-geolocation.html';


  var MAP_ZOOM = 5;

  Template.demomap.onRendered(function() {
    var self = this;

    GoogleMaps.ready('demomap', function(map) {
      var marker;
      console.log('map ready');
      // Create and move the marker when latLng changes.
      // self.autorun(function() {
      //   var lastPoint = null;
      //   eventNotifications = EventNotifications.find({},{sort: {'datatime': -1}, limit: 100});
      //   eventNotifications.forEach(function(obj){
      //       console.log(obj.event.location);
      //       var pointLatLng = new google.maps.LatLng(parseFloat(obj.event.location[1]), parseFloat(obj.event.location[0]));
      //       // If the marker doesn't yet exist, create it.
      //       var point = new google.maps.Marker({
      //           position: new google.maps.LatLng(parseFloat(obj.event.location[1]), parseFloat(obj.event.location[0])),
      //           map: map.instance,
      //           icon: {
      //             path: google.maps.SymbolPath.CIRCLE,
      //             scale: 5
      //           },
      //         });            
      //         point.setPosition(pointLatLng);
      //         map.instance.setCenter(point.getPosition());
      //   });

      //   // Center and zoom the map view onto the current position.  
      // var point = new google.maps.Marker({
      //           position: new google.maps.LatLng(51.508800670335646,-0.06943131238223),
      //           map: map.instance,
      //           icon: {
      //             path: google.maps.SymbolPath.CIRCLE,
      //             scale: 5
      //           },
      //         });            
      //         point.setPosition(new google.maps.LatLng(51.508800670335646,-0.06943131238223));       
          //map.instance.setCenter(point.getPosition());
          //google.maps.event.trigger(map, "resize");
          var latLng = new google.maps.LatLng(51.508800670335646,-0.06943131238223);
          map.instance.setCenter(latLng);
          map.instance.setZoom(MAP_ZOOM);         
      });
    });
  //});

  // Template.demomap.onCreated(function indexOnCreated() {

  //   let self = this;

  //   // self.subscribe('EventNotifications',{
  //   //       onStop: function(e) {
  //   //           if (e) {
  //   //               console.log("EventNotifications subscription error " + e);                  
  //   //           }
  //   //       }
  //   //   });
  // });

  Template.demomap.helpers({
    // geolocationError: function() {
    //   var error = Geolocation.error();
    //   return error && error.message;
    // },
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

      //var latLng = Geolocation.latLng();
      // Initialize the map once we have the latLng.
      
      if (GoogleMaps.loaded()) {
        console.log('map loaded');        
        return {
          center: new google.maps.LatLng(51.508800670335646,-0.06943131238223),
          zoom: MAP_ZOOM
        };
      }
    }
  });


