/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/view_agg__tr__transaction.js

  Description:    Widget 'ViewAgg_Tr_Transaction'.

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
        'admin/collection_orig__transaction',
        'admin/view_agg__button',
        'admin/view_agg__span__date',
        'admin/view_agg__tr__w_header'
    ], function($,
                util,
                collection_orig__transaction,
                ViewAgg_Button,
                ViewAgg_Span_Date,
                ViewAgg_Tr_WHeader) {

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

        function _td() {
            return $('<td>');
        }

        return ViewAgg_Tr_WHeader.extend({

                //  @param  params.flag_exclude_charged
                //  @param  params.model_orig__transaction
                initialize: function(params) {

                        ViewAgg_Tr_WHeader.prototype.initialize.apply(this, arguments);


                        var flagExcludeCharged       = params.flag_exclude_charged,
                            model_orig__transaction  = params.model_orig__transaction;

                        var $buttonDelete = (new ViewAgg_Button)
                                                         .$el
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
                                          : (new ViewAgg_Button)
                                                         .$el
                                                         .text("Charge");

                        if ($buttonCharge) {
                            $buttonCharge.click(function () {
                                    collection_orig__transaction
                                                            .doXhrCharge(model_orig__transaction);
                                });
                        }


                        this.get_$thHeader().append($buttonDelete).append($buttonCharge);


                        var type                         = model_orig__transaction.get('type'),
                            view_agg__span__dateCharged  = flagExcludeCharged
                                                         ? null
                                                         : new ViewAgg_Span_Date(),
                            view_agg__span__dateCreated  = new ViewAgg_Span_Date();

                        if (view_agg__span__dateCharged) {
                            view_agg__span__dateCharged.setDate(model_orig__transaction
                                                                                 .get('charged'));
                        }
                        view_agg__span__dateCreated.setDate(model_orig__transaction
                                                                                 .get('created'));

                        this.$el.append(_td().text(type || ""))
                                .append(view_agg__span__dateCharged
                                                   ? _td().append(view_agg__span__dateCharged.$el)
                                                   : null)
                                .append(_td().append(view_agg__span__dateCreated.$el))
                                .append(_td().text(model_orig__transaction
                                                                .get('charge_description') || ""))
                                .append(_td().text(strChargeAmount || ""))
                                .append(_td().text(model_orig__transaction
                                                                .get('stripe_token_id') || ""))
                                .append(_td().text(model_orig__transaction
                                                                .get('stripe_email') || ""))
                                .append(_td().text(model_orig__transaction
                                                                .get('customer_name') || ""))
                                .append(_td().text(model_orig__transaction
                                                                .get('customer_phone') || ""))
                                .append(_td().text(model_orig__transaction
                                                                .get('shipping_address') || ""))
                                .append(flagExcludeCharged
                                        ? null
                                        : _td().append(_getAggA_Customer(
                                                                type,
                                                                model_orig__transaction
                                                                    .get('stripe_customer_id'))))
                                .append(flagExcludeCharged
                                        ? null
                                        : _td().append(_getAggA_Charge(
                                                                type,
                                                                model_orig__transaction
                                                                    .get('stripe_charge_id'))));
                    },

                markAsCharged: function() {
                        this.markAs("--- Charged ---");
                    },

                markAsDeleted: function() {
                        this.markAs("--- Deleted ---");
                    }
            });

    });


})(_plugin_RainbowPayPress__define);
