#!/bin/bash

bold="\e[1m"
uline="\e[4m"
reset="\e[0m"
green="\e[0;92m"
blue="\e[0;94m"

echo -e "${blue}${bold}${uline}[S.I.M.O.N.A | Starting application]${reset}"
echo " "

echo -e "${green}${bold}[Building frontend application]${reset}"
echo -e "${green}Installing dependencies...${reset}"
cd src/frontend
npm install
echo -e "${green}Replacing ip address...${reset}"
newip=$(ifconfig | grep 0xfff | grep -Eo '([0-9]{1,3}\.){3}[0-9]{1,3}' | grep -v 255)
echo "new ip:$newip"
sed 's/*\.*\.*\.*/"$newip"/g'
echo -e "${green}Building application...${reset}"
npm run build
echo " "

echo -e "${green}${bold}[Building backend application]${reset}"
echo -e "${green}Installing dependencies...${reset}"
cd ../backend
npm install
echo -e "${green}Starting application...${reset}"
npm run start
cd ../..
echo " "