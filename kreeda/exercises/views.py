from typing import Any, Dict
from django.shortcuts import render
from django.views.generic import TemplateView

from .models import LessonPlan


class sample(TemplateView):
    template_name = "example.html"

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)

        context["data"] = "hello world"
        context["lesson_plans"] = LessonPlan.objects.all()

        return context