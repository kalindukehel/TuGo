from rest_framework import routers
from .views import AccountViewSet
from .views import PostViewSet
from .views import login, logout, signup, songcharts, songcharts, valid
from django.contrib import admin
from django.urls import re_path, path, include
from django.conf.urls import url
router = routers.DefaultRouter()
router.register('accounts',AccountViewSet,'accounts')
router.register('posts', PostViewSet, 'posts')


urlpatterns = [
    url(r'^api/', include((router.urls,'accounts'), namespace='api')),
    url(r'^login/', login, name="login_user"),
    url(r'^logout/', logout, name="logout_user"),
    url(r'^signup/', signup, name="signup_user"),
    url(r'^valid/', valid, name="valid"),
    url(r'^songcharts/', songcharts, name="song_charts"),
    path('admin/',admin.site.urls)
]