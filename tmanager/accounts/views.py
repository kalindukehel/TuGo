from django.shortcuts import render
from accounts.models import Account, Follower, Post, Like, Comment, Tile, Activity_Item
from rest_framework import viewsets, permissions
from .serializers import AccountSerializer, PrivateAccountSerializer, FollowRequestSerializer, PostSerializer, FollowerSerializer, FollowingSerializer, CommentSerializer, LikeSerializer, TileSerializer, FeedSerializer, ActivitySerializer, FavoriteSerializer
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN
from rest_framework import status
from django.contrib.auth import authenticate
from django.db.models import Q
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
        serializer_list = {'followers':FollowerSerializer,'following':FollowingSerializer}
        return (serializer_list[self.action] if self.action in serializer_list else AccountSerializer)

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

    @action(detail=False, methods=['POST'], serializer_class=AccountSerializer)
    def search_by_username(self,request,*args,**kwargs):
        search_query = self.request.data.get('search_query')
        #Filters users by if their name or username contains search query
        user_list = Account.objects.filter(Q(username__contains=search_query) | Q(name__contains=search_query))
        serialized = PrivateAccountSerializer(user_list,many=True)
        return Response(serialized.data)

    @action(detail=True, methods=['GET'])
    def details(self,request,*args,**kwargs):
        return Response({
            'posts': self.get_object().posts.count(),
            'followers': self.get_object().followers.count(),
            'following': self.get_object().following.count()
        })
    
    @action(detail=False, methods=['GET','POST'])
    def requests(self,request,*args,**kwargs):
        if(request.method=='POST'): #If user wants to perform action on a request
            action = self.request.data.get('action')
            requester = self.request.data.get('requester')
            if(action == 'confirm'):
                #Create follower object then delete follower request item, push new activity item to user
                follow_request = request.user.requests.get(requester=requester)
                follower = Follower.objects.create(follower=follow_request.requester,following=request.user)
                follow_request.delete()
                follower.save()
                activity_item = Activity_Item(user=request.user,activity_type='FOLLOW',action_user=follow_request.requester, follower=follower)
                activity_item.save()
            elif(action == 'delete'):
                follow_request = request.user.requests.filter(requester=requester)
                follow_request.delete()

            return Response(status=status.HTTP_201_CREATED)
        else: #If user is getting a list of requests
            requests = request.user.requests.all()
            serialized = FollowRequestSerializer(requests,many=True)
            return Response(serialized.data)
    
    @action(detail=False, methods=['GET'])
    def requested(self,request,*args,**kwargs):
        requested = request.user.requested.all()
        serialized = FollowRequestSerializer(requested,many=True)
        return Response(serialized.data)
    
    @action(detail=True, methods=['POST','GET'], serializer_class=FollowerSerializer)
    def followers(self,request,*args,**kwargs):
        if(request.method=='POST'): #if user wants to follow or unfollow the user
            if(self.get_object().is_private == True and not self.get_object().followers.filter(follower=request.user).exists()):
                #create follow request if none so far, otherwise delete existing request
                follow_request, created = self.get_object().requests.all().get_or_create(requester=request.user,to_request=self.get_object())
                if not created:
                    follow_request.delete()
                    return Response(status=status.HTTP_205_RESET_CONTENT)
                else:
                    follow_request.save()
                    return Response(status=status.HTTP_202_ACCEPTED)
            else:
                follower, created = self.get_object().followers.all().get_or_create(follower=request.user,following=self.get_object())
                #if follower already exists (not created) delete existing one
                if not created:
                    follower.delete()
                    return Response(status=status.HTTP_205_RESET_CONTENT)

                #if follower is created, then save the object and push a new activity item to followed user
                else:
                    follower.save()
                    activity_item = Activity_Item(user=self.get_object(),activity_type='FOLLOW',action_user=request.user, follower=follower)
                    activity_item.save()
                    return Response(status=status.HTTP_201_CREATED)
        else: #if user is getting followers list
            if(self.get_object().is_private == False or
            self.get_object().followers.filter(follower=self.request.user).exists() or
            self.get_object() == self.request.user):
                all_followers = self.get_object().followers.all()
                serializer = FollowerSerializer(all_followers,many=True)
                return Response(serializer.data)
            else:
                return Response()

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
            all_posts = self.get_object().posts.all().order_by('-id')
            serializer = PostSerializer(all_posts,many=True)
            return Response(serializer.data)
        else:
            return Response(status=HTTP_403_FORBIDDEN)

    @action(detail=False, methods=['GET'])
    def feed(self,request,*args,**kwargs):
        feed_posts = request.user.feed.all()
        serializer = FeedSerializer(feed_posts,many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def activity(self,request,*args,**kwargs):
        activity = request.user.activity.all().order_by('-id')
        serializer = ActivitySerializer(activity,many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def favorites(self,request,*args,**kwargs):
        favorites = request.user.favorites.all()
        serializer = FavoriteSerializer(favorites,many=True)
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
                #If user is not liking own post, push activity item to the user receiving the like
                if(request.user != self.get_object().author):
                    activity_item = Activity_Item(user=self.get_object().author,activity_type='LIKE',action_user=request.user,post=self.get_object(),like=like)
                    activity_item.save()
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
            #If user is not commenting on own post, push activity item to the user receiving the comment
            if(request.user != self.get_object().author):
                activity_item = Activity_Item(user=self.get_object().author,activity_type='COMMENT',action_user=request.user,comment=comment, post=self.get_object())
                activity_item.save()
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

    @action(detail=True, methods=['GET','POST'], serializer_class=FavoriteSerializer)
    def favorite(self, request, *args, **kwargs):
        if(request.method == 'POST'):
            post = self.get_object()
            favorite, created = request.user.favorites.all().get_or_create(author=request.user,post=self.get_object())
            #if post was already favorited
            if not created:
                favorite.delete()
            else:
                favorite.save()
            return Response(status=status.HTTP_201_CREATED)
        elif(request.method == 'GET'):
            if(request.user.favorites.filter(author=request.user,post=self.get_object())):
                return Response({"favorited":True})
            else:
                return Response({"favorited":False})

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