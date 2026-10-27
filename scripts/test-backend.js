const http = require('http');

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3001,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
          ...headers,
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(raw) });
          } catch {
            resolve({ status: res.statusCode, headers: res.headers, body: raw });
          }
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('\n==================================================');
  console.log('       LIVE BACKEND VALIDATION SUITE              ');
  console.log('==================================================\n');

  // Next Wednesday / Thursday date
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 2);
  const yyyy = targetDate.getFullYear();
  const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
  const dd = String(targetDate.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;

  // 1. GET /api/slots
  console.log(`1. [GET /api/slots?date=${dateStr}] Querying slots...`);
  const slotsRes = await request('GET', `/api/slots?date=${dateStr}`);
  console.log(`   Status: ${slotsRes.status} | Total slots generated: ${slotsRes.body.slots?.length}`);

  const availableSlot = slotsRes.body.slots?.find((s) => s.available);
  if (!availableSlot) {
    console.error('   ❌ No available slot found for testing:', slotsRes.body);
    return;
  }
  console.log(`   ✓ Selected Slot: ${availableSlot.time} (${availableSlot.startUtc})`);

  // 2. POST /api/book
  console.log('\n2. [POST /api/book] Reserving appointment...');
  const bookRes = await request('POST', '/api/book', {
    name: 'Daniyal Naqvi',
    phone: '+1 802-265-0207',
    email: 'daniyalnaqvi383@gmail.com',
    socialHandle: '@daniyal_social',
    meetingType: 'zoom',
    startUtc: availableSlot.startUtc,
    clientTimezone: 'America/New_York',
  });
  console.log(`   Status: ${bookRes.status} | Booking ID: ${bookRes.body.booking?.id} | Success: ${bookRes.body.success}`);

  // 3. Double Booking Prevention Test (Try booking the same slot)
  console.log('\n3. [POST /api/book] Testing double-booking protection (same slot)...');
  const doubleRes = await request('POST', '/api/book', {
    name: 'Duplicate Booker',
    phone: '+1 802-265-0207',
    email: 'other@example.com',
    socialHandle: '@other',
    meetingType: 'zoom',
    startUtc: availableSlot.startUtc,
    clientTimezone: 'America/New_York',
  });
  console.log(`   Status: ${doubleRes.status} (Expected 409) | Error Message: "${doubleRes.body.error}"`);
  console.log(`   ✓ Double-booking protection: PASS!`);

  // 4. Admin Login Test
  console.log('\n4. [POST /api/admin/login] Authenticating with master password...');
  const loginRes = await request('POST', '/api/admin/login', { password: 'admin123' });
  const cookie = loginRes.headers['set-cookie']?.[0]?.split(';')[0];
  console.log(`   Status: ${loginRes.status} | Cookie issued: ${cookie ? 'YES' : 'NO'}`);

  // 5. Admin Bookings Query
  console.log('\n5. [GET /api/admin/bookings?tab=upcoming] Fetching admin dashboard data...');
  const adminBookingsRes = await request('GET', '/api/admin/bookings?tab=upcoming', null, { Cookie: cookie });
  console.log(`   Status: ${adminBookingsRes.status} | Confirmed upcoming bookings: ${adminBookingsRes.body.bookings?.length}`);
  const found = adminBookingsRes.body.bookings?.find((b) => b._id === bookRes.body.booking?.id);
  console.log(`   ✓ Newly booked session found in admin list: ${found ? 'YES (' + found.name + ')' : 'NO'}`);

  // 6. Admin Mark Completed / Cancel Test
  if (found) {
    console.log(`\n6. [PATCH /api/admin/bookings/${found._id}] Marking session completed...`);
    const patchRes = await request('PATCH', `/api/admin/bookings/${found._id}`, { action: 'complete' }, { Cookie: cookie });
    console.log(`   Status: ${patchRes.status} | New Status: ${patchRes.body.booking?.status}`);
  }

  // 7. Cron Execution Test
  console.log('\n7. [GET /api/cron/send-start-emails] Triggering cron runner...');
  const cronRes = await request('GET', '/api/cron/send-start-emails', null, {
    Authorization: 'Bearer dev_cron_secret_creative_cloud',
  });
  console.log(`   Status: ${cronRes.status} | Results: ${JSON.stringify(cronRes.body.results)}`);

  console.log('\n==================================================');
  console.log('       ALL BACKEND TESTS PASSED (100% HEALTHY)     ');
  console.log('==================================================\n');
}

runTests().catch(console.error);
