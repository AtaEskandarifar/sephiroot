from django.db.models import F
from django.shortcuts import get_object_or_404
from django.views.generic import DetailView, ListView

from .models import Category, Post, Tag


class BlogListView(ListView):
    model = Post
    template_name = "blogs/blogs.html"
    context_object_name = "posts"
    paginate_by = 6

    def get_queryset(self):
        return (
            Post.objects.published()
            .select_related("author", "category")
            .prefetch_related("tags")
            .order_by("-published_at", "-created_at")
        )


class BlogDetailView(DetailView):
    model = Post
    template_name = "blogs/blogdetail.html"
    context_object_name = "post"
    slug_field = "slug"
    slug_url_kwarg = "slug"

    def get_queryset(self):
        return (
            Post.objects.published()
            .select_related("author", "category")
            .prefetch_related("tags")
        )

    def get_object(self, queryset=None):
        obj = super().get_object(queryset=queryset)

        Post.objects.filter(pk=obj.pk).update(
            views_count=F("views_count") + 1
        )
        obj.refresh_from_db(fields=["views_count"])
        return obj

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        post = self.object

        # پیدا کردن پست قبلی و بعدی بر اساس زمان انتشار
        queryset = Post.objects.published()

        context["previous_post"] = (
            queryset.filter(published_at__lt=post.published_at)
            .order_by("-published_at")
            .first()
        )
        context["next_post"] = (
            queryset.filter(published_at__gt=post.published_at)
            .order_by("published_at")
            .first()
        )
        return context


class CategoryPostsView(ListView):
    template_name = "blogs/category_posts.html"
    context_object_name = "posts"
    paginate_by = 9

    def get_queryset(self):
        self.category = get_object_or_404(Category, slug=self.kwargs["slug"])
        return (
            Post.objects.published()
            .filter(category=self.category)
            .select_related("author", "category")
            .prefetch_related("tags")
        )

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["category"] = self.category
        return context


class TagPostsView(ListView):
    template_name = "blogs/tag_posts.html"
    context_object_name = "posts"
    paginate_by = 9

    def get_queryset(self):
        self.tag = get_object_or_404(Tag, slug=self.kwargs["slug"])
        return (
            Post.objects.published()
            .filter(tags=self.tag)
            .select_related("author", "category")
            .prefetch_related("tags")
            .distinct()
        )

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["tag"] = self.tag
        return context


###################################################################



