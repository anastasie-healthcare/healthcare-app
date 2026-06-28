from django.contrib import admin
from .models import (
    User, MedicalRecord, MedicalDocument,
    Establishment, DoctorProfile, Appointment,
    MedicalNote, Report, WomensHealthProfile, CycleLog
)

admin.site.register(User)
admin.site.register(MedicalRecord)
admin.site.register(MedicalDocument)
admin.site.register(Establishment)
admin.site.register(DoctorProfile)
admin.site.register(Appointment)
admin.site.register(MedicalNote)
admin.site.register(Report)
admin.site.register(WomensHealthProfile)
admin.site.register(CycleLog)