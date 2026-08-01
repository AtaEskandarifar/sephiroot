from django.shortcuts import render
from django.views import View

class EducationsView(View):
    def get(self, request):
        return render(request, 'educations/educations.html')
