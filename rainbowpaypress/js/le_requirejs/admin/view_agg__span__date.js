/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        2.3.0-development_unreleased

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


define(['backbone', 'jquery'], function(backbone, $) {


        function _getDigits(num, len) {
            var str = "" + num;
            while (str.length < len) {
                str = '0' + str;
            }
            return str;
        }

        function _getDateComponents(date) {
            if (!date) return null;

            return {
                    year:   date.getFullYear(),
                    month:  _getDigits(date.getMonth() + 1, 2),
                    day:    _getDigits(date.getDate(), 2),
                    hour:   _getDigits(date.getHours(), 2),
                    min:    _getDigits(date.getMinutes(), 2),
                    sec:    _getDigits(date.getSeconds(), 2),
                    msec:   _getDigits(date.getMilliseconds(), 3)
                };
        }

        function _getDateReprTZName(date) {
            var arrMatchTZ = date && date.toString().match(/\([^)]+\)/g);
            return arrMatchTZ && arrMatchTZ.length == 1 && arrMatchTZ[0] || "";
        }

        function _getDateStrings(date) {

            var date_components = _getDateComponents(date);
            if (!date_components) return null;

            function _getWeekday() {
                return (['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])[date.getDay()];
            }

            return {
                    'weekday':  _getWeekday(),
                    'date':     date_components.year + '-' + date_components.month
                                                     + '-' + date_components.day,
                    'time':     date_components.hour + ':' + date_components.min
                                                     + ':' + date_components.sec,
                    'tz':       _getDateReprTZName(date)
                };
        }

        function _getDateRepr(date) {

            var date_strings = _getDateStrings(date);
            if (!date_strings) return null;

            return date_strings.weekday + ' ' + date_strings.date
                                       + '  ' + date_strings.time
                                       + '  ' + date_strings.tz;
        }


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

                        var date_strings = _getDateStrings(date);
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
