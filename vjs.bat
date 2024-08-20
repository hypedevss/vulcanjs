@echo off
setlocal EnableDelayedExpansion

set "indexPath=%~dp0index.js"

set "arguments=%*"

node %indexPath% %arguments%