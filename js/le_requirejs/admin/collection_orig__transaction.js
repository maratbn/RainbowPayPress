/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.0.1--development_unreleased

  Module:         js/le_requirejs/admin/collection_orig__transaction.js

  Description:    Single instance of collection 'CollectionOrig_Transaction'
                  to be shared across the app.

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
        'admin/model_orig__transaction'
    ], function (backbone, $, model_info__app_common, ModelOrig_Transaction) {

        return new (backbone.Collection.extend({

                model: ModelOrig_Transaction,

                doXhrDelete: function(model_orig__transaction) {
                        if (!model_orig__transaction) return;

                        var $xhr = $.ajax(model_info__app_common.get('ajax_url'), {
                                              data: {
                                                      'action':  'stripe_payment_press__delete',
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
                        return model_info__app_common.get('ajax_url') +
                                                 '?action=stripe_payment_press__get_transactions';
                    }
            }));

    });


})(_plugin_Stripe_Payment_Press__define);
