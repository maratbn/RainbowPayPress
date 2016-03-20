/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        2.1.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/collection_orig__transaction.js

  Description:    Single instance of collection 'CollectionOrig_Transaction'
                  to be shared across the app.

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
        'admin/model_orig__transaction'
    ], function (backbone, $, model_orig__app_common, ModelOrig_Transaction) {

        return new (backbone.Collection.extend({

                model: ModelOrig_Transaction,

                doXhrCharge: function(model_orig__transaction) {
                        if (!model_orig__transaction) return;

                        var $xhr = $.ajax(model_orig__app_common.get('ajax_url'), {
                                              data: {
                                                      'action':  'stripe_payment_press__admin__charge',
                                                      'id':      model_orig__transaction.get('id')
                                                  },
                                              method: 'post'
                                          });

                        $xhr.success(function(strData) {
                                var objData = JSON.parse(strData);
                                if (!objData || !objData.success) {
                                    if (objData.errors &&
                                        objData.errors.indexOf('error__no_curl') >= 0) {
                                        window.alert("Unable to charge transactions because your PHP environment lacks cURL support, without which it cannot communicate with the Stripe servers.  Please enable PHP cURL support on your server.  If your server is running Debian or Ubuntu, this can be done by installing the package 'php5-curl'.");
                                    }
                                    return;
                                }

                                model_orig__transaction.set({
                                        'charged':             objData.charged,
                                        'stripe_customer_id':  objData.stripe_customer_id,
                                        'stripe_charge_id':    objData.stripe_charge_id
                                    });
                            });
                    },

                doXhrDelete: function(model_orig__transaction) {
                        if (!model_orig__transaction) return;

                        var $xhr = $.ajax(model_orig__app_common.get('ajax_url'), {
                                              data: {
                                                      'action':  'stripe_payment_press__admin__delete',
                                                      'id':      model_orig__transaction.get('id')
                                                  },
                                              method: 'post'
                                          }),
                            me = this;

                        $xhr.success(function(strData) {
                                var objData = JSON.parse(strData);
                                if (!objData || !objData.success) return;

                                me.remove(model_orig__transaction);
                            });
                    },

                parse: function(response, options) {
                        if (!response.success) return null;

                        return response.transactions;
                    },

                url: function() {
                        return model_orig__app_common.get('ajax_url') +
                                                 '?action=stripe_payment_press__admin__get_transactions';
                    }
            }));

    });


})(_plugin_RainbowPayPress__define);
