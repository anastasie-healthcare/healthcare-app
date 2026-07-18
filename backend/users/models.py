from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ("user", "User"),
        ("doctor", "Doctor"),
        ("admin", "Admin"),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="user")
    phone = models.CharField(max_length=20, blank=True, null=True)
    profile_picture = models.ImageField(upload_to="profiles/", blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"


class MedicalRecord(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="medical_record")
    birth_date = models.DateField(blank=True, null=True)
    sex = models.CharField(max_length=10, blank=True, null=True)
    height = models.FloatField(blank=True, null=True)
    weight = models.FloatField(blank=True, null=True)
    physical_activity = models.CharField(max_length=20, blank=True, null=True)
    sports = models.TextField(blank=True, null=True) # JSON list
    sports_frequency = models.IntegerField(blank=True, null=True)
    sleep_quality = models.CharField(max_length=20, blank=True, null=True)
    sleep_hours = models.FloatField(blank=True, null=True)
    stress_level = models.CharField(max_length=20, blank=True, null=True)
    water_intake = models.CharField(max_length=20, blank=True, null=True)
    diet = models.CharField(max_length=20, blank=True, null=True)
    tobacco = models.CharField(max_length=20, blank=True, null=True)
    alcohol = models.CharField(max_length=20, blank=True, null=True)
    allergies = models.TextField(blank=True, null=True)
    chronic_illnesses = models.TextField(blank=True, null=True)
    surgeries = models.TextField(blank=True, null=True)
    active_treatments = models.TextField(blank=True, null=True)
    family_history = models.TextField(blank=True, null=True)
    health_goals = models.TextField(blank=True, null=True) # JSON list
    onboarding_completed = models.BooleanField(default=False)
    medical_history = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Medical Record for {self.user.username}"


class MedicalDocument(models.Model):
    CATEGORY_CHOICES = (
        ("prescription", "Ordonnance"),
        ("analysis", "Analyse"),
        ("vaccine", "Vaccination"),
        ("other", "Autre"),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="medical_documents")
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="other")
    date = models.DateField()
    notes = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to="medical_docs/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.get_category_display()})"


class Establishment(models.Model):
    TYPE_CHOICES = (
        ("hospital", "Hôpital"),
        ("clinic", "Clinique"),
        ("cabinet", "Cabinet Médical"),
    )
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="clinic")
    location = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"


class DoctorProfile(models.Model):
    STATUS_CHOICES = (
        ("pending", "En attente"),
        ("approved", "Approuvé"),
        ("rejected", "Rejeté"),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="doctor_profile")
    specialty = models.CharField(max_length=255)
    license_number = models.CharField(max_length=100)
    establishment = models.ForeignKey(
        Establishment, on_delete=models.SET_NULL, null=True, blank=True, related_name="doctors"
    )
    diploma = models.FileField(upload_to="diplomas/", blank=True, null=True)
    verification_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    rejection_reason = models.TextField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Dr. {self.user.username} ({self.specialty})"


class Appointment(models.Model):
    STATUS_CHOICES = (
        ("pending", "pending"),
        ("confirmed", "Confirmed"),
        ("declined", "declined"),
        ("postponed", "postponed"),
        ("completed", "completed"),
    )
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="appointments_as_patient")
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="appointments_as_doctor")
    date = models.DateField()
    time_slot = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    symptoms = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Appointment: Patient {self.patient.username} with Dr. {self.doctor.username} on {self.date}"


class MedicalNote(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="medical_notes_as_patient")
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="medical_notes_as_doctor")
    content = models.TextField()
    prescription = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Note by Dr. {self.doctor.username} for {self.patient.username} on {self.created_at.date()}"


class Report(models.Model):
    STATUS_CHOICES = (
        ("pending", "En attente"),
        ("resolved", "Résolu"),
        ("ignored", "Ignoré"),
    )
    TYPE_CHOICES = (
        ("comment", "Commentaire"),
        ("content", "Contenu"),
        ("other", "Autre"),
    )
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE)
    content_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="other")
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report {self.id} ({self.get_content_type_display()}) - {self.get_status_display()}"


class WomensHealthProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="womens_health_profile")
    is_enabled = models.BooleanField(default=True)
    last_period_date = models.DateField(blank=True, null=True)
    cycle_length = models.IntegerField(default=28)
    period_duration = models.IntegerField(default=5)

    def __str__(self):
        return f"Women's Health Profile for {self.user.username}"


class CycleLog(models.Model):
    PAIN_CHOICES = (
        ("none", "Aucune"),
        ("mild", "Légère"),
        ("moderate", "Modérée"),
        ("severe", "Intense"),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cycle_logs")
    date = models.DateField()
    pain_level = models.CharField(max_length=20, choices=PAIN_CHOICES, default="none")
    mood = models.CharField(max_length=100, blank=True)
    fatigue = models.CharField(max_length=20, choices=PAIN_CHOICES, default="none")
    flow = models.CharField(max_length=20, choices=(("none", "Aucun"), ("light", "Léger"), ("medium", "Moyen"), ("heavy", "Abondant")), default="none")
    symptoms = models.TextField(blank=True) # JSON string list
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Cycle log for {self.user.username} on {self.date}"

