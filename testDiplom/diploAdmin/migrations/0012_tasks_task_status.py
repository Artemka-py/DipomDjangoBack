# Generated by Django 3.1.2 on 2021-05-04 20:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('diploAdmin', '0011_auto_20210421_1436'),
    ]

    operations = [
        migrations.AddField(
            model_name='tasks',
            name='task_status',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='diploAdmin.status', verbose_name='Статус задачи'),
        ),
    ]
