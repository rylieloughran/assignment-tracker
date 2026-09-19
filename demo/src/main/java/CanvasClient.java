import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

public class CanvasClient {

    public static void main(String[] args) throws Exception {

        // Create HTTP client
        HttpClient client = HttpClient.newHttpClient();

        // Create GET request
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:3000/assignments"))
                .GET()
                .build();

        // Send request
        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        // Get JSON from response
        String json = response.body();

        // Print the raw JSON
        System.out.println("Raw JSON:");
        System.out.println(json);
        System.out.println();

        // Create Jackson ObjectMapper
        ObjectMapper mapper = new ObjectMapper();

        // Convert JSON into a List of Assignment objects
        List<Assignment> assignments =
                mapper.readValue(
                        json,
                        new TypeReference<List<Assignment>>() {}
                );

        // Print each assignment
        for (Assignment assignment : assignments) {
            System.out.println("Name: " + assignment.name);
            System.out.println("Course ID: " + assignment.course_id);
            System.out.println("Due: " + assignment.due_at);
            System.out.println();
        }
    }
}