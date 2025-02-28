#!/bin/bash
# build.sh

VITE_WORKFLOW_NAME="$1" #Get first argument

if [ -z "$VITE_WORKFLOW_NAME" ]; then
  echo "Error: VITE_WORKFLOW_NAME is not set"
  exit 1
fi

export VITE_WORKFLOW_NAME #Make the variable accessible

pnpm vite build
