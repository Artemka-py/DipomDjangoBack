# Generated by Django 3.1.2 on 2021-04-22 22:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('diploAdmin', '0011_auto_20210421_1436'),
    ]

    operations = [
        migrations.AddField(
            model_name='tasks',
            name='description',
            field=models.TextField(blank=True, null=True, verbose_name='Описание задачи'),
        ),
    ]
