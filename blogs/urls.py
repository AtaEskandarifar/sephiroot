from django.urls import path
from .views import BlogDetailView, BlogListView, CategoryPostsView, TagPostsView

app_name = "blog"

urlpatterns = [
    path("", BlogListView.as_view(), name="blogs"),
    path("category/<str:slug>/", CategoryPostsView.as_view(), name="category_posts"),
    path("tag/<str:slug>/", TagPostsView.as_view(), name="tag_posts"),
    path("<str:slug>/", BlogDetailView.as_view(), name="post_detail"),
]
