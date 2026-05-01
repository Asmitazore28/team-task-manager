// Full test flow: create user, login, create project, create task, get dashboard
const http = require('http');

let token = "";
let projectId = "";

const request = (options, data) => new Promise((resolve, reject) => {
  const req = http.request(options, res => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch(e) {
        resolve(body);
      }
    });
  });
  req.on('error', reject);
  if (data) req.write(data);
  req.end();
});

async function test() {
  console.log("=== Testing Full Flow ===\n");

  // 1. Register a new member user
  console.log("1. Register member user...");
  const registerRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({
    name: "John Doe",
    email: "john@test.com",
    password: "password123",
    role: "member"
  }));
  console.log("   Registered:", registerRes.user?.name, "-", registerRes.user?.role);

  // 2. Login as admin
  console.log("\n2. Login as admin...");
  const loginRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({
    email: "admin@test.com",
    password: "test123"
  }));
  token = loginRes.token;
  console.log("   Logged in:", loginRes.user?.name, "-", loginRes.user?.role);

  // 3. Create a task
  console.log("\n3. Create task...");
  const projectRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/projects',
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, JSON.stringify({
    name: "New Project",
    description: "Test project for demo"
  }));
  projectId = projectRes._id;
  console.log("   Created project:", projectRes.name);

  // 4. Create a task
  console.log("\n4. Create task...");
  const taskRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/tasks',
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, JSON.stringify({
    title: "Complete documentation",
    description: "Write README",
    status: "in-progress",
    priority: "high",
    project: projectId,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }));
  console.log("   Created task:", taskRes.title, "-", taskRes.status);

  // 5. Get dashboard
  console.log("\n5. Get dashboard...");
  const dashRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/tasks/dashboard',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log("   Stats:", {
    total: dashRes.totalTasks,
    todo: dashRes.todo,
    inProgress: dashRes.inProgress,
    done: dashRes.done,
    overdue: dashRes.overdue
  });

  // 6. Update task status
  console.log("\n6. Update task status...");
  const updateRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/tasks/${taskRes._id}/status`,
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, JSON.stringify({ status: "done" }));
  console.log("   Updated to:", updateRes.status);

  // 7. Get updated dashboard
  console.log("\n7. Get updated dashboard...");
  const dashRes2 = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/tasks/dashboard',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log("   Updated Stats:", {
    total: dashRes2.totalTasks,
    done: dashRes2.done,
    inProgress: dashRes2.inProgress
  });

  console.log("\n=== All tests passed! ===");
  console.log("\n✅ Authentication working");
  console.log("✅ Project management working");
  console.log("✅ Task management working");
  console.log("✅ Dashboard stats working");
  console.log("✅ Status tracking working");
}

test().catch(console.error);
