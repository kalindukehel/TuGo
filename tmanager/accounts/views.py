from django.shortcuts import render
from accounts.models import Account, Follower, Post, Like, Comment, Tile, Activity_Item, Feed_Item, Explore_Item, Song, Tag
from rest_framework import viewsets, permissions
from .serializers import AccountSerializer, PrivateAccountSerializer, FollowRequestSerializer, PostSerializer, FollowerSerializer, FollowingSerializer, CommentSerializer, LikeSerializer, TileSerializer, FeedSerializer, ExploreSerializer, ActivitySerializer, FavoriteSerializer, SongSerializer, TagSerializer
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN
from django.core.exceptions import ValidationError
from rest_framework import status
from django.contrib.auth import authenticate
from django.db.models import Q
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from copy import deepcopy
from django_pandas.io import read_frame
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
from datetime import datetime, date, timezone
import requests
import json

five_hours = 21600

class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = AccountSerializer
    def update(self, request, *args, **kwargs):
        if(request.data.get('is_private')):
            for i in request.user.posts.all():
                Explore_Item.objects.filter(post=i.id).delete()
        return super().update(request,*args,**kwargs)

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
                try:
                    activity_item.full_clean()
                    activity_item.save()
                except ValidationError as e:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
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
                    return Response(status=status.HTTP_204_NO_CONTENT)
                else:
                    follow_request.save()
                    return Response(status=status.HTTP_202_ACCEPTED)
            else:
                follower, created = self.get_object().followers.all().get_or_create(follower=request.user,following=self.get_object())
                #if follower already exists (not created) delete existing one
                if not created:
                    follower.delete()
                    return Response(status=status.HTTP_204_NO_CONTENT)

                #if follower is created, then save the object and push a new activity item to followed user
                else:
                    follower.save()
                    #push every post of followed user to feed
                    for post in self.get_object().posts.all():
                        feed_item = Feed_Item(user=request.user,post=post,follow_relation=follower)
                        feed_item.save()
                    activity_item = Activity_Item(user=self.get_object(),activity_type='FOLLOW',action_user=request.user, follower=follower)
                    try:
                        activity_item.full_clean()
                        activity_item.save()
                    except ValidationError as e:
                        return Response(status=status.HTTP_400_BAD_REQUEST)
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
        feed_posts = request.user.feed.all().order_by('-post')
        serializer = FeedSerializer(feed_posts,many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def explore(self,request,*args,**kwargs):
        #store the data
        qs = Post.objects.all()
        df = read_frame(qs)

        #get user following
        user_following = request.user.following.all()
        user_following_list = list(map(lambda x: x.following.id, user_following))
        #get user post ids
        user_posts = request.user.posts.all()
        user_id_list = list(map(lambda x: x.id, user_posts))
        #get user favorites post ids
        user_favorites = request.user.favorites.all()
        favorites_id_list = list(map(lambda x: x.post.id, user_favorites))
        #combine user post ids and favorites post ids
        id_list = user_id_list + favorites_id_list

        def add_index(data):
            index = []
            for i in range(0, data.shape[0]):
                index.append(i)
            return index

        df['index'] = add_index(df)
        #create a list of select columns for the recommendation engine
        columns=['song_artist', 'song_tags']
        #check for any missing values in the select columns
        df[columns].isnull().values.any()
        #create functions to combine values of the select columns into single string
        def get_important_features(data):
            important_features = []
            for i in range(0, data.shape[0]):
                important_features.append(data['song_artist'][i]+' '+data['song_tags'][i])
            return important_features

        def get_index_from_id(id):
            return df[df.id == id]["index"].values[0]

        def get_id_from_index(index):
            return df[df.index == index]["id"].values[0]

        #create a column to hold the combined strings
        df['important_features'] = get_important_features(df)
        #convert the text into a Matrix of token counts
        cm = CountVectorizer().fit_transform(df['important_features'])
        cs = cosine_similarity(cm)

        #create a list of lists of (index, similarity_score) tuples
        total = []
        user_posts_index = []
        for i in id_list:
            index = get_index_from_id(i)
            if(i in user_id_list):
                user_posts_index.append(index)
            similar_posts = list(enumerate(cs[index]))
            total.append(similar_posts)
        
        #create a list of the added similarity_scores
        final = []
        for i in range(df.shape[0]):
            score = 0
            for j in range(len(total)):
                score+=total[j][i][1]
            final.append((i, score))

        #filter out user posts from final
        def is_valid_post(item):
            if(item[0] in user_posts_index):
                return False
            if(item[1] == 0):
                return False
            return True

        filtered_index_list = list(filter(is_valid_post, final))
        filtered_index_list.sort(key=lambda x:x[1],reverse=True)
        filtered_id_list = list(map(get_id_from_index, [x[0] for x in filtered_index_list]))

        #for every post in filtered ids, create an explore item
        for post in Post.objects.filter(id__in=filtered_id_list):
            if(post.author.id not in user_following_list and not post.author.is_private):
                ExploreItem,created = request.user.explore.all().get_or_create(user=request.user,post=post)
                if(created):
                    ExploreItem.save()
        serializer = ExploreSerializer(request.user.explore.all().order_by('-post'),many=True)
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

    # def create(self, request, *args, **kwargs):
    #     value = request.data.get('value')
    #     x = PostSerializer(data)
    #     if(x.is_valid()):
    #         x.save()
    @action(detail=True, methods=['GET','POST'], serializer_class=LikeSerializer)
    def likes(self, request, *args, **kwargs):
        if(request.method == 'POST'):
            post = self.get_object()
            like, created = self.get_object().likes.all().get_or_create(author=request.user,post=self.get_object())
            #if like was not created it already exists
            if not created:
                like.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                like.save()
                #If user is not liking own post, push activity item to the user receiving the like
                if(request.user != self.get_object().author):
                    activity_item = Activity_Item(user=self.get_object().author,activity_type='LIKE',action_user=request.user,post=self.get_object(),like=like)
                    try:
                        activity_item.full_clean()
                        activity_item.save()
                    except ValidationError as e:
                        return Response(status=status.HTTP_400_BAD_REQUEST)
                return Response(status=status.HTTP_201_CREATED)
        else:
            all_likes = self.get_object().likes.all()
            serializer = LikeSerializer(all_likes,many=True)
            return Response(serializer.data)
    
    @action(detail=True, methods=['GET','POST','DELETE'], serializer_class=CommentSerializer )
    def comments(self, request, *args, **kwargs): 
        if(request.method=='POST'):
            value = request.data.get('value')
            comment = Comment(author=request.user,post=self.get_object(),value=value)
            try:
                comment.full_clean()
                comment.save()
            except ValidationError as e:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            #If user is not commenting on own post, push activity item to the user receiving the comment
            if(request.user != self.get_object().author):
                activity_item = Activity_Item(user=self.get_object().author,activity_type='COMMENT',action_user=request.user,comment=comment, post=self.get_object())
                try:
                    activity_item.full_clean()
                    activity_item.save()
                except ValidationError as e:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_201_CREATED)
        elif(request.method=='DELETE'):
            comment = Comment.objects.get(pk=request.data.get('id'))
            if(request.user==comment.author):
                comment.delete()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            all_comments = self.get_object().comments.all()
            serializer = CommentSerializer(all_comments,many=True)
            return Response(serializer.data)

    @action(detail=True, methods=['GET','POST','DELETE'], serializer_class=TileSerializer )
    def tiles(self, request, *args, **kwargs): 
        if(request.method=='POST'):
            tile_type = request.data.get('tile_type')
            if(tile_type not in ['posted_cover', 'posted_choreo', 'suggested_cover', 'suggested_choreo']):
                return Response(status=status.HTTP_400_BAD_REQUEST)
            is_youtube = request.data.get('is_youtube')
            youtube_link = request.data.get('youtube_link')
            image = request.data.get('image')
            
            #get video url
            youtube_video_url = None
            custom_video_url = None
            if(not is_youtube):
                custom_video_url = request.data.get('custom_video_url')
            # if(is_youtube):
            #     # video = pafy.new(youtube_link)
            #     # best = video.getbest()
            #     # playurl = best.url  
            #     # youtube_video_url = playurl
            # else:
            #     custom_video_url = request.data.get('custom_video_url')
            #     print(custom_video_url)
            tile = Tile(post=self.get_object(),tile_type=tile_type,is_youtube=is_youtube,youtube_link=youtube_link,image=image,youtube_video_url=youtube_video_url, custom_video_url=custom_video_url)
            print(tile)
            try:
                tile.full_clean()
                tile.save()
            except ValidationError as e:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_201_CREATED)
        elif(request.method=='DELETE'):
            tile = Tile.objects.get(pk=request.data.get('id'))
            if(request.user==tile.post.author):
                tile.delete()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            tiles = self.get_object().tiles.all()
            # for i in tiles:
            #     if(i.is_youtube):
            #         if(i.youtube_video_created is None):
            #             i.youtube_video_created = datetime.now(timezone.utc)
            #             try:
            #                 video = pafy.new(i.youtube_link)
            #             except:
            #                 print("video is currently not available")
            #                 continue
            #             best = video.getbest()
            #             playurl = best.url
            #             i.youtube_video_url = playurl
            #         else:
            #             # difference = datetime.combine(datetime.now(), datetime.now().time()) - datetime.combine(i.video_created, i.video_created.time()) 
            #             difference = datetime.now(timezone.utc) - i.youtube_video_created
            #             if(difference.total_seconds() > five_hours):
            #                 i.youtube_video_created = datetime.now(timezone.utc)
            #                 try:
            #                     video = pafy.new(i.youtube_link)
            #                 except:
            #                     print("video is currently not available")
            #                     continue
            #                 best = video.getbest()
            #                 playurl = best.url
            #                 i.youtube_video_url = playurl
            #     i.save()
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

    @action(detail=True, methods=['GET','POST'], serializer_class=TagSerializer )
    def tags(self, request, *args, **kwargs): 
        if(request.method=='POST'):
            tagged_id = request.data.get('tagged_id')
            value = request.data.get('value')
            #account being tagged
            tagged_account = Account.objects.filter(id=tagged_id)[0]
            tag = Tag(author=request.user,post=self.get_object(),value=value,tagged=tagged_account)
            try:
                tag.full_clean()
                tag.save()
            except ValidationError as e:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            #If user is not commenting on own post, push activity item to the user receiving the comment
            if(request.user != tagged_account):
                activity_item = Activity_Item(user=tagged_account,activity_type='TAG',action_user=request.user,tag=tag, post=self.get_object())
                try:
                    activity_item.full_clean()
                    activity_item.save()
                except ValidationError as e:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_201_CREATED)
        else:
            all_tags = self.get_object().tags.all()
            serializer = TagSerializer(all_tags,many=True)
            return Response(serializer.data)
        return Response(status=status.HTTP_200_OK)

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

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def songcharts(request,*args,**kwargs):
    #get id from body
    playlist_id = request.data.get('playlist_id')
    #get playlist name and image
    playlistRes = requests.get("http://api.napster.com/v2.2/playlists/" + playlist_id + "?apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3").json()
    name = playlistRes['playlists'][0]['name']
    playlist_image = playlistRes['playlists'][0]['images'][0]['url']
    #get playlist tracks
    tracksRes = requests.get("https://api.napster.com/v2.2/playlists/" + playlist_id + "/tracks?limit=100&apikey=ZjE2MDcyZDctNDNjMC00NDQ5LWI3YzEtZTExY2Y2ZWNlZTg3").json()
    songs = tracksRes['tracks']
    tracks = []
    for song in songs:
        songObj = {
            'id': song['id'],
            'audio_url': song['previewURL'],
            'artist': song['artistName'],
            'title': song['name'],
            'album': song['albumName'],
            'albumCover': "https://api.napster.com/imageserver/v2/albums/" + song['albumId'] + "/images/500x500.jpg"
        }
        tracks.append(songObj)
    #create response object
    response = {
        'name': name,
        'playlist_image': playlist_image,
        'tracks': tracks,
        'playlist_id': playlist_id
    }
    return Response({'data': response},status=status.HTTP_200_OK)

# class SongViewSet(viewsets.ModelViewSet):
#     queryset = Song.objects.all()
#     permission_classes = [
#         permissions.IsAuthenticated
#     ]
#     serializer_class = SongSerializer

#     @action(detail=False, methods=['GET','POST'], serializer_class=SongSerializer)
#     def songsearch(self, request,*args,**kwargs):
#         response = []
#         search_query = self.request.data.get('search_query')
#         search_response = requests.get("https://www.googleapis.com/youtube/v3/search?key=AIzaSyD4PveZNEi_D3PmpYuwJ8fub1zp65Clieg&type=video&part=snippet&maxResults=10&q="+ search_query +"&videoCategoryId=10").json()
#         #each song from youtube response
#         for song in search_response['items']:
#             video_id = song['id']['videoId']
#             url = "https://www.youtube.com/watch?v=" + video_id
#             playurl = ''
#             #check if song exists in database
#             matching = Song.objects.filter(video_id=video_id)
#             #if song does not exist generate a url and save song to the database
#             if not matching:
#                 video = pafy.new(url)
#                 streams = video.audiostreams
#                 for s in streams:
#                     if (s.extension == "m4a"):
#                         playurl = s.url
#                         song_created = datetime.now()
#                         title=song['snippet']['title']
#                         thumbnail=song['snippet']['thumbnails']['high']['url']
#                         artist=song['snippet']['channelTitle']
#                         break
#                 newSong = Song(video_id=video_id, audio_url=playurl, song_created=song_created, title=title, thumbnail=thumbnail, artist=artist)
#                 response.append(newSong)
#                 newSong.save()
#             #if song exists, check if audio link is expired or not
#             else:
#                 saved = matching[0]
#                 difference = datetime.combine(datetime.now(), datetime.now().time()) - datetime.combine(saved.song_created, saved.song_created.time())          
#                 if(difference.seconds > five_hours):
#                     video = pafy.new(url)
#                     streams = video.audiostreams
#                     for s in streams:
#                         if (s.extension == "m4a"):
#                             saved.audio_url = s.url
#                             playurl = s.url
#                             saved.song_created = datetime.now()
#                             saved.save()
#                             response.append(saved)
#                             break
#                 else:
#                     playurl = saved.audio_url
#                     response.append(saved)
#         serializer = SongSerializer(response, many=True)
#         return Response(serializer.data)