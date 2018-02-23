#!/bin/sh
echo "Status: 200"
echo "Content-Type: text/plain"
echo
    
# Followed by a response body
echo "Hello $QUERY_STRING"