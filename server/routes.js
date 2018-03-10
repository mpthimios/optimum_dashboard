import { $ } from 'meteor/jquery'; 

Picker.route('/rewardstats/:user_id/:location', function(params, req, res, next) {
  console.log(params.user_id);
  var data = {
    params: params,
    query: params.query,
    body: res.body
  };
  result = Meteor.call("getUserPoints", params.user_id, params.location);
  //console.log(result);
  result.points.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.from) - new Date(b.from);
    });
  res.setHeader( 'Content-Type', 'application/json' );
  res.statusCode = 200;
  res.end(JSON.stringify(result) );
});

Picker.route('/currentweekrewardstats/:user_id/:location', function(params, req, res, next) {
  console.log(params._id);
  var data = {
    params: params,
    query: params.query,
    body: res.body
  };
  result = Meteor.call("getUserPoints", params.user_id, params.location); //"kxGk08xaefaTWcQFUJUQtJQmB4m4N3lB", "LJU"
  //console.log(result);
  result.points.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.from) - new Date(b.from);
    });
  result.points = result.points[result.points.length - 1];
  res.setHeader( 'Content-Type', 'application/json' );
  res.statusCode = 200;
  res.end(JSON.stringify(result) );
});

Picker.route('/totalrewardstats/:user_id/:location', function(params, req, res, next) {
  console.log(params._id);
  var data = {
    params: params,
    query: params.query,
    body: res.body
  };
  result = Meteor.call("getUserPoints", params.user_id, params.location); //"kxGk08xaefaTWcQFUJUQtJQmB4m4N3lB", "LJU"
  var total_points = 0;
  var total_bike_points = 0;
  var total_walk_points = 0;
  var total_pt_points = 0;
  for (entry in result.points){
  	  console.log(entry);
  	  console.log(result.points[entry].total_week_credits);
	  total_points = total_points + result.points[entry].total_week_credits;
	  total_bike_points = total_bike_points + result.points[entry].bicycle_credits;
  	  total_walk_points =  total_walk_points + result.points[entry].walking_credits;
      total_pt_points = total_pt_points + result.points[entry].public_transport_credits;
	}
  res.setHeader( 'Content-Type', 'application/json' );
  res.statusCode = 200;
  res.end(JSON.stringify({"total_points": total_points, "total_bike_points" : total_bike_points, "total_walk_points": total_walk_points, "total_pt_points": total_pt_points}) );
});