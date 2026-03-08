const http = require('http');

const request = (path, method, body, token = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
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
    console.log('--- Testing Admin Login ---');
    const loginRes = await request('/api/auth/login', 'POST', {
      email: 'admin@apex.com',
      password: 'admin123'
    });
    console.log('Login Status:', loginRes.status);
    
    if (loginRes.status !== 200) {
      console.log('Login failed:', loginRes.data);
      return;
    }
    
    const token = loginRes.data.token;
    console.log('Admin Token:', token ? 'Received' : 'Missing');

    console.log('\n--- Testing Get Me ---');
    const meRes = await request('/api/auth/me', 'GET', null, token);
    console.log('Get Me Status:', meRes.status);
    console.log('Is Admin:', meRes.data.role === 'admin');

    console.log('\n--- Testing Create Teacher ---');
    const teacherData = {
      email: 'teacher1@apex.com',
      password: 'password123',
      name: 'John Doe',
      teacherId: 'T1001',
      subject: 'Mathematics',
      phoneNumber: '0712345678',
      assignedGrades: [6, 7]
    };
    const createTeacherRes = await request('/api/auth/teachers', 'POST', teacherData, token);
    console.log('Create Teacher Status:', createTeacherRes.status);
    if (createTeacherRes.status === 201) {
      console.log('Teacher created successfully, role:', createTeacherRes.data.role);
    } else {
      console.log('Create Teacher failed:', createTeacherRes.data);
    }
    
    console.log('\n--- Testing Create Student ---');
    const studentData = {
      email: 'student1@apex.com',
      password: 'password123',
      name: 'Jane Smith',
      studentId: 'S1001',
      grade: 6,
      phoneNumber: '0777123456',
      parentName: 'Jack Smith',
      parentContactNumber: '0777654321',
      address: '123 Main St'
    };
    const createStudentRes = await request('/api/auth/students', 'POST', studentData, token);
    console.log('Create Student Status:', createStudentRes.status);
    if (createStudentRes.status === 201) {
      console.log('Student created successfully, role:', createStudentRes.data.role);
    } else {
       console.log('Create Student failed:', createStudentRes.data);
    }
    
    console.log('\n--- Testing Teacher Login ---');
    const teacherLoginRes = await request('/api/auth/login', 'POST', {
      email: 'teacher1@apex.com',
      password: 'password123'
    });
    console.log('Teacher Login Status:', teacherLoginRes.status);
    if(teacherLoginRes.data.teacherProfile) {
      console.log('Teacher profile included in login response');
    }

  } catch (err) {
    console.error('Test script error:', err);
  }
};

runTests();
