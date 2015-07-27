<?php

namespace plugin_Stripe_Payment_Press\Stripe;

class BalanceTest extends TestCase
{
    public function testRetrieve()
    {
        self::authorizeFromEnv();
        $d = Balance::retrieve();
        $this->assertSame($d->object, "balance");
        $this->assertTrue(Util\Util::isList($d->available));
        $this->assertTrue(Util\Util::isList($d->pending));
    }
}
