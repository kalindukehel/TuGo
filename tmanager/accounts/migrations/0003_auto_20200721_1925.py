# Generated by Django 3.0.8 on 2020-07-21 19:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_account_created_at'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Video_Tile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_youtube', models.BooleanField()),
                ('link', models.URLField()),
                ('image', models.URLField()),
                ('view_count', models.IntegerField(default='0')),
            ],
        ),
        migrations.AddField(
            model_name='account',
            name='following',
            field=models.ManyToManyField(related_name='followers', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='account',
            name='is_private',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='account',
            name='last_login',
            field=models.DateTimeField(blank=True, null=True, verbose_name='last login'),
        ),
        migrations.AddField(
            model_name='account',
            name='password',
            field=models.CharField(default='null', max_length=128, verbose_name='password'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='account',
            name='profile_picture',
            field=models.ImageField(default='default.jpg', upload_to='profile_pictures'),
        ),
        migrations.AlterField(
            model_name='account',
            name='email',
            field=models.EmailField(error_messages={'unique': 'Email is already in use.'}, max_length=30, unique=True),
        ),
        migrations.AlterField(
            model_name='account',
            name='username',
            field=models.CharField(error_messages={'unique': 'Username is taken.'}, max_length=20, unique=True),
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('caption', models.CharField(default='', max_length=200)),
                ('soundcloud_art', models.URLField()),
                ('soundcloud_audio', models.URLField()),
                ('song_name', models.CharField(max_length=200)),
                ('song_artist', models.CharField(max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('comments', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='accounts.Comment')),
                ('likes', models.ManyToManyField(related_name='liked_posts', to=settings.AUTH_USER_MODEL)),
                ('posted_choreos', models.ForeignKey(max_length=2, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='choreo_owner', to='accounts.Video_Tile')),
                ('posted_covers', models.ForeignKey(max_length=2, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='cover_owner', to='accounts.Video_Tile')),
                ('suggested_choreos', models.ForeignKey(max_length=10, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='suggested_choreo_owner', to='accounts.Video_Tile')),
                ('suggested_covers', models.ForeignKey(max_length=10, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='suggested_cover_owner', to='accounts.Video_Tile')),
            ],
        ),
        migrations.AddField(
            model_name='comment',
            name='account',
            field=models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='account',
            name='posts',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='posted_by', to='accounts.Post'),
        ),
    ]
