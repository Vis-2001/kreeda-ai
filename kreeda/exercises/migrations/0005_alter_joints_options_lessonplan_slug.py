# Generated by Django 4.2.3 on 2023-07-15 17:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exercises', '0004_alter_joints_tensorflow_model_number'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='joints',
            options={'verbose_name_plural': 'Joints'},
        ),
        migrations.AddField(
            model_name='lessonplan',
            name='slug',
            field=models.SlugField(default='', editable=False, max_length=255),
        ),
    ]