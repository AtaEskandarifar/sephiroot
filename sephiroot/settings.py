from pathlib import Path
import os # Needed for env variables if used, but not strictly for these settings

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-$b5hthojclxpz0b^ga308d9(s(@nu)mv30#8cup5r7q&k_bv^1' # Replace with a real secret key for production

# SECURITY WARNING: don't run with debug turned on in production!
# Set DEBUG = False in production and configure ALLOWED_HOSTS
DEBUG = True

# Configure ALLOWED_HOSTS for production. For local development with DEBUG=True, it can be empty or ['127.0.0.1', 'localhost']
ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    ##############################
    # Your app configurations
    'home.apps.HomeConfig',
    'about.apps.AboutConfig',
    'services.apps.ServicesConfig',
    'educations.apps.EducationsConfig',
    'pricing.apps.PricingConfig',
    'blogs.apps.BlogsConfig',
    'contacts.apps.ContactsConfig',
    ##############################
    # Third-party apps
    'compressor', # Kept as it's for static file optimization
    ##############################
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware', # Essential for security
    'django.contrib.sessions.middleware.SessionMiddleware', # Session management
    'django.middleware.common.CommonMiddleware', # Handles URL routing and redirects
    'django.middleware.csrf.CsrfViewMiddleware', # CSRF protection - VERY IMPORTANT
    'django.contrib.auth.middleware.AuthenticationMiddleware', # User authentication
    'django.contrib.messages.middleware.MessageMiddleware', # Message framework
    'django.middleware.clickjacking.XFrameOptionsMiddleware', # Clickjacking protection
    # 'csp.middleware.CSPMiddleware', # Removed as per request
]

ROOT_URLCONF = 'sephiroot.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request', # Makes request object available in templates
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
            # Add 'django.template.context_processors.media' if you use media files
        },
    },
]

WSGI_APPLICATION = 'sephiroot.wsgi.application'


# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators
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
# https://docs.djangoproject.com/en/6.0/topics/i18n/
LANGUAGE_CODE = 'en-us' # Consider 'fa-ir' if your primary language is Persian
TIME_ZONE = 'UTC' # Consider 'Asia/Tehran' if appropriate
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/
STATIC_URL = '/static/' # URL prefix for static files
STATICFILES_DIRS = [
    BASE_DIR / 'static', # Directory for additional static files
]
STATIC_ROOT = BASE_DIR / 'staticfiles' # Directory where collectstatic will gather files

MEDIA_URL = '/media/' # URL prefix for media files
MEDIA_ROOT = BASE_DIR / 'media' # Directory for uploaded media files


# Compressor settings (optional, for optimizing CSS/JS)
STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder', # Needed if using django-compressor
]

# Compressor settings (example, configure as needed)
# COMPRESS_ENABLED = True # Set to True for production

# Security settings for Production (ensure these are handled correctly)
# These should generally be OFF when DEBUG = True
if not DEBUG:
    # SECURITY WARNING: Add your domain(s) here for production
    # ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']

    # Redirect all HTTP requests to HTTPS
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True # Apply HSTS to all subdomains
    SECURE_HSTS_PRELOAD = True # Allow browser preloading (use with caution)

    # Use secure cookies for session and CSRF
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

    # Prevent Clickjacking
    X_FRAME_OPTIONS = 'DENY' # Or 'SAMEORIGIN' if you need to embed in same-origin frames

    # Prevent MIME-sniffing
    SECURE_CONTENT_TYPE_NOSNIFF = True

    # Referrer Policy
    SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"

    # Other security headers if needed (e.g., from django-referrer-policy)
else:
    # Development settings
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    SECURE_HSTS_SECONDS = 0
    SECURE_HSTS_PRELOAD = False
    X_FRAME_OPTIONS = 'SAMEORIGIN' # Often needed during development if iframes are used
    SECURE_CONTENT_TYPE_NOSNIFF = False
    SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin" # Can be kept for development


# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend' # Configure your email backend for production
# EMAIL_HOST = 'smtp.example.com'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = 'your_email@example.com'
# EMAIL_HOST_PASSWORD = 'your_email_password'
# DEFAULT_FROM_EMAIL = 'webmaster@yourdomain.com'

# Media file settings (upload handling)
# DATA_UPLOAD_MAX_MEMORY_SIZE = 2147483647 # Default is 2.5MB, adjust if needed
# FILE_UPLOAD_MAX_MEMORY_SIZE = 2147483647 # Default is 2.5MB
# DATA_UPLOAD_MAX_NUMBER_FIELDS = 1000 # Default is 1000


# Other settings can go here...
