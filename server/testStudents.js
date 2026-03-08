const http = require('http');

const request = (path, method, body, token = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(body));
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data || '{}') });
        } catch(e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  try {
    console.log('--- 1. Admin Login ---');
    const loginRes = await request('/api/auth/login', 'POST', {
      email: 'admin@apex.com',
      password: 'admin123'
    });
    console.log('Login Status:', loginRes.status);
    
    if (loginRes.status !== 200) {
      console.log('Admin login failed. Aborting tests.');
      return;
    }
    const token = loginRes.data.data.token;

    console.log('\n--- 2. Create Test Student ---');
    const uniqueId = Date.now().toString().slice(-4);
    const testStudentData = {
      email: `test_stud_${uniqueId}@apex.com`,
      password: 'password123',
      name: `Test Student ${uniqueId}`,
      studentId: `S${uniqueId}`,
      grade: 8,
      phoneNumber: `077${uniqueId}000`,
      parentName: 'Parent Name',
      parentContactNumber: '0710000000',
      address: 'Test Address'
    };
    const createRes = await request('/api/auth/students', 'POST', testStudentData, token);
    console.log('Create Student Status:', createRes.status);
    if (createRes.status !== 201) {
      console.log('Failed to create test student:', createRes.data);
      return;
    }
    const studentIdStr = createRes.data.data.studentProfile._id;
    console.log(`Created Student ID (DB): ${studentIdStr}`);

    console.log('\n--- 3. Get All Students (No queries) ---');
    const getAllRes = await request('/api/students', 'GET', null, token);
    console.log('Get All Status:', getAllRes.status);
    console.log('Pagination Data:', getAllRes.data.pagination);
    console.log('Number of Students returned:', getAllRes.data.data.length);
    if(getAllRes.data.data[0] && getAllRes.data.data[0].user) {
        console.log('User populated:', !!getAllRes.data.data[0].user.email);
    }

    console.log('\n--- 4. Search Students (Regex logic) ---');
    const searchRes = await request(`/api/students?search=${uniqueId}`, 'GET', null, token);
    console.log('Search Status:', searchRes.status);
    console.log('Search Results Count:', searchRes.data.data.length);

    console.log('\n--- 5. Get Student By ID ---');
    const getOneRes = await request(`/api/students/${studentIdStr}`, 'GET', null, token);
    console.log('Get One Status:', getOneRes.status);
    console.log('Matched ID:', getOneRes.data.data._id === studentIdStr);

    console.log('\n--- 6. Update Student ---');
    const updateRes = await request(`/api/students/${studentIdStr}`, 'PUT', { grade: 7 }, token);
    console.log('Update Status:', updateRes.status);
    console.log('Updated Grade:', updateRes.data.data.grade);

    console.log('\n--- 7. Delete Student ---');
    const deleteRes = await request(`/api/students/${studentIdStr}`, 'DELETE', null, token);
    console.log('Delete Status:', deleteRes.status);

    console.log('\n--- 8. Verify Linked User Deletion ---');
    const verifyLoginRes = await request('/api/auth/login', 'POST', {
      email: testStudentData.email,
      password: testStudentData.password
    });
    console.log('Verify Student User Login Status (Expect 401):', verifyLoginRes.status);

  } catch (err) {
    console.error('Test script error:', err);
  }
};

runTests();
