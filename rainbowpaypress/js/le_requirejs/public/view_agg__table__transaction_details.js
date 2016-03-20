/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        1.1.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/public/view_agg__table__transaction_details.js

  Description:    Widget 'ViewAgg_Table_TransactionDetails'.

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


define(['jquery',
        'util',
        'view_agg__table',
        'public/view_agg__tr__transaction_detail'
    ], function($,
                util,
                ViewAgg_Table,
                ViewAgg_Tr_TransactionDetail) {

        return ViewAgg_Table.extend({

                //  @param  params.model_info__transaction_details
                //  @param  params.name                 Name of the seller
                //  @param  params.info                 Miscellaneous additional information
                initialize: function(params) {

                        ViewAgg_Table.prototype.initialize.apply(this, arguments);

                        var model_info__transaction_details = params.model_info__transaction_details;

                        (new ViewAgg_Tr_TransactionDetail({
                                    model_info__transaction_details: model_info__transaction_details,
                                    field: 'type',
                                    name: "Stripe transaction type:"
                                })).$el.appendTo(this.$el);

                        (new ViewAgg_Tr_TransactionDetail({
                                    model_info__transaction_details: model_info__transaction_details,
                                    field: 'charge_description',
                                    name: "Description:"
                                })).$el.appendTo(this.$el);

                        if (params.info) {
                            (new ViewAgg_Tr_TransactionDetail({
                                    name: "Information:",
                                    text: params.info
                                })).$el.appendTo(this.$el);
                        }

                        (new ViewAgg_Tr_TransactionDetail({
                                    callback_format_value: util.formatCurrency,
                                    model_info__transaction_details: model_info__transaction_details,
                                    field: 'charge_amount',
                                    name: "Puchase amount:"
                                })).$el.appendTo(this.$el);

                        var view_agg__tr__transaction_detailStripeToken =
                                                new ViewAgg_Tr_TransactionDetail({
                                                            model_info__transaction_details:
                                                                        model_info__transaction_details,
                                                            field: 'stripe_token_id',
                                                            name: "Stripe token id:",
                                                            text_enter: "Enter credit card info",
                                                            text_modify: "Modify"
                                                        });

                        view_agg__tr__transaction_detailStripeToken.$el.appendTo(this.$el);

                        var view_agg__tr__transaction_detailStripeEmail =
                                                new ViewAgg_Tr_TransactionDetail({
                                                            model_info__transaction_details:
                                                                        model_info__transaction_details,
                                                            field: 'stripe_email',
                                                            name: "Stripe card email:",
                                                            text_enter: "Enter credit card info",
                                                            text_modify: "Modify"
                                                        });

                        view_agg__tr__transaction_detailStripeEmail.$el.appendTo(this.$el);

                        var view_agg__tr__transaction_detailCustomerName =
                                                new ViewAgg_Tr_TransactionDetail({
                                                            model_info__transaction_details:
                                                                        model_info__transaction_details,
                                                            field: 'customer_name',
                                                            name: "Customer name:",
                                                            text_enter: "Enter customer name",
                                                            text_modify: "Modify"
                                                        });

                        view_agg__tr__transaction_detailCustomerName.$el.appendTo(this.$el);

                        var view_agg__tr__transaction_detailCustomerPhone =
                                                new ViewAgg_Tr_TransactionDetail({
                                                            model_info__transaction_details:
                                                                        model_info__transaction_details,
                                                            field: 'customer_phone',
                                                            name: "Customer phone:",
                                                            text_enter: "Enter customer phone",
                                                            text_modify: "Modify"
                                                        });

                        view_agg__tr__transaction_detailCustomerPhone.$el.appendTo(this.$el);

                        var $buttonSubmit = $('<button>').text("Submit").appendTo(this.$el);

                        $('<tr>').append($('<td>').attr('colspan', '2').append($buttonSubmit))
                                 .appendTo(this.$el);


                        var handler = null;

                        // Close Checkout on page navigation
                        $(window).on('popstate', function() {
                                if (handler) handler.close();
                            });

                        this.listenTo(model_info__transaction_details, 'do_prompt', function(event) {
                                var field = event.field;

                                if (field == 'stripe_token_id' || field == 'stripe_email') {
                                    require(
                                        ['stripe_checkout'],
                                        function(stripe_checkout) {
                                            //  Based on:
                                            //  https://stripe.com/docs/checkout#integration-custom

                                            handler = StripeCheckout.configure({
                                                    'allow-remember-me':
                                                                    false,
                                                    'key':          model_info__transaction_details
                                                                                 .getPublishKey(),
                                                    'panel-label':  "Obtain Stripe token",

                                                    'token': function(dataToken) {
                                                            // Use the token to create the charge
                                                            // with a server-side script.  You can
                                                            // access the token ID with `token.id`

                                                            model_info__transaction_details.set({
                                                                    'stripe_token_id':
                                                                                    dataToken.id,
                                                                    'stripe_email': dataToken.email
                                                                });
                                                        }
                                                });

                                            // Open Checkout with further options
                                            handler.open({
                                                    name:         params.name,
                                                    description:  model_info__transaction_details
                                                                        .get('charge_description'),
                                                    amount:       model_info__transaction_details
                                                                        .get('charge_amount')
                                                });
                                        });

                                    return;
                                }

                                if (field == 'customer_name') {
                                    var strCustomerName = window.prompt(
                                                                "Enter customer name:",
                                                                model_info__transaction_details
                                                                          .get('customer_name')
                                                                                           || "");
                                    if (!strCustomerName) return;

                                    model_info__transaction_details.set('customer_name',
                                                                  strCustomerName);
                                    return;
                                }

                                if (field == 'customer_phone') {
                                    var strCustomerPhone = window.prompt(
                                                                "Enter customer phone:",
                                                                model_info__transaction_details
                                                                          .get('customer_phone')
                                                                                           || "");
                                    if (!strCustomerPhone) return;

                                    model_info__transaction_details.set('customer_phone',
                                                                  strCustomerPhone);
                                    return;
                                }
                            });

                        var me = this;

                        $buttonSubmit.click(function(event) {
                                event.preventDefault();

                                if (model_info__transaction_details
                                                     .doCheckForFieldsWithMissingValues()) {
                                    window.alert("Please specify the required information by clicking on the links in red.");
                                    return;
                                }

                                if (!window.confirm("Submit this transaction?")) return;

                                model_info__transaction_details.doXhrSubmit();
                            });
                    }
            });

    });


})(_plugin_RainbowPayPress__define, _plugin_RainbowPayPress__require);
