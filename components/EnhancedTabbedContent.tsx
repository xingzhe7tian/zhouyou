"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function EnhancedTabbedContent() {
  return (
    <Tabs defaultValue="javascript" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
        <TabsTrigger value="python">Python</TabsTrigger>
        <TabsTrigger value="java">Java</TabsTrigger>
        <TabsTrigger value="php">PHP</TabsTrigger>
      </TabsList>
      <TabsContent value="javascript">
        <Card>
          <CardHeader>
            <CardTitle>JavaScript (Node.js)</CardTitle>
            <CardDescription>
              使用 Node.js 的 fetch API 与服务器交互
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
              <code>
{`// 使用 Node.js 的 fetch API
const fetchPlayers = async () => {
  try {
    const response = await fetch('https://api.example.com/players');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

fetchPlayers();`}
              </code>
            </pre>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="python">
        <Card>
          <CardHeader>
            <CardTitle>Python</CardTitle>
            <CardDescription>
              使用 Python 的 requests 库与服务器交互
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
              <code>
{`import requests

def fetch_players():
    try:
        response = requests.get('https://api.example.com/players')
        data = response.json()
        print(data)
    except requests.RequestException as e:
        print(f'Error: {e}')

fetch_players()`}
              </code>
            </pre>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="java">
        <Card>
          <CardHeader>
            <CardTitle>Java</CardTitle>
            <CardDescription>
              使用 Java 11 的 HttpClient 与服务器交互
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
              <code>
{`import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class ApiClient {
    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.example.com/players"))
                .build();

        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenAccept(System.out::println)
                .join();
    }
}`}
              </code>
            </pre>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="php">
  <Card>
    <CardHeader>
      <CardTitle>PHP</CardTitle>
      <CardDescription>
        使用 PHP 的 cURL 扩展与服务器交互
      </CardDescription>
    </CardHeader>
    <CardContent>
      <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
        <code>
{`<?php
function fetchPlayers() {
    $url = 'https://api.example.com/players';
    
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($curl);
    
    if ($response === false) {
        $error = curl_error($curl);
        echo "Error: " . $error;
    } else {
        $data = json_decode($response, true);
        print_r($data);
    }
    
    curl_close($curl);
}

fetchPlayers();
?>`}
        </code>
      </pre>
    </CardContent>
  </Card>
</TabsContent>
    </Tabs>
  )
}

