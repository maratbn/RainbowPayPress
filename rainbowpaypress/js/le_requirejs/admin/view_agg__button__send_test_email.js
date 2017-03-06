/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/view_agg__button__send_test_email.js

  Description:    Widget 'ViewAgg_Button_SendTestEmail' is specifically for
                  the logic for the button to send test emails.

  This file is part of RainbowPayPress.

  Licensed under the GNU General Public License Version 3.

  RainbowPayPress is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  RainbowPayPress is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with RainbowPayPress.  If not, see <http://www.gnu.org/licenses/>.
*/


(function(define) {


define(['jquery',
        'model_orig__app_common',
        'admin/view_agg__button'
    ], function($,
                model_orig__app_common,
                ViewAgg_Button) {


        //  Widget 'ViewAgg_Button_SendTestEmail':


        var strCaptionDoSend = "Send test email";


        return ViewAgg_Button.extend({

                initialize: function() {
                        ViewAgg_Button.prototype.initialize.apply(this, arguments);

                        this.$el.text(strCaptionDoSend);

                        this.on(
                            'click',
                            function() {
                                    this.setDisabled(true);
                                    this.$el.text("Sending test email.  Please wait...");

                                    var $xhr = $.ajax(
                                        model_orig__app_common.get('ajax_url'), {
                                            data: {
                                                    'action': 'rainbow_pay_press__admin__send_test_email'
                                                },
                                            method: 'post'
                                        }),
                                        me = this;

                                    $xhr.success(function(strData) {
                                            me.setDisabled(false);
                                            me.$el.text(strCaptionDoSend);

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
                                              .alert("Test email sent successfully.  Make sure to check your SPAM folder for it, and to configure your SPAM filter to not filter it if it is there.");
                                        });
                                },
                            this);
                    }
            });
    });


})(_plugin_RainbowPayPress__define);
