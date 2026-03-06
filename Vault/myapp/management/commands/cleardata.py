import os
import glob

from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):
    help = "Clear storage/db.sqlite3 and storage/media/*"

    def handle(self, *args, **options):

        for file_path in glob.glob(os.path.join('storage', 'db.sqlite3')):
            os.remove(file_path)

        for file_path in glob.glob(os.path.join('storage', 'media', 'myapp_upload', '*')):
            os.remove(file_path)

