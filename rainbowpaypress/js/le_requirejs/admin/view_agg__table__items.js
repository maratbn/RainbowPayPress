/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/view_agg__table__items.js

  Description:    Widget 'ViewAgg_Table_Items'.

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
        'view_agg__table',
        'admin/collection_orig__item',
        'admin/view_agg__button',
        'admin/view_agg__tr__item'
    ], function($,
                ViewAgg_Table,
                collection_orig__item,
                ViewAgg_Button,
                ViewAgg_Tr_Item) {

        return ViewAgg_Table.extend({

                initialize: function() {

                        ViewAgg_Table.prototype.initialize.apply(this, arguments);

                        this.$el.addClass('widget_view_agg__table__items');

                        $('<tr>').append($('<th>').append((new ViewAgg_Button)
                                                              .$el
                                                              .click(
                                                                function() {
                                                                    collection_orig__item.reset();
                                                                    collection_orig__item.fetch();
                                                                })
                                                              .text("Refresh")))
                                 .append($('<th>').text("Handle:"))
                                 .append($('<th>').text("Cost:"))
                                 .append($('<th>').text("Description:"))
                                 .append($('<th>').text("Is disallowed?"))
                                 .append($('<th>').text("Disallowed reason"))
                                 .appendTo($('<thead>').appendTo(this.$el));


                        var totalRows  = 0,
                            $tbody     = $('<tbody>').appendTo(this.$el);

                        function _prependViewAgg_Tr_Item(params) {
                            var view_agg__tr__item = new ViewAgg_Tr_Item(params);

                            view_agg__tr__item.$el.prependTo($tbody);

                            totalRows++;
                            view_agg__tr__item.$el.addClass((totalRows % 2)
                                                                    ? 'item--even'
                                                                    : 'item--odd');

                            return view_agg__tr__item;
                        }


                        var mapViewAgg_Tr_Item = {};

                        this.listenTo(
                            collection_orig__item,
                            'add',
                            function(model_orig__item) {

                                var id = model_orig__item.get('id');
                                if (mapViewAgg_Tr_Item[id]) return;

                                mapViewAgg_Tr_Item[id] = _prependViewAgg_Tr_Item({
                                                                model_orig__item: model_orig__item
                                                            });
                            });

                        this.listenTo(
                            collection_orig__item,
                            'remove',
                            function(model_orig__item) {
                                var id = model_orig__item.get('id');
                                var view_agg__tr__item = mapViewAgg_Tr_Item[id];
                                if (!view_agg__tr__item) return;

                                mapViewAgg_Tr_Item[id] = null;

                                view_agg__tr__item.markAsDeleted();
                            });

                        this.listenTo(
                            collection_orig__item,
                            'reset',
                            function() {
                                for (var id in mapViewAgg_Tr_Item) {
                                    var view_agg__tr__item = mapViewAgg_Tr_Item[id];
                                    if (!view_agg__tr__item) continue;

                                    view_agg__tr__item.$el.remove();
                                    mapViewAgg_Tr_Item[id] = null;
                                }

                                $tbody.empty();
                            });
                    }
            });

    });


})(_plugin_RainbowPayPress__define);
