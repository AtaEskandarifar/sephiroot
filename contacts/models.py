import uuid

from django.db import models


class ContactMessage(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "New"
        READ = "read", "Read"
        REPLIED = "replied", "Replied"
        ARCHIVED = "archived", "Archived"

    # شناسه غیرقابل حدس برای استفاده داخلی، نه URL عمومی.
    public_id = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
        db_index=True,
    )

    name = models.CharField(max_length=120)
    contact_info = models.CharField(max_length=255)
    message = models.TextField(max_length=5000)

    status = models.CharField(
        max_length=12,
        choices=Status.choices,
        default=Status.NEW,
        db_index=True,
    )

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.name[:50]} — {self.created_at:%Y-%m-%d %H:%M}"
