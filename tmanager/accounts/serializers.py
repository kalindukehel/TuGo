from rest_framework import serializers
from accounts.models import Account, Post, Follower, Requester, Like, Comment, Tile, Explore_Item, Feed_Item, Activity_Item, Favorite, Song, Tag
from rest_framework.validators import UniqueValidator
from django.core.exceptions import ValidationError


class AccountSerializer(serializers.ModelSerializer):
    isViewable = serializers.SerializerMethodField()
    def get_isViewable(self,obj):
        return True
    class Meta:
        model = Account
        fields = '__all__'
        
    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class PrivateAccountSerializer(serializers.ModelSerializer):
    isViewable = serializers.SerializerMethodField()
    def get_isViewable(self,obj):
        return False
    class Meta:
        model = Account
        fields = (
            'id',
            'username',
            'profile_picture',
            'name',
            'notification_token',
            'isViewable'
            )

class PostSerializer(serializers.ModelSerializer):
    isViewable = serializers.SerializerMethodField()
    def get_isViewable(self,obj):
        return True
    class Meta:
        model = Post
        fields = (
            '__all__'
        )
    def create(self, request, *args, **kwargs):
        #set author to user making the request
        request['author'] = self.context['request'].user
        newPost = super().create(request, *args, **kwargs)
        #push post to own feed
        feed_item = Feed_Item(user=self.context['request'].user,post=newPost,follow_relation=None)
        feed_item.save()
        # try:
        #     feed_item.full_clean()
        #     feed_item.save()
        # except ValidationError as e:
        #     return None
        #create a feed item for the new post and push it to all followers
        for followerObject in self.context['request'].user.followers.all():
            feed_item = Feed_Item(user=followerObject.follower,post=newPost,follow_relation=followerObject)
            feed_item.save()
        return newPost

class PrivatePostSerializer(serializers.ModelSerializer):
    isViewable = serializers.SerializerMethodField()
    def get_isViewable(self,obj):
        return False
    class Meta:
        model = Post
        fields = (
            'id',
            'author',
            'isViewable'
        )

class FeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feed_Item
        fields = (
            '__all__'
        )

class ExploreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Explore_Item
        fields = (
            '__all__'
        )

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = (
            '__all__'
        )
    def create(self, request, *args, **kwargs):
        print("CREATED")
        newComment = super().create(request, *args, **kwargs)
        activity_item = Activity_item(user=newComment.post.author,activity_type='COMMENT',comment=newComment.value)
        activity_item.save()
        return newComment

class LikeSerializer(serializers.ModelSerializer):
     class Meta:
        model = Like
        fields = (
            '__all__'
        )         

class TagSerializer(serializers.ModelSerializer):
     class Meta:
        model = Tag
        fields = (
            '__all__'
        )       

class FollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follower
        fields = (
            '__all__'
        )


class FollowingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follower
        fields = (
            'following',
        )
    
class FollowRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requester
        fields = (
            '__all__'
        )

class TileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tile
        fields = (
            '__all__'
        )

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity_Item
        fields = (
            '__all__'
        )

class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = (
            '__all__'
        ) 

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = (
            '__all__'
        )  