from rest_framework.routers import DefaultRouter
from .views import TutorStudentViewSet, JoinTutorByInviteView
from django.urls import path

router = DefaultRouter()
router.register(r'tutor-students', TutorStudentViewSet, basename='tutor-students')

urlpatterns = router.urls
urlpatterns += [
    path('join/<uuid:invite_code>/', JoinTutorByInviteView.as_view(), name='join-tutor'),
]