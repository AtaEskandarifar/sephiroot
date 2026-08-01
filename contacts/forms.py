import re

from django import forms

from .models import ContactMessage


class ContactMessageForm(forms.ModelForm):
    # Honeypot field
    website = forms.CharField(
        required=False,
        label="Leave this field empty", # برای کاربران واقعی
        widget=forms.HiddenInput,
        help_text="If you fill this out, your message will not be sent.", # راهنمای مخفی
    )

    class Meta:
        model = ContactMessage
        fields = ("name", "contact_info", "message", "website")
        # length constraints moved to clean_* methods for better control and messaging

    def clean_website(self):
        # اگر honeypot پر شده باشد، خطا ایجاد کن.
        value = self.cleaned_data.get("website", "").strip()
        if value:
            raise forms.ValidationError("Invalid transmission. Please leave the 'website' field empty.")
        return value

    def clean_name(self):
        name = self.cleaned_data.get("name", "").strip()
        if not 2 <= len(name) <= 120:
            raise forms.ValidationError("Your name must be between 2 and 120 characters.")
        # Basic check for control characters (excluding common whitespace if needed)
        # This regex is simplified; more robust validation might be needed based on exact requirements.
        if re.search(r"[\x00-\x1F\x7F]", name):
            raise forms.ValidationError("Your name contains invalid characters.")
        return name

    def clean_contact_info(self):
        contact_info = self.cleaned_data.get("contact_info", "").strip()
        if not 5 <= len(contact_info) <= 255:
            raise forms.ValidationError("Your contact information must be between 5 and 255 characters.")
        if re.search(r"[\x00-\x1F\x7F]", contact_info):
            raise forms.ValidationError("Contact information contains invalid characters.")
        return contact_info

    def clean_message(self):
        message = self.cleaned_data.get("message", "").strip()
        if not 10 <= len(message) <= 5000:
            raise forms.ValidationError("Your message must be between 10 and 5000 characters.")

        # Prevent common XSS patterns using regex (as a secondary defense)
        # WARNING: Regex for XSS is complex and may not catch all cases. Django's auto-escaping is the primary defense.
        # This regex aims to catch basic script tags and attribute injections.
        xss_pattern = re.compile(r"<script.*?>.*?</script>|<.*? (?:onerror|onload|onclick|onmouseover|onmouseout|onmousemove|onmousedown|onmouseup|onkeydown|onkeyup|onkeypress)=.*?>", re.IGNORECASE)
        if xss_pattern.search(message):
            raise forms.ValidationError("Your message contains potentially harmful content.")

        # Null byte and most control characters check (already covered by generic control char check above)
        # but keeping specific check for clarity if needed.
        # if re.search(r"[\x00-\x08\x0B\x0C\x0E-\x1F]", message):
        #     raise forms.ValidationError("Message contains invalid control characters.")

        return message
