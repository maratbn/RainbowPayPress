/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/view_agg__tr__config__option__string.js

  Description:    Widget 'ViewAgg_Tr_Config_Option_String' for displaying
                  string config options.

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


define(['admin/view_agg__tr__config__option',
        'jquery',
        'admin/model_orig__config',
        'admin/view_agg__button'
    ], function(ViewAgg_Tr_Config_Option,
                $,
                model_orig__config,
                ViewAgg_Button) {


        //  Widget 'ViewAgg_Tr_Config_Option_String':


        return ViewAgg_Tr_Config_Option.extend({

                //  @param  params.field                The field in 'ModelOrig_Config' this widget
                //                                      is associated with.
                //
                //  @param  params.label                The label to render for the option.
                //
                //  @param  params.prompt               The prompt for the 'Change' button.
                //
                initialize: function(params) {

                        ViewAgg_Tr_Config_Option.prototype.initialize.apply(this, arguments);

                        if (params &&
                            params.field &&
                            params.prompt) {

                            (new ViewAgg_Button)
                                .$el
                                .text("Change...")
                                .click(function() {
                                        var strValNew = window.prompt(params.prompt,
                                                                      model_orig__config
                                                                                .get(params.field)
                                                                      || "");
                                        if (strValNew == null) return;

                                        var objConfig = {};
                                        objConfig[params.field] = strValNew;

                                        model_orig__config.doXhrUpdate(objConfig);
                                    }).appendTo(this.get_$thButton());
                        }
                    }
            });
    });


})(_plugin_RainbowPayPress__define);
