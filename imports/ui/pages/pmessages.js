import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';
import datatables from 'datatables.net';
import datatables_bs from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';


import './pmessages.html';

import { OptimumMessages } from '../../api/exports/exports.js';


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

        },
    });
	
	/*this.autorun(() => {
    if (this.subscriptionsReady()) {
      FlowRouter.go('OptimumMessages', OptimumMessages.find());
    }
  });*/
    
});

Template.pmessages.helpers({
    'message': function(){
        return OptimumMessages.find();
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
	
	$('#mytable').DataTable({
		"ordering": false,
		"searching": false,
        "bPaginate":false,
	
	});
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
