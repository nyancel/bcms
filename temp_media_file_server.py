import http.server
import socketserver

"""
this file is only meant as a placeholder whilst we're waiting for an S3 bucket

it's required if you want to be able to fetch media images using http
"""

PORT = 8080

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()