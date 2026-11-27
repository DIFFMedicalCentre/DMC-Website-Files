type Notification = {id:string; appointment_id:string; notification_type:'patient'|'hospital'; recipient_email:string; claim_token:string};
type Patient = {patient_type:string; email:string; phone:string; patient_details:Record<string,unknown>};
type Appointment = {booking_reference:string; patient_id:string; service_name:string; consultant_name:string; requested_date:string; requested_time:string|null; booking_details:Record<string,unknown>};
function env(name:string) { const v=process.env[name]?.trim(); if(!v) throw new Error('configuration_error'); return v; }
async function db<T>(path:string, body?:object):Promise<T> {
  const key=env('SUPABASE_SERVICE_ROLE_KEY');
  const r=await fetch(`${env('SUPABASE_URL').replace(/\/+$/, '')}/rest/v1/${path}`,{method:body?'POST':'GET',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(5000)});
  if(!r.ok) throw new Error('database_error');
  return await r.json() as T;
}
function hospitalContent(p:Patient,a:Appointment) {
 const {patient_type:type,email,phone,patient_details:details}=p;
 const first=details.first_name,last=details.last_name,reference=a.booking_reference,category=a.booking_details.appointment_type,service=a.service_name,doctor=a.consultant_name,requestedDate=a.requested_date,requestedTime=a.requested_time?.slice(0,5);
    type EmailRow = [string, unknown];
    const display = (value: unknown): string => Array.isArray(value)
      ? value.join(', ') || 'Not provided'
      : value == null || value === '' ? 'Not provided' : String(value);
    const escapeHtml = (value: unknown): string => display(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c));
    const patientRows: EmailRow[] = [
      ['Patient type', type === 'new' ? 'New Patient' : 'Existing Patient'],
      ['First name', first],
      ...(type === 'new' ? [['Middle name', details.middle_name] as EmailRow] : []),
      ['Last name', last], ['Email address', email], ['Phone number', phone],
      ['WhatsApp number', details.whatsapp_phone],
    ];
    if (type === 'new') {
      patientRows.push(['Gender', details.gender], ['Date of birth', details.date_of_birth],
        ['Residential address', details.residential_address], ['LGA', details.residential_city],
        ['State of origin', details.state_of_origin], ['Nationality', details.nationality],
        ['Marital status', details.marital_status], ['Next of kin', details.next_of_kin],
        ['Relationship', details.next_of_kin_relationship], ['How did you hear about us?', details.how_did_you_hear]);
    } else {
      patientRows.push(['Hospital number (unverified)', details.unverified_hospital_number], ['Hospital number verification', 'Pending manual verification']);
    }
    const appointmentRows: EmailRow[] = [
      ['Appointment mode', 'Physical / In-Person'], ['Department / category', category],
      ['Requested service', service], ['Consultant / specialist', doctor],
      ['Preferred consultation date', requestedDate],
      ['Preferred consultation time (WAT)', requestedTime || 'Call ahead to arrange time'],
      ['Appointment status', 'Pending Confirmation'],
    ];
    const action = 'Contact the patient, verify the submitted information and hospital number where applicable, confirm availability and initiate the actual appointment booking. Verify the recipient before replying; the submitted email address is not independently verified.';
    const textRows = (rows: EmailRow[]) => rows.map(([label,value]) => `${label}: ${display(value)}`).join('\n');
    const htmlRows = (rows: EmailRow[]) => rows.map(([label,value]) => `<tr><th scope="row" align="left" style="padding:10px;border-bottom:1px solid #e2e8f0;color:#475569;font-weight:normal;width:43%;vertical-align:top">${escapeHtml(label)}</th><td style="padding:10px;border-bottom:1px solid #e2e8f0;overflow-wrap:anywhere;vertical-align:top">${escapeHtml(value)}</td></tr>`).join('');
    const section = (heading: string, rows: EmailRow[]) => `<h2 style="font-size:17px;color:#092957;margin:24px 0 8px">${heading}</h2><table style="width:100%;border-collapse:collapse;font-size:14px;table-layout:fixed">${htmlRows(rows)}</table>`;
    const hospitalText = `Dear Front Desk Officer,\n\nNew physical appointment request.\nBooking reference: ${reference}\n\nPATIENT DETAILS\n${textRows(patientRows)}\n\nAPPOINTMENT REQUEST\n${textRows(appointmentRows)}\n\nREQUIRED ACTION\n${action}\n\nConfidential — For authorised DMC personnel only.`;
    const hospitalHtml = `<!doctype html><html lang="en"><body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#172b45"><div style="max-width:680px;margin:0 auto;background:#ffffff"><div style="background:#092957;color:#ffffff;padding:28px"><h1 style="font-size:24px;margin:0">DIFF MEDICAL CENTRE</h1><p style="color:#a5f3fc;font-size:13px">ONLINE APPOINTMENT BOOKING PORTAL</p><h2 style="font-size:20px;margin-bottom:0">New Physical Appointment Request</h2></div><div style="padding:24px"><p>Dear Front Desk Officer,</p><p>A new physical appointment request has been submitted. Kindly review the information below.</p><div style="background:#ecfeff;border:1px solid #a5f3fc;padding:16px;border-radius:8px">Booking reference<br><strong style="font-size:22px;color:#092957">${escapeHtml(reference)}</strong><p style="color:#92400e;margin-bottom:0">Pending Confirmation</p></div>${section('SECTION A — PATIENT DETAILS',patientRows)}${section('SECTION B — APPOINTMENT REQUEST',appointmentRows)}<h2 style="font-size:17px;color:#092957">SECTION C — REQUIRED ACTION</h2><p>${escapeHtml(action)}</p><p style="font-size:12px;color:#475569">Confidential — For authorised DMC personnel only.</p></div><div style="background:#092957;color:#ffffff;text-align:center;padding:20px">DIFF Medical Centre<br>www.diffmedicalcentre.com</div></div></body></html>`;
 return {subject:`New Physical Appointment Request | ${reference}`,text:hospitalText,html:hospitalHtml,reply_to:email};
}
async function send(n:Notification):Promise<'accepted'|'queued'|'failed'> {
 let outcome='retry', error='unknown_error', providerId:string|null=null;
 try {
  const [a]=await db<Appointment[]>(`dmc_appointments?id=eq.${encodeURIComponent(n.appointment_id)}&select=booking_reference,patient_id,service_name,consultant_name,requested_date,requested_time,booking_details`);
  if(!a) throw new Error('database_error');
  const [p]=await db<Patient[]>(`dmc_patients?id=eq.${encodeURIComponent(a.patient_id)}&select=patient_type,email,phone,patient_details`);
  if(!p) throw new Error('database_error');
  if(n.notification_type==='hospital' && n.recipient_email!=='appointments@diffmedicalcentre.com') {outcome='failed';error='configuration_error';}
  else if(n.notification_type==='patient' && n.recipient_email!==p.email.toLowerCase().trim()) {outcome='failed';error='invalid_request';}
  else {
   const content=n.notification_type==='hospital'?hospitalContent(p,a):{subject:'DMC appointment request received',text:`DIFF Medical Centre has received an appointment request. Reference: ${a.booking_reference}. This is not a confirmed appointment. Our team will contact you. If you did not submit this request, please disregard this message.`};
   const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env('RESEND_API_KEY')}`,'Content-Type':'application/json','Idempotency-Key':`dmc-queue-${n.id}`},body:JSON.stringify({from:env('DMC_FROM_EMAIL'),to:[n.recipient_email],...content}),signal:AbortSignal.timeout(5000)});
   if(r.ok){const data=await r.json() as {id?:string};if(typeof data.id==='string' && data.id){providerId=data.id;outcome='sent';}}
   else if(r.status===429){error='rate_limited';}
   else if(r.status>=500 || r.status===408){error='provider_unavailable';}
   else if(r.status===409){error='provider_conflict';} 
   else {outcome='failed';error=[401,403].includes(r.status)?'configuration_error':'invalid_request';}
  }
 } catch(e) {error=e instanceof Error && e.message==='configuration_error'?'configuration_error':'network_error';}
 const finished=await db<boolean>('rpc/dmc_finish_email_attempt',{p_id:n.id,p_claim_token:n.claim_token,p_outcome:outcome,p_resend_email_id:providerId,p_error_code:error});
 if(!finished) return 'queued';
 return outcome==='sent'?'accepted':outcome==='failed'?'failed':'queued';
}
export async function processQueue(appointmentId:string|null=null,limit=2):Promise<Partial<Record<'patient'|'hospital','accepted'|'queued'|'failed'>>> {
 const rows=await db<Notification[]>('rpc/dmc_claim_email_notifications',{p_limit:limit,p_appointment_id:appointmentId});
 const results=await Promise.allSettled(rows.map(async n=>({type:n.notification_type,status:await send(n)})));
 const output:Partial<Record<'patient'|'hospital','accepted'|'queued'|'failed'>>={};
 for(const r of results) {if(r.status==='fulfilled') output[r.value.type]=r.value.status;else console.error('DMC notification completion deferred');}
 return output;
}
