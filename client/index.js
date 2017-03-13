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
            updateRequestsChart();
        },
    });

    Meteor.call("userRouteLogCount", function(err, res) {
        Session.set("userRouteLogCount", res);
    });

    Meteor.call("userRouteCount", function(err, res) {
        Session.set("userRouteCount", res);
    });

    Meteor.call("userRatingsCount", function(err, res) {
        Session.set("userRatingsCount", res);
    });

    Meteor.call("helpfulMessages", function(err, res) {
        Session.set("helpfulMessages", res);
    });

    Meteor.call("notHelpfulMessages", function(err, res) {
        Session.set("notHelpfulMessages", res);
    });

    Meteor.call("preferredModeCar", function(err, res) {
        Session.set("preferredModeCar", res);
    });

    Meteor.call("preferredModePT", function(err, res) {
        Session.set("preferredModePT", res);
    });

    Meteor.call("preferredModeBICYCLE", function(err, res) {
        Session.set("preferredModeBICYCLE", res);
    });   

    Meteor.call("preferredModeWALK", function(err, res) {
        Session.set("preferredModeWALK", res);
    });     

    Meteor.call("femaleUsers", function(err, res) {
        Session.set("femaleUsers", res);
    }); 
    
    Meteor.call("maleUsers", function(err, res) {
        Session.set("maleUsers", res);
    });

    Meteor.call("languageENusers", function(err, res) {
        Session.set("languageENusers", res);
    });

    Meteor.call("languageDEusers", function(err, res) {
        Session.set("languageDEusers", res);
    });

    Meteor.call("languageSLusers", function(err, res) {
        Session.set("languageSLusers", res);
    });

    Meteor.call("personalityExtraversion", function(err, res) {
        Session.set("personalityExtraversion", res);
    });

    Meteor.call("personalityConscientiousness", function(err, res) {
        Session.set("personalityConscientiousness", res);
    });

    Meteor.call("personalityNeuroticism", function(err, res) {
        Session.set("personalityNeuroticism", res);
    });

    Meteor.call("personalityOpenness", function(err, res) {
        Session.set("personalityOpenness", res);
    });

    Meteor.call("personalityAgreeableness", function(err, res) {
        Session.set("personalityAgreeableness", res);
    });

    Meteor.call("ownsCar", function(err, res) {
        Session.set("ownsCar", res);
    });

    Meteor.call("ownsBicycle", function(err, res) {
        Session.set("ownsBicycle", res);
    });

    Meteor.call("ownsMotorcycle", function(err, res) {
        Session.set("ownsMotorcycle", res);
    });

    Meteor.call("numberOfMessages", function(err, res) {
        Session.set("numberOfMessages", res);
    });

    Meteor.call("numberOfEventNotifications", function(err, res) {
        Session.set("numberOfEventNotifications", res);        
    });

    Meteor.call("numberOfNotifiedUsers", function(err, res) {
        Session.set("numberOfNotifiedUsers", res);        
    });    

});

Template.topTiles.helpers({
	userCount() {
		let u = OptimumUsers.find().fetch();		
		return OptimumUsers.find().count();
	},
	getUserRouteLogCount() {
		return Session.get("userRouteLogCount");
	},
    getUserRouteCount() {
        return Session.get("userRouteCount");
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

function updateRequestsChart() {
        // Get the context of the canvas element we want to select
        var ctx  = document.getElementById("myChart").getContext("2d");    

        // Set the options
        var options = {

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

        var options2 = {
            //Boolean - Whether to show lines for each scale point
            scaleShowLine: true,

            //Boolean - Whether we show the angle lines out of the radar
            angleShowLineOut: true,

            //Boolean - Whether to show labels on the scale
            scaleShowLabels: false,

            // Boolean - Whether the scale should begin at zero
            scaleBeginAtZero: true,

            //String - Colour of the angle line
            angleLineColor: "rgba(0,0,0,.1)",

            //Number - Pixel width of the angle line
            angleLineWidth: 1,

            //String - Point label font declaration
            pointLabelFontFamily: "'Arial'",

            //String - Point label font weight
            pointLabelFontStyle: "normal",

            //Number - Point label font size in pixels
            pointLabelFontSize: 10,

            //String - Point label font colour
            pointLabelFontColor: "#666",

            //Boolean - Whether to show a dot for each point
            pointDot: true,

            //Number - Radius of each point dot in pixels
            pointDotRadius: 3,

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

        }

        var dataset = UserRouteLogGraph.find().fetch();
        
        var labels = [];
        var points = [];

        _.forEach(dataset, function(point){
            labels.push(point.date);
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
    var myLineChart = new Chart(ctx).Line(data, options);
};

function random() {
    return Math.floor((Math.random() * 100) + 1);
};