// Import meteor stuff
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/layouts/blank-layout.js';
import '../../ui/layouts/main-layout.js';
import '../../ui/pages/home.js';
import '../../ui/pages/googlemaps-geolocation.js';
import '../../ui/pages/pmessages.js';
import '../../ui/pages/cep.js';
import '../../ui/pages/rewards.js';
import '../../ui/pages/pcharts.js';
import '../../ui/pages/userstats.js';

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

FlowRouter.route('/pmessages', {
	action: function() {
		BlazeLayout.render('mainLayout', {main: "pmessages"});
	}   
});

FlowRouter.route('/cep', {
	action: function() {
		BlazeLayout.render('mainLayout', {main: "cep"});
	}   
});

FlowRouter.route('/rewards', {
	action: function() {
		BlazeLayout.render('mainLayout', {main: "rewards"});
	}   
});

FlowRouter.route('/pcharts', {
	action: function() {
		BlazeLayout.render('mainLayout', {main: "pcharts"});
	}   
});

FlowRouter.route('/demo', {
	action: function() {
		BlazeLayout.render('blankLayout', {main: "demomap"});
	}    
});

FlowRouter.route('/userstats', {
	action: function() {
		BlazeLayout.render('blankLayout', {main: "userstats"});
	}    
});
