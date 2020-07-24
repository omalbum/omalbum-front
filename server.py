#!/usr/bin/env python3
# encoding: utf-8
"""Use instead of `python3 -m http.server` when you need CORS"""
"""https://gist.github.com/acdha/925e9ffc3d74ad59c3ea#file-simple_cors_server-py-L4"""

from http.server import HTTPServer, SimpleHTTPRequestHandler


import os
from urllib import parse as urlparse

class CORSRequestHandler(SimpleHTTPRequestHandler):
	def end_headers(self):
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Access-Control-Allow-Methods', 'GET')
		self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
		return super(CORSRequestHandler, self).end_headers()
	
	def do_GET(self):
		# Parse query data to find out what was requested
		parsedParams = urlparse.urlparse(self.path)
		# See if the file requested exists
		if os.access('.' + os.sep + parsedParams.path, os.R_OK):
			# File exists, serve it up
			SimpleHTTPRequestHandler.do_GET(self);
		else:
			parts = self.path.split("?")
			self.path = parts[0]+".html";
			if len(parts)>1:
				self.path+="?"+parts[1]
			parsedParams = urlparse.urlparse(self.path)
			if os.access('.' + os.sep + parsedParams.path, os.R_OK):
				SimpleHTTPRequestHandler.do_GET(self);

httpd = HTTPServer(('localhost', 8000), CORSRequestHandler)
httpd.serve_forever()
