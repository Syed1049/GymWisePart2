import React from 'react';
import {StripeProvider} from '@stripe/stripe-react-native';
import StorePage from './Store';

function Payment() {
  return (
    <StripeProvider publishableKey="pk_test_51PCHHcHWkHsHNjigAgKH1gbdCU0xjrUZWQ6TjGkeRrwHT6Tuqfrn9PuFiVVVbFhDkm2Gj90xAmhq1u4QR5llpx6500fPIMy7EB">
        <StorePage/>
    </StripeProvider>
  );
}

export default Payment;