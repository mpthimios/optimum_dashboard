import { Meteor } from 'meteor/meteor';
import './blank-layout.html';

Template.blankLayout.onRendered(function() {
    // Add gray color for background in blank layout
    //$('body').addClass('gray-bg');

});

Template.blankLayout.onDestroyed(function() {
    // Remove special color for blank layout
    //$('body').removeClass('gray-bg');
});
