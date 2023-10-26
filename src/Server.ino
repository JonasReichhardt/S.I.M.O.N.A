#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <AccelStepper.h>

// Define stepper motor connections and motor interface type.
// Motor interface type must be set to 1 when using a driver
#define dirPin 4
#define stepPin 0
#define sleepPin 2
#define motorInterfaceType 1
#define stepsPerRev 200

#ifndef STASSID
#define STASSID "WIFI"
#define STAPSK "WIFI"
#endif

// Create a new instance of the AccelStepper class:
AccelStepper stepper = AccelStepper(motorInterfaceType, stepPin, dirPin);
const char* ssid = STASSID;
const char* password = STAPSK;

ESP8266WebServer server(80);

void handleNotFound() {
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) { message += " " + server.argName(i) + ": " + server.arg(i) + "\n"; }
  server.send(404, "text/plain", message);
}

void setup(void) {
  stepper.setMaxSpeed(500);
  stepper.setAcceleration(250);
  pinMode(sleepPin, OUTPUT);
  digitalWrite(sleepPin, LOW);

  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("esp8266")) { Serial.println("MDNS responder started"); }

  server.on("/inline", []() {
    server.send(200, "text/plain", "this works as well");
  });

  server.on("/open", []() {
    digitalWrite(sleepPin, HIGH);
    delay(5);
    stepper.runToNewPosition(stepsPerRev * 10);
    digitalWrite(sleepPin, LOW);
    server.send(200, "text/plain", "Opening");
  });

  server.on("/close", []() {
    digitalWrite(sleepPin, HIGH);
    delay(5);
    stepper.runToNewPosition(0);
    digitalWrite(sleepPin, LOW);
    server.send(200, "text/plain", "Closing");
  });

  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");
}

void loop(void) {
  server.handleClient();
  MDNS.update();
}
