import hashlib
import hmac
import uuid

from django.conf import settings
from django.utils.deprecation import MiddlewareMixin

from .models import Visitor


VISITOR_COOKIE_NAME = "sephiroot_visitor_id"


class VisitorCounterMiddleware(MiddlewareMixin):
    def process_request(self, request):
        visitor_id = request.COOKIES.get(VISITOR_COOKIE_NAME)

        if visitor_id:
            fingerprint_source = f"cookie:{visitor_id}"
        else:
            # Nginx should pass the real client IP through X-Real-IP.
            ip_address = request.META.get(
                "HTTP_X_REAL_IP",
                request.META.get("REMOTE_ADDR", ""),
            )
            user_agent = request.META.get("HTTP_USER_AGENT", "")

            fingerprint_source = f"ip:{ip_address}|ua:{user_agent}"

        fingerprint = hmac.new(
            settings.SECRET_KEY.encode(),
            fingerprint_source.encode(),
            hashlib.sha256,
        ).hexdigest()

        visitor, created = Visitor.objects.get_or_create(
            fingerprint=fingerprint
        )

        request.visitor_fingerprint = fingerprint
        request.visitor_cookie_missing = not visitor_id

        # Save this only for new visitors. This prevents a database write
        # on every request from the same browser.
        if created:
            request.visitor_is_new = True
        else:
            request.visitor_is_new = False

    def process_response(self, request, response):
        if getattr(request, "visitor_cookie_missing", False):
            visitor_id = str(uuid.uuid4())

            response.set_cookie(
                VISITOR_COOKIE_NAME,
                visitor_id,
                max_age=60 * 60 * 24 * 365 * 2,
                secure=True,
                httponly=True,
                samesite="Lax",
            )

        return response
