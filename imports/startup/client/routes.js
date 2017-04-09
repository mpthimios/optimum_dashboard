// Import meteor stuff
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/layouts/blank-layout.js';
import '../../ui/layouts/main-layout.js';
import '../../ui/pages/cep.js';
import '../../ui/pages/home.js';

FlowRouter.route('/', {
    action: function() {
		BlazeLayout.render('mainLayout', {main: "home"});
	}   
});

FlowRouter.route('/home', {
   action: function() {
		BlazeLayout.render('mainLayout', {main: "home"});
	} 
});

FlowRouter.route('/cep', {
	action: function() {
		BlazeLayout.render('mainLayout', {main: "cep"});
	}   
});