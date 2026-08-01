from django.urls import path
from .views import *

app_name = 'pricing'
urlpatterns = [
    path('', PricingView.as_view(), name='pricing'),
]