#!/bin/bash

bold="\e[1m"
uline="\e[4m"
reset="\e[0m"
green="\e[0;92m"
blue="\e[0;94m"

echo -e "${blue}${bold}${uline}[S.I.M.O.N.A | Install web application]${reset}"
echo " "

echo -e "${green}${bold}[Building frontend application]${reset}"
echo -e "${green}Installing dependencies...${reset}"
cd frontend
npm install
echo -e "${green}Building application...${reset}"
npm run build
echo " "