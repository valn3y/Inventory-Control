//Import library
#include <SPI.h>
#include <Ethernet.h>

//Mac address
byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};
IPAddress myIp(192, 168, 0, 50); //My IP
IPAddress ip(192, 168, 0, 1); //IP default local network
IPAddress server(192, 168, 0, 14);

//Ethernet client
EthernetClient client;

void setup() {
  Serial.begin(9600);

  //Start setup shield
  Serial.println("Iniciando Ethernet com DHCP");
  if(Ethernet.begin(mac) == 0) {
    Serial.println("Falha na configuracao Ethernet com DHCP");

    //Check if Arduino is without Shield
    if(Ethernet.hardwareStatus() == EthernetNoHardware){
      Serial.println("Ethernet Shield nao encontrado");
      while(true){
        delay(1);
      }
    }

    //Check if Shield have connection with cable
    if(Ethernet.linkStatus() == LinkOFF) {
      Serial.println("Ethernet nao possui cabo conectado");
    }

    //Try to configure using IP address instead of DHCP
    Ethernet.begin(mac, myIp, ip);
  } else {
    Serial.print("DHCP assinado com IP: ");
    Serial.println(Ethernet.localIP());
  }

  delay(1000);
  Serial.print("conectando ");
  Serial.print(server);
  Serial.println("...");

  //Get connection
  if(client.connect(server, 4000)) {
    Serial.print("conectado ");
    Serial.println(client.remoteIP());
  } else {
    Serial.println("Falha na conexao");
  }
}

void reconnect(String input) {
  Serial.println("Tentando reconectar... ");
  if(client.connect(server, 4000)){
    Serial.print("conectado ");
    Serial.println(client.remoteIP());
    Serial.println("Fazendo requisicao novamente");
    delay(1000);
    request(input);
  } else {
    Serial.println("Falha na conexao, tente novamente");
  }
}

void request(String input) {
  if(!client.connected()) {
    reconnect(input);
  } else {
    String data = "barCode=62494132"; 
    client.println("POST /products/updateArduino HTTP/1.1");
    client.println("Content-Type: application/x-www-form-urlencoded");
    client.print("Content-Length: ");
    client.println(data.length());
    client.println();
    client.print(data);
    delay(1500);
    if(client.available() > 0){
      String c = client.readString();
      Serial.println(c);
      client.stop();
    } else {
      Serial.println("Nao recebeu resposta do back");
      client.stop();
    }
  }
}

void loop() {
  if(Serial.available() > 0) {
    String input = Serial.readString();
    request(input);
  }
}
