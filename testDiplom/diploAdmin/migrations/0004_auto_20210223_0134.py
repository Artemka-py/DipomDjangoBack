# Generated by Django 3.1.2 on 2021-02-22 22:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('diploAdmin', '0003_auto_20210223_0031'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='is_admin',
            field=models.BooleanField(default=False, verbose_name='Администратор'),
        ),
        migrations.AlterField(
            model_name='users',
            name='is_staff',
            field=models.BooleanField(default=False, verbose_name='Сотрудник'),
        ),
    ]
