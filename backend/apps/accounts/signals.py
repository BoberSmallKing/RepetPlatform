from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, TutorProfile, StudentProfile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if not created:
        return

    if instance.role == User.Role.TUTOR:
        TutorProfile.objects.create(user=instance)
    elif instance.role == User.Role.STUDENT:
        StudentProfile.objects.create(user=instance)