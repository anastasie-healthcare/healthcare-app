from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import MedicalRecord, MedicalDocument, Establishment, DoctorProfile, Appointment, MedicalNote, Report, WomensHealthProfile, CycleLog

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirmPassword = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "confirmPassword", "role"]

    def validate(self, data):
        if data["password"] != data["confirmPassword"]:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop("confirmPassword")
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data.get("role", "user"),
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    verification_status = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "phone", "profile_picture", "verification_status"]

    def get_verification_status(self, obj):
        if obj.role == 'doctor':
            try:
                return obj.doctor_profile.verification_status
            except:
                return 'pending'
        return None

class EstablishmentSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source="get_type_display", read_only=True)

    class Meta:
        model = Establishment
        fields = ["id", "name", "type", "type_display", "location", "address", "description"]


class DoctorProfileSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source="user", read_only=True)
    establishment_detail = EstablishmentSerializer(source="establishment", read_only=True)
    verification_status_display = serializers.CharField(source="get_verification_status_display", read_only=True)

    class Meta:
        model = DoctorProfile
        fields = [
            "id", "user", "user_detail", "specialty", "license_number", "establishment",
            "establishment_detail", "diploma", "verification_status", "verification_status_display",
            "rejection_reason", "bio", "consultation_fee"
        ]


class AppointmentSerializer(serializers.ModelSerializer):
    patient_detail = UserSerializer(source="patient", read_only=True)
    doctor_detail = UserSerializer(source="doctor", read_only=True)
    doctor_profile = serializers.SerializerMethodField(read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id", "patient", "patient_detail", "doctor", "doctor_detail", "doctor_profile",
            "date", "time_slot", "status", "status_display", "symptoms", "notes", "created_at"
        ]

    def get_doctor_profile(self, obj):
        try:
            profile = DoctorProfile.objects.get(user=obj.doctor)
            return DoctorProfileSerializer(profile).data
        except DoctorProfile.DoesNotExist:
            return None


class MedicalNoteSerializer(serializers.ModelSerializer):
    doctor_detail = UserSerializer(source="doctor", read_only=True)

    class Meta:
        model = MedicalNote
        fields = ["id", "patient", "doctor", "doctor_detail", "content", "prescription", "created_at"]


class ReportSerializer(serializers.ModelSerializer):
    reported_by_detail = UserSerializer(source="reported_by", read_only=True)
    content_type_display = serializers.CharField(source="get_content_type_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Report
        fields = [
            "id", "reported_by", "reported_by_detail", "content_type", "content_type_display",
            "description", "status", "status_display", "created_at"
        ]


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "is_active", "date_joined"]


class MedicalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalRecord
        fields = [
            "id", "birth_date", "sex", "height", "weight", 
            "physical_activity", "sports", "sports_frequency", 
            "sleep_quality", "sleep_hours", "stress_level", 
            "water_intake", "diet", "tobacco", "alcohol", 
            "allergies", "chronic_illnesses", "surgeries", 
            "active_treatments", "family_history", "health_goals", 
            "onboarding_completed", "medical_history"
        ]


class WomensHealthProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = WomensHealthProfile
        fields = ["id", "user", "is_enabled", "last_period_date", "cycle_length", "period_duration"]


class CycleLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CycleLog
        fields = ["id", "user", "date", "pain_level", "mood", "fatigue", "flow", "symptoms", "notes"]


class MedicalDocumentSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = MedicalDocument
        fields = ["id", "title", "category", "category_display", "date", "notes", "file", "created_at"]
        read_only_fields = ["created_at"]

