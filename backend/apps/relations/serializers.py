from rest_framework import serializers
from .models import TutorStudentRelation
from apps.accounts.models import StudentProfile, TutorProfile
from django.shortcuts import get_object_or_404

class TutorStudentSerializer(serializers.ModelSerializer):
    student_id = serializers.IntegerField(write_only=True, required=False)
    student = serializers.SerializerMethodField()
    tutor = serializers.SerializerMethodField()

    class Meta:
        model = TutorStudentRelation
        fields = ('id', 'student_id', 'student', 'is_active', 'tutor', 'target', 'type_class', 'created_at')
        read_only_fields = ('id', 'student', 'is_active', 'tutor', 'created_at')

    def get_student(self, obj):
        user = obj.student.user
        return {"id": user.id, "full_name": user.full_name, "email": user.email}

    def get_tutor(self, obj):
        user = obj.tutor.user
        return {"id": user.id, "full_name": user.full_name, "email": user.email}

    def validate(self, attrs):
        request = self.context.get('request')
        if request and request.method == 'POST':
            student_id = attrs.get('student_id')
            tutor_profile = request.user.tutor_profile
            if TutorStudentRelation.objects.filter(tutor=tutor_profile, student_id=student_id).exists():
                raise serializers.ValidationError("Связь с этим учеником уже существует.")
        return attrs

    def create(self, validated_data):
        student_id = validated_data.pop('student_id')
        tutor_profile = self.context['request'].user.tutor_profile
        student_profile = get_object_or_404(StudentProfile, pk=student_id)

        return TutorStudentRelation.objects.create(
            tutor=tutor_profile,
            student=student_profile,
            **validated_data
        )

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        if hasattr(instance, 'update_active_status'):
            instance.update_active_status()
        return instance

class JoinByInviteSerializer(serializers.Serializer):
    invite_code = serializers.CharField(write_only=True)

    def validate_invite_code(self, value):
        try:
            return TutorProfile.objects.get(invite_code=value)
        except TutorProfile.DoesNotExist:
            raise serializers.ValidationError("Неверный код приглашения.")