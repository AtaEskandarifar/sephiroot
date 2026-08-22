from django.urls import path
from .views import *

app_name = 'about'
urlpatterns = [
    path('', AboutView.as_view(), name='about'),
]
