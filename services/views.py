from django.shortcuts import render
from django.views import View


class ServicesView(View):
    def get(self, request):
        return render(request, 'services/services.html')