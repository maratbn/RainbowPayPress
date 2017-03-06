=== RainbowPayPress ===
Contributors: maratbn
Tags: Stripe, accept payments, accept credit card, accept credit card payments, pay, payment, credit, credit card, creditcard, creditcards, pay online, payonline, sell online, sellonline, VISA, MasterCard, AmericanExpress, Discover
Requires at least: 3.8.1
Tested up to: 4.7.2
Stable tag: 3.1.0
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

  Demo at: http://maratbn.com/projects/rainbow-pay-press/#demo

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
  * PHP cURL support enabled (Install module 'php-curl' on Debian / Ubuntu)
  * PHP multibyte string support enabled (Install module 'mb-string' on Debian / Ubuntu)
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


== Screenshots ==

1.  Examples of shortcode syntax, and display of all the transaction details entry fields that can
    be made available to the buyer on any page of the website.

2.  The official Stripe Checkout Dialog that appears when the buyer clicks to enter the Stripe
    token id or Stripe card email fields.

3.  RainbowPayPress admin menu.

4.  Example of transaction details entry fields filled out by the buyer just before transaction
    submission.

5.  Transaction submission confirmation message displayed to the buyer after transaction
    submission.  The confirmation message includes the timestamp of the submission and the Stripe
    token that can be used by the website administrator(s) to charge the buyer's credit card.

6.  The 'Pending Transactions' and 'Charged Transactions' tables as they appear to the website
    administrator(s) on the 'Transactions' admin page, containing the data for example
    transactions.  New transactions are initially inserted as new rows to the top of the 'Pending'
    table,  Clicking the 'Charge' button charges the transaction, and moves the associated record
    to the top of the 'Charged' table.  The 'Charged' table contains additional columns 'Customer
    ID' and 'Charge ID'.  These data tokens are created by the Stripe business logic when the
    transaction is charged, and they are rendered as web links, clicking on which takes the user to
    the associated records on their Stripe account on the Stripe website.

7.  The 'Items' table as it appears to the website administrator(s), containing an example list of
    items that can be specified for sale via RainbowPayPress shortcodes.

8.  The RainbowPayPress 'Settings' page as it appears to the website administrator(s) with some
    example settings.

9.  A screenshot of a customer record as it appears on the Stripe website.  This record was created
    when the associated transaction was charged by clicking on the 'Charge' button on its row on
    the 'Pending Transaction' table on the 'Transactions' admin page.  Once a transaction is
    charged, all records associated with that charge can be tracked on the user's Stripe account.


== Changelog ==

= 3.1.0 =
* Tested up to WordPress version 4.7.2.
* Synched with the latest Stripe Checkout JavaScript API.
* Limited the loading of plugin's static resources only to pages that use the plugin.
* Implemented detection of when a transaction could not be submitted due to an untrusted HTTPS/SSL
  certificate.
* Implemented notification to the paying user when a payment transaction could not be submitted due
  to a communication error with the server.
* Added additional tags to make the plugin easier to find in the WordPress plugins directory.
* Added detection of missing PHP multibyte string support, which is necessary to communicate with
  Stripe.

= 3.0.1 =
* Fixed bug with allowed items being treated as disallowed.

= 3.0.0 =
* Fixed another date parsing bug that effected Firefox.
* Database schema has been modified.  Table 'plugin_rainbow_pay_press_transactions' fields
  'customer_name' and 'customer_phone' are now allowed to be NULL.  If upgrading, user should
  examine the table schema to verify that these fields are now allowed to be NULL, and if not,
  alter the table manually to allow these fields to be NULL.  User can use the Adminer plugin to
  accomplish this.  Alternatively, user can disable the plugin, backup the data in the table,
  delete the table, and re-enable the plugin to create the table anew.
* Entity name is now specified in the global RainbowPayPress configuration rather than in each
  shortcode.
* Fixed bug with resetting configuration settings to empty strings.
* Shortcode syntax has changed.  Instead of specifying the cost amount and description of each item
  in the shortcode, now only a pre-configured item handle is specified.  Upon upgrading, users will
  need to manually create the appropriate item records in the Items configuration, and to update
  their shortcodes to include handles to their items.
* Shortcode syntax has changed.  The previous shortcode parameter 'fields' has been renamed to
  'override_fields'.  Upon upgrading, users will need to manually modify their shortcodes to comply
  with this latest parameter name.

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
