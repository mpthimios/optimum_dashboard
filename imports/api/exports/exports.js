import { Mongo } from 'meteor/mongo';

export const OptimumUsers = new Mongo.Collection("OptimumUsers", { 
    idGeneration: 'MONGO'
});

export const UserRouteLog = new Mongo.Collection("UserRouteLog", { 
    idGeneration: 'MONGO'
});

export const UserRoute = new Mongo.Collection("UserRoute", { 
    idGeneration: 'MONGO'
});

export const UserFeedback = new Mongo.Collection("UserFeedback", { 
    idGeneration: 'MONGO'
});

