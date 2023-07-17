from django.urls import path

from .views import LessonPlansListView, LessonPlanDetailView

urlpatterns = [
    path("plans", LessonPlansListView.as_view(), name="lessonplan-list"),
    path("plans/<str:slug>", LessonPlanDetailView.as_view(), name="lessonplan-detail")
]