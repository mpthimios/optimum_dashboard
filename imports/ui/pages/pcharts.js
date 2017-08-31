import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';


import './pcharts.html';

import { OptimumUsers } from '../../api/exports/exports.js';
import { OptimumMessages } from '../../api/exports/exports.js';
import { UserTrip } from '../../api/exports/exports.js';
//import { UserRouteLogGraph } from '../../api/exports/exports.js';
import { UserRoute } from '../../api/exports/exports.js';
import { UserRouteTrip } from '../../api/exports/exports.js';


Template.pcharts.onCreated(function() {
	

	let self = this;
	
	self.subscribe('UserTrip',{
        onStop: function(e) {
            if (e) {
                console.log("UserTrip subscription error " + e);             
            }
        },
    });
	
	self.subscribe('OptimumMessages',{
        onStop: function(e) {
            if (e) {
                console.log("UserTrip subscription error " + e);             
            }
        },
    });
	
	self.subscribe('UserRoute',{
        onStop: function(e) {
            if (e) {
                console.log("UserRoute subscription error " + e);             
            }
        },
        onReady: function(e) {
			
			createRequestsChart();

        },
    });
	
    
});

Template.pcharts.helpers({
    /*'message': function(){
        return OptimumMessages.find();
    },*/
	'route': function(){
        return UserRoute.find();
    },
	'trip': function(){
        return UserTrip.find();
    }
});


function createRequestsChart() {
    console.log("createRequestsChart");
        // Get the context of the canvas element we want to select
        var ctx  = document.getElementById("mybarChart").getContext("2d");
		var ctx2  = document.getElementById("mybarChart2").getContext("2d");  	
		var ctx3  = document.getElementById("mybarChart3").getContext("2d");
		var ctx4  = document.getElementById("mybarChart4").getContext("2d"); 
		

        // Set the options
        var chartOptions = {

            ///Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines: true,

            //String - Colour of the grid lines
            scaleGridLineColor: "rgba(0,0,0,.05)",

            //Number - Width of the grid lines
            scaleGridLineWidth: 1,

            //Boolean - Whether to show horizontal lines (except X axis)
            scaleShowHorizontalLines: true,

            //Boolean - Whether to show vertical lines (except Y axis)
            scaleShowVerticalLines: true,

            //Boolean - Whether the line is curved between points
            bezierCurve: true,

            //Number - Tension of the bezier curve between points
            bezierCurveTension: 0.4,

            //Boolean - Whether to show a dot for each point
            pointDot: true,

            //Number - Radius of each point dot in pixels
            pointDotRadius: 4,

            //Number - Pixel width of point dot stroke
            pointDotStrokeWidth: 1,

            //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
            pointHitDetectionRadius: 20,

            //Boolean - Whether to show a stroke for datasets
            datasetStroke: true,

            //Number - Pixel width of dataset stroke
            datasetStrokeWidth: 2,

            //Boolean - Whether to fill the dataset with a colour
            datasetFill: true,

            //String - A legend template
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

        };

		
		let helpfulMessages = UserRoute.find({'route_feedback.helpful' : true}).fetch();
		let nothelpfulMessages = UserRoute.find({'route_feedback.helpful' : false}).fetch();
        let routeIds = null;
        
        routeIdsComp = UserTrip.find({'body.additionalInfo.additionalProperties.strategy': 'comparison'}, {fields: {'requestId':1}}).fetch();
		routeIdsSug = UserTrip.find({'body.additionalInfo.additionalProperties.strategy': 'suggestion'}, {fields: {'requestId':1}}).fetch();
		routeIdsSelf = UserTrip.find({'body.additionalInfo.additionalProperties.strategy': 'self-monitoring'}, {fields: {'requestId':1}}).fetch();
        
        helpfullMessagesArray = _.pluck(helpfulMessages,"_id");
		nothelpfullMessagesArray = _.pluck(nothelpfulMessages,"_id");
        routeIdsArrayComp = _.pluck(routeIdsComp,"requestId");
		routeIdsArraySug = _.pluck(routeIdsSug,"requestId");
		routeIdsArraySelf = _.pluck(routeIdsSelf,"requestId");
        comparison = 0;
		suggestion = 0;
		selfmonitoring = 0;
		comparisonf = 0;
		suggestionf = 0;
		selfmonitoringf = 0;
		
		
        for (element in helpfullMessagesArray){
			
            if (_.indexOf(routeIdsArrayComp, element) >= 0){
                comparison++;
            }
			if (_.indexOf(routeIdsArraySug, element) >= 0){
                suggestion++;
            }
			if (_.indexOf(routeIdsArraySelf, element) >= 0){
                selfmonitoring++;
            }
        }
		
		/*console.log(UserRoute);
		routeIdsComp = UserTrip.find({}, {fields: {'requestId':1}}).fetch();
		console.log(routeIdsComp)
        //routeIdsComp = UserRouteTrip.find({'strategy': 'comparison', 'helpful' : true}, {fields: {'requestId':1}}).fetch();
		routeIdsArrayComp = _.pluck(routeIdsComp,"requestId");*/
		
        var labels = ['comparison', 'suggestion', 'self-monitoring'];
        var points = [comparison, suggestion, selfmonitoring];
		
		for (element in nothelpfullMessagesArray){
			
            if (_.indexOf(routeIdsArrayComp, element) >= 0){
                comparisonf++;
            }
			if (_.indexOf(routeIdsArraySug, element) >= 0){
                suggestionf++;
            }
			if (_.indexOf(routeIdsArraySelf, element) >= 0){
                selfmonitoringf++;
            }
        }
		
		var pointsf = [comparisonf, suggestionf, selfmonitoringf];

        
        // Set the data
        var data = {
            labels: labels,
            datasets: [{
                label: "Success",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: points
            },
			{
                label: "Failure",
                fillColor: "rgba(255,0,0,0.2)",
                strokeColor: "rgba(255,0,0,1)",
                pointColor: "rgba(255,0,0,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: pointsf
            },
			]
        };
    
	//Collect data for second graph
	//Get messages per target
	routeIdswalk = UserTrip.find({'body.additionalInfo.additionalProperties.mode': 'walk'}, {fields: {'requestId':1}}).fetch();
	routeIdsbike = UserTrip.find({'body.additionalInfo.additionalProperties.mode': 'bike'}, {fields: {'requestId':1}}).fetch();
	routeIdspt = UserTrip.find({'body.additionalInfo.additionalProperties.mode': 'pt'}, {fields: {'requestId':1}}).fetch();
	routeIdscar = UserTrip.find({'body.additionalInfo.additionalProperties.mode': 'car'}, {fields: {'requestId':1}}).fetch();
	routeIdsbikeSharing = UserTrip.find({'body.additionalInfo.additionalProperties.mode': 'bikeSharing'}, {fields: {'requestId':1}}).fetch();
	routeIdsbikeRide = UserTrip.find({'body.additionalInfo.additionalProperties.mode': 'bike&ride'}, {fields: {'requestId':1}}).fetch();
        
    
    routeIdsArraywalk = _.pluck(routeIdswalk,"requestId");
	routeIdsArraybike = _.pluck(routeIdsbike,"requestId");
	routeIdsArraypt = _.pluck(routeIdspt,"requestId");
	routeIdsArraycar = _.pluck(routeIdscar,"requestId");
	routeIdsArraybikeSharing = _.pluck(routeIdsbikeSharing,"requestId");
	routeIdsArraybikeRide = _.pluck(routeIdsbikeRide,"requestId");
	
	
    var labels2 = ['walk', 'bike', 'pt', 'car', 'bikeSharing', 'bike&ride'];
    var points2 = [routeIdsArraywalk.length, routeIdsArraybike.length, routeIdsArraypt.length, routeIdsArraycar.length, routeIdsArraybikeSharing.length, routeIdsArraybikeRide.length];
	
	var data2 = {
            labels: labels2,
            datasets: [{
                label: "Data",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: points2
            }]
        };
		
		
	//Collect data for third graph
	messagesIds = UserTrip.find({},{fields:{'body.additionalInfo.additionalProperties.messageId':1}}).fetch();
	
    //messageIdsArray = _.pluck(messagesIds,"messageId");
	BD=0
	NW=0
	TR=0
	EI=0
	WD=0
	
	messagesIds.forEach(function(m) {

		var mes = m.body.additionalInfo.additionalProperties.messageId;
		if (mes != undefined || mes != null){
			
            context = OptimumMessages.find({'id':m.body.additionalInfo.additionalProperties.messageId},{fields:{'context':1}}).fetch();
			context.forEach(function(c){
			
			if (c.context == "BikeDistance"){
				BD+=1
			}
			if (c.context == "NiceWeather"){
				NW+=1
			}
			if (c.context == "emissionIncreasing"){
				EI+=1
			}
			if (c.context == "TooManyTransportRoutes"){
                TR+=1
			}
			if (c.context == "WalkingDistance"){
                WD+=1
			}
			});
        }
	});
	

	
	var labels3 = ['Bike Distance', 'Nice Weather', 'emission Increasing', 'Too Many Transport Routes', 'Walking Distance'];
    var points3 = [BD, NW, EI, TR, WD];
	
	var data3 = {
            labels: labels3,
            datasets: [{
                label: "Data",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: points3
            }]
        };
		
	//Graph 4
	var labels4 = ['Successful', 'Not'];
    var points4 = [helpfullMessagesArray.length, nothelpfullMessagesArray.length];
	
	var data4 = {
            labels: labels4,
            datasets: [{
                label: "Data",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: points4
            }]
        };
		
	// draw the charts
    //myLineChart = new Chart(ctx).Line(data, chartOptions);
	myLineChart = new Chart(ctx).Bar(data, chartOptions);
	myBarChart2 = new Chart(ctx2).Bar(data2, chartOptions);
	myBarChart3 = new Chart(ctx3).Bar(data3, chartOptions);
	myBarChart4 = new Chart(ctx4).Bar(data4, chartOptions);
	
};