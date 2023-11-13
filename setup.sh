#!/bin/bash

bold="\e[1m"
uline="\e[4m"
reset="\e[0m"
green="\e[0;92m"
blue="\e[0;94m"

echo -e "${blue}${bold}${uline}[S.I.M.O.N.A | Installing application]${reset}"
echo " "

echo -e "${green}${bold}[Installing OS dependencies]${reset}"
echo " "

echo -e "${green}Installing audio player...${reset}"
sudo apt-get install mpg321 -y
echo " "

echo -e "${green}Installing gpio library...${reset}"
sudo apt-get install pigpio -y
echo " "

echo -e "${green}Installing runtime environment...${reset}"
sudo apt-get install npm -y
echo " "

echo -e "${green}${bold}[S.I.M.O.N.A | Versions]${reset}"
echo -e "${green}mpg321${reset}"
mpg321 -V
echo " "
echo -e "${green}pigpio${reset}"
pigpiod -v
echo " "
echo -e "${green}node${reset}"
node -v
echo " "
echo -e "${green}npm${reset}"
npm -v
echo " "


