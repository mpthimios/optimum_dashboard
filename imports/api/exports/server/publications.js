import { Meteor } from 'meteor/meteor';

import { OptimumUsers } from '../exports.js';
import { UserRouteLog } from '../exports.js';
//import { userRouteLogCount } from '../exports.js';


Meteor.publish('OptimumUsers', function usersPublication() {
    return OptimumUsers.find();
}); 

Meteor.publish('userRouteLogCount', function UserRouteLogCountPublication() {
	//console.log(UserRouteLog.find().count());
    return 60;//UserRouteLog.find().count();
}); 