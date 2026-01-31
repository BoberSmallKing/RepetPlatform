from django.db import models
from apps.accounts.models import TutorProfile, StudentProfile


class TutorStudentRelation(models.Model):
    tutor = models.ForeignKey(
        TutorProfile,
        on_delete=models.CASCADE,
        related_name='students'
    )
    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name='tutors'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tutor', 'student')
        db_table = 'tutor_student_relations'

    def __str__(self):
        return f"{self.student.user.email} -> {self.tutor.user.email}"