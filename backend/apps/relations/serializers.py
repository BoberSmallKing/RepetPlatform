from rest_framework import serializers
from .models import TutorStudentRelation
from apps.accounts.models import StudentProfile, TutorProfile
    
    
class TutorStudentSerializer(serializers.ModelSerializer):
    student_id = serializers.IntegerField(write_only=True)
    student = serializers.SerializerMethodField()
    tutor = serializers.SerializerMethodField()

    class Meta:
        model = TutorStudentRelation
        fields = ('id', 'student_id', 'student', 'tutor', 'created_at')
        read_only_fields = ('id', 'student', 'tutor', 'created_at')

    def get_student(self, obj):
        user = obj.student.user
        return {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
        }

    def get_tutor(self, obj):
        user = obj.tutor.user
        return {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
        }

    def create(self, validated_data):
        student_id = validated_data.pop('student_id')
        student_profile = self.context['request'].user.student_profile if self.context['request'].user.role == 'student' else None
        if student_profile is None:
            student_profile = StudentProfile.objects.get(pk=student_id)

        tutor_profile = self.context['request'].user.tutor_profile

        return TutorStudentRelation.objects.create(
            tutor=tutor_profile,
            student=student_profile
        )
