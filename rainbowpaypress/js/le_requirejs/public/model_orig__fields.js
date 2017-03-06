/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/public/model_orig__fields.js

  Description:    Model 'ModelOrig_Fields'.

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
            'underscore'
        ], function(backbone,
                    _) {

            return backbone.Model.extend({

                    defaults: {
                            'flag_query_phone':    true,
                            'flag_query_shipping': false
                        },

                    initialize: function() {

                            var arrFieldsRequired = ['stripe_token_id',
                                                     'stripe_email',
                                                     'customer_name',
                                                     'customer_phone'];

                            this.getFieldsRequired = function() {
                                    return arrFieldsRequired;
                                };


                            function _excludeField(strField) {
                                arrFieldsRequired = _.difference(arrFieldsRequired, [strField]);
                            }

                            function _includeField(strField) {
                                arrFieldsRequired = _.union(arrFieldsRequired, [strField]);
                            }

                            this.on('change:flag_query_phone change:flag_query_shipping', function() {
                                    if (this.get('flag_query_phone')) {
                                        _includeField('customer_phone');
                                    } else {
                                        _excludeField('customer_phone');
                                    }

                                    if (this.get('flag_query_shipping')) {
                                        _includeField('shipping_address');
                                    } else {
                                        _excludeField('shipping_address');
                                    }
                                }, this);
                        },

                    parse: function(strFields) {
                            if (!strFields) return;

                            var arrFields = strFields.split(/\s/g);
                            if (!arrFields) return;

                            for (var i = 0; i < arrFields.length; i++) {
                                var strField = arrFields[i];
                                if (!strField) continue;

                                strField = strField.toLowerCase();

                                switch (strField) {
                                    case '!phone':
                                        this.set('flag_query_phone', false);
                                        break;
                                    case 'shipping':
                                        this.set('flag_query_shipping', true);
                                        break;
                                }
                            }
                        }
                });

        });


})(_plugin_RainbowPayPress__define);
