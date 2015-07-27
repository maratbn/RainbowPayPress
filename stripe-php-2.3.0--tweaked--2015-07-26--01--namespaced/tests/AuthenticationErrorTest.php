<?php

namespace plugin_Stripe_Payment_Press\Stripe;

class AuthenticationErrorTest extends TestCase
{
    public function testInvalidCredentials()
    {
        Stripe::setApiKey('invalid');
        try {
            Customer::create();
        } catch (Error\Authentication $e) {
            $this->assertSame(401, $e->getHttpStatus());
        }
    }
}
