/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/collection_orig__item.js

  Description:    Single instance of collection 'CollectionOrig_Item'
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
        'util',
        'model_orig__app_common',
        'admin/model_orig__item'
    ], function (backbone, $, util, model_orig__app_common, ModelOrig_Item) {

        return new (backbone.Collection.extend({

                model: ModelOrig_Item,


                doXhrDelete: function(model_orig__item) {
                        if (!model_orig__item) return;

                        var $xhr = $.ajax(model_orig__app_common.get('ajax_url'), {
                                              data: {
                                                      'action':  'rainbow_pay_press__admin__delete_item',
                                                      'id':      model_orig__item.get('id')
                                                  },
                                              method: 'post'
                                          }),
                            me = this;

                        $xhr.success(function(strData) {
                                var objData = JSON.parse(strData);
                                if (!objData || !objData.success) return;

                                me.remove(model_orig__item);
                            });
                    },

                parse: function(response, options) {
                        if (!response.success) return null;

                        return response.items;
                    },

                url: function() {
                        return model_orig__app_common.get('ajax_url') +
                                                    '?action=rainbow_pay_press__admin__get_items';
                    }
            }));
    });


})(_plugin_RainbowPayPress__define);
