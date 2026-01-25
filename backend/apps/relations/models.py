from django.db import models
from django.conf import settings

class TutorStudent(models.Model):
    """
    Связь репетитор ↔ ученик.
    """
    tutor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='students'
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tutors'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tutor_students'
        verbose_name = 'Tutor-Student relation'
        verbose_name_plural = 'Tutor-Student relations'
        unique_together = ('tutor', 'student')

    def __str__(self):
        return f"{self.student.full_name} → {self.tutor.full_name}"