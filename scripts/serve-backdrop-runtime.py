from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
import sys
root=Path(sys.argv[1]).resolve()
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=str(root),**kw)
 def do_GET(self):
  target=root/self.path.split('?')[0].lstrip('/')
  if not target.exists() and '.' not in target.name:self.path='/index.html'
  super().do_GET()
 def log_message(self,*a):pass
ThreadingHTTPServer(('127.0.0.1',8089),Handler).serve_forever()
