from django.db import models
from django.utils.text import slugify
from modelcluster.models import ParentalKey
from wagtail.models import ClusterableModel, Orderable
from wagtail.admin.panels import FieldPanel, InlinePanel, MultiFieldPanel
from wagtail.snippets.models import register_snippet


@register_snippet
class Joints(models.Model):
    tensorflow_model_number = models.IntegerField(unique=True)
    name = models.CharField(max_length=128)

    positive_error_angle = models.IntegerField()
    positive_error_message = models.CharField(max_length=128)

    negative_error_angle = models.IntegerField()
    negative_error_message = models.CharField(max_length=128)

    def __str__(self) -> str:
        return self.name
    
    class Meta:
        verbose_name_plural = "Joints"


@register_snippet
class ExerciseCategory(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField(null=True, blank=True)

    def __str__(self) -> str:
        return self.name


@register_snippet
class Exercise(models.Model):
    category = models.ForeignKey(
        ExerciseCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="exercises"
    )
    name = models.CharField(max_length=128)
    description = models.TextField()
    slug = models.SlugField(
        default="",
        editable=False,
        max_length=255
    )
    video_reference = models.FileField(
        upload_to="exercise_videos",

        # temp for development
        null=True,
        blank=True
    )
    joints_to_track = models.ManyToManyField(
        Joints,
        related_name="joints",
    )

    panels = [
        FieldPanel("category"),
        FieldPanel("name"),
        FieldPanel("description"),
        FieldPanel("video_reference"),
        FieldPanel("joints_to_track")
    ]

    def __str__(self) -> str:
        return self.name
    
    def save(self, **kwargs) -> None:
        """Override save method to save slug field."""
        name = self.name
        self.slug = slugify(name)
        super().save(**kwargs)
    



class ExerciseSet(Orderable):
    page = ParentalKey("exercises.LessonPlan", related_name="exercise_sets")

    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    number_of_sets = models.IntegerField()
    reps = models.IntegerField(default=8, help_text="Number of reps per set.")

    panels = [
        FieldPanel("exercise"),
        FieldPanel("number_of_sets"),
        FieldPanel("reps")
    ]



@register_snippet
class LessonPlan(ClusterableModel):
    name = models.CharField(max_length=128)
    slug = models.SlugField(
        default="",
        editable=False,
        max_length=255
    )
    description = models.TextField()

    panels = [
        FieldPanel("name"),
        FieldPanel("description"),
        MultiFieldPanel(
            [InlinePanel("exercise_sets", label="Exercise Sets")],
            heading="Exercise Sets",
        ),
    ]

    def save(self, **kwargs) -> None:
        """Override save method to save slug field."""
        name = self.name
        self.slug = slugify(name)
        super().save(**kwargs)
