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
\add_action('wp_enqueue_scripts', '\\plugin_Stripe_Payment_Press\\action_wp_enqueue_scripts');
\add_action('wp_print_footer_scripts',
            '\\plugin_Stripe_Payment_Press\\action_wp_print_footer_scripts');


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
      <h2>Usage Info:</h2>
      <p>Use the shortcode
         <code>[stripe-payment-press amount=1234 name="My entity" desc="Buy this" label="Click to buy"]</code>
         to embed a Stripe payment widget on
         any page or post.</p>
      <p>
        <h5>Required shortcode attributes:</h5>
        <ul>
          <li>
            <code>amount</code>
            <p>The amount to charge in cents.</p>
          </li>
          <li>
            <code>name</code>
            <p>Your site / company / organization name.</p>
          </li>
          <li>
            <code>desc</code>
            <p>Description of the product / service / fee you're charging for.</p>
          </li>
        </ul>
        <h5>Optional shortcode attributes:</h5>
        <ul>
          <li>
            <code>label</code>
            <p>Stripe payment button label, otherwise defaults to "Pay with card" or similar.</p>
          </li>
        </ul>
      </p>
      <h2>Configuration:</h2>
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

function action_wp_enqueue_scripts() {
    \wp_enqueue_script('jquery');
    \wp_enqueue_script('plugin__Stripe-Payment-Press__stripe_checkout',
                       'https://checkout.stripe.com/checkout.js',
                       null,
                       \date('Y-m-d'));
}

function action_wp_print_footer_scripts() {
?>
    <script type='text/javascript'>
        jQuery(document).ready(function($) {
                var $elSnaps = $("snap[data-plugin-stripe-payment-press-role=root]");

                for (var i = 0; i < $elSnaps.length; i++) {
                    var $elSnap = $($elSnaps[i]);

                    var amount =  $elSnap.attr('data-plugin-stripe-payment-press-amount'),
                        name =    $elSnap.attr('data-plugin-stripe-payment-press-name'),
                        desc =    $elSnap.attr('data-plugin-stripe-payment-press-desc'),
                        label =   $elSnap.attr('data-plugin-stripe-payment-press-label');

                    var $buttonMakePayment = $('<button>').text(label || "Pay with Stripe")
                                                          .appendTo($elSnap);

                    //  Based on: https://stripe.com/docs/checkout#integration-custom

                    var handler = StripeCheckout.configure({
                            key: '<?=\esc_attr(\get_option(SETTING__STRIPE_TEST_PUBLISH_KEY))?>',
                            token: function(token) {
                                    // Use the token to create the charge with a server-side script.
                                    // You can access the token ID with `token.id`

                                }
                        });

                    $buttonMakePayment.on('click', function(e) {
                            // Open Checkout with further options
                            handler.open({
                                    name:         name,
                                    description:  desc,
                                    amount:       amount
                                });

                            e.preventDefault();
                        });

                    // Close Checkout on page navigation
                    $(window).on('popstate', function() {
                            handler.close();
                        });
                }
            });
    </script>
<?php
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
        $atts['amount'] == null ||
        $atts['desc'] == null ||
        $atts['name'] == null) {
        return '<b><i>Short-code [stripe-payment-press] missconfigured.</i></b>';
    }

    return '<snap data-plugin-stripe-payment-press-role="root"' .
                ' data-plugin-stripe-payment-press-amount="' . \esc_attr($atts['amount']) .
                                                         '"' .
                ' data-plugin-stripe-payment-press-name="' . \esc_attr($atts['name']) .
                                                       '"' .
                ' data-plugin-stripe-payment-press-desc="' . \esc_attr($atts['desc']) .
                                                       '"' .
                ($atts['label'] == null ? "" :
                ' data-plugin-stripe-payment-press-label="' . \esc_attr($atts['label']) .
                                                        '"') . '>' .
           '</snap>';
}
?>
