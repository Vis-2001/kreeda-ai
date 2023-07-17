from typing import Any, Dict
from django.shortcuts import render
from django.views.generic import DetailView, ListView

from .models import LessonPlan


class LessonPlansListView(ListView):
    model = LessonPlan


class LessonPlanDetailView(DetailView):
    model = LessonPlan
    query_pk_and_slug = True