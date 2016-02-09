/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.7.0-development_unreleased

  Module:         js/le_requirejs/admin/model_orig__config.js

  Description:    Single instance of model 'ModelOrig_Config' for storing
                  configuration parameters.

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
        'model_orig__app_common'
    ], function(backbone,
                $,
                model_orig__app_common) {

        return new (backbone.Model.extend({

                defaults: {
                        'stripe_key_live_secret':   null,
                        'stripe_key_live_publish':  null,
                        'stripe_key_test_secret':   null,
                        'stripe_key_test_publish':  null
                    },

                doXhrRefresh: function() {
                        var $xhr = $.ajax(
                            model_orig__app_common.get('ajax_url'), {
                                data: {
                                        'action': 'stripe_payment_press__admin__get_config'
                                    },
                                method: 'post'
                            }),
                            me = this;

                        $xhr.success(function(strData) {
                                var objData = JSON.parse(strData);
                                if (!objData || !objData['success']) return;

                                me.set(objData['config']);
                            });
                    },

                doXhrUpdate: function(objConfig) {
                        var $xhr = $.ajax(
                            model_orig__app_common.get('ajax_url'), {
                                data: {
                                        'action': 'stripe_payment_press__admin__update_config',
                                        'config': objConfig
                                    },
                                method: 'post'
                            }),
                            me = this;

                        $xhr.success(function(strData) {
                                var objData = JSON.parse(strData);
                                if (!objData || !objData['success']) return;

                                me.set(objData['config']);
                            });
                    }
            }));

    });


})(_plugin_StripePaymentPress__define);