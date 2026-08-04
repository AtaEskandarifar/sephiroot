import math
import bleach
from django.conf import settings
from django.db import models
from django.urls import reverse
from django.utils import timezone
from django.utils.html import mark_safe
from django.utils.text import slugify
from django_ckeditor_5.fields import CKEditor5Field


class Category(models.Model):
    # (بدون تغییر)
    name = models.CharField(max_length=100, verbose_name="نام دسته")
    slug = models.SlugField(max_length=150, unique=True, allow_unicode=True, verbose_name="اسلاگ")
    description = models.TextField(blank=True, verbose_name="توضیحات دسته")

    class Meta:
        verbose_name = "دسته‌بندی"
        verbose_name_plural = "دسته‌بندی‌ها"

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("blog:category_posts", kwargs={"slug": self.slug})


class Tag(models.Model):
    # (بدون تغییر)
    name = models.CharField(max_length=100, verbose_name="نام برچسب")
    slug = models.SlugField(max_length=150, unique=True, allow_unicode=True, verbose_name="اسلاگ")

    class Meta:
        verbose_name = "برچسب"
        verbose_name_plural = "برچسب‌ها"

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("blog:tag_posts", kwargs={"slug": self.slug})


class PostQuerySet(models.QuerySet):
    def published(self):
        return self.filter(
            status=Post.Status.PUBLISHED,
            published_at__isnull=False,
            published_at__lte=timezone.now(),
        )


class Post(models.Model):
    class Status(models.TextChoices):
        DRAFT = "DF", "پیش‌نویس"
        PUBLISHED = "PB", "منتشر شده"

    title = models.CharField(max_length=250, verbose_name="عنوان مقاله")
    slug = models.SlugField(max_length=250, unique=True, allow_unicode=True, verbose_name="اسلاگ (URL)")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="blog_posts",
                               verbose_name="نویسنده")
    excerpt = models.TextField(max_length=320, help_text="خلاصه برای سئو.", verbose_name="خلاصه")

    # تغییر اصلی: جایگزینی TextField با CKEditor5Field
    content = CKEditor5Field(config_name="extends", verbose_name="محتوای مقاله")

    featured_image = models.ImageField(upload_to="blog/covers/%Y/%m/", blank=True, null=True, verbose_name="تصویر شاخص")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="posts",
                                 verbose_name="دسته‌بندی")
    tags = models.ManyToManyField(Tag, blank=True, related_name="posts", verbose_name="برچسب‌ها")

    status = models.CharField(max_length=2, choices=Status.choices, default=Status.DRAFT, verbose_name="وضعیت انتشار")
    published_at = models.DateTimeField(blank=True, null=True, verbose_name="زمان انتشار")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="آخرین به‌روزرسانی")
    views_count = models.PositiveIntegerField(default=0, editable=False, verbose_name="تعداد بازدید")

    seo_title = models.CharField(max_length=60, blank=True, verbose_name="عنوان سئو")
    meta_description = models.CharField(max_length=160, blank=True, verbose_name="توضیحات متا")

    objects = PostQuerySet.as_manager()

    class Meta:
        verbose_name = "پست وبلاگ"
        verbose_name_plural = "پست‌های وبلاگ"
        ordering = ["-published_at", "-created_at"]
        indexes = [
            models.Index(fields=["status", "published_at"]),
            models.Index(fields=["slug"]),
        ]

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse(
            "blog:post_detail",
            kwargs={"slug": self.slug},
        )

    def save(self, *args, **kwargs):
        # تولید اتوماتیک اسلاگ
        if not self.slug:
            self.slug = slugify(self.title, allow_unicode=True)

        # مدیریت زمان انتشار
        if self.status == self.Status.PUBLISHED and not self.published_at:
            self.published_at = timezone.now()

        # پاک‌سازی امنیتی با Bleach قبل از ذخیره در دیتابیس
        self.content = self._sanitize_html(self.content)

        super().save(*args, **kwargs)

    @staticmethod
    def _sanitize_html(html_content):
        if not html_content:
            return ""

        # ۱. تعریف دقیق تگ‌های مورد نیاز CKEditor
        allowed_tags = list(bleach.sanitizer.ALLOWED_TAGS) + [
            "p", "br", "span", "div", "h1", "h2", "h3", "h4", "h5", "h6",
            "img", "figure", "figcaption", "strong", "em", "u", "s",
            "ul", "ol", "li", "blockquote", "code", "pre"
        ]

        # ۲. اجازه دادن به کلاس‌ها و استایل‌ها (برای تراز تصاویر و رنگ‌ها)
        allowed_attrs = {
            "*": ["class", "style"],
            "a": ["href", "rel", "title", "target"],
            "img": ["src", "alt", "width", "height"],
        }

        # ۳. تمیز کردن محتوا بدون انکود کردن مجدد تگ‌های سالم
        cleaned = bleach.clean(
            html_content,
            tags=allowed_tags,
            attributes=allowed_attrs,
            strip=True  # تگ‌های غیرمجاز را حذف کن، نه اینکه انکود کنی
        )
        return cleaned
    @property
    def read_time(self):
        """تخمین زمان مطالعه با حذف تگ‌های HTML"""
        # پاک کردن تگ‌ها برای شمارش دقیق کلمات
        text_content = bleach.clean(self.content, tags=[], strip=True)
        words = len(text_content.split())
        minutes = math.ceil(words / 200)
        return max(1, minutes)
