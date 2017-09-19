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


var optionSet1 = {
  startDate: moment().subtract(29, 'days'),
  endDate: moment(),
  minDate: new Date('01/01/2016'),
  maxDate: new Date('12/12/2017'),
  dateLimit: {
    days: 720
  },
  showDropdowns: true,
  showWeekNumbers: true,
  timePicker: false,
  timePickerIncrement: 1,
  timePicker12Hour: true,
  ranges: {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  },
  opens: 'left',
  buttonClasses: ['btn btn-default'],
  applyClass: 'btn-small btn-primary',
  cancelClass: 'btn-small',
  format: 'MM/DD/YYYY',
  separator: ' to ',
  locale: {
    applyLabel: 'Submit',
    cancelLabel: 'Clear',
    fromLabel: 'From',
    toLabel: 'To',
    customRangeLabel: 'Custom',
    daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    firstDay: 1
  }
};

var cb = function(start, end, label) {
  console.log(start.toISOString(), end.toISOString(), label);
   updateCharts(start.toISOString(), end.toISOString());
  $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

};


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
			$('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
            $('#reportrange').daterangepicker(optionSet1, cb);
			//updateCharts(start, end);

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

var chartOptions = null;

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

		
		let helpfulMessages = UserRoute.find({'route_feedback.helpful' : true},{fields: {'userId':1, '_id':1}}).fetch();
		let nothelpfulMessages = UserRoute.find({'route_feedback.helpful' : false}, {fields: {'userId':1, '_id':1}}).fetch();
        let routeIds = null;
        comparison = 0;
		suggestion = 0;
		selfmonitoring = 0;
		comparisonf = 0;
		suggestionf = 0;
		selfmonitoringf = 0;
		
		helpfulMessages.forEach(function(mes) {
			
			routeStrategies = UserTrip.find({'requestId': mes._id,'userId':mes.userId,'body.additionalInfo.additionalProperties.message':{$ne:null}}, {fields: {'requestId':1 ,'body.additionalInfo.additionalProperties.strategy':1}}).fetch();
			
			routeStrategies.forEach(function(strategy) {
					
				if(strategy.body.additionalInfo.additionalProperties.strategy == "comparison"){
					comparison++;
				}
				else if(strategy.body.additionalInfo.additionalProperties.strategy == "suggestion"){
					suggestion++;
				}
				else if(strategy.body.additionalInfo.additionalProperties.strategy == "self-monitoring"){
					selfmonitoring++;
				}
				
				
			});
			
		});
		
		
        var labels = ['comparison', 'suggestion', 'self-monitoring'];
        var points = [comparison, suggestion, selfmonitoring];
		
		nothelpfulMessages.forEach(function(mes) {
			
			routeStrategies = UserTrip.find({'requestId': mes._id,'userId':mes.userId,'body.additionalInfo.additionalProperties.message':{$ne:null}}, {fields: {'requestId':1 ,'body.additionalInfo.additionalProperties.strategy':1}}).fetch();
			
			routeStrategies.forEach(function(strategy) {
					
				if(strategy.body.additionalInfo.additionalProperties.strategy == "comparison"){
					comparisonf++;
				}
				else if(strategy.body.additionalInfo.additionalProperties.strategy == "suggestion"){
					suggestionf++;
				}
				else if(strategy.body.additionalInfo.additionalProperties.strategy == "self-monitoring"){
					selfmonitoringf++;
				}
				
				
			});
			
		});
		
		var pointsf = [comparison+comparisonf, suggestion+suggestionf, selfmonitoring+selfmonitoringf];

        
        // Set the data
        var data = {
            labels: labels,
            datasets: [{
                label: "Success",
                fillColor: "rgba(50,205,50,0.2)",
                strokeColor: "rgba(50,205,50,1)",
                pointColor: "rgba(50,205,50,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(50,205,50,1)",
                data: points
            },
			{
                label: "Failure",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: pointsf
            },
			]
        };
    
	//Collect data for second graph
	//Get messages per target
	routeIdswalk = UserTrip.find({'body.additionalInfo.additionalProperties.mode': 'walk', 'body.additionalInfo.additionalProperties.messageId':{$ne:null}}, {fields: {'requestId':1}}).fetch();
	routeIdsbike = UserTrip.find({'body.additionalInfo.additionalProperties.mode': 'bicycle', 'body.additionalInfo.additionalProperties.messageId':{$ne:null}}, {fields: {'requestId':1}}).fetch();
	routeIdspt = UserTrip.find({'body.additionalInfo.additionalProperties.mode': 'pt', 'body.additionalInfo.additionalProperties.messageId':{$ne:null}}, {fields: {'requestId':1}}).fetch();
	routeIdscar = UserTrip.find({'body.additionalInfo.additionalProperties.mode': 'car', 'body.additionalInfo.additionalProperties.messageId':{$ne:null}}, {fields: {'requestId':1}}).fetch();
	routeIdsbikeSharing = UserTrip.find({'body.additionalInfo.additionalProperties.mode': 'bikeSharing', 'body.additionalInfo.additionalProperties.messageId':{$ne:null}}, {fields: {'requestId':1}}).fetch();
	routeIdsbikeRide = UserTrip.find({'body.additionalInfo.additionalProperties.mode': 'bike&ride', 'body.additionalInfo.additionalProperties.messageId':{$ne:null}}, {fields: {'requestId':1}}).fetch();
        
    
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
	messagesIds = UserTrip.find({'body.additionalInfo.additionalProperties.messageId':{$exists:true}},{fields:{'body.additionalInfo.additionalProperties.messageId':1}}).fetch();
	
    //messageIdsArray = _.pluck(messagesIds,"messageId");
	BD=0
	NW=0
	TR=0
	EI=0
	WD=0
	
	messagesIds.forEach(function(m) {

		var mes = m.body.additionalInfo.additionalProperties.messageId;
		//console.log(mes)
		if (mes != undefined || mes != null){
			
            context = OptimumMessages.find({'id':mes},{fields:{'context':1}}).fetch();
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
    var points4 = [helpfulMessages.length, nothelpfulMessages.length];
	
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
	myLineChart = new Chart(ctx).Bar(data4, chartOptions);
	myBarChart2 = new Chart(ctx2).Bar(data, chartOptions);
	myBarChart3 = new Chart(ctx3).Bar(data2, chartOptions);
	myBarChart4 = new Chart(ctx4).Bar(data3, chartOptions);
	
};


function updateCharts(start, end){
	
	let helpfulMessages = UserRoute.find({'route_feedback.helpful' : true},{fields: {'userId':1, '_id':1}}).fetch();
		let nothelpfulMessages = UserRoute.find({'route_feedback.helpful' : false}, {fields: {'userId':1, '_id':1}}).fetch();
        let routeIds = null;
        comparison = 0;
		suggestion = 0;
		selfmonitoring = 0;
		comparisonf = 0;
		suggestionf = 0;
		selfmonitoringf = 0;
		
		helpfulMessages.forEach(function(mes) {
			
			routeStrategies = UserTrip.find({'requestId': mes._id,'userId':mes.userId,'body.additionalInfo.additionalProperties.message':{$ne:null}, 'createdat' : { $gte : new Date(start), $lt: new Date(end) }}, {fields: {'requestId':1 ,'body.additionalInfo.additionalProperties.strategy':1}}).fetch();
			
			routeStrategies.forEach(function(strategy) {
					
				if(strategy.body.additionalInfo.additionalProperties.strategy == "comparison"){
					comparison++;
				}
				else if(strategy.body.additionalInfo.additionalProperties.strategy == "suggestion"){
					suggestion++;
				}
				else if(strategy.body.additionalInfo.additionalProperties.strategy == "self-monitoring"){
					selfmonitoring++;
				}
				
				
			});
			
		});
		
		
        var labels = ['comparison', 'suggestion', 'self-monitoring'];
        var points = [comparison, suggestion, selfmonitoring];
		
		nothelpfulMessages.forEach(function(mes) {
			
			routeStrategies = UserTrip.find({'requestId': mes._id,'userId':mes.userId,'body.additionalInfo.additionalProperties.message':{$ne:null}, 'createdat' : { $gte : new Date(start), $lt: new Date(end) }}, {fields: {'requestId':1 ,'body.additionalInfo.additionalProperties.strategy':1}}).fetch();
			
			routeStrategies.forEach(function(strategy) {
					
				if(strategy.body.additionalInfo.additionalProperties.strategy == "comparison"){
					comparisonf++;
				}
				else if(strategy.body.additionalInfo.additionalProperties.strategy == "suggestion"){
					suggestionf++;
				}
				else if(strategy.body.additionalInfo.additionalProperties.strategy == "self-monitoring"){
					selfmonitoringf++;
				}
				
				
			});
			
		});
		
		var pointsf = [comparison+comparisonf, suggestion+suggestionf, selfmonitoring+selfmonitoringf];

        
        // Set the data
        var data = {
            labels: labels,
            datasets: [{
                label: "Success",
                fillColor: "rgba(50,205,50,0.2)",
                strokeColor: "rgba(50,205,50,1)",
                pointColor: "rgba(50,205,50,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(50,205,50,1)",
                data: points
            },
			{
                label: "Failure",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: pointsf
            },
			]
        };
    
	//Collect data for second graph
	//Get messages per target
	routeIdswalk = UserTrip.find({'body.additionalInfo.additionalProperties.mode': 'walk', 'body.additionalInfo.additionalProperties.messageId':{$ne:null}, 'createdat' : { $gte : new Date(start), $lt: new Date(end) }}, {fields: {'requestId':1}}).fetch();
	routeIdsbike = UserTrip.find({'body.additionalInfo.additionalProperties.mode': 'bicycle', 'body.additionalInfo.additionalProperties.messageId':{$ne:null}, 'createdat' : { $gte : new Date(start), $lt: new Date(end) }}, {fields: {'requestId':1}}).fetch();
	routeIdspt = UserTrip.find({'body.additionalInfo.additionalProperties.mode': 'pt', 'body.additionalInfo.additionalProperties.messageId':{$ne:null}, 'createdat' : { $gte : new Date(start), $lt: new Date(end) }}, {fields: {'requestId':1}}).fetch();
	routeIdscar = UserTrip.find({'body.additionalInfo.additionalProperties.mode': 'car', 'body.additionalInfo.additionalProperties.messageId':{$ne:null}, 'createdat' : { $gte : new Date(start), $lt: new Date(end) }}, {fields: {'requestId':1}}).fetch();
	routeIdsbikeSharing = UserTrip.find({'body.additionalInfo.additionalProperties.mode': 'bikeSharing', 'body.additionalInfo.additionalProperties.messageId':{$ne:null}, 'createdat' : { $gte : new Date(start), $lt: new Date(end) }}, {fields: {'requestId':1}}).fetch();
	routeIdsbikeRide = UserTrip.find({'body.additionalInfo.additionalProperties.mode': 'bike&ride', 'body.additionalInfo.additionalProperties.messageId':{$ne:null}, 'createdat' : { $gte : new Date(start), $lt: new Date(end) }}, {fields: {'requestId':1}}).fetch();
        
    
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
	messagesIds = UserTrip.find({'body.additionalInfo.additionalProperties.messageId':{$exists:true}, 'createdat' : { $gte : new Date(start), $lt: new Date(end) }},{fields:{'body.additionalInfo.additionalProperties.messageId':1}}).fetch();
	
    //messageIdsArray = _.pluck(messagesIds,"messageId");
	BD=0
	NW=0
	TR=0
	EI=0
	WD=0
	
	messagesIds.forEach(function(m) {

		var mes = m.body.additionalInfo.additionalProperties.messageId;
		//console.log(mes)
		if (mes != undefined || mes != null){
			
            context = OptimumMessages.find({'id':mes},{fields:{'context':1}}).fetch();
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
	var successfull = comparison+suggestion+selfmonitoring;
	var unsuccessfull= successfull+comparisonf+suggestionf+selfmonitoringf;
	var labels4 = ['Successful', 'Not'];
    var points4 = [successfull, unsuccessfull];
	
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
		
	var myChartContent = document.getElementById('mybarChartDiv');
    myChartContent.innerHTML = '&nbsp;';
    $('#mybarChartDiv').append('<canvas id="mybarChart" width="500" height="280"><canvas>');
	
	var myChartContent = document.getElementById('mybarChartDiv2');
    myChartContent.innerHTML = '&nbsp;';
    $('#mybarChartDiv2').append('<canvas id="mybarChart2" width="500" height="280"><canvas>');
	
	var myChartContent = document.getElementById('mybarChartDiv3');
    myChartContent.innerHTML = '&nbsp;';
    $('#mybarChartDiv3').append('<canvas id="mybarChart3" width="500" height="280"><canvas>');
	
	var myChartContent = document.getElementById('mybarChartDiv4');
    myChartContent.innerHTML = '&nbsp;';
    $('#mybarChartDiv4').append('<canvas id="mybarChart4" width="500" height="280"><canvas>');

    var ctx = $("#mybarChart").get(0).getContext("2d");
	var ctx2 = $("#mybarChart2").get(0).getContext("2d");     	
	var ctx3 = $("#mybarChart3").get(0).getContext("2d");   
	var ctx4 = $("#mybarChart4").get(0).getContext("2d");  
		
	// draw the charts
    //myLineChart = new Chart(ctx).Line(data, chartOptions);
	myLineChart = new Chart(ctx).Bar(data4, chartOptions);
	myBarChart2 = new Chart(ctx2).Bar(data, chartOptions);
	myBarChart3 = new Chart(ctx3).Bar(data2, chartOptions);
	myBarChart4 = new Chart(ctx4).Bar(data3, chartOptions);
	
};