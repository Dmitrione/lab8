

import org.json.simple.JSONAware;
import org.json.simple.JSONObject;


public class Message implements JSONAware{
    private int id;
    private String message;
    private String userName;


    public Message() {
        this.message = "user";
        this.userName = "";
        this.id = -1;
    }

    public Message(String message, String userName) {
        this.message = message;
        this.userName = userName;
        this.id = -1;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUserName() {
        return userName;
    }

    public static Message parseMessage(JSONObject obj){
        Message msg = new Message();
        if((String)obj.get("user") != null) {
            msg.userName = (String)obj.get("user");
        }
        msg.message = (String)obj.get("message");
        msg.id = Integer.parseInt(obj.get("id").toString());
        return msg;
    }

    @Override
    public String toJSONString(){
        JSONObject obj = new JSONObject();
        obj.put("id", id);
        obj.put("user", userName);
        obj.put("message", message);
        return obj.toString();
    }

    @Override
    public String toString() {
        return userName + " : " + message;
    }
    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Message other = (Message) obj;
        if (id != other.id)
            return false;

        return true;
    }
}
