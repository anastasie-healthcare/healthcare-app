from django.contrib import admin
from .models import User, MedicalRecord, MedicalDocument

admin.site.register(User)
admin.site.register(MedicalRecord)
admin.site.register(MedicalDocument)
