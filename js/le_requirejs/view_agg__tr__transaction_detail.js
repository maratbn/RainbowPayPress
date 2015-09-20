/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.0.1--development_unreleased

  Module:         js/le_requirejs/view_agg__tr__transaction_detail.js

  Description:    Widget 'ViewAgg_Tr_TransactionDetail'.  Renders a row inside
                  'ViewAgg_Table_TransactionDetails'.

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
        'jquery'
    ], function (backbone, $) {

        return backbone.View.extend({
                tagName: 'tr',

                //  @param  params.name              The name of this detail.
                initialize: function(params) {
                        this.$el.addClass('widget_view_agg__tr__transaction_detail');

                        this.$el.append($("<td width='34%'>").text(params.name));
                    }
            });
    });


})(_plugin_Stripe_Payment_Press__define);
