from rest_framework import viewsets, permissions
from .models import TutorStudent
from .serializers import TutorStudentSerializer


class TutorStudentViewSet(viewsets.ModelViewSet):
    """
    list    → GET    /tutor-students/
    retrieve→ GET    /tutor-students/{id}/
    create  → POST   /tutor-students/
    destroy → DELETE /tutor-students/{id}/
    """
    serializer_class = TutorStudentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TutorStudent.objects.filter(tutor=self.request.user)

    def perform_create(self, serializer):
        serializer.save(tutor=self.request.user)
