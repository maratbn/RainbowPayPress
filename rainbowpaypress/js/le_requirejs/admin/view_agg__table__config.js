/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/view_agg__table__config.js

  Description:    Widget 'ViewAgg_Table_Config' for configuration of
                  Stripe parameters.

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
        'view_agg__table',
        'admin/model_orig__config',
        'admin/view_agg__button',
        'admin/view_agg__tr__config__notes',
        'admin/view_agg__tr__config__option__boolean',
        'admin/view_agg__tr__config__option__string',
        'admin/view_agg__tr__config__option__string__email_notifications',
        'admin/view_agg__tr__w_header'
    ], function($,
                ViewAgg_Table,
                model_orig__config,
                ViewAgg_Button,
                ViewAgg_Tr_Config_Notes,
                ViewAgg_Tr_Config_Option_Boolean,
                ViewAgg_Tr_Config_Option_String,
                ViewAgg_Tr_Config_Option_String_EmailNotifications,
                ViewAgg_Tr_WHeader) {


        function _get_$ulWithURLs(arrURLs) {
            var $ul = $('<ul>');

            for (var i = 0; i < arrURLs.length; i++) {
                var strURL = arrURLs[i];

                $ul.append($('<li>').append($('<a>').attr('href', strURL)
                                                    .attr('target', '_blank')
                                                    .text(strURL)));
            }

            return $ul;
        }


        var strURLStripeAPI = 'https://dashboard.stripe.com/account/apikeys';


        return ViewAgg_Table.extend({

                initialize: function() {

                        var $buttonRefresh = (new ViewAgg_Button)
                                                          .$el
                                                          .text("Refresh");

                        $buttonRefresh.click(function() {
                                model_orig__config.doXhrRefresh();
                            });

                        this.$el.append($("<tr>").append($("<th>").append($buttonRefresh)));

                        (new ViewAgg_Tr_Config_Option_String({
                                                field:   'entity_name',
                                                label:   "Your site / company / organization name:",
                                                prompt:  "Enter your site / company / organization name:"
                                            })).$el
                                               .appendTo(this.$el);

                        (new ViewAgg_Tr_Config_Option_Boolean({
                                                field:   'flag_enable_email_notifications',
                                                label:   "Enable email notifications:"
                                            })).$el
                                               .appendTo(this.$el);

                        (new ViewAgg_Tr_Config_Option_String_EmailNotifications())
                                               .$el
                                               .appendTo(this.$el);

                        (new ViewAgg_Tr_Config_Notes({
                                                content: [
                                                        $('<p>')
                                                            .text("Make sure you have a mailing agent such as 'sendmail' configured properly on your server to send emails."),
                                                        $('<p>')
                                                            .text("If you're using 'sendmail', and sending email is taking a strangely long time, and you see an error in '/var/log/mail.err' that says 'My unqualified host name ([hostname]) unknown; sleeping for retry', then read this:")
                                                            .append(
                                                                _get_$ulWithURLs([
                                                                        'http://forum.linuxcareer.com/threads/1697-Sendmail-quot-unqualified-hostname-unknown-sleeping-for-retry-unqualified-hostname',
                                                                        'http://forums.fedoraforum.org/archive/index.php/t-85365.html'
                                                                    ]))
                                                    ]
                                            })).$el
                                               .appendTo(this.$el);

                        (new ViewAgg_Tr_Config_Option_String({
                                                field:   'stripe_key_live_secret',
                                                label:   "Stripe live secret key:",
                                                prompt:  "Enter new Stripe live secret key:"
                                            })).$el
                                               .appendTo(this.$el);

                        (new ViewAgg_Tr_Config_Option_String({
                                                field:   'stripe_key_live_publish',
                                                label:   "Stripe live publishable key:",
                                                prompt:  "Enter new Stripe live publishable key:"
                                            })).$el
                                               .appendTo(this.$el);

                        (new ViewAgg_Tr_Config_Option_String({
                                                field:   'stripe_key_test_secret',
                                                label:   "Stripe test secret key:",
                                                prompt:  "Enter new Stripe test secret key:"
                                            })).$el
                                               .appendTo(this.$el);

                        (new ViewAgg_Tr_Config_Option_String({
                                                field:   'stripe_key_test_publish',
                                                label:   "Stripe test publishable key:",
                                                prompt:  "Enter new Stripe test publishable key:"
                                            })).$el
                                               .appendTo(this.$el);

                        (new ViewAgg_Tr_Config_Notes({
                                                content: [
                                                        $('<p>')
                                                            .text(
                                                                "Get your Stripe API keys from: ")
                                                            .append(
                                                                $('<a>')
                                                                    .attr({
                                                                         'href':   strURLStripeAPI,
                                                                         'target': '_blank'
                                                                        })
                                                                    .text(strURLStripeAPI))
                                                    ]
                                            })).$el
                                               .appendTo(this.$el);
                    }
            });

    });


})(_plugin_RainbowPayPress__define);
