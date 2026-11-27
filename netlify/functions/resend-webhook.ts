
import { Webhook } from 'svix';

// Supported Resend webhook events
const supportedEvents = new Set<string>([
  'email.sent',
  'email.delivered',
  'email.delivery_delayed',
  'email.bounced',
  'email.failed',
  'email.suppressed',
  'email.complained',
]);

// Resend webhook event structure
interface ResendWebhookEvent {
  type: string;
  created_at: string;
  data: {
    email_id: string;
  };
}

// Standard JSON response
function respond(
  status: number,
  message: string
): Response {
  return new Response(
    JSON.stringify({ message }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  );
}

// Validate incoming webhook event
function isValidEvent(
  value: unknown
): value is ResendWebhookEvent {
  if (
    typeof value !== 'object' ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  const event = value as Record<string, unknown>;

  if (
    typeof event.type !== 'string' ||
    typeof event.created_at !== 'string' ||
    !Number.isFinite(Date.parse(event.created_at))
  ) {
    return false;
  }

  if (
    typeof event.data !== 'object' ||
    event.data === null ||
    Array.isArray(event.data)
  ) {
    return false;
  }

  const data = event.data as Record<string, unknown>;

  return (
    typeof data.email_id === 'string' &&
    data.email_id.trim().length > 0
  );
}

// Main Netlify webhook handler
export default async function handler(
  request: Request
): Promise<Response> {

  // Only accept POST requests
  if (request.method !== 'POST') {
    return respond(405, 'Method not allowed.');
  }

  // Load environment variables
  const secret =
    process.env.RESEND_WEBHOOK_SECRET?.trim();

  const supabaseUrl =
    process.env.SUPABASE_URL?.trim();

  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  // Verify server configuration
  if (!secret || !supabaseUrl || !serviceKey) {
    console.error(
      'DMC webhook configuration incomplete'
    );

    return respond(
      503,
      'Server configuration incomplete.'
    );
  }

  // Retrieve Svix authentication headers
  const eventId = request.headers.get('svix-id');

  const timestamp = request.headers.get(
    'svix-timestamp'
  );

  const signature = request.headers.get(
    'svix-signature'
  );

  if (!eventId || !timestamp || !signature) {
    console.warn(
      'DMC webhook missing authentication headers'
    );

    return respond(
      400,
      'Missing webhook headers.'
    );
  }

  const webhookHeaders: Record<string, string> = {
    'svix-id': eventId,
    'svix-timestamp': timestamp,
    'svix-signature': signature,
  };

  // Read the original request body
  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch {
    console.warn(
      'DMC webhook request body could not be read'
    );

    return respond(400, 'Invalid request body.');
  }

  // Enforce payload size limit
  if (Buffer.byteLength(rawBody, 'utf8') > 262144) {
    return respond(413, 'Payload too large.');
  }

  // STEP 1: Verify webhook authenticity
  // Do not depend on the return value of verify()
  try {
    const webhook = new Webhook(secret);

    webhook.verify(rawBody, webhookHeaders);

    console.info(
      'DMC webhook signature verified'
    );

  } catch {
    console.warn(
      'DMC webhook signature verification failed'
    );

    return respond(
      401,
      'Invalid webhook signature.'
    );
  }

  // STEP 2: Parse the authenticated JSON payload
  let verifiedEvent: unknown;

  try {
    verifiedEvent = JSON.parse(rawBody);

  } catch {
    console.warn(
      'DMC webhook JSON parsing failed'
    );

    return respond(
      400,
      'Invalid JSON payload.'
    );
  }

  // STEP 3: Validate basic event structure
  if (
    typeof verifiedEvent !== 'object' ||
    verifiedEvent === null ||
    Array.isArray(verifiedEvent)
  ) {
    console.warn(
      'DMC webhook invalid event structure'
    );

    return respond(
      400,
      'Invalid webhook event.'
    );
  }

  const incomingEvent =
    verifiedEvent as Record<string, unknown>;

  if (typeof incomingEvent.type !== 'string') {
    console.warn(
      'DMC webhook missing event type'
    );

    return respond(
      400,
      'Invalid event type.'
    );
  }

  // Ignore unsupported events
  if (!supportedEvents.has(incomingEvent.type)) {
    console.info(
      'DMC unsupported webhook event ignored'
    );

    return respond(200, 'Event ignored.');
  }

  // Validate supported event data
  if (!isValidEvent(verifiedEvent)) {
    console.warn(
      'DMC webhook event data validation failed'
    );

    return respond(
      400,
      'Invalid event data.'
    );
  }

  const event: ResendWebhookEvent = verifiedEvent;

  const emailId = event.data.email_id;
  const eventAt = event.created_at;

  console.info(
    'DMC authenticated webhook event:',
    event.type
  );

  // STEP 4: Update Supabase notification records
  try {
    const endpoint =
      supabaseUrl.replace(/\/+$/, '') +
      '/rest/v1/rpc/dmc_record_email_delivery';

    const response = await fetch(endpoint, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },

      body: JSON.stringify({
        p_event_id: eventId,
        p_email_id: emailId,
        p_event_type: event.type,
        p_event_at: eventAt,
      }),

      signal: AbortSignal.timeout(8000),
    });

    // Handle database errors
    if (!response.ok) {
      console.error(
        'DMC delivery status update failed:',
        response.status
      );

      return respond(
        503,
        'Database update failed.'
      );
    }

    const recorded: unknown =
      await response.json();

    // Allow Resend to retry unmatched notifications
    if (recorded !== true) {
      console.warn(
        'DMC webhook notification not yet matched'
      );

      return respond(
        503,
        'Notification not yet matched.'
      );
    }

    // Successful webhook processing
    console.info(
      'DMC delivery event recorded:',
      event.type
    );

    return respond(
      200,
      'Webhook processed successfully.'
    );

  } catch {
    console.error(
      'DMC webhook processing failed'
    );

    return respond(
      503,
      'Webhook processing failed.'
    );
  }
}
