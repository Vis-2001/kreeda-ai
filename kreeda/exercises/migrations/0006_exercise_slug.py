# Generated by Django 4.2.3 on 2023-07-17 16:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exercises', '0005_alter_joints_options_lessonplan_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='exercise',
            name='slug',
            field=models.SlugField(default='', editable=False, max_length=255),
        ),
    ]