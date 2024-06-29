@echo off
setlocal EnableDelayedExpansion

set "indexPath=%~dp0dist\index.js"

set "arguments=%*"

node %indexPath% %arguments%