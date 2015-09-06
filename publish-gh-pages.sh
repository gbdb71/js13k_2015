#! /bin/bash

if [ -d "bundle" ]; then 
   cp -v bundle/index.html bundle/app.min.js gh-pages
   cd gh-pages
   git add .
   git commit
   if [ $? -eq 0 ]; then 
      git push
   fi
   cd ..
fi
