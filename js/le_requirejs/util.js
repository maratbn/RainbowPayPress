/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.3.0-development_unreleased

  Module:         js/le_requirejs/util.js

  Description:    Client-side JavaScript utility logic.

  This file is part of StripePaymentPress.

  Licensed under the GNU General Public License Version 3.

  StripePaymentPress is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  StripePaymentPress is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with StripePaymentPress.  If not, see <http://www.gnu.org/licenses/>.
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

            var strCents = "" + amount % 100;
            if (strCents.length == 1) strCents = '0' + strCents;

            return '$' + _formatDollars(Math.floor(amount / 100)) + '.' + strCents;
        }

        return {
                formatCurrency: _formatCurrency
            };
    });


})(_plugin_StripePaymentPress__define);
