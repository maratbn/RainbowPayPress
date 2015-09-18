/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.0.1--development_unreleased

  Module:         js/le_requirejs/main.js

  Description:    Main JavaScript file for the WordPress plugin
                  'StripePaymentPress'.

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


(function(define, require) {


define(['jquery',
        'backbone',
        'view_agg__table__transaction_details'
    ], function($,
                backbone,
                ViewAgg_Table_TransactionDetails) {

        function _processShortcodes(params) {
            var $elSpans = $("span[data-plugin-stripe-payment-press-role=root]");

            for (var i = 0; i < $elSpans.length; i++) {
                var $elSpan = $($elSpans[i]);

                var amount =  $elSpan.attr('data-plugin-stripe-payment-press-amount'),
                    name =    $elSpan.attr('data-plugin-stripe-payment-press-name'),
                    desc =    $elSpan.attr('data-plugin-stripe-payment-press-desc'),
                    label =   $elSpan.attr('data-plugin-stripe-payment-press-label');

                var $buttonMakePayment = $('<button>').text(label || "Pay with Stripe")
                                                      .appendTo($elSpan);

                //  Based on: https://stripe.com/docs/checkout#integration-custom

                var handler = StripeCheckout.configure({
                        key: params['publish_key'],
                        token: function(token) {
                                // Use the token to create the charge with a server-side script.
                                // You can access the token ID with `token.id`

                                var $xhr = $.post(params['ajax_url'], {
                                        action:  'stripe_payment_press__charge_with_stripe',
                                        amount:  amount,
                                        desc:    desc,
                                        token:   token
                                    });
                            }
                    });

                $buttonMakePayment.on('click', function(e) {
                        // Open Checkout with further options
                        handler.open({
                                name:         name,
                                description:  desc,
                                amount:       amount
                            });

                        e.preventDefault();
                    });

                // Close Checkout on page navigation
                $(window).on('popstate', function() {
                        handler.close();
                    });

                (new ViewAgg_Table_TransactionDetails(params)).$el.appendTo($elSpan);
            }
        }

        function StripePaymentPressClient() {

            //  @param  params.ajax_url
            //  @param  params.publish_key
            this.start = function(params) {

                $(document).ready(function() {

                        _processShortcodes(params);

                    });
            };
        }

        var client = new StripePaymentPressClient();
        return client;
    });


})(_plugin_Stripe_Payment_Press__define, _plugin_Stripe_Payment_Press__require);
