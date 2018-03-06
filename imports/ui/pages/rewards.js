import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import {EventNotifications} from '../../api/exports/exports.js';
import { OptimumUsers } from '../../api/exports/exports.js';
import d3 from 'd3';
import './rewards.html';

Session.setDefault("usersWithRewards", []);


Template.rewards.onRendered(function() {
  let self = this;
  self.subscribe('OptimumUsersRewards',{
        onStop: function(e) {
            if (e) {
                console.log("OptimumUsersRewards subscription error " + e);                
            }
        },
        onReady: function(e) {
            usersArray = [];
            console.log("OptimumUsersRewards subscription done");
            users = OptimumUsers.find({ "pilot": { "$exists": true }}).fetch();
            
            users.forEach(function(entry){
                Meteor.call("getUserPoints", entry.id, entry.pilot, function(err, res) {
                    console.log("res");
                    //console.log(res);
                    users_with_rewards = Session.get("usersWithRewards");
                    users_with_rewards.push(res);
                    Session.set("usersWithRewards", users_with_rewards);
                });                
            });            
        },
    });
 

});

Template.rewards.events({
  'click .view_details': function(e) {
    e.preventDefault();
    
    $('#heatMapModal').modal('show');
    var user_id = e.target.getAttribute("id");
    users_data = Session.get("usersWithRewards");
    var result = $.grep(users_data, function(e){ return e.user_id == user_id; });
    
    var barChartData = {
        labels: [],
        datasets: [{
            label: user_id,
            backgroundColor: "#dfdfdf",
            borderColor: "#dfdfdf",
            borderWidth: 1,
            data: []
        }]
    };
    var formatTime = d3.timeFormat("%B %d, %Y");
    result[0].points.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.from) - new Date(b.from);
    });
    $.each(result[0].points, function( index, value ) {
      from = new Date(value.from)
      var label = formatTime(from); 
      barChartData.labels.push(label);
      barChartData.datasets[0].data.push(value.total_week_credits);
    });
    var myChartContent = document.getElementById('calheatmap');
    myChartContent.innerHTML = '&nbsp;';
    $('#calheatmap').append('<canvas id="myChart" width="800" height="300"><canvas>');

    var ctx = $("#myChart").get(0).getContext("2d");        
    
    newChart= new Chart(ctx, {
                type: 'bar',
                data: barChartData,
                options: {
                    responsive: true,
                    legend: {
                        display: false
                    },
                    title: {
                        display: false                        
                    }
                }
            });
  }
});

Template.rewards.helpers({
	getUsersWithRewards() {    
        return Session.get("usersWithRewards");        
    },
    getUserId(user){
        return user["user_id"];
    },
    getUserPilot(user){
        return user["location"]; 
    },
    getUserTotalPoints(user){
        total_points = 0;
        for (entry in user["points"]){
            //console.log(user["points"][entry]);
            total_points += user["points"][entry]["total_week_credits"]; 
        }
        return total_points;
    }
});

Template.calHeatMapModalTemplate.onRendered(function() {

    users_with_rewards = Session.get("usersWithRewards");
    var barChartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'Dataset 1',
            backgroundColor: "#dfdfdf",
            borderColor: "#dfdfdf",
            borderWidth: 1,
            data: [8, 6, 5, 7, 9, 8, 1, 6, 3, 3, 8, 7]
        }]

    };
    var ctx = document.getElementById('myChart').getContext('2d');
    newChart= new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Bar Chart'
            }
        }
    });    
});

