/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.0.1--development_unreleased

  Module:         js/le_requirejs/view_agg__table__transaction_details.js

  Description:    Widget 'ViewAgg_Table_TransactionDetails'.

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


define(['backbone',
        'jquery'
    ], function (backbone, $) {

        return backbone.View.extend({
                tagName: 'table',

                //  @param  params.ajax_url
                //  @param  params.publish_key
                //  @param  params.amount
                //  @param  params.name                 //  Name of the seller
                //  @param  params.desc                 //  Product description
                initialize: function(params) {
                        this.$el.attr({'border':       '0',
                                       'cellspacing':  '0',
                                       'cellpadding':  '0'});

                        $('<tr>').append($('<td>').text("Description:"))
                                 .append($('<td>').text(params.desc))
                                 .appendTo(this.$el);

                        var $aOpenStripe      = $('<a>').attr('href', '#')
                                                        .text("Open Stripe to specify"),
                            $tdStripeTokenId  = $('<td>');

                        var $trStripeTokenId = $('<tr>').append($('<td>').text("Stripe token id:"))
                                                        .append($tdStripeTokenId)
                                                        .append($('<td>').append($aOpenStripe))
                                                        .appendTo(this.$el);

                        //  Based on: https://stripe.com/docs/checkout#integration-custom
                        var handler = StripeCheckout.configure({
                                key: params['publish_key'],
                                token: function(dataToken) {
                                        // Use the token to create the charge with a server-side script.
                                        // You can access the token ID with `token.id`

                                        $tdStripeTokenId.text(dataToken.id);

                                        var $xhr = $.post(params['ajax_url'], {
                                                action:  'stripe_payment_press__charge_with_stripe',
                                                amount:  params.amount,
                                                desc:    params.desc,
                                                token:   dataToken
                                            });
                                    }
                            });

                        // Close Checkout on page navigation
                        $(window).on('popstate', function() {
                                handler.close();
                            });

                        $aOpenStripe.click(function(event) {
                                event.preventDefault();

                                // Open Checkout with further options
                                handler.open({
                                        name:         params.name,
                                        description:  params.desc,
                                        amount:       params.amount
                                    });
                            });
                    }
            });

    });


})(_plugin_Stripe_Payment_Press__define);
