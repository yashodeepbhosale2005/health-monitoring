# Arduino/ESP32 Integration Guide

This document provides instructions for connecting your Arduino or ESP32 device to the Health Monitoring Smart Band web application.

## Hardware Requirements

### Option 1: ESP32 with WiFi
- ESP32 development board
- Heart rate sensor (MAX30102 or similar)
- SpO2 sensor (MAX30102 or similar)
- Optional: Accelerometer for step counting
- Breadboard and jumper wires

### Option 2: Arduino with ESP32 WiFi Module
- Arduino Uno/Nano
- ESP32 WiFi module (ESP8266 or ESP32)
- Heart rate sensor (MAX30102 or similar)
- SpO2 sensor (MAX30102 or similar)
- Optional: Accelerometer for step counting

## Software Setup

### 1. Install Required Libraries

For ESP32 (Arduino IDE):
```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"
```

For Arduino with ESP32:
```cpp
#include <SoftwareSerial.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"
```

### 2. WiFi Configuration

```cpp
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverURL = "http://YOUR_SERVER_IP:5000/api/data";

void setupWiFi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}
```

### 3. Sensor Reading Functions

```cpp
MAX30105 particleSensor;

void setupSensors() {
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30105 was not found. Please check wiring/power.");
    while (1);
  }
  
  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeGreen(0);
}

float readHeartRate() {
  long irValue = particleSensor.getIR();
  if (checkForBeat(irValue) == true) {
    long delta = millis() - lastBeat;
    lastBeat = millis();
    float beatsPerMinute = 60 / (delta / 1000.0);
    if (beatsPerMinute < 255 && beatsPerMinute > 20) {
      return beatsPerMinute;
    }
  }
  return 0;
}

float readSpO2() {
  long redValue = particleSensor.getRed();
  long irValue = particleSensor.getIR();
  
  // Calculate SpO2 using red and IR values
  float ratio = (float)redValue / (float)irValue;
  float spo2 = 100 - (ratio * 20);
  
  if (spo2 >= 70 && spo2 <= 100) {
    return spo2;
  }
  return 0;
}
```

### 4. Data Transmission

```cpp
void sendHealthData(float pulseRate, float spo2, int steps, int calories) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverURL);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    DynamicJsonDocument doc(1024);
    doc["pulseRate"] = pulseRate;
    doc["spo2"] = spo2;
    doc["steps"] = steps;
    doc["calories"] = calories;
    doc["deviceId"] = "ESP32_DEVICE_001";
    doc["timestamp"] = millis();
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Data sent successfully!");
      Serial.println("Response: " + response);
    } else {
      Serial.println("Error sending data: " + String(httpResponseCode));
    }
    
    http.end();
  }
}
```

### 5. Main Loop

```cpp
void loop() {
  static unsigned long lastReading = 0;
  static int stepCount = 0;
  static int calorieCount = 0;
  
  // Read sensors every 5 seconds
  if (millis() - lastReading >= 5000) {
    float pulseRate = readHeartRate();
    float spo2 = readSpO2();
    
    // Simulate step counting (replace with actual accelerometer code)
    stepCount += random(0, 10);
    calorieCount += random(0, 5);
    
    // Send data if we have valid readings
    if (pulseRate > 0 && spo2 > 0) {
      sendHealthData(pulseRate, spo2, stepCount, calorieCount);
    }
    
    lastReading = millis();
  }
  
  delay(100);
}
```

## Complete ESP32 Code Example

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverURL = "http://YOUR_SERVER_IP:5000/api/data";

// Sensor setup
MAX30105 particleSensor;
const byte RATE_SIZE = 4;
byte rates[RATE_SIZE];
byte rateSpot = 0;
long lastBeat = 0;
float beatsPerMinute;
int beatAvg;

void setup() {
  Serial.begin(115200);
  
  // Initialize sensors
  setupSensors();
  
  // Connect to WiFi
  setupWiFi();
  
  Serial.println("Health Monitor Device Ready!");
}

void loop() {
  static unsigned long lastReading = 0;
  static int stepCount = 0;
  static int calorieCount = 0;
  
  if (millis() - lastReading >= 5000) {
    float pulseRate = readHeartRate();
    float spo2 = readSpO2();
    
    // Simulate activity data
    stepCount += random(0, 10);
    calorieCount += random(0, 5);
    
    if (pulseRate > 0 && spo2 > 0) {
      sendHealthData(pulseRate, spo2, stepCount, calorieCount);
    }
    
    lastReading = millis();
  }
  
  delay(100);
}

void setupSensors() {
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30105 was not found. Please check wiring/power.");
    while (1);
  }
  
  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeGreen(0);
}

void setupWiFi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

float readHeartRate() {
  long irValue = particleSensor.getIR();
  if (checkForBeat(irValue) == true) {
    long delta = millis() - lastBeat;
    lastBeat = millis();
    float beatsPerMinute = 60 / (delta / 1000.0);
    if (beatsPerMinute < 255 && beatsPerMinute > 20) {
      return beatsPerMinute;
    }
  }
  return 0;
}

float readSpO2() {
  long redValue = particleSensor.getRed();
  long irValue = particleSensor.getIR();
  
  if (irValue > 50000) {
    float ratio = (float)redValue / (float)irValue;
    float spo2 = 100 - (ratio * 20);
    
    if (spo2 >= 70 && spo2 <= 100) {
      return spo2;
    }
  }
  return 0;
}

void sendHealthData(float pulseRate, float spo2, int steps, int calories) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverURL);
    http.addHeader("Content-Type", "application/json");
    
    DynamicJsonDocument doc(1024);
    doc["pulseRate"] = pulseRate;
    doc["spo2"] = spo2;
    doc["steps"] = steps;
    doc["calories"] = calories;
    doc["deviceId"] = "ESP32_DEVICE_001";
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      Serial.println("Data sent successfully!");
    } else {
      Serial.println("Error sending data: " + String(httpResponseCode));
    }
    
    http.end();
  }
}
```

## Configuration Steps

1. **Update WiFi credentials** in the Arduino code
2. **Set the correct server URL** (replace `YOUR_SERVER_IP` with your actual server IP)
3. **Upload the code** to your ESP32/Arduino
4. **Connect sensors** according to the wiring diagram
5. **Power on the device** and check serial monitor for connection status
6. **Verify data transmission** by checking the web dashboard

## Troubleshooting

### Common Issues:

1. **WiFi Connection Failed**
   - Check SSID and password
   - Ensure WiFi network is 2.4GHz (ESP32 doesn't support 5GHz)
   - Check signal strength

2. **Sensor Not Detected**
   - Verify I2C connections (SDA, SCL)
   - Check power supply (3.3V for ESP32)
   - Ensure proper sensor initialization

3. **Data Not Reaching Server**
   - Check server IP address and port
   - Verify server is running
   - Check firewall settings
   - Monitor serial output for HTTP response codes

4. **Invalid Sensor Readings**
   - Ensure proper finger placement on sensor
   - Check for ambient light interference
   - Verify sensor calibration

## API Endpoints

The device sends data to these endpoints:

- `POST /api/data` - Send health data
- `GET /api/health` - Check server status

## Data Format

```json
{
  "pulseRate": 75.5,
  "spo2": 98.2,
  "steps": 1250,
  "calories": 45,
  "deviceId": "ESP32_DEVICE_001",
  "timestamp": 1640995200000
}
```

## Future Enhancements

- Bluetooth Low Energy (BLE) support
- Battery level monitoring
- Sleep mode for power saving
- Multiple sensor support
- Data buffering for offline operation
- OTA (Over-The-Air) updates
