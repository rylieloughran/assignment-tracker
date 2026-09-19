public class Assignment {
    private String name;
    private String course;
    private String dueDate;
    private boolean isCompleted;
    private String urgency; // can be "low", "medium", "high", or "critical"
    private int estimatedTime; // in minutes

    public Assignment(String name, String course, String dueDate, String urgency, int estimatedTime) {
        this.name = name;
        this.course = course;
        this.dueDate = dueDate;
        this.isCompleted = false;
        this.urgency = urgency;
        this.estimatedTime = estimatedTime;
    }
}