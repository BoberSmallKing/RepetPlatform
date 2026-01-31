from rest_framework import viewsets, permissions, status
from .models import TutorStudentRelation
from apps.accounts.models import StudentProfile, TutorProfile
from .serializers import TutorStudentSerializer
from .permission import RolePermission
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404



class TutorStudentViewSet(viewsets.ModelViewSet):
    serializer_class = TutorStudentSerializer
    permission_classes = [permissions.IsAuthenticated, RolePermission]
    required_roles = ["tutor", "student"]

    def get_queryset(self):
        user = self.request.user

        if user.role == "tutor":
            return TutorStudentRelation.objects.filter(tutor=user.tutor_profile)
        elif user.role == "student":
            return TutorStudentRelation.objects.filter(student=user.student_profile)
        return TutorStudentRelation.objects.none()


    def perform_create(self, serializer):
        user = self.request.user

        if user.role != "tutor":
            raise PermissionError("Только репетиторы могут создавать связь")

        serializer.save()

class JoinTutorByInviteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, invite_code):
        user = request.user

        if user.role != 'student':
            return Response(
                {"detail": "Only students can join tutors."},
                status=status.HTTP_403_FORBIDDEN
            )

        # 2. Получаем student profile
        try:
            student_profile = user.student_profile
        except StudentProfile.DoesNotExist:
            return Response(
                {"detail": "Student profile not found."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Находим tutor profile по invite_code
        tutor_profile = get_object_or_404(TutorProfile, invite_code=invite_code)

        # 4. Создаем связь
        relation, created = TutorStudentRelation.objects.get_or_create(
            tutor=tutor_profile,
            student=student_profile
        )

        if not created:
            return Response(
                {"detail": "Relation already exists."},
                status=status.HTTP_200_OK
            )

        return Response(
            {
                "detail": "Successfully joined tutor.",
                "tutor": tutor_profile.user.full_name
            },
            status=status.HTTP_201_CREATED
        )