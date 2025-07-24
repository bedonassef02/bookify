const stripe = Stripe('pk_test_TYooMQauvdEDq54NiTgbpRsm'); // Replace with your actual Stripe Publishable Key

const messages = document.getElementById('messages');
const form = document.getElementById('payment-form');
const submitButton = document.getElementById('submit-button');

let elements;
const baseUrl = 'http://localhost:3000/api/v1';
let accessToken = null;

// Function to display messages
function showMessage(messageText, type = 'info') {
    messages.textContent = messageText;
    messages.className = type; // Add class for styling (success/error)
}

// Function to sign in and get access token
async function signInAndGetToken() {
    showMessage('Signing in to get access token...');
    try {
        const response = await fetch(`${baseUrl}/auth/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'newuser@example.com', // Placeholder credentials
                password: 'P@ssword', // Placeholder credentials
            }),
        });

        const data = await response.json();
        if (data.tokens.accessToken) {
            accessToken = data.tokens.accessToken;
            showMessage('Access token obtained successfully.', 'success');
            return true;
        } else {
            showMessage(`Error signing in: ${data.message || 'Unknown error'}`, 'error');
            return false;
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        showMessage(`Network error during sign-in: ${error.message}`, 'error');
        return false;
    }
}

// Simulate booking and get client secret
async function createPaymentIntent() {
    showMessage('Initiating booking...');
    try {
        if (!accessToken) {
            showMessage('Access token not available. Please sign in first.', 'error');
            return null;
        }
        const response = await fetch(`${baseUrl}/booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                event: '687f715597d83f6fc17d7bb4', // Placeholder Event ID
                ticketTier: '687f715597d83f6fc17d7bb8', // Placeholder Ticket Tier ID
                numberOfTickets: 1
            }),
        });

        const bookingData = await response.json();

        if (bookingData.clientSecret) {
            showMessage('Booking successful. Setting up payment form...');
            return bookingData.clientSecret;
        } else {
            showMessage(`Error initiating booking: ${bookingData.message || 'Unknown error'}`, 'error');
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(`Network error or API Gateway not reachable: ${error.message}`, 'error');
        return null;
    }
}

// Initialize Stripe Elements
async function initializeStripe() {
    const signedIn = await signInAndGetToken();
    if (!signedIn) {
        submitButton.disabled = true;
        return;
    }
    const clientSecret = await createPaymentIntent();
    if (clientSecret) {
        elements = stripe.elements({ clientSecret });
        const cardElement = elements.create('card');
        cardElement.mount('#card-element');
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}

// Handle form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    showMessage('Processing payment...');

    const { error, paymentIntent } = await stripe.confirmCardPayment(elements.getElement('card'), {
        payment_method: {
            card: elements.getElement('card'),
        },
    });

    if (error) {
        showMessage(`Payment failed: ${error.message}`, 'error');
        submitButton.disabled = false;
    } else if (paymentIntent.status === 'succeeded') {
        showMessage('Payment succeeded! Booking confirmed.', 'success');
    } else {
        showMessage(`Payment status: ${paymentIntent.status}`, 'info');
    }
});

initializeStripe();
