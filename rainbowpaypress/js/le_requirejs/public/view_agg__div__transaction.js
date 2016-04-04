/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        2.3.0-development_unreleased_candidate

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
        'public/model_info__stripe_checkout',
        'public/model_info__transaction_details',
        'public/model_orig__fields',
        'public/view_agg__table__transaction_details'
    ], function(backbone,
                $,
                model_info__stripe_checkout,
                ModelInfo_TransactionDetails,
                ModelOrig_Fields,
                ViewAgg_Table_TransactionDetails) {

        return backbone.View.extend({

                //  @param  params.type                 Transaction type -- 'test' or 'live'.
                //  @param  params.amount
                //  @param  params.fields               Included and excluded fields.
                //                                                 (excluded fields preceded by !)
                //  @param  params.name                 Name of the seller
                //  @param  params.desc                 Product description
                //  @param  params.info                 Miscellaneous additional information
                initialize: function(params) {

                        var model_orig__fields = new ModelOrig_Fields();

                        if (params && params.fields) {
                            model_orig__fields.parse(params.fields);
                        }


                        function _doTransactionCycle() {

                            model_info__stripe_checkout.doStripeLoad();

                            var model_info__transaction_details =
                                new ModelInfo_TransactionDetails({
                                            'type':                 params.type,
                                            'charge_description':   params.desc,
                                            'charge_amount':        params.amount
                                        });

                            (new ViewAgg_Table_TransactionDetails({
                                        model_info__transaction_details:
                                                                  model_info__transaction_details,
                                        model_orig__fields:       model_orig__fields,
                                        name:                     params.name,
                                        info:                     params.info
                                    })).$el.appendTo(this.$el);


                            this.listenTo(
                                model_info__transaction_details,
                                'xhr__always__rainbow_pay_press__submit',
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
                                                .append('<br>')
                                                .append($buttonAnotherTransaction);
                                    }
                                });
                        }

                        _doTransactionCycle.call(this);
                    }
            });

    });


})(_plugin_RainbowPayPress__define);
