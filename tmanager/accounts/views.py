from django.shortcuts import render
from accounts.models import Account, Post, Like, Comment, Video_Tile
from rest_framework import viewsets, permissions
from .serializers import AccountSerializer, PostSerializer, FollowerSerializer, FollowingSerializer, CommentSerializer, VideoSerializer, FeedSerializer
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_401_UNAUTHORIZED
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from copy import deepcopy


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = AccountSerializer

    def get_object(self):
        pk = self.kwargs.get('pk')

        if pk == "self":
            return self.request.user

        return super(AccountViewSet, self).get_object()
    
    @action(detail=True, methods=['POST','GET'], serializer_class=FollowerSerializer)
    def followers(self,request,*args,**kwargs):
        if(request.method=='POST'):
            follower, created = self.get_object().followers.all().get_or_create(follower=Account.objects.filter(username='kal')[0],following=self.get_object())
            #if follower was not created it already exists
            if not created:
                follower.delete()
            else:
                follower.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            all_followers = self.get_object().followers.all()
            serializer = FollowerSerializer(all_followers,many=True)
            return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def following(self,request,*args,**kwargs):
        all_following = self.get_object().following.all()
        serializer = FollowingSerializer(all_following,many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def posts(self,request,*args,**kwargs):
        all_posts = self.get_object().posts.all()
        serializer = PostSerializer(all_posts,many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def feed(self,request,*args,**kwargs):
        feed_posts = self.get_object().feed.all()
        serializer = FeedSerializer(feed_posts,many=True)
        return Response(serializer.data)



class PostViewSet(viewsets.ModelViewSet):


    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]

    @action(detail=True,methods=['POST','GET'],serializer_class=VideoSerializer)
    def video(self,request,*args,**kwargs):
        if(request.method=='POST'):
            post = self.get_object()
            tile_type = request.data.get('tile_type')
            is_youtube = request.data.get('is_youtube') == 'true'
            link = request.data.get('link')
            image = request.data.get('image')
            video = Video_Tile(post=post,tile_type=tile_type,is_youtube=is_youtube,link=link,image=image)
            video.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            videos = Video_Tile.objects.all()
            serializer = VideoSerializer(videos,many=True)
            return Response(serializer.data)
        

    @action(detail=True, methods=['GET'], )
    def like(self, request, *args, **kwargs):
        post = self.get_object()
        user = Account.objects.filter(username='kal')[0]
        like, created = Like.objects.get_or_create(author=user,post=self.get_object())
        #if like was not created it already exists
        if not created:
            like.delete()
        else:
            like.save()
        return Response(status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['GET','POST'], serializer_class=CommentSerializer )
    def comment(self, request, *args, **kwargs): 
        if(request.method=='POST'):
            user = Account.objects.filter(username='kal')[0]
            value = request.data.get('value')
            comment = Comment(author=user,post=self.get_object(),value=value)
            comment.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            all_comments = self.get_object().comments.all()
            serializer = CommentSerializer(all_comments,many=True)
            return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request,*args,**kwargs):
    user = authenticate(username=request.data.get('username'),password=request.data.get('password'))
    if not user:
        return Response({"error":"Error. Incorrect username or password."},status=HTTP_401_UNAUTHORIZED)
    token, created = Token.objects.get_or_create(user=user)
    return Response({'token':token.key})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def logout(request,*args,**kwargs):
    request.user.auth_token.delete()
    return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def signup(request, *args, **kwargs):
    data = deepcopy(request.data)
    serializer = AccountSerializer(data=data)
    if not serializer.is_valid():
        return Response(serializer._errors, status=status.HTTP_400_BAD_REQUEST)

    # Account.objects.create(**serializer.validated_data)
    serializer.save()

    return Response(serializer.data, status=status.HTTP_201_CREATED)