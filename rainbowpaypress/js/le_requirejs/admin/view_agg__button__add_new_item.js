/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/public/view_agg__button__add_new_item.js

  Description:    Widget 'ViewAgg_Button_AddNewItem'.

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
        'admin/view_agg__div__add_new_item'
    ], function(backbone,
                ViewAgg_Div_AddNewItem) {

        return backbone.View.extend({
                tagName: 'button',

                initialize: function() {

                        var me                                 = this,
                            view_agg__div__add_new_itemCached  = null;

                        this.$el.addClass('button button-secondary widget_view_agg__button__add_new_item')
                                .text("Add new item...")
                                .on('click',
                                    function(e) {
                                            e.preventDefault();

                                            if (view_agg__div__add_new_itemCached) {
                                                if (view_agg__div__add_new_itemCached
                                                                    .$el
                                                                    .css('display') == 'none') {
                                                    view_agg__div__add_new_itemCached
                                                                    .$el
                                                                    .css('display', "");
                                                } else {
                                                    view_agg__div__add_new_itemCached
                                                                    .$el
                                                                    .css('display', 'none');
                                                }
                                            } else {
                                                (view_agg__div__add_new_itemCached =
                                                            new ViewAgg_Div_AddNewItem({
                                                                    })).$el.appendTo(me.$el
                                                                                       .parent());
                                            }
                                        });
                    }
            });

    });


})(_plugin_RainbowPayPress__define);
