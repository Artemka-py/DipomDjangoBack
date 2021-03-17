from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.core.validators import RegexValidator
from django.db import models
from django.db.models.base import Model
from django.db.models.query_utils import Q
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.utils import timezone
from treebeard.mp_tree import MP_Node
from treebeard.al_tree import AL_Node
from mptt.models import MPTTModel
from django.conf import settings


def upload_location(instatnce, filename):
    file_path = 'avatars/{username}/{filename}'.format(username=str(instatnce.username), filename=filename)
    return file_path


class MyUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Пользователи должны иметь E-mail.')

        extra_fields.setdefault('is_staff', False)
        user = self.model(
            username=username,
            email=self.normalize_email(email),
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    # user.password = password # bad - do not do this

    def create_superuser(self, username, email, password=None, **extra_fields):
        user = self.create_user(
            username, email, password=password, **extra_fields)
        user.is_admin = True
        user.is_staff = True
        user.save(using=self._db)
        return user


USERNAME_REGEX = '^[a-zA-Z0-9.+-]*$'


class Users(AbstractBaseUser):
    username = models.CharField(
        max_length=300,
        validators=[
            RegexValidator(regex=USERNAME_REGEX,
                           message='Никнейм должен содержать буквы или содерржать цифры',
                           code='invalid_username'
                           )],
        unique=True,
        primary_key=True,
        verbose_name="Логин"
    )
    email = models.EmailField(
        max_length=255,
        unique=True,
        verbose_name='E-mail'
    )
    first_name = models.CharField(max_length=255, verbose_name="Имя", blank=True)
    middle_name = models.CharField(max_length=255, verbose_name="Фамилия", blank=True)
    sur_name = models.CharField(max_length=255, blank=True, null=True, verbose_name="Отчество")
    birth_date = models.DateField(verbose_name="Дата рождения", blank=True, null=True)
    phone_num = models.CharField(max_length=255, verbose_name="Номер телефона", unique=True, blank=True, validators=[
        RegexValidator(
            regex=r'^\+?1?\d{9,17}$',
            message="Телефон должен быть примерно такого формата: '+99999999999'. Содержать максимум 17 цифр.",
            code='invalid_phone_number'
        )
    ], null=True)
    user_image_src = models.ImageField(max_length=255, upload_to=upload_location, null=True, blank=True,
                                       verbose_name="Путь до аватарки пользователя")
    is_Active = models.BooleanField(verbose_name="Активированный пользователь", default=True)
    latest_login = models.DateTimeField(verbose_name='Последний вход', default=timezone.now)
    date_joined = models.DateTimeField(verbose_name='Дата присоединения', default=timezone.now)
    is_admin = models.BooleanField(default=False, verbose_name="Администратор")
    is_staff = models.BooleanField(default=False, verbose_name="Сотрудник")

    objects = MyUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'middle_name']

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"

    def get_short_name(self):
        # The user is identified by their username
        return self.username

    def has_perm(self, perm, obj=None):
        """Does the user have a specific permission?"""
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        """Does the user have permissions to view the app `app_label`?"""
        # Simplest possible answer: Yes, always
        return True

    def image_img(self):
        if self.user_image_src:
            from django.utils.safestring import mark_safe
            return mark_safe(u'<a href="{0}" target="_blank"><img src="{0}" width="100"/></a>'.format(
                self.user_image_src.url))
        else:
            return '(Нет изображения)'

    image_img.short_description = 'Картинка'
    image_img.allow_tags = True


def upload_location_documents(instatnce, filename):
    file_path = 'documents/{login_user}/{filename}'.format(login_user=str(instatnce.login_user), filename=filename)
    return file_path

class Documents(models.Model):
    login_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="Загрузил документ")
    path_file = models.FileField(verbose_name='Путь до документов', null=True, blank=True,
                                    upload_to=upload_location_documents)

    class Meta:
        verbose_name = "Документ"
        verbose_name_plural = "Документы"

    def __str__(self):
        return str(self.path_file.url)


class Clients(models.Model):
    client_login = models.OneToOneField(settings.AUTH_USER_MODEL, db_column='client_login', primary_key=True,
                                        on_delete=models.DO_NOTHING, verbose_name="Логин клиента")
    client_organisation = models.ForeignKey('Organisations', models.DO_NOTHING, default=1, null=False,
                                            verbose_name="Организация клиента")

    def __str__(self):
        return str(self.client_login)

    class Meta:
        db_table = 'clients'
        verbose_name = 'Клиент'
        verbose_name_plural = 'Клиенты'


class Developers(models.Model):
    developer_login = models.OneToOneField(settings.AUTH_USER_MODEL, models.DO_NOTHING, db_column='developer_login', primary_key=True,
                                           verbose_name="Логин разработчика")
    outsource_spec = models.BooleanField(default=False, verbose_name="Внештатный разработчик")

    def __str__(self):
        return '%s' % self.developer_login

    class Meta:
        db_table = 'developers'
        verbose_name = 'Разработчик'
        verbose_name_plural = 'Разработчики'


class Issues(models.Model):
    issue_id = models.AutoField(primary_key=True)
    issue_name = models.CharField(max_length=255, verbose_name="Название проблемы")
    issue_description = models.TextField(verbose_name="Описание проблемы")
    issue_task = models.ForeignKey('Tasks', models.DO_NOTHING, null=False, default=1, verbose_name="Название задачи")
    issue_date = models.DateField(verbose_name="Дата обьявления проблемы")
    docs_path = models.ManyToManyField(Documents, verbose_name="Документы", null=True, blank=True)
    issue_close_status = models.BooleanField(blank=True, null=True, choices=(
        (True, 'Да'), (False, 'Нет')
    ), default=False, verbose_name="Исправлено")

    def __str__(self):
        return str(self.issue_name)

    class Meta:
        db_table = 'issues'
        verbose_name = 'Проблема'
        verbose_name_plural = 'Проблемы'


class Managers(models.Model):
    manager_login = models.OneToOneField(settings.AUTH_USER_MODEL, models.DO_NOTHING, db_column='manager_login', primary_key=True,
                                         verbose_name="Логин менеджера")
    outsource_spec = models.BooleanField(blank=True, null=True, choices=(
        (True, 'Да'), (False, 'Нет')
    ), default=False, verbose_name="Главный менджер")

    def __str__(self):
        return str(self.manager_login)

    class Meta:
        db_table = 'managers'
        verbose_name = 'Менеджер'
        verbose_name_plural = 'Менеджеры'


class Modules(models.Model):
    module_id = models.AutoField(primary_key=True)
    module_name = models.CharField(max_length=255, verbose_name="Название модуля")
    module_project = models.ForeignKey('Projects', models.DO_NOTHING, default=1, null=False,
                                       verbose_name="Название проекта")
    module_status = models.ForeignKey('Status', models.DO_NOTHING, db_column='module_status', default=1, null=False,
                                      verbose_name="Статус модуля")
    docs_path = models.ManyToManyField(Documents, verbose_name="Документы", null=True, blank=True)

    def __str__(self):
        return str(self.module_name)

    class Meta:
        db_table = 'modules'
        verbose_name = 'Модуль'
        verbose_name_plural = 'Модули'


class Notes(models.Model):
    note_id = models.AutoField(primary_key=True)
    note_name = models.CharField(max_length=255, verbose_name="Название")
    note_desc = models.TextField(verbose_name="Описание")
    note_date = models.DateField(verbose_name="Дата создания заметки", auto_now_add=True)
    note_client_login = models.ForeignKey(Clients, models.DO_NOTHING, db_column="note_client_login", default=1,
                                          null=False, verbose_name="Логин клиента")
    note_task_id = models.ForeignKey('Tasks', models.DO_NOTHING, db_column="note_task_id", default=1, null=False,
                                     verbose_name="Название задачи")
    docs_path = models.ManyToManyField(Documents, verbose_name="Документы", null=True, blank=True)

    def __str__(self):
        return str(self.note_name)

    class Meta:
        db_table = 'notes'
        verbose_name = 'Правка'
        verbose_name_plural = 'Правки'


def upload_location_org(instatnce, filename):
    file_path = 'org/{full_name}/{filename}'.format(full_name=str(instatnce.full_name), filename=filename)
    return file_path


class Organisations(models.Model):
    organisation_id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=255, verbose_name="Полное наименование организации")
    short_name = models.CharField(max_length=255, blank=True, null=True,
                                  verbose_name="Короткое наименование организации")
    organisation_description = models.TextField(blank=True, null=True, verbose_name="Описание")
    organisation_image_src = models.ImageField(upload_to=upload_location_org, null=True, blank=True,
                                               verbose_name="Путь до аватарки организации")

    def __str__(self):
        return str(self.full_name)

    def image_img(self):
        if self.organisation_image_src:
            from django.utils.safestring import mark_safe
            return mark_safe(u'<a href="{0}" target="_blank"><img src="{0}" width="100"/></a>'.format(
                self.organisation_image_src.url))
        else:
            return '(Нет изображения)'

    image_img.short_description = 'Картинка'
    image_img.allow_tags = True

    class Meta:
        db_table = 'organisations'
        unique_together = (('full_name', 'short_name'),)
        verbose_name = 'Организация'
        verbose_name_plural = 'Организации'


def upload_location_tasks(instatnce, filename):
    file_path = 'tasks/{project_name}/{filename}'.format(project_name=str(instatnce.project_name), filename=filename)
    return file_path


class Projects(models.Model):
    project_id = models.AutoField(primary_key=True)
    project_name = models.CharField(default='Плохой проект', null=False, max_length=255,
                                    verbose_name='Название проекта', unique=True)
    project_client_login = models.ForeignKey(Clients, models.DO_NOTHING, db_column='project_client_login', default=1,
                                            null=True, verbose_name='Логин клиента', blank=True)
    project_manager_login = models.ForeignKey(Managers, models.DO_NOTHING, db_column='project_manager_login', default=1,
                                            null=False, verbose_name='Логин менеджера')
    project_workgroup = models.ForeignKey('Workgroups', models.DO_NOTHING, default=1, null=False,
                                    verbose_name='Рабоча группа')
    project_info = models.TextField(verbose_name='Информация о проекте')
    project_status = models.ForeignKey('Status', models.DO_NOTHING, default=1, null=False,
                                       verbose_name='Статус проекта')
    start_date_plan = models.DateField(verbose_name='Дата старта проекта', auto_now_add=True, null=False, blank=False)
    finish_date_plan = models.DateField(verbose_name='Дата окончания проекта')
    start_date_fact = models.DateField(auto_now_add=True, null=False, blank=False,
                                       verbose_name='Фактическая дата старта проекта')
    finish_date_fact = models.DateField(verbose_name='Фактическая дата конца проекта')

    docs_path = models.ManyToManyField(Documents, verbose_name="Документы", null=True, blank=True)
    # tech_task_path = models.FileField(verbose_name='Путь до экспортированных задач', null=True, blank=True,
    #                                   upload_to=upload_location_tasks)

    def __str__(self):
        return str(self.project_name)

    class Meta:
        db_table = 'projects'
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'

    
    # def get_queryset(self):
    #     login = self.request.query_params.get('login')

    #     # qs = WorkingDeveloperList.objects.filter(developer_login = login)
    #     # for i in qs:
    #     #     qs2 = Workgroups.objects.filter()

    #     queryset = Model.objects.filter(Q(project_client_login=login) | Q(project_manager_login=login))
    #     # if (queryset)


    #     return queryset


class Stages(models.Model):
    stage_id = models.AutoField(primary_key=True)
    stage_name = models.CharField(max_length=255, verbose_name='Название этапа')
    stage_module = models.ForeignKey(Modules, models.DO_NOTHING, default=1, null=False, verbose_name='Название модуля')
    stage_status = models.ForeignKey('Status', models.DO_NOTHING, db_column='stage_status', default=1, null=False, verbose_name='Статус')
    docs_path = models.ManyToManyField(Documents, verbose_name="Документы", null=True, blank=True)
    start_date = models.DateField(verbose_name='Дата старта этапа', auto_now_add=True, null=False, blank=False)
    finish_date = models.DateField(verbose_name='Дата окончания этапа')
    start_date_fact = models.DateField(verbose_name='Фактическая дата старта этапа')
    finish_date_fact = models.DateField(verbose_name='Фактическая дата конца этапа')

    def __str__(self):
        return self.stage_name

    class Meta:
        db_table = 'stages'
        verbose_name = 'Этап'
        verbose_name_plural = 'Этапы'


class Status(models.Model):
    status_id = models.AutoField(primary_key=True)
    status_name = models.CharField(unique=True, max_length=255, verbose_name="Наименование")

    def __str__(self):
        return str(self.status_name)

    class Meta:
        db_table = 'status'
        verbose_name = 'Статус'
        verbose_name_plural = 'Статусы'


class Tasks(MPTTModel):
    task_id = models.AutoField(primary_key=True)
    task_name = models.CharField(max_length=255, verbose_name="Название задачи")
    task_stage = models.ForeignKey(Stages, models.DO_NOTHING, default=1, null=False, verbose_name="Название этапа")
    task_setter_login = models.ForeignKey(settings.AUTH_USER_MODEL, models.CASCADE, null=False, default=1, verbose_name="Поставил задачу")
    task_developer_login = models.ForeignKey('Developers', models.DO_NOTHING, db_column='task_developer_login',
                                             default=1, null=False, verbose_name="Логин разработчика")
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.DO_NOTHING,
                               verbose_name="Название главной задачи", related_name='children',
                               db_index=True)  # children_set - for treebeard
    start_date = models.DateField(verbose_name='Дата старта задачи', auto_now_add=True, null=False, blank=False)
    finish_date = models.DateField(verbose_name='Дата окончания задачи')
    start_date_fact = models.DateField(verbose_name='Фактическая дата старта задачи', null=True, blank=True)
    finish_date_fact = models.DateField(verbose_name='Фактическая дата конца задачи', null=True, blank=True)
    docs_path = models.ManyToManyField(Documents, verbose_name="Документы", null=True, blank=True)

    def __unicode__(self):
        return 'Задача %s' % self.task_name


    class Meta:
        db_table = 'tasks'
        verbose_name = "Задачу"
        verbose_name_plural = "Задачи"

    class MPTTMeta:
        order_insertion_by = ['task_name']

    def __str__(self):
        return self.task_name


class Workgroups(models.Model):
    workgroup_id = models.AutoField(primary_key=True, verbose_name="Код группы")
    workgroup_name = models.CharField(unique=True, max_length=255, verbose_name="Название группы")

    def __str__(self):
        return '%s' % self.workgroup_name

    class Meta:
        db_table = 'workgroups'
        verbose_name = 'Рабочая группа'
        verbose_name_plural = 'Рабочие группы'


class WorkingDeveloperList(models.Model):
    list_id = models.AutoField(primary_key=True)
    developer_login = models.ForeignKey(Developers, models.DO_NOTHING, db_column='developer_login', default=1,
                                        null=False, verbose_name='Логин разработчика')
    workgroup = models.ForeignKey(Workgroups, models.DO_NOTHING, default=1, null=False, verbose_name='Рабочая группа')
    head_status = models.BooleanField('Начальник')

    def __str__(self):
        return str(self.developer_login)

    class Meta:
        db_table = 'working_developer_list'
        verbose_name = 'Список группы'
        verbose_name_plural = 'Список групп'


@receiver(post_delete, sender=Users)
def submission_delete(sender, instance, **kwargs):
    instance.user_image_src.delete(False)


@receiver(post_delete, sender=Projects)
def submission_delete_projects(sender, instance, **kwargs):
    instance.tech_task_path.delete(False)


@receiver(post_delete, sender=Organisations)
def submission_delete_org(sender, instance, **kwargs):
    instance.organisation_image_src.delete(False)

@receiver(post_delete, sender=Documents)
def submission_delete_doc(sender, instatnce, **kwargs):
    instatnce.path_file.delete(False)
