#!/bin/bash

bold="\e[1m"
uline="\e[4m"
reset="\e[0m"
green="\e[0;92m"
blue="\e[0;94m"

echo -e "${blue}${bold}${uline}[S.I.M.O.N.A | Installing application]${reset}"
echo " "

echo -e "${green}${bold}[Installing OS dependencies]${reset}"

echo -e "${green}Installing audio player...${reset}"
sudo apt-get install mpg321 -y

echo -e "${green}Installing gpio library...${reset}"
sudo apt-get install pigpio -y

echo -e "${green}Installing runtime environment...${reset}"
sudo apt-get install npm -y

echo " "
echo -e "${green}${bold}[S.I.M.O.N.A | Versions]${reset}"
mpg321 -v
pigpio -v
node -v
npm -v

