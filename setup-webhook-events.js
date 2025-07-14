require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Recommended webhook events for GetMeAChai
const RECOMMENDED_EVENTS = [
  // Essential for one-time payments (chai purchases)
  'checkout.session.completed',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  
  // For future subscription features (monthly supporters)
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  
  // For disputes and refunds
  'charge.dispute.created',
  'charge.refunded'
];

async function listCurrentWebhooks() {
  console.log('🔍 Current Webhook Endpoints:\n');
  
  try {
    const webhooks = await stripe.webhookEndpoints.list();
    
    if (webhooks.data.length === 0) {
      console.log('❌ No webhook endpoints found');
      return;
    }
    
    webhooks.data.forEach((webhook, index) => {
      console.log(`${index + 1}. ${webhook.url}`);
      console.log(`   Status: ${webhook.status}`);
      console.log(`   Events: ${webhook.enabled_events.length} events`);
      console.log(`   Events: ${webhook.enabled_events.join(', ')}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error listing webhooks:', error.message);
  }
}

async function createWebhookEndpoint(url) {
  console.log(`🔧 Creating webhook endpoint: ${url}\n`);
  
  try {
    const webhook = await stripe.webhookEndpoints.create({
      url: url,
      enabled_events: RECOMMENDED_EVENTS
    });
    
    console.log('✅ Webhook endpoint created successfully!');
    console.log(`   URL: ${webhook.url}`);
    console.log(`   Status: ${webhook.status}`);
    console.log(`   Events: ${webhook.enabled_events.length} events configured`);
    console.log(`   Secret: ${webhook.secret}`);
    console.log('\n⚠️  IMPORTANT: Update your .env.local file:');
    console.log(`   STRIPE_WEBHOOK_SECRET=${webhook.secret}`);
    
    return webhook;
    
  } catch (error) {
    console.error('❌ Error creating webhook:', error.message);
  }
}

async function updateWebhookEvents(webhookId, events = RECOMMENDED_EVENTS) {
  console.log(`🔄 Updating webhook events for: ${webhookId}\n`);
  
  try {
    const webhook = await stripe.webhookEndpoints.update(webhookId, {
      enabled_events: events
    });
    
    console.log('✅ Webhook events updated successfully!');
    console.log(`   Events: ${webhook.enabled_events.length} events configured`);
    console.log(`   Events: ${webhook.enabled_events.join(', ')}`);
    
    return webhook;
    
  } catch (error) {
    console.error('❌ Error updating webhook:', error.message);
  }
}

async function main() {
  console.log('🚀 Stripe Webhook Configuration Tool\n');
  console.log('📋 Recommended Events for GetMeAChai:');
  RECOMMENDED_EVENTS.forEach((event, index) => {
    console.log(`   ${index + 1}. ${event}`);
  });
  console.log('');
  
  // List current webhooks
  await listCurrentWebhooks();
  
  console.log('📝 Usage Examples:');
  console.log('');
  console.log('// Create webhook for local development with ngrok:');
  console.log('// await createWebhookEndpoint("https://abc123.ngrok.io/api/webhooks/stripe");');
  console.log('');
  console.log('// Create webhook for production:');
  console.log('// await createWebhookEndpoint("https://yourapp.vercel.app/api/webhooks/stripe");');
  console.log('');
  console.log('// Update existing webhook events:');
  console.log('// await updateWebhookEvents("we_1234567890");');
  console.log('');
  
  // Uncomment the line below and replace with your URL to create a webhook
  // await createWebhookEndpoint('https://your-ngrok-url.ngrok.io/api/webhooks/stripe');
  
  // Uncomment the line below and replace with your webhook ID to update events
  // await updateWebhookEvents('we_1234567890');
}

main().catch(console.error);
