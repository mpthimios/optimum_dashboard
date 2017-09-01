import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';
import datatables from 'datatables.net';
import datatables_bs from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';


import './pmessages.html';

import { OptimumMessages } from '../../api/exports/exports.js';

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
});

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
    }
});


Template.pmessages.onRendered(function(){
	
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
   }     
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
	  context: message[0].context}
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
