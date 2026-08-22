from django.db import models


class Visitor(models.Model):
    fingerprint = models.CharField(
        max_length=64,
        unique=True,
        db_index=True,
    )
    first_seen = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.fingerprint[:12]
