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
        'jquery',
        'view_agg__tr__transaction_detail'
    ], function (backbone, $, ViewAgg_Tr_TransactionDetail) {

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

                        (new ViewAgg_Tr_TransactionDetail({
                                    name: "Description:",
                                    value: params.desc
                                })).$el.appendTo(this.$el);

                        (new ViewAgg_Tr_TransactionDetail({
                                    name: "Puchase amount:",
                                    value: _formatCurrency(params.amount)
                                })).$el.appendTo(this.$el);

                        var view_agg__tr__transaction_detailStripeToken =
                                                new ViewAgg_Tr_TransactionDetail({
                                                            name: "Stripe token id:",
                                                            modify_text: "Enter credit card info"
                                                        });

                        view_agg__tr__transaction_detailStripeToken.$el.appendTo(this.$el);

                        var view_agg__tr__transaction_detailStripeEmail =
                                                new ViewAgg_Tr_TransactionDetail({
                                                            name: "Stripe card email:",
                                                            modify_text: "Enter credit card info"
                                                        });

                        view_agg__tr__transaction_detailStripeEmail.$el.appendTo(this.$el);

                        var view_agg__tr__transaction_detailCustomerName =
                                                new ViewAgg_Tr_TransactionDetail({
                                                            name: "Customer name:",
                                                            modify_text: "Enter customer name"
                                                        });

                        view_agg__tr__transaction_detailCustomerName.$el.appendTo(this.$el);

                        var view_agg__tr__transaction_detailCustomerPhone =
                                                new ViewAgg_Tr_TransactionDetail({
                                                            name: "Customer phone:",
                                                            modify_text: "Enter customer phone"
                                                        });

                        view_agg__tr__transaction_detailCustomerPhone.$el.appendTo(this.$el);

                        //  Based on: https://stripe.com/docs/checkout#integration-custom
                        var handler = StripeCheckout.configure({
                                key: params['publish_key'],
                                token: function(dataToken) {
                                        // Use the token to create the charge with a server-side script.
                                        // You can access the token ID with `token.id`

                                        view_agg__tr__transaction_detailStripeToken
                                                                       .setValue(dataToken.id);
                                        view_agg__tr__transaction_detailStripeEmail
                                                                       .setValue(dataToken.email);

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
                            // Open Checkout with further options
                            handler.open({
                                    name:         params.name,
                                    description:  params.desc,
                                    amount:       params.amount
                                });
                        }

                        this.listenTo(view_agg__tr__transaction_detailStripeToken,
                                      'click_modify',
                                      _onClickOpenStripe);
                        this.listenTo(view_agg__tr__transaction_detailStripeEmail,
                                      'click_modify',
                                      _onClickOpenStripe);

                        this.listenTo(
                            view_agg__tr__transaction_detailCustomerName,
                            'click_modify',
                            function() {
                                var strCustomerName = window.prompt("Enter customer name:");
                                if (!strCustomerName) return;

                                view_agg__tr__transaction_detailCustomerName
                                                                       .setValue(strCustomerName);
                            });

                        this.listenTo(
                            view_agg__tr__transaction_detailCustomerPhone,
                            'click_modify',
                            function() {
                                var strCustomerPhone = window.prompt("Enter customer phone:");
                                if (!strCustomerPhone) return;

                                view_agg__tr__transaction_detailCustomerPhone
                                                                      .setValue(strCustomerPhone);
                            });
                    }
            });

    });


})(_plugin_Stripe_Payment_Press__define);
