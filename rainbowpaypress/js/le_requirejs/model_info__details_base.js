/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/public/model_info__details_base.js

  Description:    Model 'ModelInfo_Details_Base'.

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


define(['backbone'], function(backbone) {

        return backbone.Model.extend({

                doCheckForFieldsWithMissingValues: function(arrFieldsRequired) {
                        var arrFieldsWithMissingValues = [];

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
                    }
            });

    });


})(_plugin_RainbowPayPress__define);
