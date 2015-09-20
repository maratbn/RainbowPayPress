/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.0.1--development_unreleased

  Module:         js/le_requirejs/view_agg__div__transaction.js

  Description:    Widget 'ViewAgg_Div_Transaction'.

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
        'model_transaction_details',
        'view_agg__table__transaction_details'
    ], function(backbone, $, ModelTransactionDetails, ViewAgg_Table_TransactionDetails) {

        return backbone.View.extend({

                //  @param  params.ajax_url
                //  @param  params.publish_key
                //  @param  params.amount
                //  @param  params.name                 //  Name of the seller
                //  @param  params.desc                 //  Product description
                initialize: function(params) {

                        var model_transaction_details =
                            new ModelTransactionDetails({
                                        'product_description':  params.desc,
                                        'product_cost':         params.amount
                                    });

                        (new ViewAgg_Table_TransactionDetails({
                                    model_transaction_details:  model_transaction_details,
                                    ajax_url:                   params.ajax_url,
                                    publish_key:                params.publish_key,
                                    amount:                     params.amount,
                                    name:                       params.name,
                                    desc:                       params.desc
                                })).$el.appendTo(this.$el);
                    }
            });

    });


})(_plugin_Stripe_Payment_Press__define);
