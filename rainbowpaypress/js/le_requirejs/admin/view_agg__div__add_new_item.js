/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        2.4.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/view_agg__div__add_new_item.js

  Description:    Widget 'ViewAgg_Div_AddNewItem'.

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
        'admin/model_info__item_details',
        'admin/view_agg__table__item_details'
    ], function(backbone,
                $,
                ModelInfo_ItemDetails,
                ViewAgg_Table_ItemDetails) {

        return backbone.View.extend({

                initialize: function() {

                        function _doAddItemCycle() {

                            var model_info__item_details = new ModelInfo_ItemDetails();

                            (new ViewAgg_Table_ItemDetails({
                                        model_info__item_details: model_info__item_details
                                    })).$el.appendTo(this.$el);

                            this.listenTo(
                                model_info__item_details,
                                'xhr__always__rainbow_pay_press__add_item',
                                function(event) {
                                    if (event.success) {
                                        var me = this;

                                        var $buttonAnotherItem =
                                               $('<button>').addClass('button button-secondary')
                                                            .text("Add another item...")
                                                            .click(function() {
                                                                     $buttonAnotherItem.remove();
                                                                     _doAddItemCycle.call(me);
                                                                   });
                                        this.$el.text("New item has been added successfully.")
                                                .append('<br>')
                                                .append($buttonAnotherItem);
                                    }
                                });
                        }

                        _doAddItemCycle.call(this);
                    }
            });

    });


})(_plugin_RainbowPayPress__define);
