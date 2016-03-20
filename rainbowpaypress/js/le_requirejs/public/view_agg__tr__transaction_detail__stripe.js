/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        1.1.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/view_agg__tr__transaction_detail__stripe.js

  Description:    Widget 'ViewAgg_Tr_TransactionDetail_Stripe' for Stripe-specific rows.

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


define(['public/model_info__stripe_checkout',
        'public/view_agg__tr__transaction_detail'
    ], function(model_info__stripe_checkout,
                ViewAgg_Tr_TransactionDetail) {

        return ViewAgg_Tr_TransactionDetail.extend({

                //  @param  params.model_info__transaction_details
                //  @param  params.name                 Name of the seller
                initialize: function(params) {
                        ViewAgg_Tr_TransactionDetail.prototype.initialize.apply(this, arguments);


                        var model_info__transaction_details = params
                                                                 .model_info__transaction_details;


                        this.on('click_modify', function() {
                                model_info__stripe_checkout.doStripeCheckout(
                                                                model_info__transaction_details,
                                                                params.name);
                            }, this);
                    }

            });

    });

})(_plugin_RainbowPayPress__define);