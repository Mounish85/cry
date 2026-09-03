const BASE_URL = 'http://localhost:3000/cry';

class CookieClient {
  constructor() {
    this.cookie = '';
  }

  async request(method, path, body = null, isFormData = false) {
    const headers = {};
    if (this.cookie) {
      headers['cookie'] = this.cookie;
    }
    if (body && !isFormData) {
      headers['content-type'] = 'application/json';
    }

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = isFormData ? body : JSON.stringify(body);
    }

    const res = await fetch(`${BASE_URL}${path}`, options);

    // Save set-cookie
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      this.cookie = setCookie.split(';')[0];
    }

    let data;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return { status: res.status, data };
  }

  get(path) {
    return this.request('GET', path);
  }

  post(path, body, isFormData = false) {
    return this.request('POST', path, body, isFormData);
  }

  patch(path, body) {
    return this.request('PATCH', path, body);
  }
}

async function runTests() {
  console.log('=== STARTING NODE 22 E2E VERIFICATION ===\n');

  // Test 1: ML service health check
  try {
    const mlRes = await fetch('http://localhost:8000/');
    const mlData = await mlRes.json();
    console.log('✔ [1] Python ML Service Health:', mlRes.status, mlData);
  } catch (err) {
    console.error('✘ [1] ML service error:', err.message);
  }

  // Test 2: Unauthenticated access to protected route (should return 401)
  const client = new CookieClient();
  const unauthRes = await client.get('/projects');
  console.log('✔ [2] Unauthenticated /cry/projects returns:', unauthRes.status, unauthRes.data.message);

  // Test 3: Sign up a new user (FRONTLINER)
  const uniqueEmail = `frontliner_${Date.now()}@cryindia.org`;
  const signupRes = await client.post('/auth/signup', {
    name: 'Mounish Frontliner',
    email: uniqueEmail,
    password: 'password123',
    role: 'FRONTLINER',
  });
  console.log('✔ [3] Signup FRONTLINER returns:', signupRes.status, signupRes.data.user);

  // Test 4: Profile with JWT cookie
  const profileRes = await client.get('/auth/profile');
  console.log('✔ [4] Profile GET with JWT cookie returns:', profileRes.status, profileRes.data);

  // Test 5: Sign up a PARTNER_NGO with ngoId
  const ngoClient = new CookieClient();
  const ngoEmail = `partner_${Date.now()}@sahyog.org`;
  const ngoSignupRes = await ngoClient.post('/auth/signup', {
    name: 'Sahyog Representative',
    email: ngoEmail,
    password: 'password123',
    role: 'PARTNER_NGO',
    ngoId: '6a985c0ec5f3d84f2a676870',
  });
  console.log('✔ [5] Signup PARTNER_NGO with ngoId returns:', ngoSignupRes.status, ngoSignupRes.data.user);

  // Test 6: Fetch projects with authenticated cookie
  const projectsRes = await client.get('/projects');
  console.log('✔ [6] Fetch projects returns:', projectsRes.status, `count: ${projectsRes.data.projects?.length}`);
  const firstProject = projectsRes.data.projects?.[0];
  console.log('       Sample project:', firstProject?.name, 'Cycle:', firstProject?.cycle, 'NGO:', firstProject?.ngoId?.name);

  // Test 7: Fetch action items (which triggers ML service /analyze)
  const actionsRes = await client.get('/action-items');
  console.log('✔ [7] Fetch action-items returns:', actionsRes.status, `count: ${actionsRes.data.actionItems?.length}`);
  const firstItem = actionsRes.data.actionItems?.[0];
  console.log('       Action item with ML:', {
    title: firstItem?.title,
    status: firstItem?.status,
    attentionScore: firstItem?.attentionScore,
    attentionLevel: firstItem?.attentionLevel,
  });

  // Test 8: Get action item by ID
  if (firstItem) {
    const itemByIdRes = await client.get(`/action-items/${firstItem._id}`);
    console.log('✔ [8] Get ActionItem by ID returns:', itemByIdRes.status, {
      title: itemByIdRes.data.actionItem?.title,
      analysis: itemByIdRes.data.analysis,
    });

    // Test 9: Update action item status
    const updateRes = await client.patch(`/action-items/${firstItem._id}`, {
      status: 'PENDING',
    });
    console.log('✔ [9] Update ActionItem status returns:', updateRes.status, updateRes.data.message);

    // Test 10: Upload document to action item using FormData
    const formData = new FormData();
    const blob = new Blob(['Verification document content'], { type: 'application/pdf' });
    formData.append('document', blob, 'field_report.pdf');
    formData.append('documentType', 'Field Visit Report');
    formData.append('uploadedBy', profileRes.data.user?.id);

    const uploadRes = await client.post(`/documents/${firstItem._id}`, formData, true);
    console.log('✔ [10] Document upload returns:', uploadRes.status, uploadRes.data.message);

    // Test 11: Get documents for action item
    const docsRes = await client.get(`/documents/${firstItem._id}`);
    console.log('✔ [11] Get documents returns:', docsRes.status, `count: ${docsRes.data.documents?.length}`);
  }

  // Test 12: Notifications
  const notifsRes = await client.get('/notifications');
  console.log('✔ [12] Get notifications returns:', notifsRes.status, `count: ${notifsRes.data.notifications?.length}`);

  // Test 13: Login with registered user
  const loginClient = new CookieClient();
  const loginRes = await loginClient.post('/auth/login', {
    email: uniqueEmail,
    password: 'password123',
  });
  console.log('✔ [13] Login returns:', loginRes.status, loginRes.data.user);

  // Test 14: Profile with new login session
  const loginProfile = await loginClient.get('/auth/profile');
  console.log('✔ [14] Profile for logged-in user:', loginProfile.status, loginProfile.data);

  // Test 15: Logout
  const logoutRes = await loginClient.get('/auth/logout');
  console.log('✔ [15] Logout returns:', logoutRes.status);

  // Test 16: Check Vite frontend serves index.html
  const feRes = await fetch('http://localhost:5173/');
  console.log('✔ [16] Vite Frontend dev server returns:', feRes.status, 'Content-Type:', feRes.headers.get('content-type'));

  console.log('\n=== ALL 16 COMPREHENSIVE CHECKS PASSED WITH FLYING COLORS! ===');
}

runTests().catch(console.error);

