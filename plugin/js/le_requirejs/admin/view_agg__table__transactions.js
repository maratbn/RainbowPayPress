/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.7.0-development_unreleased

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
        'admin/view_agg__button',
        'admin/view_agg__tr__transaction'
    ], function($,
                ViewAgg_Table,
                collection_orig__transaction,
                ViewAgg_Button,
                ViewAgg_Tr_Transaction) {

        return ViewAgg_Table.extend({

                //  @param  params.flag_exclude_charged
                //  @param  params.flag_exclude_uncharged
                initialize: function(params) {

                        var flagExcludeCharged    = params && params.flag_exclude_charged,
                            flagExcludeUncharged  = params && params.flag_exclude_uncharged;

                        ViewAgg_Table.prototype.initialize.apply(this, arguments);

                        this.$el.addClass('widget_view_agg__table__transactions');

                        ($('<tr>').append($('<th>').append((new ViewAgg_Button)
                                                              .$el
                                                              .click(
                                                                function() {
                                                                  collection_orig__transaction
                                                                                         .fetch();
                                                                })
                                                              .text("Refresh")))
                                  .append($('<th>').text("Type:"))
                                  .append($('<th>').text("Created:"))
                                  .append(flagExcludeCharged ? null : $('<th>').text("Charged:"))
                                  .append($('<th>').text("Product description:"))
                                  .append($('<th>').text("Amount:"))
                                  .append($('<th>').text("Stripe token:"))
                                  .append($('<th>').text("Stripe email:"))
                                  .append($('<th>').text("Customer name:"))
                                  .append($('<th>').text("Customer phone:"))).appendTo(this.$el)
                                  .append(flagExcludeCharged ? null : $('<th>').text("Customer ID:"))
                                  .append(flagExcludeCharged ? null : $('<th>').text("Charge ID:"));

                        var mapViewAgg_Tr_Transaction = {};

                        this.listenTo(
                            collection_orig__transaction,
                            'add',
                            function(model_orig__transaction) {

                                var charged = model_orig__transaction.get('charged');
                                if (charged && flagExcludeCharged ||
                                   !charged && flagExcludeUncharged) return;

                                var id = model_orig__transaction.get('id');
                                if (mapViewAgg_Tr_Transaction[id]) return;

                                (mapViewAgg_Tr_Transaction[id] =
                                    new ViewAgg_Tr_Transaction({
                                                flag_exclude_charged:     flagExcludeCharged,
                                                model_orig__transaction:  model_orig__transaction
                                            })).$el.appendTo(this.$el);
                            });

                        this.listenTo(
                            collection_orig__transaction,
                            'remove',
                            function(model_orig__transaction) {
                                var id = model_orig__transaction.get('id');
                                var view_agg__tr__transaction = mapViewAgg_Tr_Transaction[id];
                                if (!view_agg__tr__transaction) return;

                                mapViewAgg_Tr_Transaction[id] = null;
                                view_agg__tr__transaction.$el.remove();
                            });

                        this.listenTo(
                            collection_orig__transaction,
                            'change:charged',
                            function(model_orig__transaction) {

                                if (!flagExcludeCharged && !flagExcludeUncharged) return;

                                var charged  = model_orig__transaction.get('charged'),
                                    id       = model_orig__transaction.get('id');

                                var view_agg__tr__transaction = mapViewAgg_Tr_Transaction[id];

                                //  This logic checks if the table has the 'ViewAgg_Tr_Transaction'
                                //  associated with this id but if it has to be excluded now:
                                if (view_agg__tr__transaction &&
                                    ((charged && flagExcludeCharged) ||
                                    (!charged && flagExcludeUncharged))) {
                                        view_agg__tr__transaction.$el.remove();
                                        return;
                                }

                                //  This table already has the 'ViewAgg_Tr_Transaction' associated
                                //  with this id.
                                if (view_agg__tr__transaction) return;

                                //  This table does not already have it but needs to have it.
                                (mapViewAgg_Tr_Transaction[id] =
                                    new ViewAgg_Tr_Transaction({
                                                flag_exclude_charged:     flagExcludeCharged,
                                                model_orig__transaction:  model_orig__transaction
                                            })).$el.appendTo(this.$el);
                            });
                    }
            });

    });


})(_plugin_StripePaymentPress__define);
