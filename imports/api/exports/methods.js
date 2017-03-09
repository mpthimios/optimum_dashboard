import { UserRouteLog } from './exports.js';
import { UserRoute } from './exports.js';
import { UserFeedback } from './exports.js';
import { OptimumUsers } from './exports.js';
import { OptimumMessages } from './exports.js';

Meteor.methods({ 
    userRouteLogCount: function() {
        let userRouteLogCount = UserRouteLog.find().count();
        return userRouteLogCount;
    },

    userRouteCount: function() {
        let userRouteCount = UserRoute.find().count();
        return userRouteCount;
    },

    userRatingsCount: function() {
        let userRatingsCount = UserFeedback.find().count();
        return userRatingsCount;
    },

    helpfulMessages: function() {
        let helpfulMessages = UserRoute.find({"route_feedback.helpful" : true}).count();
        return helpfulMessages;
    },

    notHelpfulMessages: function() {
        let notHelpfulMessages = UserRoute.find({"route_feedback.helpful" : false}).count();        
        return notHelpfulMessages;
    },

    preferredModeCar: function() {
        let preferredModeCar = OptimumUsers.find({$or: [{"personality.preferredMode" : "1"}, {"personality.preferredMode" : 1}]}).count();        
        return preferredModeCar;
    },

    preferredModePT: function() {
        let preferredModePT = OptimumUsers.find({$or: [{"personality.preferredMode" : "2"}, {"personality.preferredMode" : 2}]}).count();
        return preferredModePT;
    },

    preferredModeBICYCLE: function() {
        let preferredModeBICYCLE = OptimumUsers.find({$or: [{"personality.preferredMode" : "3"}, {"personality.preferredMode" : 3}]}).count();        
        return preferredModeBICYCLE;
    },

    preferredModeWALK: function() {
        let preferredModeWALK = OptimumUsers.find({$or: [{"personality.preferredMode" : "4"}, {"personality.preferredMode" : 4}]}).count();        
        return preferredModeWALK;
    },

    femaleUsers: function() {
        let femaleUsers = OptimumUsers.find({"demographics.gender" : "female"}).count();        
        return femaleUsers;
    },

    maleUsers: function() {
        let maleUsers = OptimumUsers.find({"demographics.gender" : "male"}).count();        
        return maleUsers;
    },

    languageENusers: function() {
        let languageENusers = OptimumUsers.find({"language" : "en"}).count();        
        return languageENusers;
    },

    languageDEusers: function() {
        let languageDEusers = OptimumUsers.find({"language" : "de"}).count();        
        return languageDEusers;
    },

    languageSLusers: function() {
        let languageSLusers = OptimumUsers.find({"language" : "sl"}).count();        
        return languageSLusers;
    },

    personalityExtraversion: function() {
        let personalityExtraversion = OptimumUsers.find({"personality.typeStr" : "Extraversion"}).count();        
        return personalityExtraversion;
    },

    personalityAgreeableness: function() {
        let personalityAgreeableness = OptimumUsers.find({"personality.typeStr" : "Agreeableness"}).count();        
        return personalityAgreeableness;
    },

    personalityConscientiousness: function() {
        let personalityConscientiousness = OptimumUsers.find({"personality.typeStr" : "Conscientiousness"}).count();        
        return personalityConscientiousness;
    },

    personalityNeuroticism: function() {
        let personalityNeuroticism = OptimumUsers.find({"personality.typeStr" : "Neuroticism"}).count();        
        return personalityNeuroticism;
    },

    personalityOpenness: function() {
        let personalityOpenness = OptimumUsers.find({"personality.typeStr" : "Openness"}).count();        
        return personalityOpenness;
    },

    ownsCar: function() {
        let ownsCar = OptimumUsers.find({'owned_vehicles': {$elemMatch: {'type':'car'}}}).count();        
        return ownsCar;
    },

    ownsBicycle: function() {
        let ownsBicycle = OptimumUsers.find({'owned_vehicles': {$elemMatch: {'type':'bicycle'}}}).count();        
        return ownsBicycle;
    },

    ownsMotorcycle: function() {
        let ownsMotorcycle = OptimumUsers.find({'owned_vehicles': {$elemMatch: {'type':'motorcycle'}}}).count();        
        return ownsMotorcycle;
    },

    numberOfMessages: function() {
        let numberOfMessages = OptimumMessages.find().count();        
        return numberOfMessages;
    }
});