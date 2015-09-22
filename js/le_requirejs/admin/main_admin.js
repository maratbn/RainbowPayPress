/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.0.1--development_unreleased

  Module:         js/le_requirejs/admin/main_admin.js

  Description:    Main JavaScript file for the internal admin pages for the
                  WordPress plugin 'StripePaymentPress'.

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


(function(define, require) {


define(['jquery',
        'backbone',
        'admin/view_agg__table__transactions'
    ], function($,
                backbone,
                ViewAgg_Table_Transactions) {

        function _processSpansWithRoles(params) {
            var $elSpans = $("span[data-plugin-stripe-payment-press-role=transactions]");

            for (var i = 0; i < $elSpans.length; i++) {
                var $elSpan = $($elSpans[i]);

                (new ViewAgg_Table_Transactions).$el.appendTo($elSpan);
            }
        }

        function StripePaymentPressAdminClient() {

            //  @param  params.ajax_url
            this.start = function(params) {

                $(document).ready(function() {

                        _processSpansWithRoles(params);

                    });
            };
        }

        var client = new StripePaymentPressAdminClient();
        return client;
    });


})(_plugin_Stripe_Payment_Press__define, _plugin_Stripe_Payment_Press__require);
