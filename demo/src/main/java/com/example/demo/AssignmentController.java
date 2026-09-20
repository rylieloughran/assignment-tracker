package com.example.demo;

import java.util.ArrayList;
import java.util.List;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class AssignmentController {

    // private List<Assignment> assignments = new ArrayList<>();

    private final HttpClient client = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();
    private final String JSON_SERVER_URL = "http://localhost:3000/assignments";

    @GetMapping
public List<Assignment> getAssignments() throws Exception {
    HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(JSON_SERVER_URL))
            .GET()
            .build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    return mapper.readValue(response.body(), new TypeReference<List<Assignment>>() {});
}

    @PostMapping
public Assignment addAssignment(@RequestBody Assignment assignment) throws Exception {
    String json = mapper.writeValueAsString(assignment);
    HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(JSON_SERVER_URL))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(json))
            .build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    return mapper.readValue(response.body(), Assignment.class);
}

    @PutMapping("/{id}")
public ResponseEntity<Assignment> updateAssignment(@PathVariable String id, @RequestBody Assignment updated) throws Exception {
    updated.setId(id);
    String json = mapper.writeValueAsString(updated);
    HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(JSON_SERVER_URL + "/" + id))
            .header("Content-Type", "application/json")
            .PUT(HttpRequest.BodyPublishers.ofString(json))
            .build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    if (response.statusCode() == 404) return ResponseEntity.notFound().build();
    return ResponseEntity.ok(mapper.readValue(response.body(), Assignment.class));
}

    @DeleteMapping("/{id}")
public ResponseEntity<Void> deleteAssignment(@PathVariable String id) throws Exception {
    HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(JSON_SERVER_URL + "/" + id))
            .DELETE()
            .build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    return response.statusCode() == 200 || response.statusCode() == 204
            ? ResponseEntity.noContent().build()
            : ResponseEntity.notFound().build();
}
}