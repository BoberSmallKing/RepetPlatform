from rest_framework import serializers
from .models import TutorStudent
    
    
class TutorStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorStudent
        fields = ('id', 'tutor', 'student', 'created_at')
        read_only_fields = ('id', 'tutor', 'created_at')
        