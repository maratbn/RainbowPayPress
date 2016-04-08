/*
  RainbowPayPress -- WordPress plugin for accepting credit card payments via
                     Stripe by embedding Stripe checkouts via shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        2.4.0-development_unreleased

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

        //  This will parse a date string in the format "2016-04-03 05:10:41" that is assumed to
        //  be in UTC time.
        function _parseDate(strDate) {
            if (!strDate) return null;

            var arrParts = strDate.split(' ');
            return new Date(arrParts[0] + 'T' + arrParts[1] + 'Z');
        }

        return {
                formatCurrency:  _formatCurrency,
                parseDate:       _parseDate
            };
    });


})(_plugin_RainbowPayPress__define);
