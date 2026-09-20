package com.example.demo;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class CanvasClient {

    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:3000/assignments"))
                .GET()
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        String json = response.body();

        ObjectMapper mapper = new ObjectMapper();

        List<AssignmentInput> assignments = mapper.readValue(
                json,
                new TypeReference<List<AssignmentInput>>() {}
        );

        for (AssignmentInput assignment : assignments) {
            System.out.println("Name: " + assignment.title);
            System.out.println("Course ID: " + assignment.courseName);
            System.out.println("Due: " + assignment.dueDate);
            System.out.println();
        }
    }
}