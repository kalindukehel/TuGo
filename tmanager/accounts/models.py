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

    notification_token = models.CharField(max_length=50, unique=True, null=True, error_messages={'unique':'Token is already assigned.'})

    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    soundcloud_account = models.CharField(max_length=100, null=True)
    youtube_account = models.CharField(max_length=100, null=True)
    spotify_account = models.CharField(max_length=100, null=True)

    # following = models.ManyToManyField('Account', related_name='followers')

    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']
    
class Follower(models.Model):
    follower = models.ForeignKey('Account',on_delete=models.CASCADE ,related_name='following')
    following = models.ForeignKey('Account',on_delete=models.CASCADE ,related_name='followers')
    
    class Meta:
        unique_together = ('follower', 'following')

class Requester(models.Model):
    requester = models.ForeignKey('Account',on_delete=models.CASCADE ,related_name='requested')
    to_request = models.ForeignKey('Account',on_delete=models.CASCADE ,related_name='requests')

class Post(models.Model):
    caption = models.CharField(max_length=200, default='', blank=True)

    album_cover = models.URLField()
    audio_url = models.URLField()

    author = models.ForeignKey(Account,on_delete=models.CASCADE, related_name='posts')

    song_name = models.CharField(max_length=200)
    song_artist = models.CharField(max_length=200)
    song_tags = models.CharField(max_length=200, default='', null=True, blank=True)
    song_id = models.CharField(max_length=200)
    artist_id = models.CharField(max_length=200, default='', null=True, blank=True)
    video_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    REQUIRED_FIELDS = ['album_cover', 'audio_url', 'song_name','song_artist', 'song_id', 'created_at']

class Feed_Item(models.Model):
    user = models.ForeignKey(Account,on_delete=models.CASCADE, related_name='feed')
    post = models.ForeignKey(Post,on_delete=models.CASCADE,related_name='+')
    follow_relation = models.ForeignKey(Follower,on_delete=models.CASCADE,related_name='+',null=True, blank=True)

class Explore_Item(models.Model):
    user = models.ForeignKey(Account,on_delete=models.CASCADE, related_name='explore')
    post = models.ForeignKey(Post,on_delete=models.CASCADE,related_name='+')

class Tile(models.Model):
    post = models.ForeignKey('Post',on_delete=models.CASCADE,related_name='tiles')
    tile_type = models.CharField(max_length=20) #posted_cover, posted_choreo, suggested_cover, suggested_choreo
    is_youtube = models.BooleanField(default=False)
    youtube_link = models.URLField(null=True, blank=True)
    image = models.URLField(null=True, blank=True)
    view_count = models.IntegerField(default='0')
    youtube_video_url = models.CharField(max_length=2000, default='', null=True, blank=True)
    youtube_video_created = models.DateTimeField(default=None, null=True, blank=True)
    custom_video_url = models.FileField(upload_to='videoUploads/', null=True, blank=True)

    REQUIRED_FIELDS = ['is_youtube','view_count']

class Comment(models.Model):
    author = models.ForeignKey('Account',on_delete=models.CASCADE)
    post = models.ForeignKey('Post',on_delete=models.CASCADE,related_name='comments')
    value = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    REQUIRED_FIELDS = ['account','value']

class Like(models.Model):
    author = models.ForeignKey('Account',on_delete=models.CASCADE, related_name='liked')
    post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

class Tag(models.Model):
    author = models.ForeignKey('Account',on_delete=models.CASCADE, related_name='tagger')
    post = models.ForeignKey('Post',on_delete=models.CASCADE,related_name='tags')
    value = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    tagged = models.ForeignKey('Account',on_delete=models.CASCADE, related_name='tagged')

    REQUIRED_FIELDS = ['author','value', 'tagged']

class Favorite(models.Model):
    author = models.ForeignKey('Account',on_delete=models.CASCADE, related_name='favorites')
    post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='+')
    created_at = models.DateTimeField(auto_now_add=True)    

class Activity_Item(models.Model):
    ACTIVITY_CHOICES = [
        ('FOLLOW','Follow'),
        ('LIKE', 'Like'),
        ('COMMENT','Comment'),
        ('TAG','Tag')
    ]
    user = models.ForeignKey(Account,on_delete=models.CASCADE, related_name='activity')
    activity_type = models.CharField(max_length=15,choices=ACTIVITY_CHOICES)
    action_user =  models.ForeignKey(Account,on_delete=models.CASCADE,related_name='+')
    post = models.ForeignKey(Post,on_delete=models.CASCADE,null=True,blank=True,related_name='+')
    comment = models.ForeignKey(Comment,on_delete=models.CASCADE,null=True,blank=True,related_name='+')
    like = models.ForeignKey(Like,on_delete=models.CASCADE,null=True,blank=True,related_name='+')
    follower = models.ForeignKey(Follower,on_delete=models.CASCADE,null=True,blank=True,related_name='+')
    tag = models.ForeignKey(Tag,on_delete=models.CASCADE,null=True,blank=True,related_name='+')
    created_at = models.DateTimeField(auto_now_add=True)

    REQUIRED_FIELDS = ['user','activity_type','action_user']

class Song(models.Model):
    video_id = models.CharField(max_length=11, default='')
    audio_url = models.CharField(max_length=2000, default='')
    song_created = models.DateTimeField(default=None, null=True, blank=True)
    title = models.CharField(max_length=100, default='')
    thumbnail = models.CharField(max_length=100, default='')
    artist = models.CharField(max_length=100, default='')