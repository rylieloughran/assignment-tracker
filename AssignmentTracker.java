import java.util.ArrayList;

public class AssignmentTracker {
    private ArrayList<Assignment> assignments;

    public AssignmentTracker() {
        assignments = new ArrayList<>();
    }

    public void addAssignment(Assignment assignment) {
        assignments.add(assignment);
    }
}
