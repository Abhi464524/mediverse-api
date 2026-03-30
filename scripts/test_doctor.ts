import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const doctorProfile = {
  "username": "Dr John",
  "role": "doctor",
  "speciality": "Cardiologist",

  "personalInfo": {
    "username": "Dr John Doe",
    "specialization": "Cardiologist",
    "yearsOfExperience": "8 Years"
  },

  "contactDetails": {
    "phoneNumber": "+1 234-567-8900",
    "emailAddress": "doctor@clinic.com"
  },

  "clinicDetails": {
    "clinicAddress": "123 Health Avenue, Medical District",
    "consultationFee": "500"
  },

  "workingHours": [
    {
      "day": "Monday",
      "isOpen": true,
      "allDay": true,
      "openTime": "09:00 AM",
      "closeTime": "05:00 PM",
      "morningOpenTime": "09:00 AM",
      "morningCloseTime": "12:00 PM",
      "eveningOpenTime": "04:00 PM",
      "eveningCloseTime": "08:00 PM"
    }
  ]
};

async function testDoctorProfile() {
    try {
        console.log('--- Testing Create/Update Doctor Profile ---');
        const response = await axios.post(`${API_BASE_URL}/doctors/profile`, doctorProfile);
        console.log('Response Status:', response.status);
        console.log('Saved Profile:', JSON.stringify(response.data, null, 2));

        console.log('\n--- Testing Get Doctor Profile ---');
        const getResponse = await axios.get(`${API_BASE_URL}/doctors/profile`, {
            params: { email: 'doctor@clinic.com' }
        });
        console.log('Get Response Status:', getResponse.status);
        console.log('Fetched Profile Username:', getResponse.data.username);

    } catch (error: any) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testDoctorProfile();
