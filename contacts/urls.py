from django.urls import path
from .views import *

app_name = 'contacts'
urlpatterns = [
    path('', ContactsView.as_view(), name='contacts'),
]