public class Assignment {
    private String name;
    private String course;
    private String dueDate;
    private boolean completed;

    public Assignment(String name, String course, String dueDate) {
        this.name = name;
        this.course = course;
        this.dueDate = dueDate;
        this.completed = false;
    }
}