/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        2.0.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/public/view_agg__div__transaction.js

  Description:    Widget 'ViewAgg_Div_Transaction'.

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


define(['backbone',
        'jquery',
        'public/model_info__transaction_details',
        'public/view_agg__table__transaction_details'
    ], function(backbone,
                $,
                ModelInfo_TransactionDetails,
                ViewAgg_Table_TransactionDetails) {

        return backbone.View.extend({

                //  @param  params.type                 Transaction type -- 'test' or 'live'.
                //  @param  params.amount
                //  @param  params.name                 Name of the seller
                //  @param  params.desc                 Product description
                //  @param  params.info                 Miscellaneous additional information
                initialize: function(params) {

                        function _doTransactionCycle() {
                            var model_info__transaction_details =
                                new ModelInfo_TransactionDetails({
                                            'type':                 params.type,
                                            'charge_description':   params.desc,
                                            'charge_amount':        params.amount
                                        });

                            (new ViewAgg_Table_TransactionDetails({
                                        model_info__transaction_details:
                                                                  model_info__transaction_details,
                                        name:                     params.name,
                                        info:                     params.info
                                    })).$el.appendTo(this.$el);


                            this.listenTo(
                                model_info__transaction_details,
                                'xhr__always__stripe_payment_press__submit',
                                function(event) {
                                    if (event.success) {
                                        var me = this;

                                        var $buttonAnotherTransaction =
                                               $('<button>').text("Start another transaction")
                                                            .click(function() {
                                                                     $buttonAnotherTransaction
                                                                                        .remove();
                                                                     _doTransactionCycle.call(me);
                                                                   });
                                        this.$el.text(
                                            "Your transaction has been submitted successfully.  Your confirmation code is: "
                                              + model_info__transaction_details.get('stripe_token_id'))
                                                .append($buttonAnotherTransaction);
                                    }
                                });
                        }

                        _doTransactionCycle.call(this);
                    }
            });

    });


})(_plugin_RainbowPayPress__define);
