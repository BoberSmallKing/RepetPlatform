from rest_framework import viewsets, permissions
from .models import TutorStudent
from .serializers import TutorStudentSerializer
from .permission import IsTutor


class TutorStudentViewSet(viewsets.ModelViewSet):
    serializer_class = TutorStudentSerializer
    permission_classes = [permissions.IsAuthenticated, IsTutor]

    def get_queryset(self):
        return TutorStudent.objects.filter(tutor=self.request.user)
    def perform_create(self, serializer):
        serializer.save(tutor=self.request.user)
