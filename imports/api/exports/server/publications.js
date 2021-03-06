import { Meteor } from 'meteor/meteor';

import { OptimumUsers } from '../exports.js';
import { UserRouteLog } from '../exports.js';
import { UserRouteLogGraph } from '../exports.js';
import { EventNotifications } from '../exports.js';
import { OptimumMessages } from '../exports.js';
//import { userRouteLogCount } from '../exports.js';
import { UserTrip } from '../exports.js';
import { UserRoute } from '../exports.js';


Meteor.publish('OptimumUsers', function usersPublication() {
    return OptimumUsers.find();
});

Meteor.publish('OptimumUsersRewards', function usersPublication() {
    return OptimumUsers.find({ "pilot": { $exists: true } });
});

Meteor.publish('OptimumMessages', function usersPublication() {
    return OptimumMessages.find();
});

Meteor.publish('UserRouteLogGraph', function usersPublication() {
	var self = this;
	let aggregated = UserRouteLog.aggregate([
      {$project : {
         year : {$year : "$createdDate"}, 
         month : {$month : "$createdDate"},
         day : {$dayOfMonth : "$createdDate"}         
      }},
      {$group : {
         _id : {year : "$year", month : "$month", day : "$day"}, 
         count : {$sum : 1}
      }},
      { $sort : { _id : 1 } }
    ]).forEach(function(graph_entry) {
        self.added('UserRouteLogGraph', Random.id(), {
            date:  new Date (graph_entry._id.year + "-" + graph_entry._id.month + "-" + graph_entry._id.day),
            count: graph_entry.count
        });
    });
    return UserRouteLogGraph.find();
}); 

Meteor.publish('EventNotifications', function usersPublication() {  
  return EventNotifications.find({},{sort: {'datatime': -1}, limit: 50});
});

Meteor.publish('UserTrip', function usersPublication() {
    return UserTrip.find({ },{fields:{'requestId':1, 'body.additionalInfo':1, 'userId':1, 'createdat':1}});
});

Meteor.publish('UserRoute', function usersPublication() {
    return UserRoute.find();
});


