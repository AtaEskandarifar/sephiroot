from django.urls import path
from .views import *

app_name = 'blogs'
urlpatterns = [
    path('', BlogsView.as_view(), name='blogs'),
]