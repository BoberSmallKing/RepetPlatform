from django.db import models
from apps.accounts.models import TutorProfile, StudentProfile


class TutorStudentRelation(models.Model):
    class Type_class(models.TextChoices):
        ONLINE = 'Online', 'Онлайн'
        OFLINE = 'Ofline', 'Офлайн'
        MIXED = "Mixed", "Смешанные"
        
    tutor = models.ForeignKey(TutorProfile, on_delete=models.CASCADE, related_name='students')
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='tutors')
    target = models.CharField(max_length=200, blank=True)
    type_class = models.CharField(max_length=10, choices=Type_class.choices, blank=True)
    
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tutor', 'student')
        db_table = 'tutor_student_relations'

    def __str__(self):
        return f"{self.student.user.email} -> {self.tutor.user.email}"
    
    
    def update_active_status(self):
        self.is_active = bool(self.goal and self.lesson_type)
        self.save(update_fields=["is_active"])