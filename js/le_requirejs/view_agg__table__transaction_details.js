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

        function _formatCurrency(amount) {

            function _formatDollars(dollars) {
                var strDollars = "" + dollars;
                if (strDollars.length <= 3) return strDollars;

                return _formatDollars(Math.floor(dollars / 1000)) + ',' +
                                                         strDollars.substr(strDollars.length - 3);
            }

            var strCents = "" + amount % 100;
            if (strCents.length == 1) strCents = '0' + strCents;

            return '$' + _formatDollars(Math.floor(amount / 100)) + '.' + strCents;
        }

        function _get$aOpenStripe() {
            return $('<a>').attr('href', '#').text("Enter credit card info");
        }

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

                        $('<tr>').append($("<td width='34%'>").text("Description:"))
                                 .append($("<td width='66%'>").text(params.desc))
                                 .appendTo(this.$el);

                        $('<tr>').append($("<td>").text("Puchase amount:"))
                                 .append($("<td>").text(_formatCurrency(params.amount)))
                                 .appendTo(this.$el);

                        var $aOpenStripeForTokenId  = _get$aOpenStripe(),
                            $divStripeTokenId       = $('<div>');

                        $('<tr>').append($('<td>').text("Stripe token id:"))
                                 .append($('<td>').append($divStripeTokenId)
                                                  .append($aOpenStripeForTokenId))
                                 .appendTo(this.$el);

                        var $aOpenStripeForEmail = _get$aOpenStripe(),
                            $divStripeEmail = ($('<div>'));

                        $('<tr>').append($('<td>').text("Stripe card email:"))
                                 .append($('<td>').append($divStripeEmail)
                                                  .append($aOpenStripeForEmail))
                                 .appendTo(this.$el);

                        var $aEnterCustomerName = $('<a>').attr('href', '#')
                                                          .text("Enter customer name"),
                            $divCustomerName = $('<div>');

                        $('<tr>').append($('<td>').text("Customer name:"))
                                 .append($('<td>').append($divCustomerName)
                                                  .append($aEnterCustomerName))
                                 .appendTo(this.$el);

                        //  Based on: https://stripe.com/docs/checkout#integration-custom
                        var handler = StripeCheckout.configure({
                                key: params['publish_key'],
                                token: function(dataToken) {
                                        // Use the token to create the charge with a server-side script.
                                        // You can access the token ID with `token.id`

                                        $divStripeTokenId.text(dataToken.id);
                                        $divStripeEmail.text(dataToken.email);

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

                        function _onClickOpenStripe(event) {
                            event.preventDefault();

                            // Open Checkout with further options
                            handler.open({
                                    name:         params.name,
                                    description:  params.desc,
                                    amount:       params.amount
                                });
                        }

                        $aOpenStripeForTokenId.click(_onClickOpenStripe);
                        $aOpenStripeForEmail.click(_onClickOpenStripe);

                        $aEnterCustomerName.click(function(event) {
                                event.preventDefault();

                                var strCustomerName = window.prompt("Enter customer name:");
                                if (!strCustomerName) return;

                                $divCustomerName.text(strCustomerName);
                            });
                    }
            });

    });


})(_plugin_Stripe_Payment_Press__define);
