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

                //  @param  params.model_transaction_details
                //  @param  params.ajax_url
                //  @param  params.publish_key
                //  @param  params.amount
                //  @param  params.name                 //  Name of the seller
                //  @param  params.desc                 //  Product description
                initialize: function(params) {

                        var model_transaction_details = params.model_transaction_details;

                        this.$el.attr({'border':       '0',
                                       'cellspacing':  '0',
                                       'cellpadding':  '0'});

                        (new ViewAgg_Tr_TransactionDetail({
                                    model_transaction_details: model_transaction_details,
                                    field: 'product_description',
                                    name: "Description:"
                                })).$el.appendTo(this.$el);

                        (new ViewAgg_Tr_TransactionDetail({
                                    callback_format_value: _formatCurrency,
                                    model_transaction_details: model_transaction_details,
                                    field: 'product_cost',
                                    name: "Puchase amount:"
                                })).$el.appendTo(this.$el);

                        var view_agg__tr__transaction_detailStripeToken =
                                                new ViewAgg_Tr_TransactionDetail({
                                                            model_transaction_details:
                                                                        model_transaction_details,
                                                            field: 'stripe_token_id',
                                                            name: "Stripe token id:",
                                                            text_enter: "Enter credit card info",
                                                            text_modify: "Modify"
                                                        });

                        view_agg__tr__transaction_detailStripeToken.$el.appendTo(this.$el);

                        var view_agg__tr__transaction_detailStripeEmail =
                                                new ViewAgg_Tr_TransactionDetail({
                                                            model_transaction_details:
                                                                        model_transaction_details,
                                                            field: 'stripe_email',
                                                            name: "Stripe card email:",
                                                            text_enter: "Enter credit card info",
                                                            text_modify: "Modify"
                                                        });

                        view_agg__tr__transaction_detailStripeEmail.$el.appendTo(this.$el);

                        var view_agg__tr__transaction_detailCustomerName =
                                                new ViewAgg_Tr_TransactionDetail({
                                                            model_transaction_details:
                                                                        model_transaction_details,
                                                            field: 'customer_name',
                                                            name: "Customer name:",
                                                            text_enter: "Enter customer name",
                                                            text_modify: "Modify"
                                                        });

                        view_agg__tr__transaction_detailCustomerName.$el.appendTo(this.$el);

                        var view_agg__tr__transaction_detailCustomerPhone =
                                                new ViewAgg_Tr_TransactionDetail({
                                                            model_transaction_details:
                                                                        model_transaction_details,
                                                            field: 'customer_phone',
                                                            name: "Customer phone:",
                                                            text_enter: "Enter customer phone",
                                                            text_modify: "Modify"
                                                        });

                        view_agg__tr__transaction_detailCustomerPhone.$el.appendTo(this.$el);

                        var $buttonSubmit = $('<button>').text("Submit").appendTo(this.$el);

                        $('<tr>').append($('<td>').attr('colspan', '2').append($buttonSubmit))
                                 .appendTo(this.$el);

                        //  Based on: https://stripe.com/docs/checkout#integration-custom
                        var handler = StripeCheckout.configure({
                                key: params['publish_key'],
                                token: function(dataToken) {
                                        // Use the token to create the charge with a server-side script.
                                        // You can access the token ID with `token.id`

                                        model_transaction_details.set({
                                                'stripe_token_id':  dataToken.id,
                                                'stripe_email':     dataToken.email
                                            });

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

                        this.listenTo(model_transaction_details, 'do_prompt', function(event) {
                                var field = event.field;

                                if (field == 'stripe_token_id' || field == 'stripe_email') {
                                    // Open Checkout with further options
                                    handler.open({
                                            name:         params.name,
                                            description:  params.desc,
                                            amount:       params.amount
                                        });
                                    return;
                                }

                                if (field == 'customer_name') {
                                    var strCustomerName = window.prompt(
                                                                "Enter customer name:",
                                                                model_transaction_details
                                                                          .get('customer_name')
                                                                                           || "");
                                    if (!strCustomerName) return;

                                    model_transaction_details.set('customer_name',
                                                                  strCustomerName);
                                    return;
                                }

                                if (field == 'customer_phone') {
                                    var strCustomerPhone = window.prompt(
                                                                "Enter customer phone:",
                                                                model_transaction_details
                                                                          .get('customer_phone')
                                                                                           || "");
                                    if (!strCustomerPhone) return;

                                    model_transaction_details.set('customer_phone',
                                                                  strCustomerPhone);
                                    return;
                                }
                            });

                        var me = this;

                        $buttonSubmit.click(function(event) {
                                event.preventDefault();

                                if (model_transaction_details
                                                     .doCheckForFieldsWithMissingValues()) {
                                    window.alert("Please specify the required information by clicking on the links in red.");
                                    return;
                                }

                                var $xhr = $.post(params['ajax_url'], {
                                        action:               'stripe_payment_press__submit',
                                        product_description:  model_transaction_details
                                                               .attributes['product_description'],
                                        product_cost:         model_transaction_details
                                                               .attributes['product_cost'],
                                        stripe_token_id:      model_transaction_details
                                                               .attributes['stripe_token_id'],
                                        stripe_email:         model_transaction_details
                                                               .attributes['stripe_email'],
                                        customer_name:        model_transaction_details
                                                               .attributes['customer_name'],
                                        customer_phone:       model_transaction_details
                                                               .attributes['customer_phone']
                                    });
                            });
                    }
            });

    });


})(_plugin_Stripe_Payment_Press__define);
