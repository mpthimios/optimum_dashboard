import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';

import './pmessages.html';

import { OptimumMessages } from '../../api/exports/exports.js';

Template.pmessages.onCreated(function() {

	let self = this;
    
    self.subscribe('OptimumMessages',{
        onStop: function(e) {
            if (e) {
                console.log("OptimumMessages subscription error " + e);             
            }
        },
        onReady: function(e) {

        },
    });
    
});

Template.pmessages.helpers({
    'message': function(){
        return OptimumMessages.find();
    }
});
