/*
  StripePaymentPress -- WordPress plugin for embedding Stripe checkouts via
                        shortcodes.

  Copyright (C) 2015-2016  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.7.0-development_unreleased

  Module:         js/le_requirejs/model_orig__app_common.js

  Description:    Single instance of model 'ModelOrig_AppCommon' for storing
                  information common to both public and admin front-ends.

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


define(['backbone'], function (backbone) {

        return new (backbone.Model.extend({

                defaults: {
                        'ajax_url': null
                    }

            }));

    });


})(_plugin_StripePaymentPress__define);