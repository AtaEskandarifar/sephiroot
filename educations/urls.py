from django.urls import path
from .views import *

app_name = 'educations'
urlpatterns = [
    path('', EducationsView.as_view(), name='educations'),
]