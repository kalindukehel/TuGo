from rest_framework import serializers
from accounts.models import Account, Post, Follower, Comment, Video_Tile
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

class CommentSerializer(serializers.ModelSerializer):
     class Meta:
        model = Comment
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
