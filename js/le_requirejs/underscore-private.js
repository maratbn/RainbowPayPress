/*
  Stripe-Payment-Press -- WordPress plugin for embedding Stripe checkouts via
                          shortcodes.

  Copyright (C) 2015  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.0.1--development_unreleased

  Module:         js/le_requirejs/underscore-private.js

  Description:    Proxy module for loading UnderscoreJS with 'noConflict'.

  This file is part of Stripe-Payment-Press.

  Licensed under the GNU General Public License Version 3.

  Stripe-Payment-Press is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  Stripe-Payment-Press is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with Stripe-Payment-Press.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 *  From 'http://requirejs.org/docs/jquery.html':
 */
_plugin_Stripe_Payment_Press__define([
        'underscore'
    ], function (_) {
        return _.noConflict();
    });
