<?php

namespace plugin_Stripe_Payment_Press\Stripe;

class BalanceTransactionTest extends TestCase
{
    public function testList()
    {
        self::authorizeFromEnv();
        $d = BalanceTransaction::all();
        $this->assertSame($d->url, '/v1/balance/history');
    }
}
