from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, TutorProfile, StudentProfile


admin.site.register(User)
admin.site.register(TutorProfile)
admin.site.register(StudentProfile)
