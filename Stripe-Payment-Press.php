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

const DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS = 'domain-plugin-Stripe-Payment-Press';
const SETTING__STRIPE_LIVE_PUBLISH_KEY =
                                  'plugin_Stripe_Payment_Press__setting__stripe_live_publish_key';
const SETTING__STRIPE_LIVE_SECRET_KEY =
                                   'plugin_Stripe_Payment_Press__setting__stripe_live_secret_key';
const SETTING__STRIPE_TEST_PUBLISH_KEY =
                                  'plugin_Stripe_Payment_Press__setting__stripe_test_publish_key';
const SETTING__STRIPE_TEST_SECRET_KEY =
                                   'plugin_Stripe_Payment_Press__setting__stripe_test_secret_key';
const SETTINGS_FIELD__STRIPE_LIVE_PUBLISH_KEY =
                           'plugin_Stripe_Payment_Press__settings_field__stripe_live_publish_key';
const SETTINGS_FIELD__STRIPE_LIVE_SECRET_KEY =
                            'plugin_Stripe_Payment_Press__settings_field__stripe_live_secret_key';
const SETTINGS_FIELD__STRIPE_TEST_PUBLISH_KEY =
                           'plugin_Stripe_Payment_Press__settings_field__stripe_test_publish_key';
const SETTINGS_FIELD__STRIPE_TEST_SECRET_KEY =
                            'plugin_Stripe_Payment_Press__settings_field__stripe_test_secret_key';
const SETTINGS_SECTION__STRIPE_KEYS = 'plugin_Stripe_Payment_Press__settings_group__stripe_keys';
const SLUG_INFO_SETTINGS = 'plugin_Stripe_Payment_Press_info_settings';

\add_action('admin_init', '\\plugin_Stripe_Payment_Press\\action_admin_init');
\add_action('admin_menu', '\\plugin_Stripe_Payment_Press\\action_admin_menu');
\add_filter('plugin_action_links_' . \plugin_basename(__FILE__),
                                     '\\plugin_Stripe_Payment_Press\\filter_plugin_action_links');

\add_shortcode('stripe-payment-press',
               '\\plugin_Stripe_Payment_Press\\shortcode_stripe_payment_press');

function action_admin_init() {
    //  Based on: https://kovshenin.com/2012/the-wordpress-settings-api/
    \add_settings_section(SETTINGS_SECTION__STRIPE_KEYS,
                          \__('Your Stripe Keys', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                          '\\plugin_Stripe_Payment_Press\\settings_group__stripe_keys',
                          SLUG_INFO_SETTINGS);

    \register_setting(SETTINGS_SECTION__STRIPE_KEYS, SETTING__STRIPE_TEST_SECRET_KEY);

    \add_settings_field(SETTINGS_FIELD__STRIPE_TEST_SECRET_KEY,
                        \__('Stripe Test Secret Key', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                        '\\plugin_Stripe_Payment_Press\\settings_field__stripe_test_secret_key',
                        SLUG_INFO_SETTINGS,
                        SETTINGS_SECTION__STRIPE_KEYS);


    \register_setting(SETTINGS_SECTION__STRIPE_KEYS, SETTING__STRIPE_TEST_PUBLISH_KEY);

    \add_settings_field(SETTINGS_FIELD__STRIPE_TEST_PUBLISH_KEY,
                        \__('Stripe Test Publishable Key', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                        '\\plugin_Stripe_Payment_Press\\settings_field__stripe_test_publish_key',
                        SLUG_INFO_SETTINGS,
                        SETTINGS_SECTION__STRIPE_KEYS);


    \register_setting(SETTINGS_SECTION__STRIPE_KEYS, SETTING__STRIPE_LIVE_SECRET_KEY);

    \add_settings_field(SETTINGS_FIELD__STRIPE_LIVE_SECRET_KEY,
                        \__('Stripe Live Secret Key', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                        '\\plugin_Stripe_Payment_Press\\settings_field__stripe_live_secret_key',
                        SLUG_INFO_SETTINGS,
                        SETTINGS_SECTION__STRIPE_KEYS);


    \register_setting(SETTINGS_SECTION__STRIPE_KEYS, SETTING__STRIPE_LIVE_PUBLISH_KEY);

    \add_settings_field(SETTINGS_FIELD__STRIPE_LIVE_PUBLISH_KEY,
                        \__('Stripe Live Publishable Key', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                        '\\plugin_Stripe_Payment_Press\\settings_field__stripe_live_publish_key',
                        SLUG_INFO_SETTINGS,
                        SETTINGS_SECTION__STRIPE_KEYS);
}

function action_admin_menu() {
    \add_options_page(\__('Stripe-Payment-Press Info / Settings',
                          DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                      \__('Stripe-Payment-Press', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS),
                      'manage_options',
                      SLUG_INFO_SETTINGS,
                      '\\plugin_Stripe_Payment_Press\\render_info_settings');

    function render_info_settings() {
        //  Based on http://codex.wordpress.org/Administration_Menus
        if (!\current_user_can('manage_options' ))  {
            \wp_die(__('You do not have sufficient permissions to access this page.',
                       DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS));
        }
    ?>
    <div class="wrap">
      <p>Use the shortcode <code>[stripe-payment-press amount=XXXX]</code> to embed a Stripe payment widget on
         any page or post.</p>
      <p>
        <h5>Shortcode attributes:</h5>
        <ul>
          <li>
            <code>amount</code>
            <p>The amount to charge in cents.</p>
          </li>
        </ul>
      </p>
      <form method="post" action="options.php">
        <?php //  Based on: https://kovshenin.com/2012/the-wordpress-settings-api/
            \settings_fields(SETTINGS_SECTION__STRIPE_KEYS);
            \do_settings_sections(SLUG_INFO_SETTINGS);
            \submit_button();
        ?>
      </form>
    </div>
    <?php
    }
}

function filter_plugin_action_links($arrLinks) {
    \array_push($arrLinks,
                '<a href=\'' . getUrlInfoSettings() . '\'>'
                          . \__('Info / Settings', DOMAIN_PLUGIN_STRIPE_PAYMENT_PRESS) . '</a>');
    return $arrLinks;
}

function getUrlInfoSettings() {
    return \admin_url('options-general.php?page=' . SLUG_INFO_SETTINGS);
}

function settings_field__stripe_live_publish_key() {
    //  Based on: https://kovshenin.com/2012/the-wordpress-settings-api/
    ?>
    <input type='text'
           name='<?=SETTING__STRIPE_LIVE_PUBLISH_KEY?>'
           size='40'
           value='<?=\esc_attr(\get_option(SETTING__STRIPE_LIVE_PUBLISH_KEY))?>' />
    <?php
}

function settings_field__stripe_live_secret_key() {
    //  Based on: https://kovshenin.com/2012/the-wordpress-settings-api/
    ?>
    <input type='text'
           name='<?=SETTING__STRIPE_LIVE_SECRET_KEY?>'
           size='40'
           value='<?=\esc_attr(\get_option(SETTING__STRIPE_LIVE_SECRET_KEY))?>' />
    <?php
}

function settings_field__stripe_test_publish_key() {
    //  Based on: https://kovshenin.com/2012/the-wordpress-settings-api/
    ?>
    <input type='text'
           name='<?=SETTING__STRIPE_TEST_PUBLISH_KEY?>'
           size='40'
           value='<?=\esc_attr(\get_option(SETTING__STRIPE_TEST_PUBLISH_KEY))?>' />
    <?php
}

function settings_field__stripe_test_secret_key() {
    //  Based on: https://kovshenin.com/2012/the-wordpress-settings-api/
    ?>
    <input type='text'
           name='<?=SETTING__STRIPE_TEST_SECRET_KEY?>'
           size='40'
           value='<?=\esc_attr(\get_option(SETTING__STRIPE_TEST_SECRET_KEY))?>' />
    <?php
}

function settings_group__stripe_keys() {
}

function shortcode_stripe_payment_press($atts) {
    if ($atts == null ||
        $atts['amount'] == null) {
        return '<b><i>Short-code [stripe-payment-press] missconfigured.</i></b>';
    }

}
?>
