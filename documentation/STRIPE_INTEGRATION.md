# 💳 Stripe Payment Integration

## ✅ **Implementation Complete**

The app now uses dynamic Stripe payment links for processing payments with a 4% service fee.

## 🔧 **How It Works**

### 1. **User Flow**
1. User enters amount (5-100 JOD)
2. System calculates 4% fee automatically
3. Creates Stripe payment link with total amount
4. Redirects user to Stripe checkout
5. User completes payment securely
6. Webhook confirms payment and updates transaction status

### 2. **Payment Calculation**
```javascript
const feeAmount = amount * 0.04  // 4% fee
const totalAmount = amount + feeAmount
```

### 3. **API Endpoints**

#### **Create Payment Link** (`/api/stripe/create-payment-link`)
- **Method**: POST
- **Body**: `{ amount, recipient, note, userId }`
- **Response**: `{ paymentLink, transactionId, amount, fee }`

#### **Webhook Handler** (`/api/stripe/webhook`)
- Handles payment completion
- Updates transaction status
- Processes failed payments

## 🛠 **Setup Required**

### 1. **Environment Variables**
Add these to your `.env.local`:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. **Stripe Dashboard Setup**
1. **Create Payment Links**: Enable in Stripe Dashboard
2. **Webhook Endpoint**: Add `https://yourdomain.com/api/stripe/webhook`
3. **Webhook Events**: Subscribe to:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`

### 3. **Database Schema**
The `transactions` table now includes:
- `stripe_payment_link_id`: Stripe payment link ID
- `stripe_session_id`: Stripe checkout session ID
- `fee_jod`: 4% service fee
- `total_jod`: Amount + fee

## 📱 **User Experience**

### **Send Form Changes**
- **Before**: Complex exchange rate calculation
- **After**: Simple 4% fee calculation
- **Button**: "الدفع عبر Stripe" (Pay via Stripe)
- **Summary**: Shows amount + 4% fee = total

### **Payment Flow**
1. **Form Submission** → Creates Stripe payment link
2. **Stripe Checkout** → Secure payment processing
3. **Payment Success** → Redirects to success page
4. **Webhook** → Updates transaction status

## 🔒 **Security Features**

- **Stripe Security**: All payments processed by Stripe
- **Webhook Verification**: Signature verification
- **Metadata**: Transaction details stored securely
- **User Validation**: Authentication required

## 📊 **Transaction States**

- **pending**: Payment link created, awaiting payment
- **completed**: Payment successful
- **failed**: Payment failed
- **expired**: Payment link expired

## 🎯 **Benefits**

1. **Secure**: Stripe handles all payment processing
2. **Simple**: No complex exchange rate calculations
3. **Reliable**: Webhook-based status updates
4. **User-Friendly**: Clear payment summary
5. **Scalable**: Stripe handles high volume

## 🚀 **Next Steps**

1. **Test**: Use Stripe test mode for development
2. **Webhook**: Set up webhook endpoint in Stripe Dashboard
3. **Production**: Switch to live Stripe keys for production
4. **Monitoring**: Monitor transactions in Stripe Dashboard

The payment system is now fully integrated with Stripe and ready for use!
