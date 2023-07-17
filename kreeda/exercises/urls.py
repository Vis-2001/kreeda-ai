from django.urls import path

from .views import ExerciseDetailView, ExerciseListView, ExerciseStartView, LessonPlansListView, LessonPlanDetailView

urlpatterns = [
    path("plans", LessonPlansListView.as_view(), name="lessonplan-list"),
    path("plans/<str:slug>", LessonPlanDetailView.as_view(), name="lessonplan-detail"),
    path("exercises", ExerciseListView.as_view(), name="exercise-list"),
    path("exercises/<str:slug>", ExerciseDetailView.as_view(), name="exercise-detail"),
    path("exercises/<str:slug>/start", ExerciseStartView.as_view(), name="exercise-start")
]