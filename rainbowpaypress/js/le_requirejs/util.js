/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        3.2.0-development_unreleased

  Module:         rainbowpaypress/js/le_requirejs/util.js

  Description:    Client-side JavaScript utility logic.

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


define([], function() {

        function _formatCurrency(amount) {

            function _formatDollars(dollars) {
                var strDollars = "" + dollars;
                if (strDollars.length <= 3) return strDollars;

                return _formatDollars(Math.floor(dollars / 1000)) + ',' +
                                                         strDollars.substr(strDollars.length - 3);
            }

            var amountAbs = window.Math.abs(amount);

            var strCents = "" + amountAbs % 100;
            if (strCents.length == 1) strCents = '0' + strCents;

            return (amount < 0 ? '-' : "") + '$'
                                           + _formatDollars(Math.floor(amountAbs / 100))
                                           + '.' + strCents;
        }

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

        //  This will parse a date string in the format "2016-04-03 05:10:41" that is assumed to
        //  be in UTC time.
        function _parseDate(strDate) {
            if (!strDate) return null;

            var arrParts = strDate.split(' ');
            return new Date(arrParts[0] + 'T' + arrParts[1] + 'Z');
        }

        return {
                formatCurrency:  _formatCurrency,
                getDateStrings:  _getDateStrings,
                parseDate:       _parseDate,


                getDateRepr: function(date) {

                        var date_strings = _getDateStrings(date);
                        if (!date_strings) return null;

                        return date_strings.weekday + ' ' + date_strings.date
                                                    + ' ' + date_strings.time
                                                    + ' ' + date_strings.tz;
                    }
            };
    });


})(_plugin_RainbowPayPress__define);
