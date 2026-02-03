from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import TutorStudentRelation
from .serializers import TutorStudentSerializer, JoinByInviteSerializer

class IsTutorOrReadOnlyForStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.method in permissions.SAFE_METHODS:
            return request.user.role in ['tutor', 'student']
            
        return request.user.role == 'tutor'

class TutorStudentViewSet(viewsets.ModelViewSet):
    serializer_class = TutorStudentSerializer
    permission_classes = [IsTutorOrReadOnlyForStudent]

    def get_queryset(self):
        user = self.request.user
        if user.role == "tutor":
            return TutorStudentRelation.objects.filter(tutor=user.tutor_profile)
        return TutorStudentRelation.objects.filter(student=user.student_profile)

    def perform_create(self, serializer):
        serializer.save()

class JoinTutorByInviteView(APIView):
    
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, invite_code):
        if request.user.role != 'student':
            return Response({"detail": "Только ученики могут использовать инвайт-код."}, 
                            status=status.HTTP_403_FORBIDDEN)

        serializer = JoinByInviteSerializer(data={'invite_code': invite_code})
        serializer.is_valid(raise_exception=True)
        
        tutor_profile = serializer.validated_data['invite_code']
        student_profile = request.user.student_profile

        relation, created = TutorStudentRelation.objects.get_or_create(
            tutor=tutor_profile,
            student=student_profile
        )

        if not created:
            return Response({"detail": "Вы уже связаны с этим репетитором."}, 
                            status=status.HTTP_200_OK)

        return Response({
            "detail": "Успешное присоединение.",
            "tutor": tutor_profile.user.full_name
        }, status=status.HTTP_201_CREATED)