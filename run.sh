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
newip=$(hostname -I)
echo $newip
sed -i 's/PROD_IP/"$newip"/g' .env.production
cat .env.production
echo " "
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