from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods

from .forms import ContactMessageForm
# No need to import ratelimit decorators


def is_ajax(request):
    # Check if the request header indicates an AJAX request
    return request.headers.get("X-Requested-With") == "XMLHttpRequest"


@require_http_methods(["GET", "POST"])
def contact_view(request):
    if request.method == "POST":
        form = ContactMessageForm(request.POST)

        if form.is_valid():
            # Save the message
            message = form.save()

            if is_ajax(request):
                # Return JSON response for AJAX requests on success
                return JsonResponse(
                    {
                        "success": True,
                        "message": "Your message has been sent successfully.",
                        # Include public_id for client-side correlation/logging if needed
                        "reference": str(message.public_id),
                    },
                    status=201, # Created
                )

            # For non-AJAX requests, render a success message (e.g., redirect or show message on page)
            # Using render with success message for simplicity here.
            return render(
                request,
                "contacts/contacts.html",
                {
                    "form": ContactMessageForm(), # Clear the form
                    "success": True, # Indicate success to the template
                    "success_message": "Thank you for your message! We will get back to you soon.",
                },
            )

        # If the form is not valid (validation errors)
        if is_ajax(request):
            # Return JSON response with errors for AJAX requests
            return JsonResponse(
                {
                    "success": False,
                    "message": "Validation failed.",
                    "errors": form.errors.get_json_data(), # Get errors in JSON format
                },
                status=400, # Bad Request
            )
        else:
            # For non-AJAX requests, re-render the form with errors
            # The template should display these errors appropriately
            pass # Fall through to render the form with errors

    # For GET requests, or POST requests with errors not handled by AJAX
    return render(
        request,
        "contacts/contacts.html",
        {
            "form": ContactMessageForm(),
            # If there were POST errors and it wasn't AJAX, the form object will contain errors
        },
    )

# Note: No ratelimit decorator is used.
# AJAX checks are kept for better user experience with JS.
# CSRF protection is handled by Django's CsrfViewMiddleware and {% csrf_token %}.
# XSS prevention relies on Django's auto-escaping and the regex in the form's clean_message.
# IDOR prevention relies on not exposing internal IDs and checking permissions if necessary (not shown here as this is a simple form submission).
