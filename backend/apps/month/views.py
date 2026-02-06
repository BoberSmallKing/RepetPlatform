from rest_framework import viewsets, permissions
from django.shortcuts import get_object_or_404
from .models import Month
from .serializers import MonthSerializer
from apps.relations.models import TutorStudentRelation
from datetime import date

class MonthViewSet(viewsets.ModelViewSet):
    serializer_class = MonthSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        relation_id = self.kwargs.get("relation_pk")
        relation = get_object_or_404(TutorStudentRelation, id=relation_id)

        user = self.request.user
        if user.role == "tutor" and relation.tutor.user == user:
            return Month.objects.filter(relation=relation)
        elif user.role == "student" and relation.student.user == user:
            return Month.objects.filter(relation=relation)
        return Month.objects.none()

    def perform_create(self, serializer):
        relation_id = self.kwargs.get("relation_pk")
        relation = get_object_or_404(TutorStudentRelation, id=relation_id)

        if self.request.user != relation.tutor.user:
            raise PermissionError("Только репетитор может создавать месяц")

        last_month = relation.months.order_by("-year", "-month").first()
        if last_month:
            month = last_month.month + 1
            year = last_month.year
            if month > 12:
                month = 1
                year += 1
        else:
            today = date.today()
            month = today.month
            year = today.year

        default_title = f"{Month.MonthChoices(month).label} {year}"

        serializer.save(relation=relation, month=month, year=year, title=default_title)

    def perform_update(self, serializer):
        relation = serializer.instance.relation
        if self.request.user != relation.tutor.user:
            raise PermissionError("Только репетитор может редактировать месяц")
        serializer.save()
