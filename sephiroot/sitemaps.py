from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from django.utils import timezone

from blogs.models import Category, Post, Tag

DOMAIN = "sephiroot.ir"


class BaseSitemap(Sitemap):
    protocol = "https"
    domain = DOMAIN

    def get_urls(self, page=1, site=None, protocol=None):
        urls = super().get_urls(page=page, site=site, protocol=self.protocol)
        for url in urls:
            loc = url.get("loc", "")
            # فورس کردن دامنه درست
            if loc.startswith("http://") or loc.startswith("https://"):
                path = loc.split("://", 1)[1]
                path = path.split("/", 1)[1] if "/" in path else ""
                url["loc"] = f"{self.protocol}://{self.domain}/{path}".rstrip("/")
            else:
                url["loc"] = f"{self.protocol}://{self.domain}{loc}"
        return urls


class StaticViewSitemap(BaseSitemap):
    priority = 0.9
    changefreq = "monthly"

    def items(self):
        return [
            "home:home",
            "about:about",
            "services:services",
            "educations:educations",
            "pricing:pricing",
            "contact:contact",
        ]

    def location(self, item):
        return reverse(item)


class BlogListViewSitemap(BaseSitemap):
    priority = 0.8
    changefreq = "daily"

    def items(self):
        return ["blog:blogs"]

    def location(self, item):
        return reverse(item)


class BlogPostSitemap(BaseSitemap):
    priority = 0.8
    changefreq = "weekly"

    def items(self):
        return Post.objects.published()

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return obj.get_absolute_url()


class CategorySitemap(BaseSitemap):
    priority = 0.6
    changefreq = "monthly"

    def items(self):
        return Category.objects.filter(
            posts__status=Post.Status.PUBLISHED,
            posts__published_at__isnull=False,
            posts__published_at__lte=timezone.now(),
        ).distinct()

    def location(self, obj):
        return obj.get_absolute_url()


class TagSitemap(BaseSitemap):
    priority = 0.5
    changefreq = "monthly"

    def items(self):
        return Tag.objects.filter(
            posts__status=Post.Status.PUBLISHED,
            posts__published_at__isnull=False,
            posts__published_at__lte=timezone.now(),
        ).distinct()

    def location(self, obj):
        return obj.get_absolute_url()

