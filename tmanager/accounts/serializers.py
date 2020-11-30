from rest_framework import serializers
from accounts.models import Account, Post, Follower, Like, Comment, Video_Tile, Feed_Item
from rest_framework.validators import UniqueValidator


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'
        
    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

class PostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = (
            '__all__'
        )
    def create(self, request, *args, **kwargs):
        # request.data.update({"user": request.user.pk})
        newPost = super().create(request, *args, **kwargs)
        for followerObject in request['author'].followers.all():
            feed_item = Feed_Item(user=followerObject.follower,post=newPost)
            feed_item.save()
        return newPost

class FeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feed_Item
        fields = (
            '__all__'
        )

class CommentSerializer(serializers.ModelSerializer):
     class Meta:
        model = Comment
        fields = (
            '__all__'
        )  

class LikeSerializer(serializers.ModelSerializer):
     class Meta:
        model = Like
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

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video_Tile
        fields = (
            '__all__'
        )
