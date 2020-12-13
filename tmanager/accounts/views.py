from django.shortcuts import render
from accounts.models import Account, Post, Like, Comment, Tile
from rest_framework import viewsets, permissions
from .serializers import AccountSerializer, PrivateAccountSerializer, PostSerializer, FollowerSerializer, FollowingSerializer, CommentSerializer, LikeSerializer, TileSerializer, FeedSerializer
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN
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

    def get_serializer_class(self):
        if(self.action == 'list'):
            return PrivateAccountSerializer
        elif(self.action == 'retrieve'):
            if(self.get_object().is_private == False or
            self.get_object().followers.filter(follower=self.request.user).exists() or
            self.get_object() == self.request.user):
                return AccountSerializer
            else:
                return PrivateAccountSerializer

        return AccountSerializer

    def get_object(self):
        pk = self.kwargs.get('pk')

        if pk == "self":
            return self.request.user

        return super(AccountViewSet, self).get_object()
    
    @action(detail=False, methods=['POST'], serializer_class=AccountSerializer)
    def by_ids(self,request,*args,**kwargs):
        id_set = self.request.data.get('ids')
        user_list = Account.objects.filter(id__in=id_set if id_set !=None else [])
        serialized = PrivateAccountSerializer(user_list,many=True)
        return Response(serialized.data)
    
    @action(detail=True, methods=['POST','GET'], serializer_class=FollowerSerializer)
    def followers(self,request,*args,**kwargs):
        if(request.method=='POST'):
            follower, created = self.get_object().followers.all().get_or_create(follower=request.user,following=self.get_object())
            #if follower was not created it already exists
            if not created:
                follower.delete()
            else:
                follower.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            if(self.get_object().is_private == False or
            self.get_object().followers.filter(follower=self.request.user).exists() or
            self.get_object() == self.request.user):
                all_followers = self.get_object().followers.all()
                serializer = FollowerSerializer(all_followers,many=True)
                return Response(serializer.data)
            else:
                return Response(status=HTTP_403_FORBIDDEN)

    @action(detail=True, methods=['GET'])
    def following(self,request,*args,**kwargs):
        if(self.get_object().is_private == False or
        self.get_object().followers.filter(follower=self.request.user).exists() or
        self.get_object() == self.request.user):
            all_following = self.get_object().following.all()
            serializer = FollowingSerializer(all_following,many=True)
            return Response(serializer.data)
        else:
            return Response(status=HTTP_403_FORBIDDEN)

    @action(detail=True, methods=['GET'])
    def posts(self,request,*args,**kwargs):
        if(self.get_object().is_private == False or
        self.get_object().followers.filter(follower=self.request.user).exists() or
        self.get_object() == self.request.user):
            all_posts = self.get_object().posts.all()
            serializer = PostSerializer(all_posts,many=True)
            return Response(serializer.data)
        else:
            return Response(status=HTTP_403_FORBIDDEN)

    @action(detail=False, methods=['GET'])
    def feed(self,request,*args,**kwargs):
        feed_posts = request.user.feed.all()
        serializer = FeedSerializer(feed_posts,many=True)
        return Response(serializer.data)



class PostViewSet(viewsets.ModelViewSet):


    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]
        
    @action(detail=True, methods=['GET','POST'], serializer_class=LikeSerializer)
    def likes(self, request, *args, **kwargs):
        if(request.method == 'POST'):
            post = self.get_object()
            like, created = self.get_object().likes.all().get_or_create(author=request.user,post=self.get_object())
            #if like was not created it already exists
            if not created:
                like.delete()
            else:
                like.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            all_likes = self.get_object().likes.all()
            serializer = LikeSerializer(all_likes,many=True)
            return Response(serializer.data)
    
    @action(detail=True, methods=['GET','POST'], serializer_class=CommentSerializer )
    def comments(self, request, *args, **kwargs): 
        if(request.method=='POST'):
            value = request.data.get('value')
            comment = Comment(author=request.user,post=self.get_object(),value=value)
            comment.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            all_comments = self.get_object().comments.all()
            serializer = CommentSerializer(all_comments,many=True)
            return Response(serializer.data)

    @action(detail=True, methods=['GET','POST'], serializer_class=TileSerializer )
    def tiles(self, request, *args, **kwargs): 
        if(request.method=='POST'):
            tile_type = request.data.get('tile_type')
            if(tile_type not in ['posted_cover', 'posted_choreo', 'suggested_cover', 'suggested_choreo']):
                return Response(status=status.HTTP_400_BAD_REQUEST)
            is_youtube = request.data.get('is_youtube')
            link = request.data.get('link')
            image = request.data.get('image')
            tile = Tile(post=self.get_object(),tile_type=tile_type,is_youtube=is_youtube,link=link,image=image)
            tile.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            tiles = self.get_object().tiles.all()
            serializer = TileSerializer(tiles,many=True)
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