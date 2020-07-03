#!/usr/bin/bash
git add .
git status
git commit -m $1
balena push Temper
