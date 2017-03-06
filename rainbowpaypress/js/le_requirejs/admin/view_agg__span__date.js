/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/admin/view_agg__span__date.js

  Description:    Widget 'ViewAgg_Span_Date' for rendering 'Date's inside transaction tables.

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


define(['backbone', 'jquery', 'util'], function(backbone, $, util) {

        return backbone.View.extend({
                tagName: 'span',

                setDate: function(date) {
                        var $spanWeekday  = $('<span>').attr('style', 'white-space:nowrap')
                                                       .appendTo(this.$el)
                                                       .after(' '),
                            $spanDate     = $('<span>').attr('style', 'white-space:nowrap')
                                                       .appendTo(this.$el)
                                                       .after(' '),
                            $spanTime     = $('<span>').attr('style', 'white-space:nowrap')
                                                       .appendTo(this.$el)
                                                       .after(' '),
                            $spanTZ       = $('<span>').attr('style', 'white-space:nowrap')
                                                       .appendTo(this.$el);

                        var date_strings = util.getDateStrings(date);
                        if (!date_strings) {
                            $spanWeekday.text("");
                            $spanDate.text("");
                            $spanTime.text("");
                            $spanTZ.text("");
                            return;
                        }

                        $spanWeekday.text(date_strings.weekday);
                        $spanDate.text(date_strings.date);
                        $spanTime.text(date_strings.time);
                        $spanTZ.text(date_strings.tz);
                    }
            });
    });


})(_plugin_RainbowPayPress__define);
