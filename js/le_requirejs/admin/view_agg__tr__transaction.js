/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.0.1--development_unreleased

  Module:         js/le_requirejs/admin/view_agg__tr__transaction.js

  Description:    Widget 'ViewAgg_Tr_Transaction'.

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
        'util',
        'admin/collection_orig__transaction'
    ], function (backbone, $, util, collection_orig__transaction) {

        return backbone.View.extend({

                tagName: 'tr',

                //  @param  params.flag_exclude_charged
                //  @param  params.model_orig__transaction
                initialize: function(params) {

                        var flagExcludeCharged       = params.flag_exclude_charged,
                            model_orig__transaction  = params.model_orig__transaction;

                        var $buttonDelete = $('<button>').addClass('button button-secondary')
                                                         .text("Delete");
                        $buttonDelete.click(function() {
                                if (!window
                                       .confirm("This will delete the local record of this " +
                                                         model_orig__transaction.get('type') +
                                                          " transaction.  Are you sure?")) return;

                                collection_orig__transaction.doXhrDelete(model_orig__transaction);
                            });

                        var $buttonCharge = model_orig__transaction.get('charged')
                                          ? null
                                          : $('<button>').addClass('button button-secondary')
                                                         .text("Charge");

                        if ($buttonCharge) {
                            $buttonCharge.click(function () {
                                    collection_orig__transaction
                                                            .doXhrCharge(model_orig__transaction);
                                });
                        }

                        this.$el.append($('<td>').append($buttonDelete)
                                                 .append($buttonCharge))
                                .append($('<td>').text(model_orig__transaction
                                                                    .get('type') || ""))
                                .append($('<td>').text(model_orig__transaction
                                                                    .get('created') || ""))
                                .append(flagExcludeCharged
                                        ? null
                                        : $('<td>').text(model_orig__transaction
                                                                    .get('charged') || ""))
                                .append($('<td>').text(model_orig__transaction
                                                                    .get('charge_description') ||
                                                                                              ""))
                                .append($('<td>').text(
                                                    util.formatCurrency(
                                                       model_orig__transaction
                                                                    .get('charge_amount') || "")))
                                .append($('<td>').text(model_orig__transaction
                                                                    .get('stripe_token_id') || ""))
                                .append($('<td>').text(model_orig__transaction
                                                                    .get('stripe_email') || ""))
                                .append($('<td>').text(model_orig__transaction
                                                                    .get('customer_name') || ""))
                                .append($('<td>').text(model_orig__transaction
                                                                    .get('customer_phone') || ""));
                    }
            });

    });


})(_plugin_Stripe_Payment_Press__define);
