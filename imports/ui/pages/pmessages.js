import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';
import datatables from 'datatables.net';
import datatables_bs from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';


import './pmessages.html';

import { OptimumMessages } from '../../api/exports/exports.js'; 
import { UserTrip } from '../../api/exports/exports.js';
import { UserRoute } from '../../api/exports/exports.js';

Session.setDefault("messagesFilter", {});
Session.setDefault("strategies", null);
Session.setDefault("targets", null);
Session.setDefault("contexts", null);
Session.setDefault("parameters", null);
Session.setDefault("filterAttributes", null);

function distinct(collection, field) {	
  return _.uniq(collection.find({}, {
    sort: {[field]: 1}, fields: {[field]: 1}
  }).fetch().map(function (element){ return element[field]; }), true); 
}

function addMessagesFilter(query_field, query_text){
	console.log("updating filters");
	var currentQuery = Session.get("messagesFilter");
	console.log(currentQuery);
	if (currentQuery == null || !(query_field in currentQuery)){
		if (currentQuery == null) currentQuery = {};
		currentQuery[query_field] = {};
		currentQuery[query_field]["$in"] = [query_text];
		addFilterAttribute(query_text);
	}
	else{				
		if (query_field in currentQuery){
			if ($.inArray(query_text, currentQuery[query_field]["$in"]) < 0){
				currentQuery[query_field]["$in"].push(query_text);
				addFilterAttribute(query_text);
			}
		}		
	}
	Session.set("messagesFilter", currentQuery);
}

function textSearch(textToSearch){
	var currentQuery = Session.get("messagesFilter");
	console.log(currentQuery);
	if (currentQuery == null) currentQuery = {};		
	currentQuery={ message_text: { $regex: textToSearch } };
	Session.set("messagesFilter", currentQuery);
}

function removeMessagesFilter(query_text){
	console.log("deleting filters");
	var currentQuery = Session.get("messagesFilter");
	console.log(currentQuery);
	if (currentQuery != null){
		$.each( currentQuery, function( key, value ) {
			if (value["$in"] !=null){
				var index = value["$in"].indexOf(query_text);
				if (index > -1 ){
			  		currentQuery[key]["$in"].splice(index, 1);
				}
			}			
		});				
	}		
	var filterAttributes = Session.get("filterAttributes");
	var index = filterAttributes.indexOf(query_text);
  	if (index > -1 ){
  		filterAttributes.splice(index, 1);
  	}
  	Session.set("filterAttributes", filterAttributes);
  	if (filterAttributes.length == 0){
  		if (currentQuery["message_text"] ==null){
  			Session.set("messagesFilter", null);
  		}
  		else{
  			newCurrentQuery = {};
  			newCurrentQuery["message_text"] = currentQuery["message_text"];
  			Session.set("messagesFilter", newCurrentQuery); 
  		}
  	}
  	else{
  		Session.set("messagesFilter", currentQuery);
  	}
  	
}

function addFilterAttribute(attribute){
	var filterAttributes = Session.get("filterAttributes");
	if( filterAttributes == null) filterAttributes = [];
	filterAttributes.push(attribute);
	Session.set("filterAttributes", filterAttributes);
	console.log(filterAttributes);
}

Template.pmessages.onCreated(function() {
	
	datatables(window, $);
    datatables_bs(window, $);

	let self = this;
    
    self.subscribe('OptimumMessages',{
        onStop: function(e) {
            if (e) {
                console.log("OptimumMessages subscription error " + e);             
            }
        },
        onReady: function(e) {
        	Session.set("strategies_filter", distinct(OptimumMessages, 'persuasive_strategy'));
        	Session.set("targets_filter", distinct(OptimumMessages, 'target'));
        	Session.set("contexts_filter", distinct(OptimumMessages, 'context'));
        	Session.set("parameters_filter", distinct(OptimumMessages, 'parameters'));
        },
    });
	
	self.subscribe('UserTrip',{
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


Template.pmessages.helpers({
    'message': function(){    	
    	if (Session.get("messagesFilter") !=null){
    		return OptimumMessages.find(Session.get("messagesFilter"));
    	}
    	else{
    		return OptimumMessages.find();	
    	}
    },
    'message_count': function(){
    	if (Session.get("messagesFilter") !=null){
    		return OptimumMessages.find(Session.get("messagesFilter")).count();
    	}
    	else{
    		return OptimumMessages.find().count();	
    	}
    },
    'persuasive_strategy_filter': function(){    	
    	return Session.get("strategies_filter");
    },
    'target_filter': function(){    	
    	return Session.get("targets_filter");
    },
    'context_filter': function(){    	
    	return Session.get("contexts_filter");
    },
    'parameter_filter': function(){    	
    	return Session.get("parameters_filter");
    },
    'hasAttributes': function(){    	
    	if (Session.get("filterAttributes") !=null){
    		return !((Session.get("filterAttributes")).length == 0);	
    	}
    	else{
    		return false;
    	}
    	
    },
    'attributes': function(){    	
    	return Session.get("filterAttributes");
    },
});


Template.pmessages.onRendered(function(){
	
	/*createRequestsChart();
	
	$('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
    $('#reportrange').daterangepicker(optionSet1, cb);*/
	
    /*var data = [
        ['data 1', 'Data 2', 'Data 3', 'Data 4'],
        ['Data 1', 'Data 2', 'Data 3', 'Data 4']
    ];*/
	
	 //Meteor.subscribe("newCollectionData",function(){console.log(‌​newColl.find().fetch‌​());});
	 /*var messages= OptimumMessages.find().fetch();
	
	 // placeholder array for usernames
     var data = [ ['data1','data1','data1','daa1','data1', 'dcs'] ]
	 var m=[]

    // Get username for each user, add it to usernames array
     messages.forEach(function (mes) {
            // Add current username to usernames array
			console.log("-------------------");
			console.log(mes['message_text']);
			var m = []
			//m.push(mes.message_text)
			m.push('bgmv');
			m.push('bgmv');
			m.push('bgmv');
			m.push('bgmv');
			m.push('bgmv');
			m.push('bgmv');
            data.append(m);
        });

 
    $('#mytable').DataTable({
        data : m
    });*/
	//this.$(".table").DataTable();
	


	// $('#mytable').DataTable({
	// 	"ordering": false,
	// 	"searching": false,
 //        "bPaginate":false,
	// });

});


Template.pmessages.events({
  'click #delete': function(e) {
    e.preventDefault();
	
	swal({
	  title: "Are you sure?",
	  text: "You will not be able to recover this message!",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "Yes, delete it!",
	  cancelButtonText: "No, cancel plx!",
	  closeOnConfirm: false,
	  closeOnCancel: false
	},
	function(isConfirm){
	  if (isConfirm) {
		Meteor.call('deleteMessage', this, function(error, result) {
		  if (error) {
			alert(error);
		  } 
		});
		swal("Deleted!", "Your message has been deleted.", "success");
	  } else {
		swal("Cancelled", "Your message is safe :)", "error");
	  }
	});
  },
  'click #add': function(e) {
    e.preventDefault();
    
	Session.set('selectedMessageId', null);
	
    $('#messagesModal').modal('show');
	$('.tile_count').css("opacity","0.5");
	$('#add').css("opacity","0.5");
	$('.top_nav').css("opacity","0.5");
	//$("#messagesModal").css("z-index", "1500");
  },
  'click #edit': function(e) {
    e.preventDefault();
	
	message = $(e.target).closest('.message')
    messageId = message.attr('data-id')
    Session.set('selectedMessageId', messageId);
    
    $('#messagesModal').modal('show');
	$('.tile_count').css("opacity","0.5");
	$('#add').css("opacity","0.5");
	$('.top_nav').css("opacity","0.5");
  },
  'click .strategy': function (e) {
  	e.preventDefault();
  	var name = e.currentTarget;
  	console.log(name.getAttribute("id"));
  	addMessagesFilter("persuasive_strategy", name.getAttribute("id"));
    //console.log(name.getAttribute("id"));  	
   },
  'click .target': function (e) {
  	e.preventDefault();
  	var name = e.currentTarget;
  	console.log(name.getAttribute("id"));
  	addMessagesFilter("target", name.getAttribute("id"));
    //console.log(name.getAttribute("id"));  	
   },
  'click .context': function (e) {
  	e.preventDefault();
  	var name = e.currentTarget;
  	console.log(name.getAttribute("id"));
  	addMessagesFilter("context", name.getAttribute("id"));
    //console.log(name.getAttribute("id"));  	
   },
  'click .parameters': function (e) {
  	e.preventDefault();
  	var name = e.currentTarget;
  	console.log(name.getAttribute("id"));
  	addMessagesFilter("parameters", name.getAttribute("id"));
    //console.log(name.getAttribute("id"));  	
   },
  'click .clear-filters': function (e) {
  	e.preventDefault();
  	Session.set("messagesFilter", null);
  	Session.set("filterAttributes", null)
   },
  'click .remove-filter-attribute': function (e) {
  	e.preventDefault();
  	var name = e.currentTarget;
  	console.log(name.getAttribute("id"));
  	removeMessagesFilter(name.getAttribute("id"));
   },
  'keyup #search_by_message_text': function (e) {
  	e.preventDefault();
  	var name = e.target.value;  	
  	console.log(name);  	
  	textSearch(name);
   },
   'click #reportrange': function (e) {
	   $('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
       $('#reportrange').daterangepicker(optionSet1, cb);
   },
});

Template.pmessagesModalTemplate.helpers({
  'message': function() {
    var messageId = Session.get('selectedMessageId');
	console.log(messageId)
    
    if (typeof messageId !== "undefined" &&  messageId !== null) {
		
	  var message = OptimumMessages.find({'id':messageId},{fields:{'message_text':1,'message_text_german':1,'message_text_slo':1,'target':1, 'context':1,'parameters':1,'persuasive_strategy':1}}).fetch();
	  
	  console.log(message.message_text)
	  console.log("fdcg")
	  $('#strategy').val(message[0].persuasive_strategy);
	  $('#target').val(message[0].target);
	  $('#context').val(message[0].context);
	  $('#parameters').val(message[0].parameters);
	  
	  return {persuasive_strategy: message[0].persuasive_strategy,
	  target: message[0].target,
	  parameters: message[0].parameters,
	  message_text: message[0].message_text,
	  message_text_german: message[0].message_text_german,
	  message_text_slo: message[0].message_text_slo,
	  context: message[0].context,
	  }
    } else {
      return {persuasive_strategy: '',
	  target: '',
	  parameters: '',
	  message_text: '',
	  message_text_german: '',
	  message_text_slo: '',
	  context: ''}
    }
  }
});

Template.pmessagesModalTemplate.events({
  'click #save': function(e) {
    e.preventDefault();
	
	var messageId = Session.get('selectedMessageId');
    
    var message = {
      persuasive_strategy: $('#strategy').val(),
	  target: $('#target').val(),
	  parameters: $('#parameters').val(),
	  message_text: $('#message_text').val(),
	  message_text_german: $('#message_text_german').val(),
	  message_text_slo: $('#message_text_slo').val(),
	  context: $('#context').val(),
	  number_of_times_sent: 0,
	  number_of_successes: 0,
    }
	
	if (!messageId) {
      Meteor.call('addMessage', message, function(error, result) {
        if (error) {
          alert(error);
        }
      });
	  
	  swal("Created!", "Your message has been created.",'success')
	  
    } else {
      _.extend(message, {id: messageId});
      Meteor.call('editMessage', message, function(error, result) {
        if (error) {
          alert(error);
        }
      });
    }

    $('#messagesModal').modal('hide');
	$('.tile_count').css("opacity","1");
	$('#add').css("opacity","1");
	$('.top_nav').css("opacity","1");
  },
  'click #cancel': function(e) {
	  
    e.preventDefault();
	
    $('#messagesModal').modal('hide');
	$('.tile_count').css("opacity","1");
	$('#add').css("opacity","1");
	$('.top_nav').css("opacity","1");
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

            "scales":{
              "yAxes":[{"ticks":{"beginAtZero":true}}]
            },

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
                backgroundColor:["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)"],
                borderColor:["rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)"],
                borderWidth:1,
                data: points
            },
			{
                label: "Not Success",
                backgroundColor:["rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)"],
                borderColor:["rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)"],
                borderWidth:1,
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
                backgroundColor:["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)", "rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)"],
                borderColor:["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)", "rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)"],
                borderWidth:1,
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
                backgroundColor:["rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)"],
                borderColor:["rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)"],
                borderWidth:1,
                data: points3
            }]
        };
		
	//Graph 4
	var labels4 = ['Successful', 'Not Successful'];
    var points4 = [helpfulMessages.length, nothelpfulMessages.length];
	
	var data4 = {
            labels: labels4,
            datasets: [{
                label: "Data",
                "backgroundColor":["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)"],
                "borderColor":["rgb(255, 99, 132)","rgb(255, 159, 64)"],
                data: points4
            }]
        };
		
	// draw the charts
  myLineChart = new Chart(ctx, {
                    type: "bar",
                    data: data4,
                    options: chartOptions
                });
  myBarChart2 = new Chart(ctx2, {
                    type: "bar",
                    data: data,
                    options: chartOptions
                });
  myBarChart3 = new Chart(ctx3, {
                    type: "bar",
                    data: data2,
                    options: chartOptions
                });
  myBarChart4 = new Chart(ctx4, {
                    type: "bar",
                    data: data3,
                    options: chartOptions
                });
  
	
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
                backgroundColor:["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)"],
                borderColor:["rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)"],
                borderWidth:1,
                data: points
            },
			{
                label: "Failure",
                backgroundColor:["rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)"],
                borderColor:["rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)"],
                borderWidth:1,
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
                backgroundColor:["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)", "rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)"],
                borderColor:["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)", "rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)"],
                borderWidth:1,
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
                backgroundColor:["rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)"],
                borderColor:["rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)"],
                borderWidth:1,
                data: points3
            }]
        };
		
	//Graph 4
	var successfull = comparison+suggestion+selfmonitoring;
	var unsuccessfull= successfull+comparisonf+suggestionf+selfmonitoringf;
	var labels4 = ['Successful', 'Not Successful'];
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
  myLineChart = new Chart(ctx, {
                    type: "bar",
                    data: data4,
                    options: chartOptions
                });
  myBarChart2 = new Chart(ctx2, {
                    type: "bar",
                    data: data,
                    options: chartOptions
                });
  myBarChart3 = new Chart(ctx3, {
                    type: "bar",
                    data: data2,
                    options: chartOptions
                });
  myBarChart4 = new Chart(ctx4, {
                    type: "bar",
                    data: data3,
                    options: chartOptions
                });
	
};
