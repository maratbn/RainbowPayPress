/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        2.4.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/public/model_info__transaction_details.js

  Description:    Model 'ModelInfo_TransactionDetails'.

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
        'model_orig__app_common',
        'public/model_orig__app_public',
    ], function(backbone,
                $,
                model_orig__app_common,
                model_orig__app_public) {

        return backbone.Model.extend({

                defaults: {
                        'type':                 null,
                        'charge_description':   null,
                        'charge_amount':        null,
                        'stripe_token_id':      null,
                        'stripe_email':         null,
                        'customer_name':        null,
                        'customer_phone':       null,
                        'shipping_address':     null
                    },

                doCheckForFieldsWithMissingValues: function(model_orig__fields) {
                        var arrFieldsRequired = model_orig__fields.getFieldsRequired();
                            arrFieldsWithMissingValues = [];

                        for (var i = 0; i < arrFieldsRequired.length; i++) {
                            var field = arrFieldsRequired[i];
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
                                      (model_orig__app_common.get('ajax_url'), {
                                          action:              'rainbow_pay_press__submit',
                                          type:                this.attributes['type'],
                                          charge_description:  this.attributes
                                                                           ['charge_description'],
                                          charge_amount:       this.attributes['charge_amount'],
                                          stripe_token_id:     this.attributes['stripe_token_id'],
                                          stripe_email:        this.attributes['stripe_email'],
                                          customer_name:       this.attributes['customer_name'],
                                          customer_phone:      this.attributes['customer_phone'],
                                          shipping_address:    this.attributes['shipping_address']
                                      }),
                            me = this;

                        $xhr.always(function(strData) {
                                var objData = JSON.parse(strData);

                                me.trigger('xhr__always__rainbow_pay_press__submit', {
                                               success: objData && objData.success
                                           });
                            });
                    },

                getPublishKey: function() {
                        var strType = this.attributes['type'];
                        if (strType == 'live') return model_orig__app_public.get('publish_key_live');
                        if (strType == 'test') return model_orig__app_public.get('publish_key_test');
                        return null;
                    }
            });

    });


})(_plugin_RainbowPayPress__define);
