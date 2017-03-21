import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './index.html';

import { OptimumUsers } from '../imports/api/exports/exports.js';
import { UserRouteLogGraph } from '../imports/api/exports/exports.js';

// Template.dashboard.onCreated(function indexOnCreated() {
// 	// self.subscribe('analysisById',id,{
//  //        onStop: function(e) {
//  //            if (e) {
//  //                console.log("Analysis subscription error " + e);
//  //                InfoMessages.insert({
// 	// 				type: "error",
// 	// 				message: "Could not fetch analysis."
// 	// 			});
//  //            }
//  //        }
//  //    });
// });
 
Session.setDefault("userCount", null);
Session.setDefault("userRouteLogCount", null);
Session.setDefault("userRouteCount", null);
Session.setDefault("userRatingsCount", null);
Session.setDefault("helpfulMessages", null);
Session.setDefault("notHelpfulMessages", null);
Session.setDefault("preferredModeCar", null);
Session.setDefault("preferredModePT", null);
Session.setDefault("preferredModeBICYCLE", null);
Session.setDefault("preferredModeWALK", null);
Session.setDefault("femaleUsers", null);
Session.setDefault("maleUsers", null);
Session.setDefault("languageENusers", null);
Session.setDefault("languageDEusers", null);
Session.setDefault("languageSLusers", null);
Session.setDefault("personalityExtraversion", null);
Session.setDefault("personalityConscientiousness", null);
Session.setDefault("personalityNeuroticism", null);
Session.setDefault("personalityOpenness", null);
Session.setDefault("personalityAgreeableness", null);
Session.setDefault("ownsCar", null);
Session.setDefault("ownsBicycle", null);
Session.setDefault("ownsMotorcycle", null);
Session.setDefault("numberOfMessages", null);
Session.setDefault("numberOfEventNotifications", null);
Session.setDefault("numberOfNotifiedUsers", null);

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
  updateData(start.toISOString(), end.toISOString());
  $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
};

var updateData = function(start, end){
    Meteor.call("userCount", start, end, function(err, res) {
        Session.set("userCount", res);
    });
    Meteor.call("userRouteLogCount", start, end, function(err, res) {
        Session.set("userRouteLogCount", res);
    });
    Meteor.call("userRouteSavedRoutesCount", start, end, function(err, res) {
        Session.set("userRouteSavedRoutesCount", res);
    });
    Meteor.call("userRatingsCount", function(err, res) {
        Session.set("userRatingsCount", res);
    });
    Meteor.call("preferredMode", start, end, "1", function(err, res) {
        Session.set("preferredModeCar", res);
    });
    Meteor.call("preferredMode", start, end, "2", function(err, res) {
        Session.set("preferredModePT", res);
    });
    Meteor.call("preferredMode", start, end, "3", function(err, res) {
        Session.set("preferredModeBICYCLE", res);
    });   
    Meteor.call("preferredMode", start, end, "4", function(err, res) {
        Session.set("preferredModeWALK", res);
    });
    Meteor.call("helpfulMessages", start, end, function(err, res) {
        Session.set("helpfulMessages", res);
    });
    Meteor.call("notHelpfulMessages", start, end, function(err, res) {
        Session.set("notHelpfulMessages", res);
    });
    Meteor.call("femaleUsers", start, end, function(err, res) {
        Session.set("femaleUsers", res);
    }); 
    Meteor.call("maleUsers", start, end, function(err, res) {
        Session.set("maleUsers", res);
    });
    Meteor.call("languageUsers", start, end, "en", function(err, res) {
        Session.set("languageENusers", res);
    });
    Meteor.call("languageUsers", start, end, "de", function(err, res) {
        Session.set("languageDEusers", res);
    });
    Meteor.call("languageUsers", start, end, "sl", function(err, res) {
        Session.set("languageSLusers", res);
    });
    Meteor.call("personalityType", start, end, "Extraversion", function(err, res) {
        Session.set("personalityExtraversion", res);
    });
    Meteor.call("personalityType", start, end, "Agreeableness", function(err, res) {
        Session.set("personalityConscientiousness", res);
    });
    Meteor.call("personalityType", start, end, "Conscientiousness", function(err, res) {
        Session.set("personalityNeuroticism", res);
    });
    Meteor.call("personalityType", start, end, "Neuroticism", function(err, res) {
        Session.set("personalityOpenness", res);
    });
    Meteor.call("personalityType", start, end, "Openness", function(err, res) {
        Session.set("personalityAgreeableness", res);
    });
    Meteor.call("vehicleOwners", start, end, "car", function(err, res) {
        Session.set("ownsCar", res);
    });
    Meteor.call("vehicleOwners", start, end, "bicycle", function(err, res) {
        Session.set("ownsBicycle", res);
    });
    Meteor.call("vehicleOwners", start, end, "motorcycle", function(err, res) {
        Session.set("ownsMotorcycle", res);
    });
    Meteor.call("numberOfMessages", function(err, res) {
        Session.set("numberOfMessages", res);
    });
    Meteor.call("numberOfEventNotifications", start, end, function(err, res) {
        Session.set("numberOfEventNotifications", res);        
    });
    Meteor.call("numberOfNotifiedUsers", start, end, function(err, res) {
        Session.set("numberOfNotifiedUsers", res);        
    });    

    updateRequestsChart(start, end);
   
}


Template.topTiles.onCreated(function() {

	let self = this;
    
    self.subscribe('OptimumUsers',{
        onStop: function(e) {
            if (e) {
                console.log("OptimumUsers subscription error " + e);                
            }
        }
    });

    self.subscribe('UserRouteLogGraph',{
        onStop: function(e) {
            if (e) {
                console.log("UserRouteLogGraph subscription error " + e);                
            }
        },
        onReady: function(e) {
            createRequestsChart();
            $('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
            $('#reportrange').daterangepicker(optionSet1, cb);
            updateData(null, null);
        },
    });
    
});

Template.topTiles.helpers({
	getUserCount() {
		return Session.get("userCount");        
	},
	getUserRouteLogCount() {
		return Session.get("userRouteLogCount");
	},
    getUserRouteSavedRoutesCount() {
        return Session.get("userRouteSavedRoutesCount");
    },
    getUserRatingsCount() {
        return Session.get("userRatingsCount");
    },
    getHelpfulMessages() {
        return Session.get("helpfulMessages");
    },
    getNotHelpfulMessages() {
        return Session.get("notHelpfulMessages");
    },
    getTotalMessages() {
        return Session.get("notHelpfulMessages") + Session.get("helpfulMessages");
    },
    getPreferredModeCar() {
        return Session.get("preferredModeCar");
    },
    getPreferredModePT() {
        return Session.get("preferredModePT");
    },
    getPreferredModeBICYCLE() {
        return Session.get("preferredModeBICYCLE");
    },
    getPreferredModeWALK() {
        return Session.get("preferredModeWALK");
    },
    getMaleUsers() {
        return Session.get("maleUsers");
    },
    getFemaleUsers() {
        return Session.get("femaleUsers");
    },
    getLanguageENusers() {
        return Session.get("languageENusers");
    },
    getLanguageDEusers() {
        return Session.get("languageDEusers");
    },
    getLanguageSLusers() {
        return Session.get("languageSLusers");
    },
    getPersonalityExtraversion() {
        return Session.get("personalityExtraversion");
    },
    getPersonalityConscientiousness() {
        return Session.get("personalityConscientiousness");
    },
    getPersonalityNeuroticism() {
        return Session.get("personalityNeuroticism");
    },
    getPersonalityOpenness() {
        return Session.get("personalityOpenness");
    },
    getPersonalityAgreeableness() {
        return Session.get("personalityAgreeableness");
    },
    getOwnsCar() {
        return Session.get("ownsCar");
    },
    getOwnsBicycle() {
        return Session.get("ownsBicycle");
    },
    getOwnsMotorcycle() {
        return Session.get("ownsMotorcycle");
    },
    getNumberOfMessages() {
        return Session.get("numberOfMessages");
    },
    getNumberOfEventNotifications() {
        return Session.get("numberOfEventNotifications");
    },
    getNumberOfNotifiedUsers() {
        return Session.get("numberOfNotifiedUsers");
    }

});

var myLineChart = null;
var chartOptions = null;


function createRequestsChart() {
    console.log("createRequestsChart");
        // Get the context of the canvas element we want to select
        var ctx  = document.getElementById("myChart").getContext("2d");    

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

        var dataset = null;
        var start = Session.get("start");
        var end = Session.get("end");
        if (start != null && end !=null){
            dataset = UserRouteLogGraph.find({'createdDate' : { $gte : new Date(start), $lt: new Date(end) }}).fetch();
        }
        else if (start != null){
            dataset = UserRouteLogGraph.find({'createdDate' : { $lt: new Date(end) }}).fetch();
        }
        else if (end !=null){
            dataset = UserRouteLogGraph.find({'createdDate' : { $gte : new Date(start)}}).fetch();
        }
        else{
            dataset = UserRouteLogGraph.find().fetch();
        }
        
        
        var labels = [];
        var points = [];

        _.forEach(dataset, function(point){
            labels.push(point.date.getDate() + "-" + (point.date.getMonth()+1) + "-" + point.date.getFullYear());
            points.push(point.count);
        });
        
        // Set the data
        var data = {
            labels: labels,
            datasets: [{
                label: "My First dataset",
                 fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: points
            }]
        };
    // draw the charts
    myLineChart = new Chart(ctx).Line(data, chartOptions);
};

function updateRequestsChart(start, end){
    console.log("updateRequestsChart");
    var dataset = null;
    if (start != null && end !=null){
        dataset = UserRouteLogGraph.find({'date' : { $gte : new Date(start), $lt: new Date(end) }}).fetch();
    }
    else if (start != null){
        dataset = UserRouteLogGraph.find({'date' : { $lt: new Date(end) }}).fetch();
    }
    else if (end !=null){
        dataset = UserRouteLogGraph.find({'date' : { $gte : new Date(start)}}).fetch();
    }
    else{
        dataset = UserRouteLogGraph.find().fetch();
    }
    
    var labels = [];
    var points = [];
    console.log(dataset);
    _.forEach(dataset, function(point){
        console.log(new Date(point.date));
        console.log(point.date);
        labels.push(point.date.getDate() + "-" + (point.date.getMonth()+1) + "-" + point.date.getFullYear());
        points.push(point.count);
    });
    
    // Set the data
    var data = {
        labels: labels,
        datasets: [{
            label: "My First dataset",
             fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: points
        }]
    };    
    var myChartContent = document.getElementById('myChartContent');
    myChartContent.innerHTML = '&nbsp;';
    $('#myChartContent').append('<canvas id="myChart" width="800" height="300"><canvas>');

    var ctx = $("#myChart").get(0).getContext("2d");        
    myLineChart = new Chart(ctx).Line(data, chartOptions);    
    
}

function random() {
    return Math.floor((Math.random() * 100) + 1);    
};