<?php
/*
  Plugin Name: Stripe-Payment-Press
  Description: WordPress plugin for embedding Stripe checkouts via shortcodes.
  Author: Marat Nepomnyashy
  Author URI: http://www.maratbn.com
  License: GPL3
  Version: 0.0.1-development_unreleased
  Text Domain: domain-plugin-Stripe-Payment-Press
*/

/*
  Stripe-Payment-Press -- WordPress plugin for embedding Stripe checkouts via
                          shortcodes.

  Copyright (C) 2015  Marat Nepomnyashy  http://maratbn.com  maratbn@gmail

  Version:        0.0.1-development_unreleased

  Module:         Stripe-Payment-Press.php

  Description:    Main PHP file for the WordPress plugin 'Stripe-Payment-Press'.

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

namespace plugin_Stripe_Payment_Press;

add_action('admin_menu', '\\plugin_Stripe_Payment_Press\\action_admin_menu');

function action_admin_menu() {
    add_options_page( __('Stripe-Payment-Press Info / Settings',
                         'domain-plugin-Stripe-Payment-Press'),
                      __('Stripe-Payment-Press', 'domain-plugin-Stripe-Payment-Press'),
                      'manage_options',
                      'plugin_Stripe_Payment_Press_info_settings',
                      '\\plugin_Stripe_Payment_Press\\render_info_settings');

    function render_info_settings() {
        //  Based on http://codex.wordpress.org/Administration_Menus
        if (!current_user_can('manage_options' ))  {
            wp_die(__('You do not have sufficient permissions to access this page.',
                      'domain-plugin-Stripe-Payment-Press'));
        }
    ?>
    <div class="wrap">
    </div>
    <?php
    }
}
?>