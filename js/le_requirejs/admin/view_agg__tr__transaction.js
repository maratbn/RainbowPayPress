/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.2.0-development_unreleased

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

        function _getStripeUrlForCharge(type, stripe_charge_id) {
            if (!type || !stripe_charge_id) return null;

            return 'https://dashboard.stripe.com/' + window.encodeURIComponent(type) +
                                      '/payments/' + window.encodeURIComponent(stripe_charge_id);
        }

        function _getStripeUrlForCustomer(type, stripe_customer_id) {
            if (!type || !stripe_customer_id) return null;

            return 'https://dashboard.stripe.com/' + window.encodeURIComponent(type) +
                                    '/customers/' + window.encodeURIComponent(stripe_customer_id);
        }

        function _getAggA_Charge(type, stripe_charge_id) {
            if (!type || !stripe_charge_id) return null;

            var strUrl = _getStripeUrlForCharge(type, stripe_charge_id);
            if (!strUrl) return null;

            return $('<a>').attr({'href':    strUrl,
                                  'target':  '_blank'}).text(stripe_charge_id);
        }

        function _getAggA_Customer(type, stripe_customer_id) {
            if (!type || !stripe_customer_id) return null;

            var strUrl = _getStripeUrlForCustomer(type, stripe_customer_id);
            if (!strUrl) return null;

            return $('<a>').attr({'href':    strUrl,
                                  'target':  '_blank'}).text(stripe_customer_id);
        }

        return backbone.View.extend({

                tagName: 'tr',

                //  @param  params.flag_exclude_charged
                //  @param  params.model_orig__transaction
                initialize: function(params) {

                        var flagExcludeCharged       = params.flag_exclude_charged,
                            model_orig__transaction  = params.model_orig__transaction;

                        var $buttonDelete = $('<button>').addClass('button button-secondary')
                                                         .text("Delete"),
                            strChargeAmount = util.formatCurrency(model_orig__transaction
                                                                           .get('charge_amount'));

                        $buttonDelete.click(function() {
                                if (!window
                                       .confirm("This will delete the local record of this " +
                                               (model_orig__transaction.get('charged')
                                                                          ? 'charged'
                                                                          : 'pending') + " " +
                                                                       strChargeAmount + " " +
                                                         model_orig__transaction.get('type') +
                                                                         " transaction for " +
                                                 model_orig__transaction.get('stripe_email') +
                                                                      ".  Are you sure?")) return;

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


                        var type = model_orig__transaction.get('type');

                        this.$el.append($('<td>').append($buttonDelete)
                                                 .append($buttonCharge))
                                .append($('<td>').text(type || ""))
                                .append($('<td>').text(model_orig__transaction
                                                                    .get('created') || ""))
                                .append(flagExcludeCharged
                                        ? null
                                        : $('<td>').text(model_orig__transaction
                                                                    .get('charged') || ""))
                                .append($('<td>').text(model_orig__transaction
                                                                    .get('charge_description') ||
                                                                                              ""))
                                .append($('<td>').text(strChargeAmount || ""))
                                .append($('<td>').text(model_orig__transaction
                                                                    .get('stripe_token_id') || ""))
                                .append($('<td>').text(model_orig__transaction
                                                                    .get('stripe_email') || ""))
                                .append($('<td>').text(model_orig__transaction
                                                                    .get('customer_name') || ""))
                                .append($('<td>').text(model_orig__transaction
                                                                    .get('customer_phone') || ""))
                                .append(flagExcludeCharged
                                        ? null
                                        : $('<td>').append(_getAggA_Customer(
                                                                type,
                                                                model_orig__transaction
                                                                    .get('stripe_customer_id'))))
                                .append(flagExcludeCharged
                                        ? null
                                        : $('<td>').append(_getAggA_Charge(
                                                                type,
                                                                model_orig__transaction
                                                                    .get('stripe_charge_id'))));
                    }
            });

    });


})(_plugin_StripePaymentPress__define);
