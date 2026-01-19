import { supabase } from "../config/supabase.js";

/* Create notification and status: sent | draft */

export const createNotification=async (req,res) => {
    try {
        const{title,message,send_to,priority="normal",status="draft",scheduled_at=null,}=req.body;

        // basic validation
        if(!title || !message || !send_to){
            return res.status(400).json({
                error:"Title,message, and send_to are required",
            });
        }

        // insert notification
        const {data,error}=await supabase
        .from("notifications")
        .insert([
            {
                title,
                message,
                send_to,
                priority,
                status,
                scheduled_at,
                created_by:req.userId,
            },
        ])
        .select()
        .single();

        if(error){
            console.error("Notification insert error:",error);
            return res.status(500).json({error:'Failed to create notification'});
        }

        return res.status(201).json({
            message:
            status === "sent"
            ? "Notification sent successfully"
            : "Notification saved as draft",
            notification:data,
        });
    } catch (err) {
        console.error("Create notification error:",err);
        res.status(500).json({error:'Internal server error'});
        
    }
};


// Get Notifications (Admin Panel)
export const getNotifications=async (req,res) => {
    try {
        const {status}=req.query;

        let query=supabase
        .from("notifications")
        .select(
            `id,
            title,
            ,essage,
            send_to,
            priority,
            status,
            scheduled_at,
            created_at,
            admins(
            full_name,
            role
            )
            `
        )
        .order("created_at", {ascending: false});

        if(status){
            query=query.eq("status",status);
        }

        const {data,error}=await query;

        if(error){
            console.error("Fetch notifications error:", error);
      return res.status(500).json({ error: "Failed to fetch notifications" });
        }

        res.json(data);
    } catch (err) {
        console.error("Get notifications error:", err);
    res.status(500).json({ error: "Internal server error" }); 
    }
    
};

// update notification(draft -> sent / edit)

export const updateNotification=async (req,res) => {
    try {
        const {id}=req.params;
        const updates=req.body;

        // fetch existing notification
        const {data:existing, error:fetchError}=await supabase
        .from("notifications")
        .select("created_by")
        .eq("id",id)
        .single();

        if(fetchError || !existing){
              return res.status(404).json({ error: "Notification not found" });
        }

        // Authorization check
        if(existing.created_by !== req.userId && req.admin.role !== "master" || req.admin.role !== "editor"){
           return res.status(403).json({ error: "Not allowed" }); 
        }

        const {data,error}=await supabase
        .from("notifications")
        .update(updates)
        .eq("id",id)
        .select()
        .single();

        if(error){
            console.error("Update notification error:", error);
      return res.status(500).json({ error: "Failed to update notification" });
        }

        res.json({
             message: "Notification updated successfully",
      notification: data, 
        })
    } catch (err) {
        console.error("Update notification error:", err);
    res.status(500).json({ error: "Internal server error" });   
    }  
};

// delete notification (master only)

export const deleteNotification=async (req,res) => {
    try {
        if(req.admin.role !== "master"){
               return res.status(403).json({ error: "Only master can delete notifications" });
        }
        const {id}=req.params;

        const {error}=await supabase
        .from("notifications")
        .delete()
        .eq("id",id);

        if(error){
             console.error("Delete notification error:", error);
      return res.status(500).json({ error: "Failed to delete notification" });
        }

        res.json({ message: "Notification deleted successfully"});
    } catch (err) {
        console.error("Delete notification error:", err);
    res.status(500).json({ error: "Internal server error" }); 
        
    }
    
};