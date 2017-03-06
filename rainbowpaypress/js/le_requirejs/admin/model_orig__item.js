/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/model_orig__item.js

  Description:    Model 'ModelOrig_Item' for caching single item
                  information from the server.

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
        'model_orig__app_common'
    ], function (backbone, $, model_orig__app_common) {

        return backbone.Model.extend({

                defaults: {
                        'id':                   null,
                        'handle':               null,
                        'description':          null,
                        'cost':                 null,
                        'is_disallowed':        null,
                        'disallowed_reason':    null
                    },

                doXhrUpdate: function(objDataUpdate) {
                        var $xhr = $.ajax(model_orig__app_common.get('ajax_url'), {
                                  data: {
                                      'action':   'rainbow_pay_press__admin__modify_item',
                                      'id':       this.get('id'),
                                      'data':     window.encodeURIComponent(
                                                             window.JSON.stringify(objDataUpdate))
                                    },
                                  method: 'post'
                              }),
                            me = this;

                        $xhr.success(function(strData) {
                                var objData = JSON.parse(strData);
                                if (!objData || !objData['success']) {

                                    var arrErrors = objData['errors'];
                                    if (arrErrors.indexOf('error__duplicate_handle') >= 0) {
                                        window
                                          .alert(
                                            "Item was not updated because there already exists another item with the desired handle \""
                                                + objDataUpdate['handle']
                                                + "\".  Only unique item handles allowed.");
                                        return;
                                    }

                                    window
                                        .alert(
                                            "Item was not updated due to a server-side error.");
                                    return;
                                }

                                me.set(objData['item']);
                            });
                    }
            });

    });


})(_plugin_RainbowPayPress__define);
