/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        1.1.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/public/model_info__stripe_checkout.js

  Description:    Model 'ModelInfo_StripeCheckout', for logic related to
                  interfacing.with the Stripe Checkout API.

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


(function(define, require) {


define(['backbone',
        'jquery'
    ], function(backbone, $) {

        return new (backbone.Model.extend({

                defaults: {
                        'flag_stripe_closed':        false,
                        'flag_stripe_initialized':   false,
                        'flag_stripe_initializing':  false,
                        'flag_stripe_opening':       false,
                        'flag_stripe_opened':        false
                    },

                initialize: function() {

                        var handler  = null,
                            me       = this;

                        // Close Checkout on page navigation
                        $(window).on('popstate', function() {
                                if (handler) handler.close();
                            });

                        this.doStripeCheckout = function(model_info__transaction_details,
                                                         strName) {

                                this.set({
                                        'flag_stripe_closed':        false,
                                        'flag_stripe_initializing':  true
                                    });

                                require(['stripe_checkout'], function(stripe_checkout) {
                                        //  Based on:
                                        //  https://stripe.com/docs/checkout#integration-custom
                                        handler = StripeCheckout.configure({
                                                'allow-remember-me':
                                                                false,
                                                'key':          model_info__transaction_details
                                                                                 .getPublishKey(),
                                                'panel-label':  "Obtain Stripe token",

                                                'closed': function() {
                                                        me.set({'flag_stripe_closed':   true,
                                                                'flag_stripe_opened':   false});
                                                    },

                                                'opened': function() {
                                                        me.set({'flag_stripe_opening':  false,
                                                                'flag_stripe_opened':   true});
                                                    },

                                                'token': function(dataToken) {
                                                        // Use the token to create the charge with
                                                        // a server-side script.  You can access
                                                        // the token ID with `token.id`

                                                        model_info__transaction_details.set({
                                                                'stripe_token_id':  dataToken.id,
                                                                'stripe_email':     dataToken.email
                                                            });
                                                    }
                                            });

                                        me.set({
                                                'flag_stripe_initialized':   true,
                                                'flag_stripe_initializing':  false,
                                                'flag_stripe_opening':       true
                                            });

                                        // Open Checkout with further options
                                        handler.open({
                                                name:         strName,
                                                description:  model_info__transaction_details
                                                                       .get('charge_description'),
                                                amount:       model_info__transaction_details
                                                                             .get('charge_amount')
                                            });
                                    });
                            };
                    }
            }));
    });


})(_plugin_RainbowPayPress__define, _plugin_RainbowPayPress__require);
