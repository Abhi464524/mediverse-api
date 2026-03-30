import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const testUser = {
  userName: "testuser_" + Date.now(),
  password: "password123",
  role: "user"
};

async function testUserFlow() {
    try {
        console.log('--- Testing Register User ---');
        const registerResponse = await axios.post(`${API_BASE_URL}/users/signup`, testUser);
        console.log('Register Response Status:', registerResponse.status);
        console.log('Registered User:', registerResponse.data);

        console.log('\n--- Testing Login User ---');
        const loginResponse = await axios.post(`${API_BASE_URL}/users/login`, {
            userName: testUser.userName,
            password: testUser.password
        });
        console.log('Login Response Status:', loginResponse.status);
        console.log('Login Response:', loginResponse.data);

    } catch (error: any) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testUserFlow();
