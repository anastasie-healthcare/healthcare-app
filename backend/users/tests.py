from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class AnasHealthcareTests(APITestCase):
    def setUp(self):
        # Create a test female patient
        self.patient = User.objects.create_user(
            username="mariama",
            email="mariama@example.com",
            password="testpassword123",
            role="user"
        )
        # Create a doctor
        self.doctor = User.objects.create_user(
            username="dr_mbeki",
            email="mbeki@example.com",
            password="testpassword123",
            role="doctor"
        )
        
    def test_user_authentication(self):
        url = reverse("login")
        data = {"username": "mariama", "password": "testpassword123"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["role"], "user")

    def test_ai_symptom_triage(self):
        self.client.force_authenticate(user=self.patient)
        url = reverse("ai_symptom_triage")
        # Test free text mapping malaria keywords: fever, chills, headache
        data = {
            "free_text": "I feel a very high fever and chills with severe headache",
            "selected_symptoms": ["fatigue"]
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("hypotheses", response.data)
        # First hypothesis should be Malaria due to matching symptoms
        self.assertTrue(len(response.data["hypotheses"]) > 0)
        self.assertEqual(response.data["hypotheses"][0]["id"], "malaria")
        self.assertEqual(response.data["recommended_specialty"], "General Medicine")
        self.assertIn("care_summary", response.data)

    def test_womens_health_profile_view(self):
        self.client.force_authenticate(user=self.patient)
        url = reverse("womens_health_profile")
        
        # Test GET (should auto-create profile)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["is_enabled"])
        
        # Test POST
        data = {
            "last_period_date": "2026-06-01",
            "cycle_length": 28,
            "period_duration": 5
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["last_period_date"], "2026-06-01")
        self.assertEqual(response.data["cycle_length"], 28)

    def test_cycle_logs_list_create(self):
        self.client.force_authenticate(user=self.patient)
        url = reverse("cycle_logs_list_create")
        
        # Test POST a log
        data = {
            "date": "2026-06-15",
            "pain_level": "moderate",
            "mood": "happy",
            "fatigue": "mild",
            "flow": "light",
            "symptoms": '["cramps", "headache"]',
            "notes": "Feeling okay, some cramps"
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["pain_level"], "moderate")
        self.assertEqual(response.data["mood"], "happy")
        
        # Test GET logs
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["date"], "2026-06-15")

    def test_doctor_appointments(self):
        self.client.force_authenticate(user=self.doctor)
        url = reverse("appointments_list_create_update")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_doctor_medical_notes(self):
        self.client.force_authenticate(user=self.doctor)
        url = reverse("medical_notes_list_create")
        data = {
            "patient": self.patient.id,
            "content": "Patient shows signs of flu.",
            "prescription": "Paracetamol 500mg"
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["content"], "Patient shows signs of flu.")
