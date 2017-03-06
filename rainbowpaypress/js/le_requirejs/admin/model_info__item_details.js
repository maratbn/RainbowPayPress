/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/model_info__item_details.js

  Description:    Model 'ModelInfo_ItemDetails'.

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


define(['jquery',
        'model_info__details_base',
        'model_orig__app_common'
    ], function($, ModelInfo_DetailsBase, model_orig__app_common) {

        return ModelInfo_DetailsBase.extend({

                defaults: {
                        'handle':               null,
                        'cost':                 null,
                        'description':          null
                    },

                doXhrAddItem: function() {
                        var dataAdd = {'handle':        this.attributes['handle'],
                                       'cost':          this.attributes['cost'],
                                       'description':   this.attributes['description']};

                        var $xhr = $.post
                                      (model_orig__app_common.get('ajax_url'), {
                                          'action':       'rainbow_pay_press__admin__add_item',
                                          'data':         window.encodeURIComponent(
                                                                   window.JSON.stringify(dataAdd))
                                      }),
                            me = this;

                        $xhr.always(function(strData) {
                                var objData = JSON.parse(strData);

                                me.trigger('xhr__always__rainbow_pay_press__add_item', {
                                                data_response:  objData,
                                                item_submit:    dataAdd
                                           });
                            });
                    }
            });

    });


})(_plugin_RainbowPayPress__define);
