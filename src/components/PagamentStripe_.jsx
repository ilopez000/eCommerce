import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QSgAiBNoAIrMHfdrqMMFCgqvBXCJ9ymEpmjB0u8QzZUfrkNRN3DU1FEtI5Pe63YEgz5T3FwmpOvHpuR9hzGn0op00jZoKkROE');

const Payment = ({ cartItems }) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        try {
            const response = await fetch('/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                    success_url: `${window.location.origin}/success`,
                    cancel_url: `${window.location.origin}/cancel`,
                }),
            });

            const { sessionId } = await response.json();

            const stripe = await stripePromise;
            await stripe.redirectToCheckout({ sessionId });
        } catch (error) {
            console.error('Error durant el procés de pagament:', error);
            alert('No s\'ha pogut completar el pagament.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handlePayment} disabled={loading}>
                {loading ? 'Processant...' : 'Pagar ara'}
            </button>
        </div>
    );
};

export default Payment;
