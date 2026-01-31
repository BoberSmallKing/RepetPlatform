from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import UserManager
from django.conf import settings
import uuid


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        TUTOR = 'tutor', 'Репетитор'
        STUDENT = 'student', 'Ученик'

    email = models.EmailField(unique=True)

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
    )

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(blank=True)

    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.email} ({self.role})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()


class TutorProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tutor_profile'
    )

    invite_code = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )

    education = models.CharField(max_length=255, blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    price_per_hour = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"TutorProfile({self.user.email})"


class StudentProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='student_profile'
    )

    grade = models.CharField(max_length=50, blank=True)
    school = models.CharField(max_length=255, blank=True)
    goals = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"StudentProfile({self.user.email})"
