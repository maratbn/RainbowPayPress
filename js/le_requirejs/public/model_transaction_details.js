/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.0.1--development_unreleased

  Module:         js/le_requirejs/public/model__transaction_details.js

  Description:    Model 'ModelTransactionDetails'.

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


define(['backbone'
    ], function(backbone) {

        return backbone.Model.extend({

                defaults: {
                        'charge_description':   null,
                        'product_cost':         null,
                        'stripe_token_id':      null,
                        'stripe_email':         null,
                        'customer_name':        null,
                        'customer_phone':       null
                    },

                doCheckForFieldsWithMissingValues: function() {
                        var arrFieldsWithMissingValues = [];

                        for (var field in this.defaults) {
                            var value = this.attributes[field];
                            if (!value) {
                                arrFieldsWithMissingValues.push(field);
                            }
                        }

                        this.trigger('fields_with_missing_values', {
                                        fields: arrFieldsWithMissingValues
                                     });

                        return arrFieldsWithMissingValues.length > 0 && true;
                    }
            });

    });


})(_plugin_Stripe_Payment_Press__define);
