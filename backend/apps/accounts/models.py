from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from .managers import UserManager

class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        TUTOR = 'tutor', 'Репетитор'
        STUDENT = 'student', 'Ученик'
        
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices)
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

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.email} ({self.role})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

class TutorProfile(models.Model):
    """
    Профиль репетитора.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='tutor_profile'
    )
    education = models.CharField(
        max_length=255,
        help_text='Образование'
    )
    experience_years = models.PositiveIntegerField(
        default=0,
        help_text='Стаж в годах'
    )
    price_per_hour = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
        help_text='Цена за час'
    )
    class Meta:
        db_table = 'tutor_profiles'
        verbose_name = 'Tutor profile'
        verbose_name_plural = 'Tutor profiles'

    def __str__(self):
        return f"Репетитор: {self.user.full_name}"


class StudentProfile(models.Model):
    """
    Профиль ученика.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='student_profile'
    )
    grade = models.CharField(
        max_length=20,
        help_text='Класс или курс'
    )
    school = models.CharField(
        max_length=255,
        blank=True
    )
    goals = models.TextField(
        blank=True,
        help_text='Цели обучения'
    )
    class Meta:
        db_table = 'student_profiles'
        verbose_name = 'Student profile'
        verbose_name_plural = 'Student profiles'

    def __str__(self):
        return f"Ученик: {self.user.full_name}"
