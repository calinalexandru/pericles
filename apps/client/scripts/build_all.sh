#!/bin/sh

pericles='/Users/alexandru.calin/ilie/pericles'

echo "\nBuilding all modules, hold tight bro..\n"

cd "$pericles/constants"
npm run build

cd "$pericles/store"
npm run build

cd "$pericles/util"
npm run build

cd "$pericles/content"
npm run build

cd "$pericles/background"
npm run build

cd "$pericles/client"
npm run build

echo "\nBuilding complete, phew!\n"
