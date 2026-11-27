import { createHash } from 'node:crypto';
import { processQueue } from '../lib/email-service';

const consultants: Record<string, string> = {
  'john-idahosa': 'Dr. John Idahosa',
  'ifedi-okonkwo': 'Dr. Ifedi Okonkwo',
  'dauda-deba-barau': 'Dr. Dauda Deba Barau',
};

const services: Record<string, string> = {
  'General Paediatric Consultation': 'Paediatrics Department',
  'Paediatric Follow-up': 'Paediatrics Department',
  'Sunshine Family & Psychotherapy Clinic': 'General Outpatient Department',
  'Pure Snow Dental Clinic': 'Dental Surgeon',
  'Absolute Vision Eye Clinic': 'Eye Specialist',
  'Physiotherapy & Rehabilitation': 'Physiotherapist',
  'Renal / Nephrology': 'Renal Specialist',
  'Stardatt Clinic': 'Radiology Specialist',
  'E.N.T. Clinic': 'ENT Specialist',
  'General Surgery': 'General Surgeon',
  'Andrology/Urology': 'Andrology/Urology Specialist',
  'Body Code Aesthetics': 'Anaesthesia Specialist',
};

class Invalid extends Error {}

function field(
  v: unknown,
  label: string,
  max = 200,
  required = true
): string {
  if (typeof v !== 'string' && (required || v != null)) {
    throw new Invalid(`Invalid ${label}.`);
  }

  const s = typeof v === 'string' ? v.trim() : '';

  if (
    (required && !s) ||
    s.length > max ||
    /[\x00-\x1f\x7f]/.test(s)
  ) {
    throw new Invalid(`Invalid ${label}.`);
  }

  return s;
}

function date(v: unknown, label: string) {
  const s = field(v, label, 10);
  const d = new Date(s + 'T00:00:00Z');

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(s) ||
    !Number.isFinite(d.getTime()) ||
    d.toISOString().slice(0, 10) !== s
  ) {
    throw new Invalid(`Invalid ${label}.`);
  }

  return s;
}

function today() {
  return new Date(Date.now() + 3600000)
    .toISOString()
    .slice(0, 10);
}

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

// ======================================================
// DMC PHYSICAL APPOINTMENT BOOKING HANDLER
// ======================================================

export default async function handler(
  request: Request
): Promise<Response> {

  // ----------------------------------------------------
  // 1. REQUEST METHOD AND ORIGIN VALIDATION
  // ----------------------------------------------------

  if (request.method !== 'POST') {
    return json({
      success: false,
      message: 'Method not allowed.',
    }, 405);
  }

  const origin = request.headers.get('origin');

  if (origin && origin !== new URL(request.url).origin) {
    return json({
      success: false,
      message: 'Invalid origin.',
    }, 403);
  }

  if (
    !request.headers
      .get('content-type')
      ?.includes('application/json')
  ) {
    return json({
      success: false,
      message: 'JSON required.',
    }, 415);
  }

  // ----------------------------------------------------
  // 2. ENVIRONMENT CONFIGURATION
  // ----------------------------------------------------

  const SUPABASE_URL =
    process.env.SUPABASE_URL?.trim() || '';

  const SUPABASE_SERVICE_ROLE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '';

  const RESEND_API_KEY =
    process.env.RESEND_API_KEY?.trim() || '';

  const DMC_FROM_EMAIL =
    process.env.DMC_FROM_EMAIL?.trim() || '';

  const DMC_NOTIFICATION_EMAIL =
    process.env.DMC_NOTIFICATION_EMAIL?.trim() || '';

  console.log('DMC Environment Configuration:', {
    SUPABASE_URL: !!SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: !!RESEND_API_KEY,
    DMC_FROM_EMAIL: !!DMC_FROM_EMAIL,
    DMC_NOTIFICATION_EMAIL: !!DMC_NOTIFICATION_EMAIL,
  });

  if (
    !SUPABASE_URL ||
    !SUPABASE_SERVICE_ROLE_KEY ||
    DMC_NOTIFICATION_EMAIL !==
      'appointments@diffmedicalcentre.com'
  ) {
    return json({
      success: false,
      message: 'Server configuration is incomplete.',
    }, 503);
  }

  try {

    // --------------------------------------------------
    // 3. REQUEST BODY VALIDATION
    // --------------------------------------------------

    const raw = await request.text();

    if (Buffer.byteLength(raw) > 20000) {
      return json({
        success: false,
        message: 'Request too large.',
      }, 413);
    }

    let b;

    try {
      b = JSON.parse(raw);
    } catch {
      throw new Invalid('Invalid request.');
    }

    if (
      !b ||
      typeof b !== 'object' ||
      Array.isArray(b)
    ) {
      throw new Invalid('Invalid request.');
    }

    // --------------------------------------------------
    // 4. CLOUDFLARE TURNSTILE SECURITY VERIFICATION
    // --------------------------------------------------

    const turnstileSecret =
      process.env.TURNSTILE_SECRET_KEY?.trim();

    const allowedHostnames = (
      process.env.TURNSTILE_ALLOWED_HOSTNAMES || ''
    )
      .split(',')
      .map(host => host.trim().toLowerCase())
      .filter(Boolean);

    if (
      !turnstileSecret ||
      !allowedHostnames.length
    ) {
      return json({
        success: false,
        message: 'Security configuration is incomplete.',
      }, 503);
    }

    if (
      typeof b.turnstileToken !== 'string' ||
      !b.turnstileToken ||
      b.turnstileToken.length > 2048
    ) {
      return json({
        success: false,
        message: 'Please complete the security verification.',
      }, 403);
    }

    try {

      const verification = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: b.turnstileToken,
          }),
          signal: AbortSignal.timeout(5000),
        }
      );

      if (!verification.ok) {
        throw new Error('verification_unavailable');
      }

      const security = await verification.json() as {
        success?: boolean;
        hostname?: string;
        action?: string;
      };

      if (
        security.success !== true ||
        !allowedHostnames.includes(
          (security.hostname || '').toLowerCase()
        ) ||
        security.action !== 'dmc_physical_booking'
      ) {
        console.warn(
          'DMC Turnstile verification rejected'
        );

        return json({
          success: false,
          message:
            'Security verification failed. Please try again.',
        }, 403);
      }

      console.log(
        'DMC Turnstile verification successful'
      );

    } catch {

      console.error(
        'DMC Turnstile verification unavailable'
      );

      return json({
        success: false,
        message:
          'Security verification is temporarily unavailable.',
      }, 503);
    }

    // --------------------------------------------------
    // 5. IDEMPOTENCY KEY VALIDATION
    // --------------------------------------------------

    const key = field(
      b.idempotencyKey,
      'request ID',
      36
    );

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key)
    ) {
      throw new Invalid('Invalid request ID.');
    }

    // --------------------------------------------------
    // 6. PATIENT INFORMATION VALIDATION
    // --------------------------------------------------

    const type = field(
      b.patientType,
      'patient type'
    );

    if (type !== 'new' && type !== 'existing') {
      throw new Invalid('Invalid patient type.');
    }

    const first = field(
      b.firstName,
      'first name'
    );

    const last = field(
      b.lastName,
      'last name'
    );

    const email = field(
      b.email,
      'email',
      254
    ).toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Invalid('Invalid email.');
    }

    const phone = field(
      b.phone,
      'phone',
      40
    );

    if (
      !/^[+\d(). -]{7,40}$/.test(phone) ||
      phone.replace(/\D/g, '').length < 7
    ) {
      throw new Invalid('Invalid phone number.');
    }

    const details: Record<string, unknown> = {
      first_name: first,
      last_name: last,
      whatsapp_phone: field(
        b.whatsappPhone,
        'WhatsApp phone',
        40,
        false
      ),
    };

    // --------------------------------------------------
    // 7. NEW AND EXISTING PATIENT DETAILS
    // --------------------------------------------------

    if (type === 'new') {

      details.middle_name = field(
        b.middleName,
        'middle name',
        200,
        false
      );

      for (
        const [input, output] of Object.entries({
          gender: 'gender',
          residentialAddress: 'residential_address',
          residentialCity: 'residential_city',
          stateOfOrigin: 'state_of_origin',
          maritalStatus: 'marital_status',
          nationality: 'nationality',
          nextOfKin: 'next_of_kin',
          nextOfKinRelationship:
            'next_of_kin_relationship',
        })
      ) {
        details[output] = field(
          b[input],
          input,
          500
        );
      }

      details.date_of_birth = date(
        b.dateOfBirth,
        'date of birth'
      );

      if (
        String(details.date_of_birth) > today()
      ) {
        throw new Invalid(
          'Date of birth cannot be in the future.'
        );
      }

      if (
        !Array.isArray(b.howDidYouHear) ||
        !b.howDidYouHear.length ||
        b.howDidYouHear.length > 30
      ) {
        throw new Invalid(
          'Please specify how you heard about DMC.'
        );
      }

      details.how_did_you_hear =
        b.howDidYouHear.map(
          (v: unknown) =>
            field(v, 'referral source', 200)
        );

    } else {

      details.unverified_hospital_number =
        field(
          b.hospitalNumber,
          'hospital number',
          100,
          false
        ) || null;

      details.hospital_number_verification =
        'pending';
    }

    // --------------------------------------------------
    // 8. APPOINTMENT AND CONSULTANT VALIDATION
    // --------------------------------------------------

    const category = field(
      b.appointmentType,
      'appointment type'
    );

    let service: string;
    let doctor: string;
    let consultantId: string | null = null;

    if (category === 'OBGYN/IVF') {

      if (b.obgynIvfPath !== 'consultants') {
        throw new Invalid(
          'Please contact the IVF administrators directly.'
        );
      }

      consultantId = field(
        b.consultantId,
        'consultant'
      );

      if (
        !Object.prototype.hasOwnProperty.call(
          consultants,
          consultantId
        )
      ) {
        throw new Invalid('Invalid consultant.');
      }

      doctor = consultants[consultantId];
      service = 'OBGYN/IVF';

    } else {

      service = field(
        b.specialistService,
        'service'
      );

      if (
        !Object.prototype.hasOwnProperty.call(
          services,
          service
        )
      ) {
        throw new Invalid('Invalid service.');
      }

      doctor = services[service];

      if (
        b.specialistDoctor !== doctor ||
        category !== (
          doctor === 'Paediatrics Department'
            ? 'Paediatrics'
            : 'Other Specialist Consultation'
        )
      ) {
        throw new Invalid(
          'Invalid service selection.'
        );
      }
    }

    // --------------------------------------------------
    // 9. CONSULTATION DATE AND TIME VALIDATION
    // --------------------------------------------------

    const requestedDate = date(
      b.requestedDate,
      'consultation date'
    );

    const requestedTime = field(
      b.requestedTime,
      'consultation time',
      5,
      false
    );

    if (
      requestedTime
        ? !/^([01]\d|2[0-3]):[03]0$/.test(requestedTime)
        : doctor !== 'General Outpatient Department' ||
          b.callAhead !== true
    ) {
      throw new Invalid(
        'Invalid consultation time.'
      );
    }

    // --------------------------------------------------
    // 10. PREPARE PATIENT AND APPOINTMENT RECORDS
    // --------------------------------------------------

    const patient = {
      patient_type: type,
      full_name: [
        first,
        details.middle_name,
        last,
      ].filter(Boolean).join(' '),
      email,
      phone,
      hospital_number: null,
      patient_details: details,
    };

    const appointment = {
      appointment_mode: 'physical',
      service_name: service,
      consultant_name: doctor,
      requested_date: requestedDate,
      requested_time: requestedTime || null,
      starts_at: null,
      ends_at: null,
      booking_details: {
        appointment_type: category,
        consultant_id: consultantId,
        call_ahead_requested: !requestedTime,
      },
    };

    // --------------------------------------------------
    // 11. DUPLICATE SUBMISSION PROTECTION
    // --------------------------------------------------

    const hash = createHash('sha256')
      .update(
        JSON.stringify({
          patient,
          appointment,
        })
      )
      .digest('hex');

    const idempotency = createHash('sha256')
      .update(key + ':' + hash)
      .digest('hex');

    if (requestedDate < today()) {
      throw new Invalid(
        'Please select a current or future consultation date.'
      );
    }

    // --------------------------------------------------
    // 12. SUPABASE DATABASE SUBMISSION
    // --------------------------------------------------

    const db = await fetch(
      `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/rpc/dmc_create_appointment_with_notifications`,
      {
        method: 'POST',
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization:
            `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          p_patient: patient,
          p_appointment: {
            ...appointment,
            idempotency_key: idempotency,
          },
          p_hospital_email: DMC_NOTIFICATION_EMAIL,
        }),
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!db.ok) {

      console.error(
        'DMC Supabase submission failed:',
        db.status
      );

      return json({
        success: false,
        message:
          'Unable to save your request. Please retry.',
      }, 502);
    }

    // --------------------------------------------------
    // 13. VERIFY DATABASE RESPONSE
    // --------------------------------------------------

    const responseData: unknown = await db.json();

    if (
      !responseData ||
      typeof responseData !== 'object' ||
      Array.isArray(responseData)
    ) {
      return json({
        success: false,
        message: 'Invalid database response.',
      }, 502);
    }

    const result = responseData as {
      appointment_id?: string;
      booking_reference?: string;
      status?: string;
      duplicate_submission?: boolean;
    };

    if (
      typeof result.booking_reference !== 'string' ||
      !result.booking_reference
    ) {
      return json({
        success: false,
        message:
          'Unable to verify your booking. Please retry.',
      }, 502);
    }

    const reference = result.booking_reference;

    // --------------------------------------------------
    // 14. PATIENT AND HOSPITAL EMAIL NOTIFICATIONS
    // --------------------------------------------------

    let patientEmail = 'queued';
    let hospitalEmail = 'queued';

    if (result.appointment_id) {

      try {

        const outcomes = await processQueue(
          result.appointment_id,
          2
        );

        patientEmail =
          outcomes.patient ?? 'queued';

        hospitalEmail =
          outcomes.hospital ?? 'queued';

      } catch {

        console.error(
          'DMC queue processing deferred'
        );
      }
    }

    // --------------------------------------------------
    // 15. SUCCESSFUL APPOINTMENT RESPONSE
    // --------------------------------------------------

    return json({
      success: true,
      bookingReference: reference,
      status: result.status ?? 'pending',
      patientEmail,
      hospitalEmail,
    });

  } catch (e) {

    if (e instanceof Invalid) {
      return json({
        success: false,
        message: e.message,
      }, 400);
    }

    return json({
      success: false,
      message:
        'Unable to verify submission. Please retry.',
    }, 502);
  }
}

// ======================================================
// 16. NETLIFY NATIVE RATE LIMITING
// ======================================================
// Protects the physical appointment submission endpoint.
// Threshold: 5 requests within 60 seconds.
// Requests are grouped by visitor IP address and domain.
// Excessive requests receive HTTP 429.
// ======================================================

export const config = {
  path: '/.netlify/functions/create-appointment',
  rateLimit: {
    action: 'rate_limit',
    windowLimit: 5,
    windowSize: 60,
    aggregateBy: ['ip', 'domain'],
  },
};