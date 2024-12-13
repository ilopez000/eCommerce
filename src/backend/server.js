const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Stripe = require('stripe');

// Configura Stripe amb la teva clau secreta
const stripe = new Stripe('sk_test_51QSgAiBNoAIrMHfd2ODv4EOMYgdFmkWd26cTvPkghiDoYYGy5y60TDufUEd6Tx0pcofEUontRcKAsCMBwUFW8kaJ00LJXenob8'); // Substitueix amb la clau secreta

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Permet peticions del frontend al port 3000
app.use(bodyParser.json()); // Permet processar el cos de les peticions en format JSON

// Endpoint per crear una sessió de Stripe Checkout
app.post('/create-checkout-session', async (req, res) => {
  const { items, success_url, cancel_url } = req.body;

  try {
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.name },
        unit_amount: item.price * 100, // Convertir a cèntims
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url,
      cancel_url,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creant la sessió de Stripe:', error);
    res.status(500).json({ error: 'No es pot crear la sessió de Stripe' });
  }
});

// Endpoint de prova per comprovar el servidor
app.get('/', (req, res) => {
  res.send('Servidor actiu!');
});

// Executa el servidor
app.listen(PORT, () => {
  console.log(`Servidor escoltant al port ${PORT}`);
});
