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