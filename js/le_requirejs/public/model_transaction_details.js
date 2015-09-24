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


define(['backbone',
        'jquery',
        'model_info__app_common',
        'public/model_info__app_public',
    ], function(backbone, $, model_info__app_common, model_info__app_public) {

        return backbone.Model.extend({

                defaults: {
                        'type':                 null,
                        'charge_description':   null,
                        'charge_amount':        null,
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
                    },

                doXhrSubmit: function() {
                        var $xhr = $.post
                                      (model_info__app_common.get('ajax_url'), {
                                          action:              'stripe_payment_press__submit',
                                          type:                this.attributes['type'],
                                          charge_description:  this.attributes
                                                                           ['charge_description'],
                                          charge_amount:       this.attributes['charge_amount'],
                                          stripe_token_id:     this.attributes['stripe_token_id'],
                                          stripe_email:        this.attributes['stripe_email'],
                                          customer_name:       this.attributes['customer_name'],
                                          customer_phone:      this.attributes['customer_phone']
                                      }),
                            me = this;

                        $xhr.always(function(strData) {
                                var objData = JSON.parse(strData);

                                me.trigger('xhr__always__stripe_payment_press__submit', {
                                               success: objData && objData.success
                                           });
                            });
                    },

                getPublishKey: function() {
                        var strType = this.attributes['type'];
                        if (strType == 'live') return model_info__app_public.get('publish_key_live');
                        if (strType == 'test') return model_info__app_public.get('publish_key_test');
                        return null;
                    }
            });

    });


})(_plugin_Stripe_Payment_Press__define);
