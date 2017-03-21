import { UserRouteLog } from './exports.js';
import { UserRoute } from './exports.js';
import { UserFeedback } from './exports.js';
import { OptimumUsers } from './exports.js';
import { OptimumMessages } from './exports.js';
import { EventNotifications } from './exports.js';
import { UserTrip } from './exports.js';

Meteor.methods({ 
    userCount: function(start, end){        
        let userCount  =null;
        if (start != null && end !=null){
            userCount = OptimumUsers.find({ 'firstLogin' : { $gte : new Date(start), $lt: new Date(end) }}).count();
        }
        else if (start != null){
            userCount = OptimumUsers.find({ 'firstLogin' : { $gte : new Date(start)}}).count();
        }
        else if (end !=null){
            userCount = OptimumUsers.find({ 'firstLogin' : { $lt: new Date(end) }}).count();
        }
        else{
            userCount = OptimumUsers.find().count();   
        }        
        return userCount;
    },

    userRouteLogCount: function(start, end) {
        let userRouteLogCount  =null;
        if (start != null && end !=null){
            userRouteLogCount = UserRouteLog.find({ 'createdDate' : { $gte : new Date(start), $lt: new Date(end) }}).count();
        }
        else if (start != null){
            userRouteLogCount = UserRouteLog.find({ 'createdDate' : { $gte : new Date(start)}}).count();
        }
        else if (end !=null){
            userRouteLogCount = UserRouteLog.find({ 'createdDate' : { $lt: new Date(end) }}).count();
        }
        else{
            userRouteLogCount = UserRouteLog.find().count();   
        }        
        return userRouteLogCount;
    },

    userRouteSavedRoutesCount: function(start, end) {        
        let userRouteCount  =null;
        if (start != null && end !=null){
            userRouteCount = UserTrip.find({"favourite" : true, 'createdat' : { $gte : new Date(start), $lt: new Date(end) }}).count();
        }
        else if (start != null){
            userRouteCount = UserTrip.find({"favourite" : true, 'createdat' : { $gte : new Date(start)}}).count();
        }
        else if (end !=null){
            userRouteCount = UserTrip.find({"favourite" : true, 'createdat' : { $lt: new Date(end) }}).count();
        }
        else{
            userRouteCount = UserTrip.find({"favourite" : true}).count();   
        }
        return userRouteCount;
    },

    userRatingsCount: function() {
        let userRatingsCount = UserFeedback.find().count();
        return userRatingsCount;
    },

    femaleUsers: function(start, end) {
        let femaleUsers  =null;
        if (start != null && end !=null){
            femaleUsers = OptimumUsers.find({"demographics.gender" : "female", 'firstLogin' : { $gte : new Date(start), $lt: new Date(end) }}).count();
        }
        else if (start != null){
            femaleUsers = OptimumUsers.find({"demographics.gender" : "female", 'firstLogin' : { $gte : new Date(start) }}).count();
        }
        else if (end !=null){
            femaleUsers = OptimumUsers.find({"demographics.gender" : "female", 'firstLogin' : { $lt: new Date(end) }}).count();
        }
        else{
            femaleUsers = OptimumUsers.find({"demographics.gender" : "female"}).count();
        }
        return femaleUsers;
    },

    maleUsers: function(start, end) {        
        let maleUsers  =null;
        if (start != null && end !=null){
            maleUsers = OptimumUsers.find({"demographics.gender" : "male", 'firstLogin' : { $gte : new Date(start), $lt: new Date(end) }}).count();
        }
        else if (start != null){
            maleUsers = OptimumUsers.find({"demographics.gender" : "male", 'firstLogin' : { $gte : new Date(start) }}).count();
        }
        else if (end !=null){
            maleUsers = OptimumUsers.find({"demographics.gender" : "male", 'firstLogin' : { $lt: new Date(end) }}).count();
        }
        else{
            maleUsers = OptimumUsers.find({"demographics.gender" : "male"}).count();
        }
        return maleUsers;          
    },

    preferredMode: function(start, end, modeId) {
        let preferredMode  =null;
        if (start != null && end !=null){
            preferredMode = OptimumUsers.find({$or: [{"personality.preferredMode" : modeId}, {"personality.preferredMode" : parseInt(modeId)}], 
            'firstLogin' : { $gte : new Date(start), $lt: new Date(end) }}).count();
        }
        else if (start != null){
            preferredMode = OptimumUsers.find({$or: [{"personality.preferredMode" : modeId}, {"personality.preferredMode" : parseInt(modeId)}], 
            'firstLogin' : { $lt: new Date(end) }}).count();
        }
        else if (end !=null){
            preferredMode = OptimumUsers.find({$or: [{"personality.preferredMode" : modeId}, {"personality.preferredMode" : parseInt(modeId)}], 
            'firstLogin' : { $gte : new Date(start)}}).count();
        }
        else{
            preferredMode = OptimumUsers.find({$or: [{"personality.preferredMode" : modeId}, {"personality.preferredMode" : parseInt(modeId)}]}).count();
        }               
        return preferredMode;
    },

    languageUsers: function(start, end, language) {
        let languageUsers = OptimumUsers.find({"language" : language}).count();
        if (start != null && end !=null){
            languageUsers = OptimumUsers.find({"language" : language, 
            'firstLogin' : { $gte : new Date(start), $lt: new Date(end) }}).count();
        }
        else if (start != null){
            languageUsers = OptimumUsers.find({"language" : language, 
            'firstLogin' : { $lt: new Date(end) }}).count();
        }
        else if (end !=null){
            languageUsers = OptimumUsers.find({"language" : language, 
            'firstLogin' : { $gte : new Date(start)}}).count();
        }
        else{
            languageUsers = OptimumUsers.find({"language" : language}).count();
        }                                   
        return languageUsers;
    },

    vehicleOwners: function(start, end, vehicle) { //'car', 'bicycle', 'motorcycle'
        let vehicleOwners = OptimumUsers.find({'owned_vehicles': {$elemMatch: {'type':vehicle}},
            'firstLogin' : { $gte : new Date(start)}}).count();

        if (start != null && end !=null){
            vehicleOwners = OptimumUsers.find({'owned_vehicles': {$elemMatch: {'type':vehicle}},
            'firstLogin' : { $gte : new Date(start), $lt: new Date(end) }}).count();
        }
        else if (start != null){
            vehicleOwners = OptimumUsers.find({'owned_vehicles': {$elemMatch: {'type':vehicle}},
            'firstLogin' : { $lt: new Date(end) }}).count();
        }
        else if (end !=null){
            vehicleOwners = OptimumUsers.find({'owned_vehicles': {$elemMatch: {'type':vehicle}},
            'firstLogin' : { $gte : new Date(start)}}).count();
        }
        else{
            vehicleOwners = OptimumUsers.find({'owned_vehicles': {$elemMatch: {'type':vehicle}}}).count();
        }        
        return vehicleOwners;
    },

    helpfulMessages: function(start, end) {
        let helpfulMessages = UserRoute.find({"route_feedback.helpful" : true}).fetch();
        let routeIds = null;
        if (start != null && end !=null){
            routeIds = UserTrip.find({'createdat' : { $gte : new Date(start), $lt: new Date(end) }},
                {fields: {'requestId':1}}).fetch();
        }
        else if (start != null){
            routeIds = UserTrip.find({'createdat' : { $lt: new Date(end) }},{fields: {'requestId':1}}).fetch();
        }
        else if (end !=null){
            routeIds = UserTrip.find({'createdat' : { $gte : new Date(start)}}, {fields: {'requestId':1}}).fetch();
        }
        else{
            routeIds = UserTrip.find({}, {fields: {'requestId':1}}).fetch();
        }
        helpfullMessagesArray = _.pluck(helpfulMessages,"_id");
        routeIdsArray = _.pluck(routeIds,"requestId");
        result = 0;
        for (element in helpfullMessagesArray){
            if (_.indexOf(routeIdsArray, element) >= 0){
                result++;
            }
        }        
        return result;
    },

    notHelpfulMessages: function(start, end) {
        let notHelpfulMessages = UserRoute.find({"route_feedback.helpful" : false}).fetch();        
        let routeIds = null;
        if (start != null && end !=null){
            routeIds = UserTrip.find({'createdat' : { $gte : new Date(start), $lt: new Date(end) }},
                {fields: {'requestId':1}}).fetch();
        }
        else if (start != null){
            routeIds = UserTrip.find({'createdat' : { $lt: new Date(end) }},{fields: {'requestId':1}}).fetch();
        }
        else if (end !=null){
            routeIds = UserTrip.find({'createdat' : { $gte : new Date(start)}}, {fields: {'requestId':1}}).fetch();
        }
        else{
            routeIds = UserTrip.find({}, {fields: {'requestId':1}}).fetch();
        }
        notHelpfulMessagesArray = _.pluck(notHelpfulMessages,"_id");
        routeIdsArray = _.pluck(routeIds,"requestId");
        result = 0;
        for (element in notHelpfulMessagesArray){
            if (_.indexOf(routeIdsArray, element) >= 0){
                result++;
            }
        }        
        return result;        
    },

    personalityType: function(start, end, personality) { //Extraversion, Agreeableness, Conscientiousness, Neuroticism, Openness
        let personalityType = null; 
        if (start != null && end !=null){
            personalityType = OptimumUsers.find({"personality.typeStr" : personality,
            'firstLogin' : { $gte : new Date(start), $lt: new Date(end) }}).count();
        }
        else if (start != null){
            personalityType = OptimumUsers.find({"personality.typeStr" : personality,
            'firstLogin' : { $lt: new Date(end) }}).count();
        }
        else if (end !=null){
            personalityType = OptimumUsers.find({"personality.typeStr" : personality,
            'firstLogin' : { $gte : new Date(start)}}).count();
        }
        else{
            personalityType = OptimumUsers.find({"personality.typeStr" : personality}).count();
        }               
        return personalityType;
    },

    numberOfMessages: function() {
        let numberOfMessages = OptimumMessages.find().count();        
        return numberOfMessages;
    },

    numberOfEventNotifications: function(start, end) {        
        let numberOfEventNotifications = null; 
        if (start != null && end !=null){
            numberOfEventNotifications = EventNotifications.find({'datetime' : { $gte : new Date(start), $lt: new Date(end) }}).count();
        }
        else if (start != null){
            numberOfEventNotifications = EventNotifications.find({'datetime' : { $lt: new Date(end) }}).count();
        }
        else if (end !=null){
            numberOfEventNotifications = EventNotifications.find({'datetime' : { $gte : new Date(start)}}).count();
        }
        else{
            numberOfEventNotifications = EventNotifications.find().count();
        }                     
        return numberOfEventNotifications;
    },

    numberOfNotifiedUsers: function(start, end) {
        let numberOfNotifiedUsers = null;
        if (start != null && end !=null){
            numberOfNotifiedUsers = EventNotifications.aggregate([
            {$match:{
                'datetime' : { $gte : new Date(start), $lt: new Date(end) }
            }},
            {$unwind: "$affected_users"},
            {$group: {_id: null, number: {$sum: 1 }}}
          ]);            
        }
        else if (start != null){
            numberOfNotifiedUsers = EventNotifications.aggregate([
            {$match:{
                'datetime' : { $lt: new Date(end) }
            }},
            {$unwind: "$affected_users"},
            {$group: {_id: null, number: {$sum: 1 }}}
          ]);            
        }
        else if (end !=null){
            numberOfNotifiedUsers = EventNotifications.aggregate([
            {$match:{
                'datetime' : { $gte : new Date(start) }
            }},
            {$unwind: "$affected_users"},
            {$group: {_id: null, number: {$sum: 1 }}}
          ]);            
        }
        else{
            numberOfNotifiedUsers = EventNotifications.aggregate([           
            {$unwind: "$affected_users"},
            {$group: {_id: null, number: {$sum: 1 }}}
          ]);
        }                             
        if (numberOfNotifiedUsers.length == 0){
            console.log(0);
            return numberOfNotifiedUsers.length;
        }
        else{
            console.log(numberOfNotifiedUsers[0].number);
            return numberOfNotifiedUsers[0].number;
        }        
    }
});