from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class AccountManager(BaseUserManager):
    def create_user(self,email,username,password=None):
        if not email:
            raise ValueError("Users must have an email address")
        if not username:
            raise ValueError("Users must have a username")
        user = self.model(
            email=self.normalize_email(email),
            username=username
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self,email,username,password):
        user = self.create_user(
            email=self.normalize_email(email),
            password=password,
            username=username,
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


# Create your models here.

class Account(AbstractBaseUser, PermissionsMixin):
    objects = AccountManager()
    username = models.CharField(max_length=20, unique=True, error_messages={'unique':'Username is taken.'})
    email = models.EmailField(max_length=30, unique=True, error_messages={'unique':'Email is already in use.'})
    name = models.CharField(max_length=30)
    profile_picture = models.ImageField(upload_to='profilePictures/', default='/default.jpg')
    is_private = models.BooleanField(default=False)

    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    # following = models.ManyToManyField('Account', related_name='followers')

    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']
    
class Follower(models.Model):
    follower = models.ForeignKey('Account',on_delete=models.CASCADE ,related_name='following')
    following = models.ForeignKey('Account',on_delete=models.CASCADE ,related_name='followers')
    
    class Meta:
        unique_together = ('follower', 'following')

class Post(models.Model):
    caption = models.CharField(max_length=200, default='')
    soundcloud_art = models.URLField()
    soundcloud_audio = models.URLField()

    author = models.ForeignKey(Account,on_delete=models.CASCADE, related_name='posts')

    song_name = models.CharField(max_length=200)
    song_artist = models.CharField(max_length=200)

    created_at = models.DateTimeField(auto_now_add=True)
    REQUIRED_FIELDS = ['soundcloud_art', 'soundcloud_audio', 'song_name','song_artist', 'created_at']

class Feed_Item(models.Model):
    user = models.ForeignKey(Account,on_delete=models.CASCADE, related_name='feed')
    post = models.OneToOneField(Post,on_delete=models.CASCADE, primary_key=True)

class Video_Tile(models.Model):
    post = models.ForeignKey('Post',on_delete=models.CASCADE,related_name='tiles')
    tile_type = models.CharField(max_length=20) #posted_cover, posted_choreo, suggested_cover, suggested_choreo
    is_youtube = models.BooleanField(default=False)
    link = models.URLField()
    image = models.URLField()
    view_count = models.IntegerField(default='0')

    REQUIRED_FIELDS = ['is_youtube','image','link','view_count']

class Comment(models.Model):
    author = models.ForeignKey('Account',on_delete=models.CASCADE)
    post = models.ForeignKey('Post',on_delete=models.CASCADE,related_name='comments')
    value = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    REQUIRED_FIELDS = ['account','value']

class Like(models.Model):
    author = models.ForeignKey('Account',on_delete=models.CASCADE, related_name='liked')
    post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='likes')
