from rest_framework.routers import DefaultRouter
from .views import TutorStudentViewSet

router = DefaultRouter()
router.register(r'tutor-students', TutorStudentViewSet, basename='tutor-students')

urlpatterns = router.urls