from django.contrib import admin

from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "contact_info",
        "status",
        "created_at",
    )

    list_filter = ("status", "created_at")
    search_fields = ("name", "contact_info", "message")
    readonly_fields = ("created_at",)

    fieldsets = (
        ("اطلاعات فرستنده", {
            "fields": ("name", "contact_info"),
        }),
        ("محتوای پیام", {
            "fields": ("message",),
        }),
        ("مدیریت پیام", {
            "fields": ("status", "created_at"),
        }),
    )
