/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/view_agg__table__item_details.js

  Description:    Widget 'ViewAgg_Table_ItemDetails'.

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
        'util',
        'view_agg__table',
        'view_agg__tr__detail_base'
    ], function($, util, ViewAgg_Table, ViewAgg_Tr_DetailBase) {

        return ViewAgg_Table.extend({

                //  @param  params.model_info__item_details
                initialize: function(params) {

                        ViewAgg_Table.prototype.initialize.apply(this, arguments);

                        this.$el.addClass('widget_view_agg__table__item_details');


                        var model_info__item_details = params.model_info__item_details;


                        (new ViewAgg_Tr_DetailBase({
                                    model_info__details_base:   model_info__item_details,
                                    field:                      'description',
                                    name:                       "Item description:",
                                    text_enter:                 "Enter description...",
                                    text_modify:                "Modify..."
                                })).$el.appendTo(this.$el);

                        (new ViewAgg_Tr_DetailBase({
                                    model_info__details_base:   model_info__item_details,
                                    field:                      'handle',
                                    name:                       "Item handle:",
                                    text_enter:                 "Enter handle...",
                                    text_modify:                "Modify..."
                                })).$el.appendTo(this.$el);

                        (new ViewAgg_Tr_DetailBase({
                                    callback_format_value: function(value) {
                                            return util.formatCurrency(value);
                                        },

                                    model_info__details_base:   model_info__item_details,
                                    field:                      'cost',
                                    name:                       "Item cost:",
                                    text_enter:                 "Enter cost...",
                                    text_modify:                "Modify..."
                                })).$el.appendTo(this.$el);


                        var $buttonAdd = $('<button>').addClass('button button-secondary')
                                                      .text("Add");

                        $('<tr>').append($('<td>').attr('colspan', '2').append($buttonAdd))
                                 .appendTo(this.$el);


                        this.listenTo(model_info__item_details, 'do_prompt', function(event) {
                                var field = event.field;

                                if (field == 'handle') {
                                    var strHandle =
                                            window.prompt(
                                                      "Enter item handle (to refer to it by in shortcodes, not visible to users):",
                                                      model_info__item_details
                                                                            .get('handle') || "");
                                    if (strHandle == null) return;

                                    model_info__item_details.set('handle', strHandle);
                                } else if (field == 'cost') {
                                    var strCost =
                                            window.prompt(
                                                      "Enter item cost in US cents (digits only):",
                                                      model_info__item_details.get('cost') || "");
                                    if (strCost == null) return;

                                    model_info__item_details.set('cost', window.parseInt(strCost));
                                } else if (field == 'description') {
                                    var strDescription =
                                            window.prompt(
                                                      "Enter item description (visible to users):",
                                                      model_info__item_details
                                                                       .get('description') || "");
                                    if (strDescription == null) return;

                                    model_info__item_details.set('description', strDescription);
                                }
                            });


                        var me = this;

                        $buttonAdd.click(function(event) {
                                event.preventDefault();

                                if (model_info__item_details
                                                       .doCheckForFieldsWithMissingValues([
                                                                                'handle',
                                                                                'cost',
                                                                                'description'])) {
                                    window
                                        .alert(
                                            "Please specify the required information by clicking on the links in red.");
                                    return;
                                }

                                if (!window.confirm("Add this item?")) return;

                                model_info__item_details.doXhrAddItem();
                            });
                    }
            });

    });


})(_plugin_RainbowPayPress__define);
