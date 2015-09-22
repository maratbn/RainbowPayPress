/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.0.1--development_unreleased

  Module:         js/le_requirejs/admin/view_agg__table__transactions.js

  Description:    Widget 'ViewAgg_Table_Transactions'.

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


define(['jquery',
        'view_agg__table',
        'admin/collection_orig__transaction',
        'admin/view_agg__tr__transaction'
    ], function ($, ViewAgg_Table, collection_orig__transaction, ViewAgg_Tr_Transaction) {

        return ViewAgg_Table.extend({

                initialize: function() {

                        ViewAgg_Table.prototype.initialize.apply(this, arguments);

                        this.$el.addClass('widget_view_agg__table__transactions');

                        ($('<tr>').append($('<th>').text("Created:"))
                                  .append($('<th>').text("Product description:"))
                                  .append($('<th>').text("Amount:"))
                                  .append($('<th>').text("Stripe token:"))
                                  .append($('<th>').text("Stripe email:"))
                                  .append($('<th>').text("Customer name:"))
                                  .append($('<th>').text("Customer phone:"))).appendTo(this.$el);

                        this.listenTo(
                            collection_orig__transaction,
                            'add',
                            function(model_orig__transaction) {
                                (new ViewAgg_Tr_Transaction({
                                            model_orig__transaction: model_orig__transaction
                                        })).$el.appendTo(this.$el);
                            });
                    }
            });

    });


})(_plugin_Stripe_Payment_Press__define);
