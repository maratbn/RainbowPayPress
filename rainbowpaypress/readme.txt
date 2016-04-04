=== RainbowPayPress ===
Contributors: maratbn
Tags: Stripe, accept payments, accept credit card, accept credit card payments, pay, payment, credit card, pay online, sell online
Requires at least: 3.8.1
Tested up to: 4.4.2
Stable tag: 2.3.0
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl-3.0.html

Easy way to accept credit card payments via Stripe by embedding Stripe
checkouts via shortcodes.


== Description ==

Overview:

  This plugin facilitates selling of products and services on any public page
  of a WordPress website, and accepting credit card payments for these
  products and services via the Stripe payment processor.

  Because this plugin facilitates credit card payment processing specifically
  via Stripe, it is able to leverage the main security feature of that service,
  in that the credit card numbers are sent to the Stripe servers directly via
  their Checkout API, and never to the server running the website.  Because
  the credit card numbers are physically absent from the website server, the
  operators of the website server are not subject to various government
  regulations that might have otherwise come into effect had their server
  indeed stored credit card numbers.  And obviously, even if the website
  server or its storage get compromised by criminals, there simply would not
  be any credit card numbers for them to steal.

  The way this plugin is used, is that first, the administrators specify which
  products and services are being sold, their descriptions, prices, etc. by
  inserting special shortcodes with that information directly into the pages
  and posts on which they want to render the user payment buttons for these
  sales.  When site visitors load these pages, they see the associated payment
  buttons, clicking on which opens payment entry forms.  Submitting a payment
  creates a "pending transaction", details of which can be automatically
  emailed to the site operator(s).  For each pending transaction, site
  administrators can click a special "Charge" button on the plugin's admin
  page to charge that transaction via Stripe.  This creates a record for the
  customer and the charge on the Stripe servers, from which point the
  transaction can be administered via the Stripe website as any other Stripe
  transaction.

  Stripe test transactions are also supported.  These are transactions in
  which no actual real credit card gets charged.

  Currently only USD are supported.

Technical summary and special considerations:

  Initially, buyer identity, stored partially on the website server, is tied
  to their credit card number stored entirely on Stripe servers, via a special
  "Stripe Token", which is obtained directly from Stripe, via the plugin's
  JavaScript logic, running in the buyer's browser.  For this reason,
  JavaScript needs to be enabled in the buyer's browser.

  Plugin relies on special server-side PHP library stripe-php to communicate
  with the Stripe servers to direct them to charge credit cards.  This PHP
  library in turn relies on PHP cURL support enabled on the server.  The
  plugin will check if this support is enabled, and will issue admin dashboard
  notification if it is not, which will also give advise on how to enable it.

  If website administrators wish to enable automatic email notifications, they
  would need to insure that a Mail Transfer Agent (MTA) is properly configured
  on their website server.  Even when the MTA is properly configured, the
  email notifications are still likely to get filtered by SPAM filters, so
  adjustment of SPAM filters might also be needed.

Requires:

  * PHP version >= 5.4
  * PHP cURL support enabled (Install module 'php5-curl' on Debian / Ubuntu)
  * Proper Mail Transfer Agent (MTA) configuration for notification emails.

Official project URLs:

  https://wordpress.org/plugins/rainbowpaypress
  https://github.com/maratbn/RainbowPayPress
  http://maratbn.com/projects/rainbow-pay-press


== Installation ==

1. Unzip contents of `rainbowpaypress.zip` into the directory `/wp-content/plugins/rainbowpaypress/`.
2. Activate the plugin through the 'Plugins' menu in WordPress.


== Frequently Asked Questions ==

= What do I do if I get this error "Plugin could not be activated because it triggered a fatal error." when trying to activate? =

Upgrade to PHP >= 5.4  See
https://wordpress.org/support/topic/crashes-on-activate

Make sure to check your PHP version with
https://wordpress.org/plugins/display-php-version/

= Where can I ask a question about RainbowPayPress? =

Ask your questions at: https://wordpress.org/support/plugin/rainbowpaypress

= Where can I post issues / bugs / feature requests? =

Post issues / bugs / feature requests at:
https://github.com/maratbn/RainbowPayPress/issues

= Where can I post pull requests? =

Post pull requests at: https://github.com/maratbn/RainbowPayPress/pulls

= Plugin is missing feature X that I really want, what do I do? =

Post a bug / feature request, or implement the feature at your leisure, and
submit a pull request.

= Where do I get the publish and secret keys needed for plugin's configuration? =

From your Stripe account.

= Why are notification emails not sending? =

Check if you have a mail transfer agent (MTA) installed and properly
configured on your server.  Also check your SPAM folder.


== Changelog ==

= 2.3.0 =
* For better reliability and better server-side performance, loading the plugin's JavaScript logic
  on every page.  Client-side performance should not be effected that much due to local caching.
  Stripe Checkout JavaScript dialog logic is still loading only when the user opens the payment UI.
* Fixed bug with the seller name not getting propagated into the Stripe Checkout dialog.
* Fixed bug with date parsing algorithm so that it works on Firefox.
* Fixed bug with the shipping address not being displayed in the admin transactions table.

= 2.2.0 =
* Added ability to ask buyer for shipping address.
* Split-out the plugin's admin page into 3 separate pages, for Help, Transactions, and Settings.
* Included configuration settings page URL in test emails.
* Included site URL in test and notification emails.
* Added admin UI warning notification for when server-side cURL support is unavailable.
* Displaying the transaction creation and charging times in the timezone local to the client.
* Added plugin icon.
* No longer explicitly requesting to communicate with Stripe via any specific Stripe API version,
  as Stripe servers are expected to automatically communicate via the most appropriate version for
  the client library bindings version.

= 2.1.0 =
* Indicating to the user when Stripe Checkout dialog may be blocked by an ad or a popup blocker,
  by a JavaScript security policy, or by a broken network connection.
* To bypass browser popup blockers, loading Stripe checkout when the user opens the payment UI
  rather than when the user clicks to open the Stripe Checkout dialog, as that will keep the
  popup-loading logic in the same user-initiated UI callback.

= 2.0.0 =
* Having stripe-php 3.4.0 explicitly request the Stripe servers to communicate via Stripe API
  version 2016-03-07.
* For better privacy, loading Stripe checkout.js only when the user clicks to open the Stripe
  Checkout dialog.
* Indicating to the user when the Stripe Checkout dialog is initializing and opening.
* Renamed MySQL database table 'plugin_stripe_payment_press_transactions' to
  'plugin_rainbow_pay_press_transactions'.  Users of version 1.0.0 upgrading to 2.0.0 who already
  have data in the old table will have to manually export it from the old table and import it into
  the new table using Adminer or a similar plugin that can export / import database tables.

= 1.0.0 =
* Initial public release.
