from .models import Visitor


def visitor_count(request):
    return {
        "visitor_count": Visitor.objects.count(),
    }
