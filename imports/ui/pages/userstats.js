import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';
import Chart from 'chart.js';
import { HTTP } from 'meteor/http';

import './userstats.html';

usersWhoGotMessages = [
	"GWqXKjq4tlc20oT0L0ZZ4wGMpw316Isi",
	"hqtpnR0Zbp5AD7Ue4HRYCrcbu9HWWOBy",
	"Ja54jPP8YSK7LhEsgk9R37mOJ4FTE9uY",
	"jH15haONfzBYCuE6x5hkvTSsL56DG8CL",
	"6FqCLA4P5X5Vigny9Pq7aTc5o4EJD6zp",
	"CF3gNNDW1r0IHOSAWLG32ldZ2CfZmqtS",
	"h6SMk9eJOrSaBhBil11th5ORWPireXRk",
	"tboiRUXw8EfePyLugZnGAJ2fZPQyoAHV",
	"x5jizjmyI9pMn67j7U1drCZzIhN4hSlz",
	"QSY8kBUst9dgiyCkuzADyZ9QTlzEH4l7",
	"hY94Mb1OZi9YfR9QIcBLy5KUIamavAEf",
	"kxGk08xaefaTWcQFUJUQtJQmB4m4N3lB",
	"owFog42MMsfjgtnc4fF2kKoONl7Y37gL",
	"gaJYT6xqO6Ur1FECJG1Jx4MN08RRZb2S",
	"Z5k9EDo9CRIAz7vSDxc6z4QLpf4dVS3T",
	"jx1i89sLrSwfWXW82NHabwvDj3rgH0Vp",
	"5k5hBFkVNUbrWnFRU9WPTDyYAC2E01QT",
	"v49lJlTd7VHYOXzfqaDDMGpohzOkgDJE",
	"FltihLkKcXeVctbEk5EPEeB6PTCWFOa5",
	"1ADieeZKfhhYxgf3YGzxu2WatkmKeF48"
]

let activities_to_consider = ["IN_CAR",
			"IN_BUS",
			"ON_BICYCLE",
			"ON_FOOT",
			"ON_TRAIN"];

let green_activities = ["IN_BUS",
			"ON_BICYCLE",
			"ON_FOOT"];

let activitiesUrl = "http://traffic.ijs.si/NextPin/getActivities";

Session.setDefault("activitiesByWeek", {});
Session.setDefault("allActivitiesByWeek", {});

Template.comparisonChart.onRendered(function() {
	let self = this;	
    createComparisonChart();
});

Template.selfMonitoringChart.onRendered(function() {
	let self = this;	
    createSelfMonitoringChart();
});

Template.simulationChart.onRendered(function() {
	let self = this;	
    createSimulationChart();
});

Template.activityStats.onCreated(function() {
	Session.set("getActivitiesCount", 0);
	Session.set("averageNumberOfActivitiesPerUser", 0);
	Session.set("maxNumberOfActivities", 0);
	Session.set("minNumberOfActivities", 10000);
	var allActivitiesByWeek = {};
	for (user in usersWhoGotMessages){
		console.log(usersWhoGotMessages[user]);
		try {
	      const result = HTTP.call('GET', activitiesUrl, {
	        	params: { user: usersWhoGotMessages[user] }
	      	}, function( error, response ) {
			  	//console.log("result");
	      	  	//console.log(response["data"]["data"].length);
	      	  	numberOrActivities = response["data"]["data"].length;
	      	  	numberOrActivities = Session.get("getActivitiesCount");
	      	  	numberOrActivities = numberOrActivities + response["data"]["data"].length;
	      	  	Session.set("getActivitiesCount", numberOrActivities);
	      	  	Session.set("averageNumberOfActivitiesPerUser", numberOrActivities/usersWhoGotMessages.length);	      	  	
	      	  	$.each(response["data"]["data"], function( key, value ) {
				  allActivitiesByWeek = groupweek(value, allActivitiesByWeek);
				});
				Session.set("activitiesByWeek", allActivitiesByWeek);
				Session.set("allActivitiesByWeek", allActivitiesByWeek);				

	      	  	if (Session.get("maxNumberOfActivities") < response["data"]["data"].length){
	      	  		Session.set("maxNumberOfActivities", response["data"]["data"].length);
	      	  	};
	      	  	if (Session.get("minNumberOfActivities") > response["data"]["data"].length){
	      	  		Session.set("minNumberOfActivities", response["data"]["data"].length);
	      	  	};
	      	  	createActivitiesChart();
		  });      
	    } catch (e) {
	      // Got a network error, timeout, or HTTP error in the 400 or 500 range.
	      console.log(e);
	      console.log("we got an error");
	    }   
	}	
});

Template.activities_charts.onRendered(function() {
	createActivitiesChart();
});

Template.activityStats.helpers({
	getActivitiesCount() {
		return Session.get("getActivitiesCount");        
	},
	getAverageNumberOfActivitiesPerUser() {
		return Session.get("averageNumberOfActivitiesPerUser");        
	},
	getMaxNumberOfActivitiesPerUser() {
		return Session.get("maxNumberOfActivities");        
	},
	getMinNumberOfActivitiesPerUser() { 
		return Session.get("minNumberOfActivities");        
	},
	getUsers(){
		return usersWhoGotMessages;
	}
});

Template.activityStats.events({
	'click .user': function (e) {
		e.preventDefault();
		var name = e.currentTarget;
		console.log(name.getAttribute("id"));
		$('.selected_user').html(name.getAttribute("id"));
		updateStats(name.getAttribute("id"));		
	}
});

function updateStats(userId){
	try {
      const result = HTTP.call('GET', activitiesUrl, {
        	params: { user: userId }
      	}, function( error, response ) {
		  	//console.log("result");
      	  	//console.log(response["data"]["data"].length);
      	  	numberOrActivities = response["data"]["data"].length;
      	  	var activitiesByWeek = {};
      	  	$.each(response["data"]["data"], function( key, value ) {
			  activitiesByWeek = groupweek(value, activitiesByWeek);
			});			
			Session.set("activitiesByWeek", activitiesByWeek);
      	  	Session.set("getActivitiesCount", numberOrActivities);
      	  	Session.set("averageNumberOfActivitiesPerUser", numberOrActivities);
      	  	if (Session.get("maxNumberOfActivities") < response["data"]["data"].length){
      	  		Session.set("maxNumberOfActivities", response["data"]["data"].length);
      	  	};
      	  	if (Session.get("minNumberOfActivities") > response["data"]["data"].length){
      	  		Session.set("minNumberOfActivities", response["data"]["data"].length);
      	  	};
      	  	createActivitiesChart();

	  });      
    } catch (e) {
      // Got a network error, timeout, or HTTP error in the 400 or 500 range.
      console.log(e);
      console.log("we got an error");
    }   
};

function createComparisonChart(userActivities, allUsersActivities) {
    console.log("createComparisonChart");  

    var comparisonChartContent = document.getElementById('comparisonChartContent');
    comparisonChartContent.innerHTML = '&nbsp;';
    $('#comparisonChartContent').append('<canvas id="comparisonChartCanvas" width="600" height="200"><canvas>');

    var ctx = $('#comparisonChartCanvas');
	ctx.attr('height',200);

	
	if (userActivities && allUsersActivities){
		console.log("userActivities && allUsersActivities");  		
		var userGreenActivities = 0;
		var userAllActivities = 0;
		for (week in userActivities){
			for (activity in userActivities[week]){
				try{					
					var maxKey = _.max(Object.keys(userActivities[week][activity]["sensor_activity_all"]), function (o) { return userActivities[week][activity]["sensor_activity_all"][o]; });
					if (green_activities.indexOf(maxKey)>=0){
						userGreenActivities = userGreenActivities + 1;
					}
					userAllActivities = userAllActivities + 1;
				}
				catch(e){
					console.log(e);
				}
			}
		}

		var allUsersGreenActivities = 0;
		var allUsersAllActivities = 0;
		for (week in allUsersActivities){
			for (activity in allUsersActivities[week]){
				try{
					var maxKey = _.max(Object.keys(allUsersActivities[week][activity]["sensor_activity_all"]), function (o) { return allUsersActivities[week][activity]["sensor_activity_all"][o]; });
					if (green_activities.indexOf(maxKey)>=0){
						allUsersGreenActivities = allUsersGreenActivities + 1;
					}
					allUsersAllActivities = allUsersAllActivities + 1;
				}
				catch(e){
					console.log(e);
				}				
			}
		}
		console.log("allUsersGreenActivities");
		console.log(allUsersGreenActivities);

		console.log("userGreenActivities");
		console.log(userGreenActivities);


		var myChart = new Chart(ctx, {
	    type: 'horizontalBar',
	    data: {
	        labels: ["You", "Optimum Users"],
	        datasets: [{
	            label: 'Use of green transportation \n compared to other Optimum users',
	            data: [userGreenActivities/userAllActivities, allUsersGreenActivities/allUsersAllActivities],
	            backgroundColor: [
	                'rgba(255, 99, 132, 0.2)',
	                'rgba(54, 162, 235, 0.2)',	                
	            ],
	            borderColor: [
	                'rgba(255,99,132,1)',
	                'rgba(54, 162, 235, 1)',	                
	            ],
	            borderWidth: 1
	        }]
	    },	   
	    options: {
	    	maintainAspectRatio: false,
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }]
	        },
	        responsive: false
	    }
	  });    
	}
	else{
		var myChart = new Chart(ctx, {
	    type: 'horizontalBar',
	    data: {
	        labels: [["You", ""], ["Similar", "Users"]],
	        datasets: [{
	            label: 'Use of green transportation modes',
	            data: [12, 19],
	            backgroundColor: [
	                'rgba(255, 99, 132, 0.2)',
	                'rgba(54, 162, 235, 0.2)',	                
	            ],
	            borderColor: [
	                'rgba(255,99,132,1)',
	                'rgba(54, 162, 235, 1)',	                
	            ],
	            borderWidth: 1
	        }]
	    },	   
	    options: {
	    	maintainAspectRatio: false,
	        scales: {
	        	xAxes: [{
                    stacked: true,
                    beginAtZero:true
                }],
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }]
	        },
	        responsive: false
	    }
	  });    
	}
};

function randomScalingFactor() {
	return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
};

function createSelfMonitoringChart(thisWeekActivities, lastWeekActivities) {

    console.log("selfMonitoringChartCanvas"); 
    
    var chartColors = {
		IN_CAR: 'rgb(255, 99, 132)',
		IN_BUS: 'rgb(255, 159, 64)',
		ON_BICYCLE: 'rgb(255, 205, 86)',
		ON_FOOT: 'rgb(75, 192, 192)',
		ON_TRAIN: 'rgb(54, 162, 235)',
		STILL: 'rgb(153, 102, 255)',
		TILTING: 'rgb(201, 203, 207)',
		UNKNOWN: 'rgb(201, 103, 207)'
	};


	if (thisWeekActivities && lastWeekActivities){
		var totalActivitiesThisWeek = 0;
		var totalActivitiesLastWeek = 0;

		for (activity in thisWeekActivities){
			totalActivitiesThisWeek = totalActivitiesThisWeek + thisWeekActivities[activity];
		}

		for (activity in lastWeekActivities){
			totalActivitiesLastWeek = totalActivitiesLastWeek + lastWeekActivities[activity];
		}

		console.log("totalActivitiesThisWeek");
		console.log(totalActivitiesThisWeek);

		console.log("ON_FOOT");
		console.log(thisWeekActivities);
		console.log(thisWeekActivities["ON_FOOT"]/totalActivitiesThisWeek);

		var barChartData = {
            labels: ["This week", "Last week"],
            datasets: [{
                label: 'ON_FOOT',
                backgroundColor: 'rgb(255, 159, 64)',
                data: [
                    ('ON_FOOT' in thisWeekActivities ? thisWeekActivities["ON_FOOT"]/totalActivitiesThisWeek : 0 ),
                    ('ON_FOOT' in lastWeekActivities ? lastWeekActivities["ON_FOOT"]/totalActivitiesLastWeek : 0 )
                ]
            }, {
                label: 'ON_BICYCLE',
                backgroundColor: 'rgb(75, 192, 192)',
                data: [
                    ('ON_BICYCLE' in thisWeekActivities ? thisWeekActivities["ON_BICYCLE"]/totalActivitiesThisWeek : 0 ),
                    ('ON_BICYCLE' in lastWeekActivities ? lastWeekActivities["ON_BICYCLE"]/totalActivitiesLastWeek : 0 )
                ]                
            }, {
                label: 'IN_BUS',
                backgroundColor: 'rgb(54, 162, 235)',
                data: [
                    ('IN_BUS' in thisWeekActivities ? thisWeekActivities["IN_BUS"]/totalActivitiesThisWeek : 0 ),
                    ('IN_BUS' in lastWeekActivities ? lastWeekActivities["IN_BUS"]/totalActivitiesLastWeek : 0 ) 
                ]
            }, {
                label: 'ON_TRAIN',
                backgroundColor: 'rgb(255, 99, 132)',
                data: [
                    ('ON_TRAIN' in thisWeekActivities ? thisWeekActivities["ON_TRAIN"]/totalActivitiesThisWeek : 0 ),
                    ('ON_TRAIN' in lastWeekActivities ? lastWeekActivities["ON_TRAIN"]/totalActivitiesLastWeek : 0 ) 
                ]
            }, {
                label: 'IN_CAR',
                backgroundColor: 'rgb(255, 199, 132)',
                data: [
                    ('IN_CAR' in thisWeekActivities ? thisWeekActivities["IN_CAR"]/totalActivitiesThisWeek : 0 ),
                    ('IN_CAR' in lastWeekActivities ? lastWeekActivities["IN_CAR"]/totalActivitiesLastWeek : 0 ) 
                ]
            }]

        };
	}
	else{
    	var barChartData = {
            labels: ["This week", "Last week"],
            datasets: [{
                label: 'Walk',
                backgroundColor: 'rgb(255, 159, 64)',
                data: [
                    20,
                    15
                ]
            }, {
                label: 'Bicycle',
                backgroundColor: 'rgb(75, 192, 192)',
                data: [
                    40,
                    25
                ]
            }, {
                label: 'Public transport',
                backgroundColor: 'rgb(54, 162, 235)',
                data: [
                    30,
                    40 
                ]
            }, {
                label: 'Car',
                backgroundColor: 'rgb(255, 99, 132)',
                data: [
                    10,
                    20
                ]
            }]

        };
    }

    var mySelfMonitoringChartContent = document.getElementById('mySelfMonitoringChartContent');
    mySelfMonitoringChartContent.innerHTML = '&nbsp;';
    $('#mySelfMonitoringChartContent').append('<canvas id="selfMonitoringChartCanvas" width="600" height="200"><canvas>');

    var ctx = $('#selfMonitoringChartCanvas');
	ctx.attr('height',200);

    var myChart = new Chart(ctx, {
	    type: 'horizontalBar',
	    data: barChartData,
	    options: {
	    	maintainAspectRatio: false,	        
	        scales: {
                xAxes: [{
                    stacked: true,
                }],
                yAxes: [{
                    stacked: true
                }]
            },
            responsive: false
	    }
	  });
};

function createSimulationChart() {
    console.log("simulationChartCanvas");    
    var ctx = $('#simulationChartCanvas');
	ctx.attr('height',200);

    var myChart = new Chart(ctx, {
	    type: 'horizontalBar',
	    data: {
	        labels: ["Keep the same habits", "Change your habits"],
	        datasets: [{
	            label: 'What will happen if you use 5 times public transportation this week?',
	            data: [12, 19, 3, 5, 2, 3],
	            backgroundColor: [
	                'rgba(255, 99, 132, 0.2)',
	                'rgba(54, 162, 235, 0.2)',
	                // 'rgba(255, 206, 86, 0.2)',
	                // 'rgba(75, 192, 192, 0.2)',
	                // 'rgba(153, 102, 255, 0.2)',
	                // 'rgba(255, 159, 64, 0.2)'
	            ],
	            borderColor: [
	                'rgba(255,99,132,1)',
	                'rgba(54, 162, 235, 1)',
	                // 'rgba(255, 206, 86, 1)',
	                // 'rgba(75, 192, 192, 1)',
	                // 'rgba(153, 102, 255, 1)',
	                // 'rgba(255, 159, 64, 1)'
	            ],
	            borderWidth: 1
	        }]
	    },	   
	    options: {
	    	maintainAspectRatio: false,
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }]
	        }
	    }
	  });
}; 

function createActivitiesChart() {
    console.log("createActivitiesChart");    
    dataForActivitiesChart = Session.get("activitiesByWeek");
    console.log(dataForActivitiesChart);
    labels = [];
    values = [];
    for (var key in dataForActivitiesChart) {    	
    	labels.push(key);
    	values.push(dataForActivitiesChart[key].length);
    };
        var chartOptions = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Activities per Week",
                    backgroundColor: "rgba(151,187,205,0.2)",
                    borderColor: "rgba(151,187,205,0.2)",
                    data: values,
                    fill: false,
                }]
            },
            options: {
                responsive: true,                
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Month'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        }
                    }]
                }
            }
        };
    // draw the charts
    var myChartContent = document.getElementById('myChartContent');
    myChartContent.innerHTML = '&nbsp;';
    $('#myChartContent').append('<canvas id="myChart" width="800" height="300"><canvas>');
    // Get the context of the canvas element we want to select
    var ctx  = document.getElementById("myChart").getContext("2d");    
    myLineChart = new Chart(ctx, chartOptions);
    canvas = document.getElementById("myChart");    
    canvas.onclick = function(evt){
		var activePoints = myLineChart.getElementsAtEvent(evt);
		if (activePoints.length == 1){
			if (activePoints[0]["_index"] > 0){

				dataForActivitiesChart = Session.get("activitiesByWeek");
				//this week
				thisWeekActivities = {};
				point = activePoints[0]["_xScale"]["ticks"][activePoints[0]["_index"]];				
				console.log(dataForActivitiesChart[point]);				
				for (activity in dataForActivitiesChart[point]){
					try {
						var maxKey = _.max(Object.keys(dataForActivitiesChart[point][activity]["sensor_activity_all"]), function (o) { return dataForActivitiesChart[point][activity]["sensor_activity_all"][o]; });					
						thisWeekActivities = groupactivities(maxKey, thisWeekActivities);	
					}
					catch (e){
						console.log(e);
	      				console.log("we got an error");
					}				
					
				}
				console.log("thisWeekActivities");
				console.log(thisWeekActivities);
				//last week
				lastWeekActivities = {};
				point = activePoints[0]["_xScale"]["ticks"][activePoints[0]["_index"] - 1];				
				console.log(dataForActivitiesChart[point]);				
				for (activity in dataForActivitiesChart[point]){
					try{
						var maxKey = _.max(Object.keys(dataForActivitiesChart[point][activity]["sensor_activity_all"]), function (o) { return dataForActivitiesChart[point][activity]["sensor_activity_all"][o]; });					
						lastWeekActivities = groupactivities(maxKey, lastWeekActivities);	
					}
					catch (e){
						console.log(e);
	      				console.log("we got an error");
					}										
				};
				console.log("lastWeekActivities"); 
				console.log(lastWeekActivities); 

				createSelfMonitoringChart(thisWeekActivities, lastWeekActivities);
				createComparisonChart(dataForActivitiesChart, Session.get("allActivitiesByWeek"));
			}			
		}		
	};
    // => activePoints is an array of points on the canvas that are at the same position as the click event.   	
};

function groupweek(value, activitiesByWeek)
{
    d = new Date(value["start_time"]);
    d = Math.floor(d.getTime()/(1000*60*60*24*7));
    activitiesByWeek[d]=activitiesByWeek[d]||[];
    activitiesByWeek[d].push(value);
    return activitiesByWeek;
}

function groupactivities(value, activities)
{	console.log(value);
	if (activities_to_consider.indexOf(value) >= 0){
		activities[value]=activities[value]||0;
    	activities[value] = activities[value] + 1;
	}    
    return activities;
}