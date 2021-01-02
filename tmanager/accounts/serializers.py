from rest_framework import serializers
from accounts.models import Account, Post, Follower, Requester, Like, Comment, Tile, Feed_Item, Activity_Item, Favorite
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
    
class PrivateAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = (
            'id',
            'username',
            'profile_picture',
            'name'
            )

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