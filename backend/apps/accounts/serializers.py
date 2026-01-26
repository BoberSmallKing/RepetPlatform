from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password

from django.conf import settings
from django.urls import reverse
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

from .models import User, TutorProfile, StudentProfile

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Регистрация пользователя с выбором роли.
    """
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            'email',
            'password',
            'password_confirm',
            'first_name',
            'last_name',
            'role',
        )

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {"password": "Passwords do not match."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')

        # Создание пользователя
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=validated_data['role'],
            is_active=False
        )

        # Создание профиля в зависимости от роли
        if user.role == User.Role.TUTOR:
            TutorProfile.objects.create(user=user)
        elif user.role == User.Role.STUDENT:
            StudentProfile.objects.create(user=user)

        # Email-активация
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        activation_url = (
            f"{settings.FRONTEND_URL}/activate/{uid}/{token}"
        )

        send_mail(
            subject="Activate account",
            message=(
                f"Hello, {user.first_name}!\n\n"
                f"Please confirm your email:\n{activation_url}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return user

    

class UserLoginSerializer(serializers.Serializer):
    """
    Вход по email и паролю.
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password
        )

        if not user:
            raise serializers.ValidationError('Invalid credentials.')

        if not user.is_active:
            raise serializers.ValidationError('Account is not activated.')

        attrs['user'] = user
        return attrs

class TutorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorProfile
        fields = ('education', 'experience_years', 'price_per_hour')


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ('grade', 'school', 'goals')

class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    tutor_profile = TutorProfileSerializer(read_only=True)
    student_profile = StudentProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'role',
            'first_name',
            'last_name',
            'full_name',
            'avatar',
            'bio',
            'created_at',
            'updated_at',
            'tutor_profile',
            'student_profile',
        )
        read_only_fields = (
            'id',
            'email',
            'role',
            'created_at',
            'updated_at',
            'tutor_profile',
            'student_profile',
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.role == User.Role.TUTOR:
            data['student_profile'] = None
        elif instance.role == User.Role.STUDENT:
            data['tutor_profile'] = None
        return data


class UserUpdateSerializer(serializers.ModelSerializer):
    # Nested поля профиля
    tutor_profile = serializers.DictField(write_only=True, required=False)
    student_profile = serializers.DictField(write_only=True, required=False)

    class Meta:
        model = User
        fields = (
            'first_name',
            'last_name',
            'avatar',
            'bio',
            'tutor_profile',
            'student_profile',
        )

    def update(self, instance, validated_data):
        for attr in ('first_name', 'last_name', 'avatar', 'bio'):
            if attr in validated_data:
                setattr(instance, attr, validated_data[attr])
        instance.save()

        if instance.role == User.Role.TUTOR and 'tutor_profile' in validated_data:
            tutor_data = validated_data.pop('tutor_profile')
            tutor_profile = getattr(instance, 'tutor_profile', None)
            if tutor_profile:
                for key, value in tutor_data.items():
                    setattr(tutor_profile, key, value)
                tutor_profile.save()

        elif instance.role == User.Role.STUDENT and 'student_profile' in validated_data:
            student_data = validated_data.pop('student_profile')
            student_profile = getattr(instance, 'student_profile', None)
            if student_profile:
                for key, value in student_data.items():
                    setattr(student_profile, key, value)
                student_profile.save()

        return instance

    

class PasswordResetRequestSerializer(serializers.Serializer):
    """
    Запрос на сброс пароля (отправка email)
    """
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "User with this email does not exist."
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "Account is not activated."
            )

        self.context['user'] = user
        return value

    def save(self):
        user = self.context['user']

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        reset_url = (
            f"{settings.FRONTEND_URL}/password-reset-confirm/{uid}/{token}"
        )

        send_mail(
            subject="Password reset",
            message=(
                f"Hello, {user.first_name}!\n\n"
                f"To reset your password, follow the link:\n{reset_url}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Подтверждение нового пароля
    """
    new_password = serializers.CharField(
        validators=[validate_password]
    )
    new_password_confirm = serializers.CharField()

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError(
                {"new_password": "Passwords do not match."}
            )
        return attrs

    def save(self, user):
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user