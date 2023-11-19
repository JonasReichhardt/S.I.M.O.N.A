#!/bin/bash

bold="\e[1m"
uline="\e[4m"
reset="\e[0m"
green="\e[0;92m"
blue="\e[0;94m"

echo -e "${blue}${bold}${uline}[S.I.M.O.N.A | Starting application]${reset}"
echo " "

echo -e "${green}${bold}[Building frontend application]${reset}"
echo -e "${green}Replacing ip address...${reset}"
cd src/frontend
newip=$(hostname -I | xargs)
sed -i 's/PROD_IP'/"$newip"/ .env.production
cat .env.production
echo " "
echo -e "${green}Building application...${reset}"
npm run build
echo " "

echo -e "${green}${bold}[Building backend application]${reset}"
echo -e "${green}Starting application...${reset}"
cd ../backend
npm run start
cd ../..
echo " "