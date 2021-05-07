"""
Django settings for testDiplom project.

Generated by 'django-admin startproject' using Django 3.1.2.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""
from pathlib import Path
from django.utils.translation import gettext_lazy as _
import os

ROOT = os.path.abspath(os.path.dirname(__file__))
path = lambda *args: os.path.join(ROOT, *args)
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'gltv83z_1@j^39s-n#($5qy3ky%w6s#5$x*6vx=39f3g*ab(!)'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

AUTH_USER_MODEL = 'diploAdmin.Users'

# Application definition

INSTALLED_APPS = [
    'django.contrib.redirects',
    'django.contrib.sites',
    'django.contrib.auth',
    'admin_interface',
    'colorfield',
    'django.contrib.admin',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rangefilter',
    'import_export',
    'treebeard',
    'mptt',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'corsheaders',
    'rest_auth',
    'rest_auth.registration',
    'rest_framework',
    'rest_framework.authtoken',

    'diploAdmin',
    'django_extensions',
]

SITE_ID = 1

X_FRAME_OPTIONS = 'SAMEORIGIN'

IMPORT_EXPORT_USE_TRANSACTIONS = True

MIDDLEWARE = [
    'django.contrib.redirects.middleware.RedirectFallbackMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'testDiplom.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['templates', 'feincms/templates', BASE_DIR / 'frontForDiplom/build'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'testDiplom.wsgi.application'

# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'testhelpmeimportexport',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'PORT': '5432',
        'HOST': '185.43.4.30'
    }
}

# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = 'ru'

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_L10N = True

USE_TZ = True

LOCALE_PATHS = [os.path.join(BASE_DIR, 'locale')]

LANGUAGES = [
    ('en', _('English')),
    ('ru', _('Russian')),
]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'static'
STATICFILES_DIRS = (
    (BASE_DIR / 'frontForDiplom/build/static'),
)

MEDIA_URL = 'media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
FEINCMS_ADMIN_MEDIA = '/media/feincms/'
FEINCMS_ADMIN_MEDIA_LOCATION = path('media/feincms/')

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny'
    ]
}

CORS_ORIGIN_ALLOW_ALL = True

OLD_PASSWORD_FIELD_ENABLED = True
LOGOUT_ON_PASSWORD_CHANGE = False

ACCOUNT_EMAIL_VERIFICATION = 'none'
ACCOUNT_AUTHENTICATION_METHOD = 'username'
ACCOUNT_EMAIL_REQUIRED = False
ACCOUNT_LOGIN_ATTEMPTS_LIMIT = 5
ACCOUNT_LOGIN_ATTEMPTS_TIMEOUT = 86400 # 1 day in seconds

EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'i_a.n.litkin@mpt.ru'
EMAIL_HOST_PASSWORD = 'vcznjrmnunrpzngj'

EMAIL_CONFIRMATION_AUTHENTICATED_REDIRECT_URL = '/'