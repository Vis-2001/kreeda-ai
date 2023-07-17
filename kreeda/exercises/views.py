from typing import Any, Dict
from django.shortcuts import render
from django.views.generic import DetailView, ListView

from .models import Exercise, LessonPlan


class LessonPlansListView(ListView):
    model = LessonPlan


class LessonPlanDetailView(DetailView):
    model = LessonPlan
    query_pk_and_slug = True


class ExerciseListView(ListView):
    model = Exercise


class ExerciseDetailView(DetailView):
    model = Exercise
    query_pk_and_slug = True


class ExerciseStartView(DetailView):
    model = Exercise
    query_pk_and_slug = True

    template_name = "exercises/exercise_start.html"