import axios from 'axios';

const baseUrl = 'http://localhost:8000/api';

async function testAuth() {
  const randomEmail = `testuser${Math.floor(Math.random() * 10000)}@example.com`;
  try {
    // Signup with required fields
    let res = await axios.post(baseUrl + '/auth/signup', {
      name: 'Test User',
      email: randomEmail,
      password: 'TestPass123',
      role: 'student'
    });
    console.log('Signup:', res.data);

    // Login
    res = await axios.post(baseUrl + '/auth/login', {
      email: randomEmail,

      password: 'TestPass123'
    });
    console.log('Login:', res.data);
    const token = res.data.token;

    // Logout
    res = await axios.get(baseUrl + '/auth/logout', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Logout:', res.data);

  } catch (error) {
    console.error('Auth test error:', error.response?.data || error.message);
  }
}

async function testAiChat() {
  try {
    const res = await axios.post(baseUrl + '/ai/chat', { message: 'Hello, how are you?' });
    console.log('AI Chat initiated - check for streaming responses');
    // For streaming responses, we need to handle the response differently
    // This is a basic test - real streaming would need proper EventSource handling
  } catch (error) {
    console.error('AI Chat error:', error.response?.data || error.message);
  }
}

async function testWebsiteQuery() {
  try {
    const res = await axios.post(baseUrl + '/ai/chat', { message: 'what is this website about?' });
    console.log('Website Query test initiated - check for streaming responses');
  } catch (error) {
    console.error('Website Query error:', error.response?.data || error.message);
  }
}

async function testCoursesQuery() {
  try {
    const res = await axios.post(baseUrl + '/ai/chat', { message: 'tell me about all courses' });
    console.log('Courses Query test initiated - check for streaming responses');
  } catch (error) {
    console.error('Courses Query error:', error.response?.data || error.message);
  }
}

async function testAiSearch() {
  try {
    const res = await axios.post(baseUrl + '/ai/search', { input: 'AI' });
    console.log('AI Search:', res.data);
  } catch (error) {
    console.error('AI Search error:', error.response?.data || error.message);
  }
}

async function testCourse() {
  try {
    const res = await axios.get(baseUrl + '/course/getpublishedcoures');
    console.log('Get Published Courses:', res.data);
  } catch (error) {
    console.error('Course test error:', error.response?.data || error.message);
  }
}

async function runTests() {
  await testAuth();
  await testAiChat();
  await testWebsiteQuery();
  await testCoursesQuery();
  await testAiSearch();
  await testCourse();
}

runTests();
