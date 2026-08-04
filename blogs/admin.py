
from django.contrib import admin, messages
from django.db.models import Count
from django.utils import timezone
from django.utils.html import format_html

from .models import Category, Post, Tag


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "posts_count")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("name",)

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            _posts_count=Count("posts", distinct=True)
        )

    @admin.display(description="تعداد پست‌ها", ordering="_posts_count")
    def posts_count(self, obj):
        return obj._posts_count


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "posts_count")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("name",)

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            _posts_count=Count("posts", distinct=True)
        )

    @admin.display(description="تعداد پست‌ها", ordering="_posts_count")
    def posts_count(self, obj):
        return obj._posts_count


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "author",
        "category",
        "status_badge",
        "published_at",
        "created_at",
    )

    list_filter = (
        "status",
        "category",
        "tags",
        "published_at",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "title",
        "slug",
        "excerpt",
        "content",
        "author__username",
        "author__email",
    )

    date_hierarchy = "published_at"
    ordering = ("-published_at", "-created_at")
    list_per_page = 30

    prepopulated_fields = {
        "slug": ("title",),
    }

    filter_horizontal = ("tags",)
    autocomplete_fields = ("author", "category")
    list_select_related = ("category", "author")

    readonly_fields = (
        "views_count",
        "read_time_display",
        "featured_image_preview",
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "محتوای اصلی",
            {
                "fields": (
                    "title",
                    "slug",
                    "author",
                    "excerpt",
                    "content",
                )
            },
        ),
        (
            "رسانه و دسته‌بندی",
            {
                "fields": (
                    "featured_image",
                    "featured_image_preview",
                    "category",
                    "tags",
                )
            },
        ),
        (
            "انتشار",
            {
                "fields": (
                    "status",
                    "published_at",
                )
            },
        ),
        (
            "SEO",
            {
                "classes": ("collapse",),
                "fields": (
                    "seo_title",
                    "meta_description",
                ),
                "description": (
                    "در صورت خالی بودن، از عنوان و خلاصه برای داده‌های سئو استفاده می‌شود."
                ),
            },
        ),
        (
            "آمار و زمان‌ها",
            {
                "classes": ("collapse",),
                "fields": (
                    "views_count",
                    "read_time_display",
                    "created_at",
                    "updated_at",
                ),
            },
        ),
    )

    actions = (
        "action_publish",
        "action_unpublish_to_draft",
    )

    @admin.display(description="وضعیت", ordering="status")
    def status_badge(self, obj):
        """
        نمایش وضعیت پست به شکل badge رنگی در لیست Django Admin.
        """

        status_styles = {
            Post.Status.PUBLISHED: (
                "background:#14532d;"
                "color:#dcfce7;"
                "border:1px solid #22c55e;"
            ),
            Post.Status.DRAFT: (
                "background:#374151;"
                "color:#e5e7eb;"
                "border:1px solid #6b7280;"
            ),
        }

        style = status_styles.get(
            obj.status,
            (
                "background:#3f3f46;"
                "color:#f4f4f5;"
                "border:1px solid #71717a;"
            ),
        )

        return format_html(
            '<span style="display:inline-block;padding:3px 9px;'
            'border-radius:9999px;font-size:12px;font-weight:700;'
            'line-height:1.4;{}">{}</span>',
            style,
            obj.get_status_display(),
        )

    @admin.display(description="زمان مطالعه")
    def read_time_display(self, obj):
        return f"{obj.read_time} دقیقه"

    @admin.display(description="کاور")
    def featured_image_preview(self, obj):
        """
        نمایش preview تصویر شاخص در صفحه‌ی ویرایش پست.
        """

        if not obj.featured_image:
            return "—"

        return format_html(
            '<img src="{}" alt="کاور مقاله: {}" '
            'style="height:44px;width:66px;object-fit:cover;'
            'border-radius:6px;border:1px solid #444;" />',
            obj.featured_image.url,
            obj.title,
        )

    @admin.action(description="انتشار پست‌های انتخاب‌شده")
    def action_publish(self, request, queryset):
        """
        پست‌ها را Published می‌کند و فقط برای مواردی که تاریخ انتشار ندارند،
        published_at را روی زمان فعلی قرار می‌دهد.
        """

        now = timezone.now()
        total = queryset.count()

        queryset.filter(
            published_at__isnull=True,
        ).update(
            status=Post.Status.PUBLISHED,
            published_at=now,
        )

        queryset.filter(
            published_at__isnull=False,
        ).update(
            status=Post.Status.PUBLISHED,
        )

        self.message_user(
            request,
            f"{total} پست با موفقیت منتشر شد.",
            level=messages.SUCCESS,
        )

    @admin.action(description="برگرداندن پست‌های انتخاب‌شده به پیش‌نویس")
    def action_unpublish_to_draft(self, request, queryset):
        """
        فقط وضعیت را به Draft برمی‌گرداند و تاریخ انتشار قبلی را نگه می‌دارد.
        """

        count = queryset.update(status=Post.Status.DRAFT)

        self.message_user(
            request,
            f"{count} پست به حالت پیش‌نویس برگشت.",
            level=messages.SUCCESS,
        )
