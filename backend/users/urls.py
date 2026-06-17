from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register, name="register"),
    path("login/", views.login, name="login"),
    path("profile/", views.get_profile, name="profile"),
    path("google/", views.google_login, name="google_login"),
    path("medical-record/", views.get_medical_record, name="get_medical_record"),
    path("medical-documents/", views.medical_documents_list_create, name="medical_documents_list_create"),
    path("medical-documents/<int:pk>/", views.medical_document_delete, name="medical_document_delete"),
    path("establishments/", views.establishments_list_create, name="establishments_list_create"),
    path("doctors/", views.doctors_list_update, name="doctors_list_update"),
    path("doctors/<int:pk>/verify/", views.doctor_verify, name="doctor_verify"),
    path("appointments/", views.appointments_list_create_update, name="appointments_list_create_update"),
    path("medical-notes/", views.medical_notes_list_create, name="medical_notes_list_create"),
    path("reports/", views.reports_list_create_update, name="reports_list_create_update"),
    path("admin-analytics/", views.admin_analytics, name="admin_analytics"),
    path("admin-users/", views.admin_users_list_update, name="admin_users_list_update"),
    path("ai-triage/", views.ai_symptom_triage, name="ai_symptom_triage"),
    path("womens-health/", views.womens_health_profile_view, name="womens_health_profile"),
    path("cycle-logs/", views.cycle_logs_list_create, name="cycle_logs_list_create"),
]

