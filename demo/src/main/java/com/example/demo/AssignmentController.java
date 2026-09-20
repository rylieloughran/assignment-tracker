package com.example.demo;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@CrossOrigin(origins = "*")
public class AssignmentController {

    @GetMapping("/api/assignments")
    public List<AssignmentInput> getAssignments() throws Exception {

        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:3000/assignments"))
                .GET()
                .build();

        HttpResponse<String> response =
                client.send(
                        request,
                        HttpResponse.BodyHandlers.ofString()
                );

        String json = response.body();

        ObjectMapper mapper = new ObjectMapper();

        List<AssignmentInput> assignments = mapper.readValue(
                json,
                new TypeReference<List<AssignmentInput>>() {}
        );

        return assignments;
    }


    @PostMapping("/api/assignments")
    public Assignment createAssignment(
            @RequestBody Assignment assignment) throws Exception {

        HttpClient client = HttpClient.newHttpClient();

        ObjectMapper mapper = new ObjectMapper();

        // Convert the Assignment object into JSON
        String json = mapper.writeValueAsString(assignment);

        // Send the JSON to JSON Server
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:3000/assignments"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        // Send the request
        HttpResponse<String> response =
                client.send(
                        request,
                        HttpResponse.BodyHandlers.ofString()
                );

        // Convert JSON Server's response back into an Assignment
        return mapper.readValue(
                response.body(),
                Assignment.class
        );
    }
}