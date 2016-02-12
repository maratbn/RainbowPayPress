/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.7.0-development_unreleased

  Module:         js/le_requirejs/admin/view_agg__tr__option__string__email_notifications.js

  Description:    Widget 'ViewAgg_Tr_Option_String_EmailNotifications' is
                  specifically for the email address for notifications field.

  This file is part of StripePaymentPress.

  Licensed under the GNU General Public License Version 3.

  StripePaymentPress is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  StripePaymentPress is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with StripePaymentPress.  If not, see <http://www.gnu.org/licenses/>.
*/


(function(define) {


define(['jquery',
        'model_orig__app_common',
        'admin/view_agg__tr__option__string'
    ], function($,
                model_orig__app_common,
                ViewAgg_Tr_Option_String) {


        //  Widget 'ViewAgg_Tr_Option_String_EmailNotifications':


        return ViewAgg_Tr_Option_String.extend({

                initialize: function(params) {

                        ViewAgg_Tr_Option_String.prototype.initialize.call(this, {
                                field:   'email_notifications',
                                label:   "Email address to send notifications to:",
                                prompt:  "Enter new email address for notifications:"
                            });

                        $('<button>')
                                .addClass('button button-secondary')
                                .text("Send test email")
                                .appendTo($('<td>')
                                                .appendTo(this.$el))
                                .click(function() {
                                            var $xhr = $.ajax(
                                                model_orig__app_common.get('ajax_url'), {
                                                    data: {
                                                            'action': 'stripe_payment_press__admin__send_test_email'
                                                        },
                                                    method: 'post'
                                                });

                                            $xhr.success(function(strData) {
                                                    var objData = JSON.parse(strData);
                                                    if (!objData || !objData['success']) {
                                                        var arrErrors = objData['errors'];
                                                            strNotice = "Test email was not sent.";

                                                        if (arrErrors) {
                                                            if (arrErrors.indexOf('error__no_recipient') >= 0) {
                                                                strNotice = "Test email was not sent because the recipient email address was not configured.";
                                                            } else if (arrErrors.indexOf('error__wp_mail') >= 0) {
                                                                strNotice += "  Your server may not be properly configured to send emails.  Make sure sendmail is properly installed and configured.";
                                                            }
                                                        }

                                                        window.alert(strNotice);
                                                        return;
                                                    }

                                                    window
                                                      .alert("Test email sent successfully.");
                                                });
                                        });
                    }
            });
    });


})(_plugin_StripePaymentPress__define);
