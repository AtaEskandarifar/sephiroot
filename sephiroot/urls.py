"""
URL configuration for sephiroot project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path("ckeditor5/", include("django_ckeditor_5.urls")),
    path('', include('home.urls', namespace='home')),
    path('about/', include('about.urls', namespace='about')),
    path('services/', include('services.urls', namespace='services')),
    path('educations/', include('educations.urls', namespace='educations')),
    path('pricing/', include('pricing.urls', namespace='pricing')),
    path('blog/', include('blogs.urls', namespace='blog')),
    path('contacts/', include('contacts.urls', namespace='contact')),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)