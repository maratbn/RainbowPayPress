/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        2.2.0-development_unreleased

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
        'admin/view_agg__tr__w_header'
    ], function($,
                util,
                collection_orig__transaction,
                ViewAgg_Button,
                ViewAgg_Tr_WHeader) {

        function _flipToSingleCol() {
            var totalCols = this.$el.children().length;

            this.$el.empty();

            return _td().attr({'colspan':  totalCols,
                               'style':    'text-align:center'})
                        .appendTo(this.$el);
        }

        function _getDigits(num, len) {
            var str = "" + num;
            while (str.length < len) {
                str = '0' + str;
            }
            return str;
        }

        function _getDateComponents(date) {
            if (!date) return null;

            return {
                    year:   date.getFullYear(),
                    month:  _getDigits(date.getMonth() + 1, 2),
                    day:    _getDigits(date.getDate(), 2),
                    hour:   _getDigits(date.getHours(), 2),
                    min:    _getDigits(date.getMinutes(), 2),
                    sec:    _getDigits(date.getSeconds(), 2),
                    msec:   _getDigits(date.getMilliseconds(), 3)
                };
        }

        function _getDateReprTZName(date) {
            var arrMatchTZ = date && date.toString().match(/\([^)]+\)/g);
            return arrMatchTZ && arrMatchTZ.length == 1 && arrMatchTZ[0] || "";
        }

        function _getDateRepr(date) {
            if (!date) return null;

            function _getWeekday() {
                return (['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])[date.getDay()];
            }

            var date_components  = _getDateComponents(date),
                strDateRepr      = "";

            strDateRepr += _getWeekday();
            strDateRepr += ' ';

            strDateRepr += date_components.year;
            strDateRepr += '-';
            strDateRepr += date_components.month;
            strDateRepr += '-';
            strDateRepr += date_components.day;
            strDateRepr += '  ';
            strDateRepr += date_components.hour;
            strDateRepr += ':';
            strDateRepr += date_components.min;
            strDateRepr += ':';
            strDateRepr += date_components.sec;

            strDateRepr += '  ';
            strDateRepr += _getDateReprTZName(date);

            return strDateRepr;
        }

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


                        var type = model_orig__transaction.get('type');

                        this.$el.append(_td().text(type || ""))
                                .append(flagExcludeCharged
                                        ? null
                                        : _td().text(_getDateRepr(
                                                            model_orig__transaction
                                                                          .get('charged')) || ""))
                                .append(_td().text(_getDateRepr(
                                                            model_orig__transaction
                                                                          .get('created')) || ""))
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
                        _flipToSingleCol.call(this).text("--- Charged ---");
                    },

                markAsDeleted: function() {
                        _flipToSingleCol.call(this).text("--- Deleted ---");
                    }
            });

    });


})(_plugin_RainbowPayPress__define);
