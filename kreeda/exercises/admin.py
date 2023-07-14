from django.contrib import admin

from .models import Exercise, ExerciseCategory, Joints


admin.site.register(Exercise)
admin.site.register(ExerciseCategory)
admin.site.register(Joints)