/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

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


(function(define) {


define(['jquery',
        'util',
        'view_agg__table',
        'public/view_agg__tr__transaction_detail',
        'public/view_agg__tr__transaction_detail__stripe'
    ], function($,
                util,
                ViewAgg_Table,
                ViewAgg_Tr_TransactionDetail,
                ViewAgg_Tr_TransactionDetail_Stripe) {

        return ViewAgg_Table.extend({

                //  @param  params.model_info__transaction_details
                //  @param  params.model_orig__fields
                //  @param  params.name                 Name of the seller
                //  @param  params.info                 Miscellaneous additional information
                initialize: function(params) {

                        ViewAgg_Table.prototype.initialize.apply(this, arguments);

                        this.$el.addClass('widget_view_agg__table__transaction_details');


                        var model_info__transaction_details  = params
                                                                 .model_info__transaction_details,
                            model_orig__fields               = params.model_orig__fields;

                        (new ViewAgg_Tr_TransactionDetail({
                                    model_info__details_base: model_info__transaction_details,
                                    field: 'type',
                                    name: "Stripe transaction type:"
                                })).$el.appendTo(this.$el);

                        (new ViewAgg_Tr_TransactionDetail({
                                    model_info__details_base: model_info__transaction_details,
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
                                    model_info__details_base: model_info__transaction_details,
                                    field: 'charge_amount',
                                    name: "Puchase amount:"
                                })).$el.appendTo(this.$el);

                        (new ViewAgg_Tr_TransactionDetail_Stripe({
                                model_info__transaction_details:
                                            model_info__transaction_details,
                                field: 'stripe_token_id',
                                name: "Stripe token id:",
                                name_seller: params.name,
                                text_enter: "Enter credit card info...",
                                text_modify: "Modify..."
                            })).$el.appendTo(this.$el);

                        (new ViewAgg_Tr_TransactionDetail_Stripe({
                                model_info__transaction_details:
                                            model_info__transaction_details,
                                field: 'stripe_email',
                                name: "Stripe card email:",
                                name_seller: params.name,
                                text_enter: "Enter credit card info...",
                                text_modify: "Modify..."
                            })).$el.appendTo(this.$el);

                        (new ViewAgg_Tr_TransactionDetail({
                                model_info__details_base:
                                            model_info__transaction_details,
                                field: 'customer_name',
                                name: "Customer name:",
                                text_enter: "Enter customer name...",
                                text_modify: "Modify..."
                            })).$el.appendTo(this.$el);

                        if (model_orig__fields.get('flag_query_phone')) {
                            (new ViewAgg_Tr_TransactionDetail({
                                    model_info__details_base:
                                                    model_info__transaction_details,
                                    field: 'customer_phone',
                                    name: "Customer phone:",
                                    text_enter: "Enter customer phone...",
                                    text_modify: "Modify..."
                                })).$el.appendTo(this.$el);
                        }

                        if (model_orig__fields.get('flag_query_shipping')) {
                            (new ViewAgg_Tr_TransactionDetail({
                                    model_info__details_base:
                                                model_info__transaction_details,
                                    field: 'shipping_address',
                                    name: "Shipping address:",
                                    text_enter: "Enter shipping address...",
                                    text_modify: "Modify..."
                                })).$el.appendTo(this.$el);
                        }


                        var $buttonSubmit = $('<button>').text("Submit");

                        $('<tr>').append($('<td>').attr('colspan', '2').append($buttonSubmit))
                                 .appendTo(this.$el);


                        this.listenTo(model_info__transaction_details, 'do_prompt', function(event) {
                                var field = event.field;

                                if (field == 'customer_name') {
                                    var strCustomerName = window.prompt(
                                                                "Enter customer name:",
                                                                model_info__transaction_details
                                                                          .get('customer_name')
                                                                                           || "");
                                    if (strCustomerName == null) return;

                                    model_info__transaction_details.set('customer_name',
                                                                  strCustomerName);
                                } else if (field == 'customer_phone') {
                                    var strCustomerPhone = window.prompt(
                                                                "Enter customer phone:",
                                                                model_info__transaction_details
                                                                          .get('customer_phone')
                                                                                           || "");
                                    if (strCustomerPhone == null) return;

                                    model_info__transaction_details.set('customer_phone',
                                                                  strCustomerPhone);
                                } else if (field == 'shipping_address') {
                                    var strShippingAddress = window.prompt(
                                                                "Enter shipping address:",
                                                                model_info__transaction_details
                                                                          .get('shipping_address')
                                                                                           || "");
                                    if (strShippingAddress == null) return;

                                    model_info__transaction_details.set('shipping_address',
                                                                        strShippingAddress);
                                }
                            });

                        var me = this;

                        $buttonSubmit.click(function(event) {
                                event.preventDefault();

                                if (model_info__transaction_details
                                         .doCheckForFieldsWithMissingValues(
                                                                    model_orig__fields
                                                                          .getFieldsRequired())) {
                                    window.alert("Please specify the required information by clicking on the links in red.");
                                    return;
                                }

                                if (!window.confirm("Submit this transaction?")) return;

                                model_info__transaction_details.doXhrSubmit();
                            });
                    }
            });

    });


})(_plugin_RainbowPayPress__define);
