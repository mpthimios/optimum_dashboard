import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import './footer.html';

Template.footer.onRendered = function () {

    // FIXED FOOTER
    // Uncomment this if you want to have fixed footer or add 'fixed' class to footer element in html code
    // $('.footer').addClass('fixed');

};
