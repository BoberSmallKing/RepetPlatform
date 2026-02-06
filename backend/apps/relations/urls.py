from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter
from django.urls import path
from .views import TutorStudentViewSet, JoinTutorByInviteView
from apps.month.views import MonthViewSet

router = DefaultRouter()
router.register(r'tutor-students', TutorStudentViewSet, basename='tutor-students')

relation_router = NestedDefaultRouter(router, r'tutor-students', lookup='relation')
relation_router.register(r'months', MonthViewSet, basename='relation-months')

urlpatterns = router.urls
urlpatterns += [
    path('join/<uuid:invite_code>/', JoinTutorByInviteView.as_view(), name='join-tutor'),
]
urlpatterns += relation_router.urls
