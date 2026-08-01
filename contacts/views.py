from django.shortcuts import render
from django.views import View


class ContactsView(View):
    def get(self, request):
        return render(request, 'contacts/contacts.html')
