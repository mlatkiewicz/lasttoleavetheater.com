#!/usr/bin/env python3
"""Same as `python3 -m http.server`, except every response is sent with
Cache-Control: no-store. Plain http.server sends Last-Modified but no
cache-control header, which lets browsers reuse a cached copy on a normal
reload without ever asking the server for a fresh one -- so edits to
css/js/html don't show up until a hard refresh. This closes that gap."""
import os
import sys
import http.server


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()


if __name__ == '__main__':
    port = int(os.environ.get('PORT') or (sys.argv[1] if len(sys.argv) > 1 else 8080))
    http.server.test(HandlerClass=NoCacheHandler, port=port)
